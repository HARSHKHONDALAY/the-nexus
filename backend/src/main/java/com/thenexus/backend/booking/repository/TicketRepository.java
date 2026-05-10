package com.thenexus.backend.booking.repository;

import com.thenexus.backend.booking.domain.Ticket;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketRepository extends JpaRepository<Ticket, UUID> {
  List<Ticket> findByBookingId(UUID bookingId);
  Optional<Ticket> findByQrTokenHash(String qrTokenHash);
  Optional<Ticket> findFirstByBookingIdOrderByCreatedAtAsc(UUID bookingId);
  long countByBookingEventIdAndStatus(UUID eventId, com.thenexus.backend.booking.domain.TicketStatus status);
}
