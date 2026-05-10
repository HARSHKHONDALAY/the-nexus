package com.thenexus.backend.operations.service;

import com.thenexus.backend.audit.domain.PlatformAuditLog;
import com.thenexus.backend.audit.repository.PlatformAuditLogRepository;
import com.thenexus.backend.booking.domain.Booking;
import com.thenexus.backend.booking.domain.BookingStatus;
import com.thenexus.backend.booking.domain.Ticket;
import com.thenexus.backend.booking.domain.TicketStatus;
import com.thenexus.backend.booking.repository.BookingRepository;
import com.thenexus.backend.booking.repository.TicketRepository;
import com.thenexus.backend.booking.service.BookingReferenceService;
import com.thenexus.backend.booking.service.BookingService;
import com.thenexus.backend.common.exception.ApiException;
import com.thenexus.backend.event.domain.EventCategory;
import com.thenexus.backend.event.domain.EventStatus;
import com.thenexus.backend.event.domain.PlatformEvent;
import com.thenexus.backend.event.domain.TicketTier;
import com.thenexus.backend.event.repository.EventCategoryRepository;
import com.thenexus.backend.event.repository.PlatformEventRepository;
import com.thenexus.backend.event.repository.TicketTierRepository;
import com.thenexus.backend.finance.domain.FinanceEntry;
import com.thenexus.backend.finance.domain.FinanceEntryType;
import com.thenexus.backend.finance.repository.FinanceEntryRepository;
import com.thenexus.backend.operations.dto.AdminDashboardResponse;
import com.thenexus.backend.operations.dto.AdminEventResponse;
import com.thenexus.backend.operations.dto.AttendeeResponse;
import com.thenexus.backend.operations.dto.AuditLogResponse;
import com.thenexus.backend.operations.dto.CreateAdminEventRequest;
import com.thenexus.backend.operations.dto.EventStatusRequest;
import com.thenexus.backend.operations.dto.FinanceEntryRequest;
import com.thenexus.backend.operations.dto.FinanceEntryResponse;
import com.thenexus.backend.operations.dto.FinanceSummaryResponse;
import com.thenexus.backend.operations.dto.WalkInRequest;
import com.thenexus.backend.security.AdminAuthorizationService;
import com.thenexus.backend.user.domain.User;
import com.thenexus.backend.webhook.service.CacheInvalidationService;
import jakarta.transaction.Transactional;
import java.text.Normalizer;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class AdminOperationsService {
  private static final Logger log = LoggerFactory.getLogger(AdminOperationsService.class);

  private final PlatformEventRepository eventRepository;
  private final EventCategoryRepository categoryRepository;
  private final TicketTierRepository ticketTierRepository;
  private final BookingRepository bookingRepository;
  private final TicketRepository ticketRepository;
  private final FinanceEntryRepository financeEntryRepository;
  private final PlatformAuditLogRepository auditLogRepository;
  private final BookingReferenceService referenceService;
  private final BookingService bookingService;
  private final AdminAuthorizationService adminAuthorizationService;
  private final CacheInvalidationService cacheInvalidationService;

  public AdminOperationsService(
      PlatformEventRepository eventRepository,
      EventCategoryRepository categoryRepository,
      TicketTierRepository ticketTierRepository,
      BookingRepository bookingRepository,
      TicketRepository ticketRepository,
      FinanceEntryRepository financeEntryRepository,
      PlatformAuditLogRepository auditLogRepository,
      BookingReferenceService referenceService,
      BookingService bookingService,
      AdminAuthorizationService adminAuthorizationService,
      CacheInvalidationService cacheInvalidationService) {
    this.eventRepository = eventRepository;
    this.categoryRepository = categoryRepository;
    this.ticketTierRepository = ticketTierRepository;
    this.bookingRepository = bookingRepository;
    this.ticketRepository = ticketRepository;
    this.financeEntryRepository = financeEntryRepository;
    this.auditLogRepository = auditLogRepository;
    this.referenceService = referenceService;
    this.bookingService = bookingService;
    this.adminAuthorizationService = adminAuthorizationService;
    this.cacheInvalidationService = cacheInvalidationService;
  }

  @Transactional
  public AdminDashboardResponse dashboard(User actor) {
    List<String> alerts = new ArrayList<>();
    List<String> unavailableServices = new ArrayList<>();

    List<AdminEventResponse> currentEvents;
    List<AuditLogResponse> recentActivity;
    
    // Try to load current events with safe fallback
    try {
      currentEvents = currentEvents(actor);
    } catch (RuntimeException exception) {
      log.error("dashboard_current_events_failed actorId={}", actor == null ? null : actor.getId(), exception);
      currentEvents = List.of();
      alerts.add("Current event metrics are temporarily unavailable.");
      unavailableServices.add("currentEvents");
    }
    
    // Try to load recent activity with safe fallback
    try {
      recentActivity = auditLogs(actor).stream().limit(8).toList();
    } catch (RuntimeException exception) {
      log.error("dashboard_recent_activity_failed actorId={}", actor == null ? null : actor.getId(), exception);
      recentActivity = List.of();
      alerts.add("Recent activity is temporarily unavailable.");
      unavailableServices.add("recentActivity");
    }

    long totalRegistrations = currentEvents.stream().mapToLong(AdminEventResponse::registrations).sum();
    long checkedIn = currentEvents.stream().mapToLong(AdminEventResponse::checkedIn).sum();
    long revenue = currentEvents.stream().mapToLong(AdminEventResponse::revenuePaise).sum();
    long venueCost = currentEvents.stream().mapToLong(AdminEventResponse::venueCostPaise).sum();
    long expense = currentEvents.stream().mapToLong(AdminEventResponse::expensePaise).sum();
    long profit = revenue - venueCost - expense;
    return new AdminDashboardResponse(
        unavailableServices.isEmpty() ? "ok" : "partial_failure",
        currentEvents.size(),
        totalRegistrations,
        checkedIn,
        revenue,
        venueCost,
        expense,
        profit,
        currentEvents,
        recentActivity,
        alerts,
        unavailableServices);
  }

  @Transactional
  public List<AdminEventResponse> currentEvents(User actor) {
    return eventRepository
        .findByStatusInAndDeletedAtIsNullOrderByStartsAtAsc(List.of(EventStatus.DRAFT, EventStatus.PUBLISHED, EventStatus.LIVE, EventStatus.SOLD_OUT))
        .stream()
        .filter(event -> adminAuthorizationService.canAccessEvent(actor, event))
        .map(this::safeEventResponse)
        .flatMap(Optional::stream)
        .toList();
  }

  @Transactional
  public List<AdminEventResponse> pastEvents(User actor) {
    try {
      return eventRepository.findByStatusInOrderByStartsAtDesc(List.of(EventStatus.CLOSED, EventStatus.CANCELLED, EventStatus.ARCHIVED))
          .stream()
          .filter(event -> adminAuthorizationService.canAccessEvent(actor, event))
          .map(this::safeEventResponse)
          .flatMap(Optional::stream)
          .toList();
    } catch (RuntimeException exception) {
      log.error("failed_loading_past_admin_events", exception);
      return List.of();
    }
  }

  @Transactional
  public AdminEventResponse createEvent(CreateAdminEventRequest request, User actor) {
    if (!request.endsAt().isAfter(request.startsAt())) throw new ApiException(HttpStatus.BAD_REQUEST, "Event end time must be after start time.");
    String categorySlug = switch (request.eventType()) {
      case "The Chess Nexus", "Chess Nexus", "chess-nexus" -> "chess-nexus";
      case "The Art Nexus", "Art Nexus", "art-nexus" -> "art-nexus";
      default -> throw new ApiException(HttpStatus.BAD_REQUEST, "Event type must be Chess Nexus or Art Nexus.");
    };
    EventCategory category = categoryRepository.findBySlug(categorySlug)
        .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, "Event category is not configured."));
    adminAuthorizationService.assertCanAccessEcosystem(actor, category.getSlug());
    String slug = uniqueSlug(request.title());
    PlatformEvent event = new PlatformEvent(category, slug, request.title(), null, request.description(), request.venueName(),
        request.venueAddress(), request.city(), request.startsAt(), request.endsAt(), "Asia/Kolkata",
        request.maxCapacity(), true, actor);
    event.updateOperations(request.registrationOpen(), request.allowWalkIns(), request.visibility(),
        request.venueCostPaise(), request.seoTitle(), request.seoDescription(), actor);
    if (request.publish()) event.publish(actor);
    PlatformEvent saved = eventRepository.save(event);
    ticketTierRepository.save(new TicketTier(saved, "General Entry", "Standard access", request.ticketPricePaise(), "INR",
        request.maxCapacity(), null, null, 0));
    audit(actor, "event", saved.getId(), "event.created", eventEcosystem(saved), "{\"title\":\"" + escape(saved.getTitle()) + "\"}");
    
    // Invalidate frontend caches
    if (request.publish()) {
      cacheInvalidationService.invalidateEventPage(saved.getSlug());
      cacheInvalidationService.invalidateAllEvents();
      cacheInvalidationService.invalidateHomePage();
    }
    
    return eventResponse(saved);
  }

  @Transactional
  public AdminEventResponse updateEventStatus(UUID eventId, String action, User actor) {
    PlatformEvent event = getEvent(eventId, actor);
    switch (action) {
      case "open_registrations" -> event.openRegistrations(actor);
      case "close_registrations" -> event.closeRegistrations(actor);
      case "publish" -> event.publish(actor);
      case "mark_live" -> event.markLive(actor);
      case "move_to_past", "close" -> event.close(actor);
      case "archive" -> event.archive(actor);
      default -> throw new ApiException(HttpStatus.BAD_REQUEST, "Unknown event action.");
    }
    audit(actor, "event", event.getId(), "event." + action, eventEcosystem(event), "{}");
    
    // Invalidate frontend caches for publishing actions
    if ("publish".equals(action) || "mark_live".equals(action)) {
      cacheInvalidationService.invalidateEventPage(event.getSlug());
      cacheInvalidationService.invalidateAllEvents();
      cacheInvalidationService.invalidateHomePage();
    }
    
    return eventResponse(event);
  }

  @Transactional
  public AdminEventResponse duplicateEvent(UUID eventId, User actor) {
    PlatformEvent source = getEvent(eventId, actor);
    CreateAdminEventRequest request = new CreateAdminEventRequest(
        source.getTitle() + " Copy",
        source.getCategory().getSlug(),
        source.getStartsAt().plusSeconds(604800),
        source.getEndsAt().plusSeconds(604800),
        source.getVenueName(),
        source.getVenueAddress(),
        source.getCity(),
        primaryTicketPrice(source),
        source.getVenueCostPaise(),
        source.getCapacity(),
        source.getDescription(),
        false,
        false,
        source.isAllowWalkIns(),
        source.getVisibility(),
        source.getSeoTitle(),
        source.getSeoDescription());
    return createEvent(request, actor);
  }

  @Transactional
  public List<AttendeeResponse> attendees(UUID eventId, String query, User actor) {
    getEvent(eventId, actor);
    return bookingRepository.searchEventBookings(eventId, query == null ? "" : query).stream()
        .map(booking -> AttendeeResponse.from(booking, ticketRepository.findFirstByBookingIdOrderByCreatedAtAsc(booking.getId()).orElse(null)))
        .toList();
  }

  @Transactional
  public AttendeeResponse addWalkIn(WalkInRequest request, User actor) {
    PlatformEvent event = getEvent(request.eventId(), actor);
    if (!event.isAllowWalkIns()) throw new ApiException(HttpStatus.CONFLICT, "Walk-ins are not enabled for this event.");
    TicketTier tier = request.ticketTierId() == null
        ? ticketTierRepository.findByEventIdOrderBySortOrderAsc(event.getId()).stream().findFirst()
            .orElseThrow(() -> new ApiException(HttpStatus.CONFLICT, "No ticket tier exists for this event."))
        : ticketTierRepository.findLockedById(request.ticketTierId())
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Ticket tier not found."));
    tier.reserve(1);
    long amount = request.amountPaidPaise() > 0 ? request.amountPaidPaise() : tier.getPricePaise();
    Booking booking = new Booking(referenceService.nextReference(), null, event, tier, request.name(), request.email(), request.phone(),
        1, amount, tier.getCurrency(), Instant.now().plusSeconds(900));
    booking.markWalkIn(request.source() == null ? "walk_in" : request.source(), request.instagram(), request.age(),
        request.city(), request.occupation(), request.paymentMethod(), request.notes());
    Booking saved = bookingRepository.save(booking);
    bookingService.confirmPaidBooking(saved);
    Ticket ticket = ticketRepository.findFirstByBookingIdOrderByCreatedAtAsc(saved.getId()).orElseThrow();
    if (request.checkedIn()) ticket.checkIn(actor);
    audit(actor, "booking", saved.getId(), "attendee.walk_in_added", eventEcosystem(event), "{\"event\":\"" + escape(event.getTitle()) + "\"}");
    return AttendeeResponse.from(saved, ticket);
  }

  @Transactional
  public AttendeeResponse checkIn(UUID ticketId, User actor) {
    Ticket ticket = ticketRepository.findById(ticketId).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Ticket not found."));
    adminAuthorizationService.assertCanAccessEvent(actor, ticket.getBooking().getEvent());
    ticket.checkIn(actor);
    audit(actor, "ticket", ticket.getId(), "ticket.checked_in", eventEcosystem(ticket.getBooking().getEvent()), "{}");
    return AttendeeResponse.from(ticket.getBooking(), ticket);
  }

  @Transactional
  public AttendeeResponse undoCheckIn(UUID ticketId, User actor) {
    Ticket ticket = ticketRepository.findById(ticketId).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Ticket not found."));
    adminAuthorizationService.assertCanAccessEvent(actor, ticket.getBooking().getEvent());
    ticket.undoCheckIn();
    audit(actor, "ticket", ticket.getId(), "ticket.check_in_undone", eventEcosystem(ticket.getBooking().getEvent()), "{}");
    return AttendeeResponse.from(ticket.getBooking(), ticket);
  }

  @Transactional
  public void deleteAttendee(UUID bookingId, User actor) {
    Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Booking not found."));
    adminAuthorizationService.assertCanAccessEvent(actor, booking.getEvent());
    audit(actor, "booking", booking.getId(), "attendee.deleted", eventEcosystem(booking.getEvent()), "{\"name\":\"" + escape(booking.getAttendeeName()) + "\"}");
    bookingRepository.delete(booking);
  }

  @Transactional
  public FinanceSummaryResponse financeSummary(User actor) {
    List<AdminEventResponse> events = eventRepository.findAll().stream()
        .filter(event -> adminAuthorizationService.canAccessEvent(actor, event))
        .map(this::eventResponse)
        .toList();
    List<FinanceEntry> scopedEntries = scopedFinanceEntries(actor);
    List<FinanceEntryResponse> entries = scopedEntries.stream().map(FinanceEntryResponse::from).toList();
    long revenue = events.stream().mapToLong(AdminEventResponse::revenuePaise).sum() + entryTotal(scopedEntries, FinanceEntryType.REVENUE);
    long venue = events.stream().mapToLong(AdminEventResponse::venueCostPaise).sum() + entryTotal(scopedEntries, FinanceEntryType.VENUE_COST);
    long expense = entryTotal(scopedEntries, FinanceEntryType.EXPENSE) + entryTotal(scopedEntries, FinanceEntryType.MISC);
    long refund = entryTotal(scopedEntries, FinanceEntryType.REFUND);
    return new FinanceSummaryResponse(revenue, venue, expense, refund, revenue - venue - expense - refund, events, entries);
  }

  @Transactional
  public FinanceEntryResponse addFinanceEntry(FinanceEntryRequest request, User actor) {
    PlatformEvent event = request.eventId() == null ? null : getEvent(request.eventId(), actor);
    if (event == null && !adminAuthorizationService.isSuperAdmin(actor)) {
      throw new ApiException(HttpStatus.FORBIDDEN, "Only Super Admins can create global finance entries.");
    }
    FinanceEntry entry = financeEntryRepository.save(new FinanceEntry(event, request.entryType(), request.amountPaise(), request.note(), actor));
    audit(actor, "finance_entry", entry.getId(), "finance.entry_added", eventEcosystem(event), "{\"type\":\"" + entry.getEntryType().name() + "\"}");
    return FinanceEntryResponse.from(entry);
  }

  @Transactional
  public void deleteFinanceEntry(UUID entryId, User actor) {
    FinanceEntry entry = financeEntryRepository.findById(entryId)
        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Finance entry not found."));
    if (!adminAuthorizationService.canAccessFinanceEntry(actor, entry)) {
      throw new ApiException(HttpStatus.FORBIDDEN, "This admin is not assigned to this ecosystem.");
    }
    entry.delete();
    audit(actor, "finance_entry", entry.getId(), "finance.entry_deleted", eventEcosystem(entry.getEvent()), "{}");
  }

  @Transactional
  public List<AuditLogResponse> auditLogs(User actor) {
    String ecosystemSlug = adminAuthorizationService.requiredScopedEcosystem(actor);
    if (ecosystemSlug == null) {
      return auditLogRepository.findTop100ByOrderByCreatedAtDesc().stream()
          .map(this::safeAuditLogResponse)
          .flatMap(Optional::stream)
          .toList();
    }
    return auditLogRepository.findTop100ByEcosystemSlugOrderByCreatedAtDesc(ecosystemSlug).stream()
        .map(this::safeAuditLogResponse)
        .flatMap(Optional::stream)
        .toList();
  }

  private Optional<AdminEventResponse> safeEventResponse(PlatformEvent event) {
    try {
      return Optional.of(eventResponse(event));
    } catch (RuntimeException exception) {
      log.warn("skipping_malformed_admin_event eventId={}", event == null ? null : event.getId(), exception);
      return Optional.empty();
    }
  }

  private Optional<AuditLogResponse> safeAuditLogResponse(PlatformAuditLog logEntry) {
    try {
      return Optional.of(AuditLogResponse.from(logEntry));
    } catch (RuntimeException exception) {
      log.warn("skipping_malformed_audit_log logId={}", logEntry == null ? null : logEntry.getId(), exception);
      return Optional.empty();
    }
  }

  private AdminEventResponse eventResponse(PlatformEvent event) {
    long revenue = bookingRepository.findByEventIdOrderByCreatedAtDesc(event.getId()).stream()
        .filter(booking -> booking.getStatus() == BookingStatus.CONFIRMED)
        .mapToLong(Booking::getAmountPaise)
        .sum();
    long extraRevenue = financeEntryRepository.findByEventIdAndDeletedAtIsNullOrderByCreatedAtDesc(event.getId()).stream()
        .filter(entry -> entry.getEntryType() == FinanceEntryType.REVENUE)
        .mapToLong(FinanceEntry::getAmountPaise)
        .sum();
    long expenses = financeEntryRepository.findByEventIdAndDeletedAtIsNullOrderByCreatedAtDesc(event.getId()).stream()
        .filter(entry -> entry.getEntryType() == FinanceEntryType.EXPENSE || entry.getEntryType() == FinanceEntryType.MISC || entry.getEntryType() == FinanceEntryType.REFUND)
        .mapToLong(FinanceEntry::getAmountPaise)
        .sum();
    long checkedIn = ticketRepository.countByBookingEventIdAndStatus(event.getId(), TicketStatus.CHECKED_IN);
    long registrations = bookingRepository.countByEventId(event.getId());
    long ticketPrice = primaryTicketPrice(event);
    long totalRevenue = revenue + extraRevenue;
    long profit = totalRevenue - event.getVenueCostPaise() - expenses;
    return AdminEventResponse.from(event, ticketPrice, registrations, checkedIn, totalRevenue, expenses, profit);
  }

  private long primaryTicketPrice(PlatformEvent event) {
    return ticketTierRepository.findByEventIdOrderBySortOrderAsc(event.getId()).stream().findFirst().map(TicketTier::getPricePaise).orElse(0L);
  }

  private PlatformEvent getEvent(UUID eventId) {
    return eventRepository.findById(eventId).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Event not found."));
  }

  private PlatformEvent getEvent(UUID eventId, User actor) {
    PlatformEvent event = getEvent(eventId);
    adminAuthorizationService.assertCanAccessEvent(actor, event);
    return event;
  }

  private String uniqueSlug(String title) {
    String base = Normalizer.normalize(title, Normalizer.Form.NFD)
        .replaceAll("\\p{M}", "")
        .toLowerCase(Locale.ROOT)
        .replaceAll("[^a-z0-9]+", "-")
        .replaceAll("(^-|-$)", "");
    if (base.isBlank()) base = "event";
    String candidate = base;
    int suffix = 2;
    while (eventRepository.existsBySlug(candidate)) candidate = base + "-" + suffix++;
    return candidate;
  }

  private void audit(User actor, String entityType, UUID entityId, String action, String metadata) {
    audit(actor, entityType, entityId, action, actor == null ? null : actor.getAssignedEcosystemSlug(), metadata);
  }

  private void audit(User actor, String entityType, UUID entityId, String action, String ecosystemSlug, String metadata) {
    auditLogRepository.save(new PlatformAuditLog(actor, entityType, entityId, action, ecosystemSlug, metadata));
  }

  private String eventEcosystem(PlatformEvent event) {
    return event == null || event.getCategory() == null ? null : event.getCategory().getSlug();
  }

  private List<FinanceEntry> scopedFinanceEntries(User actor) {
    return financeEntryRepository.findByDeletedAtIsNullOrderByCreatedAtDesc().stream()
        .filter(entry -> adminAuthorizationService.canAccessFinanceEntry(actor, entry))
        .toList();
  }

  private long entryTotal(List<FinanceEntry> entries, FinanceEntryType type) {
    return entries.stream()
        .filter(entry -> entry.getEntryType() == type)
        .mapToLong(FinanceEntry::getAmountPaise)
        .sum();
  }

  public AdminEventResponse updateEventStatus(UUID eventId, EventStatusRequest request, User actor) {
    PlatformEvent event = eventRepository.findById(eventId)
        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Event not found."));
    
    adminAuthorizationService.assertCanAccessEvent(actor, event);
    
    switch (request.action()) {
      case "close_registrations" -> event.closeRegistrations(actor);
      case "open_registrations" -> event.openRegistrations(actor);
      case "mark_live" -> event.markLive(actor);
      case "archive" -> event.archive(actor);
      case "close" -> event.close(actor);
      default -> throw new ApiException(HttpStatus.BAD_REQUEST, "Unknown action: " + request.action());
    }
    
    audit(actor, "event", eventId, "status_update", String.format("action=%s", request.action()));
    PlatformEvent savedEvent = eventRepository.save(event);
    return eventResponse(savedEvent);
  }

  @Transactional
  public void deleteEvent(UUID eventId, User actor) {
    PlatformEvent event = eventRepository.findById(eventId)
        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Event not found."));
    
    adminAuthorizationService.assertCanAccessEvent(actor, event);
    
    // Delete associated ticket tiers first
    ticketTierRepository.deleteByEventId(eventId);
    
    // Delete the event
    eventRepository.delete(event);
    
    audit(actor, "event", eventId, "delete", String.format("title=%s", event.getTitle()));
  }

  private String escape(String value) {
    return value == null ? "" : value.replace("\\", "\\\\").replace("\"", "\\\"");
  }
}
