package com.thenexus.backend.booking.repository;

import com.thenexus.backend.booking.domain.Booking;
import com.thenexus.backend.booking.domain.BookingStatus;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BookingRepository extends JpaRepository<Booking, UUID> {
  Optional<Booking> findByBookingReference(String bookingReference);
  List<Booking> findByEventIdOrderByCreatedAtDesc(UUID eventId);
  long countByEventIdAndStatus(UUID eventId, BookingStatus status);
  long countByEventId(UUID eventId);
  List<Booking> findByEventIdInOrderByCreatedAtDesc(List<UUID> eventIds);
  boolean existsByEventIdAndAttendeeEmailIgnoreCaseAndStatusIn(UUID eventId, String attendeeEmail, List<BookingStatus> statuses);

  @Query("""
      select b from Booking b
      where b.event.id = :eventId
        and (
          :query is null or :query = '' or
          lower(b.attendeeName) like lower(concat('%', :query, '%')) or
          lower(b.attendeeEmail) like lower(concat('%', :query, '%')) or
          b.attendeePhone like concat('%', :query, '%')
        )
      order by b.createdAt desc
      """)
  List<Booking> searchEventBookings(@Param("eventId") UUID eventId, @Param("query") String query);

  // Optimized queries to prevent N+1 issues
  @Query("SELECT b FROM Booking b LEFT JOIN FETCH b.event LEFT JOIN FETCH b.ticketTier WHERE b.event.id = :eventId ORDER BY b.createdAt DESC")
  List<Booking> findByEventIdWithEventAndTicketTier(UUID eventId);

  @Query("SELECT b FROM Booking b LEFT JOIN FETCH b.event LEFT JOIN FETCH b.ticketTier ORDER BY b.createdAt DESC")
  List<Booking> findAllWithEventAndTicketTier();

  @Query("SELECT b FROM Booking b LEFT JOIN FETCH b.event LEFT JOIN FETCH b.ticketTier WHERE b.id = :bookingId")
  Optional<Booking> findByIdWithEventAndTicketTier(@Param("bookingId") UUID bookingId);
}
