package com.thenexus.backend.operations.service;

import com.thenexus.backend.finance.domain.FinanceEntry;
import com.thenexus.backend.finance.domain.FinanceEntryType;
import com.thenexus.backend.finance.repository.FinanceEntryRepository;
import com.thenexus.backend.event.domain.PlatformEvent;
import com.thenexus.backend.event.repository.PlatformEventRepository;
import com.thenexus.backend.operations.dto.FinanceEntryRequest;
import com.thenexus.backend.operations.dto.FinanceEntryResponse;
import com.thenexus.backend.operations.dto.FinanceSummaryResponse;
import com.thenexus.backend.user.domain.User;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class AdminFinanceService {
  private static final Logger log = LoggerFactory.getLogger(AdminFinanceService.class);

  private final FinanceEntryRepository financeEntryRepository;
  private final PlatformEventRepository eventRepository;

  public AdminFinanceService(FinanceEntryRepository financeEntryRepository, PlatformEventRepository eventRepository) {
    this.financeEntryRepository = financeEntryRepository;
    this.eventRepository = eventRepository;
  }

  @Transactional
  public FinanceSummaryResponse getFinanceSummary(User actor) {
    try {
      // Get all entries and calculate totals
      List<FinanceEntry> allEntries = financeEntryRepository.findByDeletedAtIsNullOrderByCreatedAtDesc();
      
      long totalRevenue = allEntries.stream()
          .filter(entry -> entry.getEntryType() == FinanceEntryType.REVENUE)
          .mapToLong(FinanceEntry::getAmountPaise)
          .sum();
      
      long totalExpenses = allEntries.stream()
          .filter(entry -> entry.getEntryType() == FinanceEntryType.EXPENSE)
          .mapToLong(FinanceEntry::getAmountPaise)
          .sum();
      
      long totalProfit = totalRevenue - totalExpenses;

      // Get recent entries (last 50)
      List<FinanceEntry> recentEntries = allEntries.stream()
          .limit(50)
          .toList();
      
      List<FinanceEntryResponse> recentEntriesResponse = recentEntries.stream()
          .map(this::toFinanceEntryResponse)
          .toList();

      return new FinanceSummaryResponse(
          totalRevenue,
          0L, // totalVenueCostPaise
          totalExpenses,
          0L, // totalRefundPaise
          totalProfit,
          List.of(), // events - empty for finance-only summary
          recentEntriesResponse
      );
    } catch (Exception e) {
      log.error("Failed to get finance summary for user: {}", actor.getEmail(), e);
      throw new com.thenexus.backend.common.exception.ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to get finance summary");
    }
  }

  @Transactional
  public FinanceEntryResponse createFinanceEntry(FinanceEntryRequest request, User actor) {
    try {
      // Validate request
      if (request.amountPaise() <= 0) {
        throw new com.thenexus.backend.common.exception.ApiException(HttpStatus.BAD_REQUEST, "Amount must be positive");
      }

      // Find event if eventId is provided
      PlatformEvent event = null;
      if (request.eventId() != null) {
        event = eventRepository.findById(request.eventId())
            .orElseThrow(() -> new com.thenexus.backend.common.exception.ApiException(HttpStatus.BAD_REQUEST, "Event not found"));
      }

      FinanceEntry entry = new FinanceEntry(
          event,
          request.entryType(),
          request.amountPaise(),
          request.note(),
          actor
      );

      FinanceEntry savedEntry = financeEntryRepository.save(entry);
      log.info("Created finance entry: {} by user: {}", savedEntry.getId(), actor.getEmail());

      return toFinanceEntryResponse(savedEntry);
    } catch (Exception e) {
      log.error("Failed to create finance entry for user: {}", actor.getEmail(), e);
      throw new com.thenexus.backend.common.exception.ApiException(HttpStatus.BAD_REQUEST, "Failed to create finance entry");
    }
  }

  @Transactional
  public List<FinanceEntryResponse> getFinanceEntries(UUID eventId, User actor) {
    try {
      List<FinanceEntry> entries;
      if (eventId != null) {
        entries = financeEntryRepository.findByEventIdAndDeletedAtIsNullOrderByCreatedAtDesc(eventId);
      } else {
        entries = financeEntryRepository.findByDeletedAtIsNullOrderByCreatedAtDesc();
      }
      
      return entries.stream()
          .map(this::toFinanceEntryResponse)
          .toList();
    } catch (Exception e) {
      log.error("Failed to get finance entries for user: {}", actor.getEmail(), e);
      throw new com.thenexus.backend.common.exception.ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to get finance entries");
    }
  }

  private FinanceEntryResponse toFinanceEntryResponse(FinanceEntry entry) {
    return new FinanceEntryResponse(
        entry.getId(),
        entry.getEvent() != null ? entry.getEvent().getId() : null,
        entry.getEvent() != null ? entry.getEvent().getTitle() : "Global",
        entry.getEntryType().name(),
        entry.getAmountPaise(),
        entry.getNote(),
        entry.getCreatedBy() != null ? entry.getCreatedBy().getFullName() : "System",
        entry.getCreatedAt()
    );
  }
}
