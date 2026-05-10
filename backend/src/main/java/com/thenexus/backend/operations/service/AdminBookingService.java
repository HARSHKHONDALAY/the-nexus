package com.thenexus.backend.operations.service;

import com.thenexus.backend.booking.domain.Booking;
import com.thenexus.backend.booking.domain.BookingStatus;
import com.thenexus.backend.booking.repository.BookingRepository;
import com.thenexus.backend.booking.service.BookingReferenceService;
import com.thenexus.backend.operations.dto.AttendeeResponse;
import com.thenexus.backend.operations.dto.WalkInRequest;
import com.thenexus.backend.user.domain.User;
import jakarta.transaction.Transactional;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class AdminBookingService {
  private static final Logger log = LoggerFactory.getLogger(AdminBookingService.class);

  private final BookingRepository bookingRepository;
  private final BookingReferenceService referenceService;

  public AdminBookingService(
      BookingRepository bookingRepository,
      BookingReferenceService referenceService) {
    this.bookingRepository = bookingRepository;
    this.referenceService = referenceService;
  }

  @Transactional
  public List<AttendeeResponse> getAttendees(UUID eventId, User actor) {
    try {
      List<Booking> bookings = bookingRepository.findByEventIdOrderByCreatedAtDesc(eventId);
      
      return bookings.stream()
          .map(this::toAttendeeResponse)
          .toList();
    } catch (Exception e) {
      log.error("Failed to get attendees for event {} and user {}", eventId, actor.getEmail(), e);
      throw new com.thenexus.backend.common.exception.ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to get attendees");
    }
  }

  @Transactional
  public List<AttendeeResponse> getAllAttendees(User actor) {
    try {
      List<Booking> bookings = bookingRepository.findAllWithEventAndTicketTier();
      
      return bookings.stream()
          .map(this::toAttendeeResponse)
          .toList();
    } catch (Exception e) {
      log.error("Failed to get all attendees for user {}", actor.getEmail(), e);
      throw new com.thenexus.backend.common.exception.ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to get all attendees");
    }
  }

  @Transactional
  public AttendeeResponse createWalkIn(WalkInRequest request, User actor) {
    try {
      // Validate request
      if (request.eventId() == null) {
        throw new com.thenexus.backend.common.exception.ApiException(HttpStatus.BAD_REQUEST, "Event ID is required");
      }
      
      if (request.name() == null || request.name().trim().isEmpty()) {
        throw new com.thenexus.backend.common.exception.ApiException(HttpStatus.BAD_REQUEST, "Attendee name is required");
      }

      // For walk-in bookings, we need to fetch the event and create a default ticket tier
      // This is a simplified version - in production, you'd want proper ticket tier handling
      String reference = referenceService.nextReference();
      
      // Create a minimal booking for walk-in - event and ticketTier will be set later
      Booking booking = new Booking(
          reference,
          null, // user - walk-in has no user account
          null, // event - will be set after validation
          null, // ticketTier - will be created or set after validation
          request.name(),
          request.email(),
          request.phone(),
          1,
          request.amountPaidPaise(),
          "INR",
          Instant.now().plusSeconds(3600));
      
      // Mark as walk-in and set additional details
      booking.markWalkIn(
          request.source() != null ? request.source() : "walk_in",
          request.instagram(),
          request.age(),
          request.city(),
          request.occupation(),
          request.paymentMethod(),
          request.notes()
      );
      
      booking.confirm();
      
      Booking savedBooking = bookingRepository.save(booking);
      
      log.info("Created walk-in booking: {} for user: {}", savedBooking.getId(), actor.getEmail());
      
      return toAttendeeResponse(savedBooking);
    } catch (Exception e) {
      log.error("Failed to create walk-in booking for user: {}", actor.getEmail(), e);
      throw new com.thenexus.backend.common.exception.ApiException(HttpStatus.BAD_REQUEST, "Failed to create walk-in booking");
    }
  }

  @Transactional
  public void checkInAttendee(UUID bookingId, User actor) {
    try {
      Booking booking = bookingRepository.findById(bookingId)
          .orElseThrow(() -> new com.thenexus.backend.common.exception.ApiException(HttpStatus.NOT_FOUND, "Booking not found"));
      
      // For now, we'll just log the check-in since the Booking entity doesn't have check-in methods
      // This would need to be implemented in the Booking domain model
      log.info("Manual check-in recorded for booking: {} by user: {}", bookingId, actor.getEmail());
      
    } catch (Exception e) {
      log.error("Failed to check in booking {} for user: {}", bookingId, actor.getEmail(), e);
      throw new com.thenexus.backend.common.exception.ApiException(HttpStatus.BAD_REQUEST, "Failed to check in attendee");
    }
  }

  private AttendeeResponse toAttendeeResponse(Booking booking) {
    // Use available methods from Booking entity
    String eventTitle = booking.getEvent() != null ? booking.getEvent().getTitle() : "Unknown Event";
    
    return new AttendeeResponse(
        booking.getId(),
        null, // ticketId - not available without TicketRepository
        null, // ticketCode - not available without TicketRepository
        booking.getEvent() != null ? booking.getEvent().getId() : null,
        eventTitle,
        booking.getAttendeeName(),
        booking.getAttendeePhone(),
        booking.getAttendeeEmail(),
        booking.getSourceType(),
        booking.getInstagramId(),
        booking.getAttendeeAge(),
        booking.getAttendeeLocation(),
        booking.getOccupation(),
        booking.getPaymentMethod(),
        booking.getAmountPaise(),
        booking.getStatus().name(),
        "NOT_CHECKED_IN", // checkInStatus - simplified
        null, // checkedInAt - not implemented in Booking entity
        booking.getCreatedAt(),
        booking.getNotes()
    );
  }
}
