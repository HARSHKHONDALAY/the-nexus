package com.thenexus.backend.booking.service;

import com.thenexus.backend.audit.domain.PlatformAuditLog;
import com.thenexus.backend.audit.repository.PlatformAuditLogRepository;
import com.thenexus.backend.booking.domain.Booking;
import com.thenexus.backend.booking.domain.BookingStatus;
import com.thenexus.backend.booking.domain.Ticket;
import com.thenexus.backend.booking.domain.TicketScan;
import com.thenexus.backend.booking.dto.BookingResponse;
import com.thenexus.backend.booking.dto.CreateBookingRequest;
import com.thenexus.backend.booking.dto.TicketResponse;
import com.thenexus.backend.booking.repository.BookingRepository;
import com.thenexus.backend.booking.repository.TicketRepository;
import com.thenexus.backend.booking.repository.TicketScanRepository;
import com.thenexus.backend.common.exception.ApiException;
import com.thenexus.backend.event.domain.EventStatus;
import com.thenexus.backend.event.domain.PlatformEvent;
import com.thenexus.backend.event.domain.TicketTier;
import com.thenexus.backend.event.repository.PlatformEventRepository;
import com.thenexus.backend.event.repository.TicketTierRepository;
import com.thenexus.backend.notification.service.NotificationService;
import com.thenexus.backend.security.AdminAuthorizationService;
import com.thenexus.backend.user.domain.User;
import jakarta.transaction.Transactional;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class BookingService {
  private final PlatformEventRepository eventRepository;
  private final TicketTierRepository ticketTierRepository;
  private final BookingRepository bookingRepository;
  private final TicketRepository ticketRepository;
  private final BookingReferenceService referenceService;
  private final QrTicketService qrTicketService;
  private final TicketScanRepository ticketScanRepository;
  private final NotificationService notificationService;
  private final PlatformAuditLogRepository auditLogRepository;
  private final AdminAuthorizationService adminAuthorizationService;

  public BookingService(PlatformEventRepository eventRepository, TicketTierRepository ticketTierRepository,
      BookingRepository bookingRepository, TicketRepository ticketRepository, BookingReferenceService referenceService,
      QrTicketService qrTicketService, TicketScanRepository ticketScanRepository, NotificationService notificationService,
      PlatformAuditLogRepository auditLogRepository, AdminAuthorizationService adminAuthorizationService) {
    this.eventRepository = eventRepository; this.ticketTierRepository = ticketTierRepository; this.bookingRepository = bookingRepository;
    this.ticketRepository = ticketRepository; this.referenceService = referenceService; this.qrTicketService = qrTicketService;
    this.ticketScanRepository = ticketScanRepository; this.notificationService = notificationService;
    this.auditLogRepository = auditLogRepository; this.adminAuthorizationService = adminAuthorizationService;
  }

  @Transactional
  public BookingResponse create(CreateBookingRequest request, User user) {
    PlatformEvent event = eventRepository.findById(request.eventId())
        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Event not found."));
    if (event.getStatus() != EventStatus.PUBLISHED && event.getStatus() != EventStatus.LIVE) {
      throw new ApiException(HttpStatus.CONFLICT, "Event is not open for booking.");
    }
    if (bookingRepository.existsByEventIdAndAttendeeEmailIgnoreCaseAndStatusIn(
        event.getId(),
        request.attendeeEmail(),
        List.of(BookingStatus.PENDING_PAYMENT, BookingStatus.CONFIRMED, BookingStatus.WAITLISTED))) {
      throw new ApiException(HttpStatus.CONFLICT, "A booking already exists for this email and event.");
    }
    TicketTier tier = ticketTierRepository.findLockedById(request.ticketTierId())
        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Ticket tier not found."));
    if (!tier.getEvent().getId().equals(event.getId())) throw new ApiException(HttpStatus.BAD_REQUEST, "Ticket tier does not belong to event.");
    tier.reserve(request.quantity());
    Booking booking = new Booking(referenceService.nextReference(), user, event, tier, request.attendeeName(), request.attendeeEmail(),
        request.attendeePhone(), request.quantity(), tier.getPricePaise() * request.quantity(), tier.getCurrency(), Instant.now().plusSeconds(900));
    booking.updateOperationalDetails(request.sourceType(), request.instagramId(), request.attendeeAge(), request.attendeeLocation(),
        request.occupation(), null, request.notes());
    return BookingResponse.from(bookingRepository.save(booking));
  }

  @Transactional
  public BookingResponse confirmPaidBooking(Booking booking) {
    if (booking.getStatus() == BookingStatus.CONFIRMED) {
      return BookingResponse.withTickets(booking, ticketRepository.findByBookingId(booking.getId()).stream()
          .map(ticket -> TicketResponse.withQrToken(ticket, qrTicketService.decrypt(ticket.getQrTokenCiphertext())))
          .toList());
    }
    booking.confirm();
    booking.getTicketTier().confirmReserved(booking.getQuantity());
    List<TicketResponse> tickets = new java.util.ArrayList<>();
    for (int i = 1; i <= booking.getQuantity(); i++) {
      String token = qrTicketService.newQrToken();
      Ticket ticket = ticketRepository.save(new Ticket(booking, booking.getBookingReference() + "-" + i,
          qrTicketService.hash(token), qrTicketService.encrypt(token), booking.getAttendeeName()));
      tickets.add(TicketResponse.withQrToken(ticket, token));
    }
    queueConfirmation(booking, tickets);
    auditLogRepository.save(new PlatformAuditLog(null, "booking", booking.getId(), "booking.confirmed",
        booking.getEvent().getCategory().getSlug(), "{\"reference\":\"" + booking.getBookingReference() + "\"}"));
    return BookingResponse.withTickets(booking, tickets);
  }

  @Transactional
  public TicketResponse checkIn(String qrToken, UUID eventId, User actor) {
    String tokenHash = qrTicketService.hash(qrToken);
    Ticket ticket = ticketRepository.findByQrTokenHash(tokenHash).orElse(null);
    if (ticket == null) {
      ticketScanRepository.save(new TicketScan(null, tokenHash, "INVALID", "Ticket not found.", actor));
      throw new ApiException(HttpStatus.NOT_FOUND, "Ticket not found.");
    }
    if (eventId != null && !ticket.getBooking().getEvent().getId().equals(eventId)) {
      ticketScanRepository.save(new TicketScan(ticket, tokenHash, "WRONG_EVENT", "Ticket belongs to another event.", actor));
      throw new ApiException(HttpStatus.FORBIDDEN, "Ticket belongs to another event.");
    }
    adminAuthorizationService.assertCanAccessEvent(actor, ticket.getBooking().getEvent());
    try {
      ticket.checkIn(actor);
      ticketScanRepository.save(new TicketScan(ticket, tokenHash, "CHECKED_IN", "Ticket checked in.", actor));
      auditLogRepository.save(new PlatformAuditLog(actor, "ticket", ticket.getId(), "ticket.checked_in",
          ticket.getBooking().getEvent().getCategory().getSlug(), "{}"));
      return TicketResponse.from(ticket);
    } catch (ApiException exception) {
      ticketScanRepository.save(new TicketScan(ticket, tokenHash, "REJECTED", exception.getMessage(), actor));
      throw exception;
    }
  }

  @Transactional
  public void failBookingPayment(Booking booking, String reason) {
    if (booking.getStatus() != BookingStatus.PENDING_PAYMENT) return;
    booking.cancel(reason == null || reason.isBlank() ? "Payment failed." : reason);
    booking.getTicketTier().releaseReserved(booking.getQuantity());
  }

  @Transactional
  public void refundBooking(Booking booking, String reason) {
    if (booking.getStatus() == BookingStatus.REFUNDED) return;
    booking.markRefunded(reason == null || reason.isBlank() ? "Payment refunded." : reason);
    ticketRepository.findByBookingId(booking.getId()).forEach(Ticket::markRefunded);
  }

  public Booking getBooking(UUID bookingId) {
    return bookingRepository.findById(bookingId).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Booking not found."));
  }

  public List<BookingResponse> eventBookings(UUID eventId) {
    return bookingRepository.findByEventIdOrderByCreatedAtDesc(eventId).stream().map(BookingResponse::from).toList();
  }

  private void queueConfirmation(Booking booking, List<TicketResponse> tickets) {
    String payload = "{"
        + "\"bookingReference\":\"" + escape(booking.getBookingReference()) + "\","
        + "\"eventTitle\":\"" + escape(booking.getEvent().getTitle()) + "\","
        + "\"attendeeName\":\"" + escape(booking.getAttendeeName()) + "\","
        + "\"tickets\":["
        + tickets.stream()
            .map(ticket -> "{\"ticketCode\":\"" + escape(ticket.ticketCode()) + "\",\"qrToken\":\"" + escape(ticket.qrToken()) + "\"}")
            .collect(java.util.stream.Collectors.joining(","))
        + "]}";
    notificationService.queue(booking.getAttendeeEmail(), "booking.confirmed",
        "Your " + booking.getEvent().getTitle() + " ticket", payload);
  }

  private String escape(String value) {
    return value == null ? "" : value.replace("\\", "\\\\").replace("\"", "\\\"");
  }
}
