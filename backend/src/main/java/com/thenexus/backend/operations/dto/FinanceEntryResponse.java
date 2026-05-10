package com.thenexus.backend.operations.dto;

import com.thenexus.backend.finance.domain.FinanceEntry;
import java.time.Instant;
import java.util.UUID;

public record FinanceEntryResponse(
    UUID id,
    UUID eventId,
    String eventTitle,
    String entryType,
    long amountPaise,
    String note,
    String createdBy,
    Instant createdAt) {
  public static FinanceEntryResponse from(FinanceEntry entry) {
    return new FinanceEntryResponse(
        entry.getId(),
        entry.getEvent() == null ? null : entry.getEvent().getId(),
        entry.getEvent() == null ? "Global" : entry.getEvent().getTitle(),
        entry.getEntryType().name(),
        entry.getAmountPaise(),
        entry.getNote(),
        entry.getCreatedBy() == null ? "System" : entry.getCreatedBy().getFullName(),
        entry.getCreatedAt());
  }
}
