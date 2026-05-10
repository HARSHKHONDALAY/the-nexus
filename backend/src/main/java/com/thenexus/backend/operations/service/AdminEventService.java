package com.thenexus.backend.operations.service;

import com.thenexus.backend.event.domain.EventCategory;
import com.thenexus.backend.event.domain.EventStatus;
import com.thenexus.backend.event.domain.PlatformEvent;
import com.thenexus.backend.event.repository.EventCategoryRepository;
import com.thenexus.backend.event.repository.PlatformEventRepository;
import com.thenexus.backend.event.repository.TicketTierRepository;
import com.thenexus.backend.operations.dto.AdminEventResponse;
import com.thenexus.backend.operations.dto.CreateAdminEventRequest;
import com.thenexus.backend.security.AdminAuthorizationService;
import com.thenexus.backend.user.domain.User;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.thenexus.backend.common.exception.ApiException;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class AdminEventService {
  private static final Logger log = LoggerFactory.getLogger(AdminEventService.class);

  private final PlatformEventRepository eventRepository;
  private final EventCategoryRepository categoryRepository;
  private final TicketTierRepository ticketTierRepository;
  private final AdminAuthorizationService adminAuthorizationService;
  private final ObjectMapper objectMapper;

  public AdminEventService(
      PlatformEventRepository eventRepository,
      EventCategoryRepository categoryRepository,
      TicketTierRepository ticketTierRepository,
      AdminAuthorizationService adminAuthorizationService,
      ObjectMapper objectMapper) {
    this.eventRepository = eventRepository;
    this.categoryRepository = categoryRepository;
    this.ticketTierRepository = ticketTierRepository;
    this.adminAuthorizationService = adminAuthorizationService;
    this.objectMapper = objectMapper;
  }

  @Transactional
  public List<AdminEventResponse> getCurrentEvents(User actor) {
    return eventRepository.findByStatusInOrderByStartsAtAsc(List.of(EventStatus.DRAFT, EventStatus.PUBLISHED, EventStatus.LIVE, EventStatus.SOLD_OUT, EventStatus.CLOSED))
        .stream()
        .filter(event -> adminAuthorizationService.canAccessEvent(actor, event))
        .map(event -> AdminEventResponse.from(event, 0, 0, 0, 0, 0, 0))
        .toList();
  }

  @Transactional
  public List<AdminEventResponse> getPastEvents(User actor) {
    return eventRepository.findByStatusInOrderByStartsAtDesc(List.of(EventStatus.ARCHIVED, EventStatus.CANCELLED))
        .stream()
        .filter(event -> adminAuthorizationService.canAccessEvent(actor, event))
        .map(event -> AdminEventResponse.from(event, 0, 0, 0, 0, 0, 0))
        .toList();
  }

  @Transactional
  public AdminEventResponse createEvent(CreateAdminEventRequest request, MultipartFile posterImage, User actor) {
    try {
      // Validate event data
      validateEventData(request);
      
      // Create event entity
      EventCategory category = categoryRepository.findBySlug(request.eventType())
          .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, "Invalid event category: " + request.eventType()));
      
      // Generate slug from title if not provided
      String slug = generateSlug(request.title());
      
      PlatformEvent event = new PlatformEvent(
          category,
          slug,
          request.title(),
          null, // subtitle
          request.description(),
          request.venueName(),
          request.venueAddress(),
          request.city(),
          request.startsAt(),
          request.endsAt(),
          "Asia/Kolkata", // default timezone
          request.maxCapacity(),
          true, // waitlistEnabled
          actor
      );
      
      // Set additional fields
      event.updateOperations(
          request.registrationOpen(),
          request.allowWalkIns(),
          request.visibility(),
          request.venueCostPaise(),
          request.seoTitle(),
          request.seoDescription(),
          actor
      );
      
      // Publish if requested
      if (request.publish()) {
        event.publish(actor);
      }
      
      // Handle poster image if provided
      if (posterImage != null && !posterImage.isEmpty()) {
        log.info("Received poster image: {} ({} bytes)", posterImage.getOriginalFilename(), posterImage.getSize());
        // TODO: Implement poster image upload logic
      }
      
      // Save event
      PlatformEvent savedEvent = eventRepository.save(event);
      
      log.info("Created event: {} by user: {}", savedEvent.getTitle(), actor.getEmail());
      return AdminEventResponse.from(savedEvent, 0, 0, 0, 0, 0, 0);
      
    } catch (Exception e) {
      log.error("Failed to create event", e);
      throw new ApiException(HttpStatus.BAD_REQUEST, "Failed to create event: " + e.getMessage());
    }
  }

  @Transactional
  public void deleteEvent(UUID eventId, User actor) {
    PlatformEvent event = eventRepository.findById(eventId)
        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Event not found"));
    
    if (!adminAuthorizationService.canAccessEvent(actor, event)) {
      throw new ApiException(HttpStatus.FORBIDDEN, "Access denied");
    }
    
    // Delete associated ticket tiers first
    ticketTierRepository.deleteByEventId(eventId);
    
    // Delete the event
    eventRepository.delete(event);
    
    log.info("Deleted event: {} by user: {}", event.getTitle(), actor.getEmail());
  }

  @Transactional
  public AdminEventResponse updateEventStatus(UUID eventId, String status, User actor) {
    PlatformEvent event = eventRepository.findById(eventId)
        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Event not found"));
    
    if (!adminAuthorizationService.canAccessEvent(actor, event)) {
      throw new ApiException(HttpStatus.FORBIDDEN, "Access denied");
    }
    
    try {
      EventStatus newStatus = EventStatus.valueOf(status.toUpperCase());
      
      // Use the entity's domain methods for status changes
      switch (newStatus) {
        case PUBLISHED -> event.publish(actor);
        case ARCHIVED -> event.archive(actor);
        case CLOSED -> event.close(actor);
        case LIVE -> event.markLive(actor);
        default -> log.warn("Unsupported status update: {}", newStatus);
      }
      
      PlatformEvent updatedEvent = eventRepository.save(event);
      log.info("Updated event status: {} to {} by user: {}", event.getTitle(), newStatus, actor.getEmail());
      
      return AdminEventResponse.from(updatedEvent, 0, 0, 0, 0, 0, 0);
    } catch (IllegalArgumentException e) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "Invalid event status: " + status);
    }
  }

  private void validateEventData(CreateAdminEventRequest request) {
    if (request.endsAt().isBefore(request.startsAt())) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "Event end time must be after start time");
    }
    
    if (request.maxCapacity() <= 0) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "Event capacity must be greater than 0");
    }
  }

  private String generateSlug(String title) {
    // Simple slug generation - normalize and lowercase
    String normalized = java.text.Normalizer.normalize(title, java.text.Normalizer.Form.NFD)
        .replaceAll("[^\\p{ASCII}]", "")
        .replaceAll("[^a-zA-Z0-9\\s]", "")
        .trim()
        .replaceAll("\\s+", "-")
        .toLowerCase();
    
    // Ensure uniqueness
    String baseSlug = normalized;
    String slug = baseSlug;
    int counter = 1;
    
    while (eventRepository.existsBySlug(slug)) {
      slug = baseSlug + "-" + counter;
      counter++;
    }
    
    return slug;
  }
}
