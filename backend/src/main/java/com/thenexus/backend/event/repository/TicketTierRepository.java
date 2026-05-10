package com.thenexus.backend.event.repository;

import com.thenexus.backend.event.domain.TicketTier;
import jakarta.persistence.LockModeType;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;

public interface TicketTierRepository extends JpaRepository<TicketTier, UUID> {
  List<TicketTier> findByEventIdOrderBySortOrderAsc(UUID eventId);
  @Lock(LockModeType.PESSIMISTIC_WRITE)
  Optional<TicketTier> findLockedById(UUID id);
}
