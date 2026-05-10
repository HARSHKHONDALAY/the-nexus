package com.thenexus.backend.finance.repository;

import com.thenexus.backend.finance.domain.FinanceEntry;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FinanceEntryRepository extends JpaRepository<FinanceEntry, UUID> {
  List<FinanceEntry> findByDeletedAtIsNullOrderByCreatedAtDesc();
  List<FinanceEntry> findByEventIdAndDeletedAtIsNullOrderByCreatedAtDesc(UUID eventId);
}
