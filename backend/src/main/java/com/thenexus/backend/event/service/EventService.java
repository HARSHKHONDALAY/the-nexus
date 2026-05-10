package com.thenexus.backend.event.service;

import com.thenexus.backend.common.exception.ApiException;
import com.thenexus.backend.event.domain.EventCategory;
import com.thenexus.backend.event.domain.EventStatus;
import com.thenexus.backend.event.domain.PlatformEvent;
import com.thenexus.backend.event.domain.TicketTier;
import com.thenexus.backend.event.dto.CreateEventRequest;
import com.thenexus.backend.event.dto.CreateTicketTierRequest;
import com.thenexus.backend.event.dto.EventResponse;
import com.thenexus.backend.event.dto.TicketTierResponse;
import com.thenexus.backend.event.repository.EventCategoryRepository;
import com.thenexus.backend.event.repository.PlatformEventRepository;
import com.thenexus.backend.event.repository.TicketTierRepository;
import com.thenexus.backend.security.AdminAuthorizationService;
import com.thenexus.backend.user.domain.User;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class EventService {
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

  public List<EventResponse> publicEvents() {
    return eventRepository.findByStatusInOrderByStartsAtAsc(List.of(EventStatus.PUBLISHED, EventStatus.LIVE, EventStatus.SOLD_OUT))
        .stream().map(EventResponse::from).toList();
  }

  public EventResponse publicEventBySlug(String slug) {
    PlatformEvent event = eventRepository.findBySlug(slug)
        .filter(found -> found.getStatus() == EventStatus.PUBLISHED || found.getStatus() == EventStatus.LIVE || found.getStatus() == EventStatus.SOLD_OUT)
        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Event not found."));
    return EventResponse.from(event);
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
  public EventResponse publish(UUID eventId, User actor) {
    PlatformEvent event = getEvent(eventId);
    adminAuthorizationService.assertCanAccessEvent(actor, event);
    event.publish(actor);
    return EventResponse.from(event);
  }

  @Transactional
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

  public PlatformEvent getEvent(UUID eventId) {
    return eventRepository.findById(eventId).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Event not found."));
  }
}
