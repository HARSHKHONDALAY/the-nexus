package com.thenexus.backend.event.repository;

import com.thenexus.backend.event.domain.TicketTier;
import jakarta.persistence.LockModeType;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

public interface TicketTierRepository extends JpaRepository<TicketTier, UUID> {
  List<TicketTier> findByEventIdOrderBySortOrderAsc(UUID eventId);
  
  // Find ticket tiers with event to prevent lazy loading issues
  @Query("SELECT tt FROM TicketTier tt LEFT JOIN FETCH tt.event WHERE tt.event.id = :eventId ORDER BY tt.sortOrder ASC")
  List<TicketTier> findByEventIdWithEventOrderBySortOrderAsc(UUID eventId);
  
  @Lock(LockModeType.PESSIMISTIC_WRITE)
  Optional<TicketTier> findLockedById(UUID id);
  void deleteByEventId(UUID eventId);
}
