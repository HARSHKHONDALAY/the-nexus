package com.thenexus.backend.operations.dto;

import com.thenexus.backend.booking.domain.Booking;
import com.thenexus.backend.booking.domain.Ticket;
import java.time.Instant;
import java.util.UUID;

public record AttendeeResponse(
    UUID bookingId,
    UUID ticketId,
    String ticketCode,
    UUID eventId,
    String eventTitle,
    String name,
    String phone,
    String email,
    String source,
    String instagram,
    Integer age,
    String location,
    String occupation,
    String paymentMethod,
    long amountPaidPaise,
    String bookingStatus,
    String checkInStatus,
    Instant checkedInAt,
    Instant registrationTime,
    String notes) {
  public static AttendeeResponse from(Booking booking, Ticket ticket) {
    return new AttendeeResponse(
        booking.getId(),
        ticket == null ? null : ticket.getId(),
        ticket == null ? null : ticket.getTicketCode(),
        booking.getEvent().getId(),
        booking.getEvent().getTitle(),
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
        ticket == null ? "NO_TICKET" : ticket.getStatus().name(),
        ticket == null ? null : ticket.getCheckedInAt(),
        booking.getCreatedAt(),
        booking.getNotes());
  }
}
