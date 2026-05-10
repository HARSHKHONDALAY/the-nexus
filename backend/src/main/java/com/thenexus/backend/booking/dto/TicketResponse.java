package com.thenexus.backend.booking.dto;

import com.thenexus.backend.booking.domain.Ticket;
import java.time.Instant;
import java.util.UUID;

public record TicketResponse(UUID id, String ticketCode, String attendeeName, String status, Instant checkedInAt, String qrToken) {
  public static TicketResponse from(Ticket ticket) {
    return new TicketResponse(ticket.getId(), ticket.getTicketCode(), ticket.getAttendeeName(), ticket.getStatus().name(), ticket.getCheckedInAt(), null);
  }

  public static TicketResponse withQrToken(Ticket ticket, String qrToken) {
    return new TicketResponse(ticket.getId(), ticket.getTicketCode(), ticket.getAttendeeName(), ticket.getStatus().name(), ticket.getCheckedInAt(), qrToken);
  }
}
