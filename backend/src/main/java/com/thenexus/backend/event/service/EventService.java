package com.thenexus.backend.event.service;

import com.thenexus.backend.common.exception.ApiException;
import com.thenexus.backend.event.dto.CreateEventRequest;
import com.thenexus.backend.event.dto.EventResponse;
import com.thenexus.backend.event.dto.CreateTicketTierRequest;
import com.thenexus.backend.event.dto.TicketTierResponse;
import com.thenexus.backend.event.dto.PublicEventWithTiersResponse;
import com.thenexus.backend.event.domain.EventCategory;
import com.thenexus.backend.event.domain.EventStatus;
import com.thenexus.backend.event.domain.PlatformEvent;
import com.thenexus.backend.event.domain.TicketTier;
import com.thenexus.backend.event.repository.EventCategoryRepository;
import com.thenexus.backend.event.repository.PlatformEventRepository;
import com.thenexus.backend.event.repository.TicketTierRepository;
import com.thenexus.backend.security.AdminAuthorizationService;
import com.thenexus.backend.user.domain.User;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class EventService {
  private static final Logger log = LoggerFactory.getLogger(EventService.class);
  
  private final EventCategoryRepository categoryRepository;
  private final PlatformEventRepository eventRepository;
  private final TicketTierRepository ticketTierRepository;
  private final AdminAuthorizationService adminAuthorizationService;

  public EventService(EventCategoryRepository categoryRepository, PlatformEventRepository eventRepository,
      TicketTierRepository ticketTierRepository, AdminAuthorizationService adminAuthorizationService) {
    this.categoryRepository = categoryRepository;
    this.eventRepository = eventRepository;
    this.ticketTierRepository = ticketTierRepository;
    this.adminAuthorizationService = adminAuthorizationService;
  }

  @Transactional
  @Cacheable(value = "publicEvents", key = "'all'")
  public List<EventResponse> publicEvents() {
    log.info("Fetching public events...");
    try {
      // Use the safer query that explicitly joins categories to prevent lazy loading issues
      List<PlatformEvent> events = eventRepository.findByStatusInOrderByStartsAtAscWithCategories(List.of(EventStatus.PUBLISHED, EventStatus.LIVE, EventStatus.SOLD_OUT));
      log.info("Found {} events with PUBLISHED/LIVE/SOLD_OUT status", events.size());
      
      // Stream-based processing for better performance
      return events.stream()
          .map(EventResponse::from)
          .toList();
      
    } catch (Exception e) {
      log.error("Failed to fetch public events", e);
      throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to fetch public events");
    }
  }

  public EventResponse publicEventBySlug(String slug) {
    try {
      PlatformEvent event = eventRepository.findBySlugWithCategory(slug)
          .filter(found -> found.getStatus() == EventStatus.PUBLISHED || found.getStatus() == EventStatus.LIVE || found.getStatus() == EventStatus.SOLD_OUT)
          .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Event not found."));
      
      // Validate event data before processing
      if (event.getId() == null) {
        throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Event has invalid ID");
      }
      
      if (event.getTitle() == null || event.getTitle().trim().isEmpty()) {
        throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Event has invalid title");
      }
      
      if (event.getSlug() == null || event.getSlug().trim().isEmpty()) {
        throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Event has invalid slug");
      }
      
      return EventResponse.from(event);
    } catch (ApiException e) {
      throw e; // Re-throw API exceptions
    } catch (Exception e) {
      log.error("Error fetching event by slug: {}", slug, e);
      throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to fetch event: " + e.getMessage());
    }
  }

  public PublicEventWithTiersResponse publicEventWithTiersBySlug(String slug) {
    try {
      // Use the event repository method with category to avoid lazy loading issues
      PlatformEvent event = eventRepository.findBySlugWithCategory(slug)
          .filter(found -> found.getStatus() == EventStatus.PUBLISHED || found.getStatus() == EventStatus.LIVE || found.getStatus() == EventStatus.SOLD_OUT)
          .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Event not found."));
      
      // Validate event data before processing
      if (event.getId() == null) {
        throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Event has invalid ID");
      }
      
      if (event.getTitle() == null || event.getTitle().trim().isEmpty()) {
        throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Event has invalid title");
      }
      
      if (event.getSlug() == null || event.getSlug().trim().isEmpty()) {
        throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Event has invalid slug");
      }
      
      // Get ticket tiers for this event
      log.info("Loading ticket tiers for event: {}", event.getId());
      List<TicketTier> tiers = ticketTierRepository.findByEventIdOrderBySortOrderAsc(event.getId());
      log.info("Found {} ticket tiers for event: {}", tiers.size(), event.getId());
      
      // Create response with basic event data (no category to avoid lazy loading)
      return PublicEventWithTiersResponse.from(event, tiers);
    } catch (ApiException e) {
      throw e; // Re-throw API exceptions
    } catch (Exception e) {
      log.error("Error fetching event by slug: {}", slug, e);
      throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to fetch event: " + e.getMessage());
    }
  }

  public List<EventResponse> adminEvents(User actor) {
    return eventRepository.findAll().stream()
        .filter(event -> adminAuthorizationService.canAccessEvent(actor, event))
        .map(EventResponse::from)
        .toList();
  }

  @Transactional
  public EventResponse create(CreateEventRequest request, User actor) {
    if (!request.endsAt().isAfter(request.startsAt())) throw new ApiException(HttpStatus.BAD_REQUEST, "Event end time must be after start time.");
    if (eventRepository.existsBySlug(request.slug())) throw new ApiException(HttpStatus.CONFLICT, "Event slug already exists.");
    EventCategory category = categoryRepository.findBySlug(request.categorySlug())
        .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, "Unknown event category."));
    adminAuthorizationService.assertCanAccessEcosystem(actor, category.getSlug());
    PlatformEvent event = new PlatformEvent(category, request.slug(), request.title(), request.subtitle(), request.description(),
        request.venueName(), request.venueAddress(), request.city(), request.startsAt(), request.endsAt(), request.timezone(),
        request.capacity(), request.waitlistEnabled(), actor);
    return EventResponse.from(eventRepository.save(event));
  }

  @Transactional
  @CacheEvict(value = {"publicEvents", "eventBySlug"}, allEntries = true)
  public EventResponse publish(UUID eventId, User actor) {
    PlatformEvent event = getEvent(eventId);
    adminAuthorizationService.assertCanAccessEvent(actor, event);
    event.publish(actor);
    return EventResponse.from(event);
  }

  @Transactional
  @CacheEvict(value = {"publicEvents", "eventBySlug"}, allEntries = true)
  public EventResponse archive(UUID eventId, User actor) {
    PlatformEvent event = getEvent(eventId);
    adminAuthorizationService.assertCanAccessEvent(actor, event);
    event.archive(actor);
    return EventResponse.from(event);
  }

  @Transactional
  public TicketTierResponse createTier(UUID eventId, CreateTicketTierRequest request, User actor) {
    PlatformEvent event = getEvent(eventId);
    adminAuthorizationService.assertCanAccessEvent(actor, event);
    TicketTier tier = new TicketTier(event, request.name(), request.description(), request.pricePaise(), request.currency(),
        request.capacity(), request.salesStartAt(), request.salesEndAt(), request.sortOrder());
    return TicketTierResponse.from(ticketTierRepository.save(tier));
  }

  public List<TicketTierResponse> tiers(UUID eventId) {
    return ticketTierRepository.findByEventIdOrderBySortOrderAsc(eventId).stream().map(TicketTierResponse::from).toList();
  }

  @Transactional
  public void delete(UUID eventId, User actor) {
    PlatformEvent event = getEvent(eventId);
    adminAuthorizationService.assertCanAccessEvent(actor, event);
    
    // Delete associated ticket tiers first
    ticketTierRepository.deleteByEventId(eventId);
    
    // Delete the event
    eventRepository.delete(event);
  }

  public PlatformEvent getEvent(UUID eventId) {
    return eventRepository.findById(eventId).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Event not found."));
  }
}
