package com.thenexus.backend.booking.dto;

import com.thenexus.backend.booking.domain.Booking;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record BookingResponse(UUID id, String bookingReference, UUID eventId, UUID ticketTierId, String attendeeName,
    String attendeeEmail, String attendeePhone, int quantity, long amountPaise, String currency, String status,
    Instant paymentDeadlineAt, Instant createdAt, List<TicketResponse> tickets) {
  public static BookingResponse from(Booking booking) {
    return new BookingResponse(booking.getId(), booking.getBookingReference(), booking.getEvent().getId(),
        booking.getTicketTier().getId(), booking.getAttendeeName(), booking.getAttendeeEmail(), booking.getAttendeePhone(),
        booking.getQuantity(), booking.getAmountPaise(), booking.getCurrency(), booking.getStatus().name(),
        booking.getPaymentDeadlineAt(), booking.getCreatedAt(), List.of());
  }

  public static BookingResponse withTickets(Booking booking, List<TicketResponse> tickets) {
    return new BookingResponse(booking.getId(), booking.getBookingReference(), booking.getEvent().getId(),
        booking.getTicketTier().getId(), booking.getAttendeeName(), booking.getAttendeeEmail(), booking.getAttendeePhone(),
        booking.getQuantity(), booking.getAmountPaise(), booking.getCurrency(), booking.getStatus().name(),
        booking.getPaymentDeadlineAt(), booking.getCreatedAt(), tickets);
  }
}
