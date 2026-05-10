package com.thenexus.backend.operations.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.thenexus.backend.audit.domain.PlatformAuditLog;
import com.thenexus.backend.audit.repository.PlatformAuditLogRepository;
import com.thenexus.backend.booking.repository.BookingRepository;
import com.thenexus.backend.booking.repository.TicketRepository;
import com.thenexus.backend.booking.service.BookingReferenceService;
import com.thenexus.backend.booking.service.BookingService;
import com.thenexus.backend.event.domain.EventCategory;
import com.thenexus.backend.event.domain.PlatformEvent;
import com.thenexus.backend.event.repository.EventCategoryRepository;
import com.thenexus.backend.event.repository.PlatformEventRepository;
import com.thenexus.backend.event.repository.TicketTierRepository;
import com.thenexus.backend.finance.domain.FinanceEntry;
import com.thenexus.backend.finance.domain.FinanceEntryType;
import com.thenexus.backend.finance.repository.FinanceEntryRepository;
import com.thenexus.backend.operations.dto.AdminDashboardResponse;
import com.thenexus.backend.operations.dto.FinanceSummaryResponse;
import com.thenexus.backend.security.AdminAuthorizationService;
import com.thenexus.backend.user.domain.AdminType;
import com.thenexus.backend.user.domain.User;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

class AdminOperationsServiceTest {

  @Test
  void financeSummaryExcludesGlobalAndOtherEcosystemEntriesForScopedAdmins() {
    PlatformEvent chessEvent = event("chess-nexus");
    PlatformEvent artEvent = event("art-nexus");
    User chessAdmin = user(AdminType.CHESS_NEXUS_ADMIN, "chess-nexus");

    PlatformEventRepository eventRepository = mock(PlatformEventRepository.class);
    FinanceEntryRepository financeEntryRepository = mock(FinanceEntryRepository.class);
    TicketTierRepository ticketTierRepository = mock(TicketTierRepository.class);
    BookingRepository bookingRepository = mock(BookingRepository.class);
    TicketRepository ticketRepository = mock(TicketRepository.class);

    when(eventRepository.findAll()).thenReturn(List.of(chessEvent, artEvent));
    when(financeEntryRepository.findByDeletedAtIsNullOrderByCreatedAtDesc())
        .thenReturn(List.of(
            new FinanceEntry(null, FinanceEntryType.REVENUE, 999_00, "global", chessAdmin),
            new FinanceEntry(chessEvent, FinanceEntryType.REVENUE, 100_00, "chess", chessAdmin),
            new FinanceEntry(artEvent, FinanceEntryType.REVENUE, 200_00, "art", chessAdmin)));
    when(ticketTierRepository.findByEventIdOrderBySortOrderAsc(any())).thenReturn(List.of());
    when(bookingRepository.findByEventIdOrderByCreatedAtDesc(any())).thenReturn(List.of());

    AdminOperationsService service = new AdminOperationsService(
        eventRepository,
        mock(EventCategoryRepository.class),
        ticketTierRepository,
        bookingRepository,
        ticketRepository,
        financeEntryRepository,
        mock(PlatformAuditLogRepository.class),
        mock(BookingReferenceService.class),
        mock(BookingService.class),
        new AdminAuthorizationService());

    FinanceSummaryResponse summary = service.financeSummary(chessAdmin);

    assertThat(summary.totalRevenuePaise()).isEqualTo(100_00);
    assertThat(summary.entries()).hasSize(1);
    assertThat(summary.entries().getFirst().note()).isEqualTo("chess");
    assertThat(summary.events()).hasSize(1);
  }

  @Test
  void dashboardSkipsMalformedAuditLogsInsteadOfFailing() {
    PlatformEventRepository eventRepository = mock(PlatformEventRepository.class);
    PlatformAuditLogRepository auditLogRepository = mock(PlatformAuditLogRepository.class);
    PlatformAuditLog brokenLog = mock(PlatformAuditLog.class);
    when(eventRepository.findByStatusInAndDeletedAtIsNullOrderByStartsAtAsc(any())).thenReturn(List.of());
    when(brokenLog.getId()).thenReturn(UUID.randomUUID());
    when(brokenLog.getActor()).thenThrow(new IllegalStateException("broken actor relation"));
    when(auditLogRepository.findTop100ByOrderByCreatedAtDesc()).thenReturn(List.of(brokenLog));

    AdminOperationsService service = new AdminOperationsService(
        eventRepository,
        mock(EventCategoryRepository.class),
        mock(TicketTierRepository.class),
        mock(BookingRepository.class),
        mock(TicketRepository.class),
        mock(FinanceEntryRepository.class),
        auditLogRepository,
        mock(BookingReferenceService.class),
        mock(BookingService.class),
        new AdminAuthorizationService());

    AdminDashboardResponse dashboard = service.dashboard(user(AdminType.SUPER_ADMIN, null));

    assertThat(dashboard.status()).isEqualTo("ok");
    assertThat(dashboard.recentActivity()).isEmpty();
  }

  @Test
  void currentEventsSkipsMalformedEventsInsteadOfFailing() {
    PlatformEventRepository eventRepository = mock(PlatformEventRepository.class);
    TicketTierRepository ticketTierRepository = mock(TicketTierRepository.class);
    BookingRepository bookingRepository = mock(BookingRepository.class);
    FinanceEntryRepository financeEntryRepository = mock(FinanceEntryRepository.class);
    PlatformEvent brokenEvent = mock(PlatformEvent.class);
    EventCategory category = mock(EventCategory.class);
    when(category.getSlug()).thenReturn("chess-nexus");
    when(category.getName()).thenThrow(new IllegalStateException("broken category relation"));
    when(brokenEvent.getId()).thenReturn(UUID.randomUUID());
    when(brokenEvent.getCategory()).thenReturn(category);
    when(eventRepository.findByStatusInAndDeletedAtIsNullOrderByStartsAtAsc(any())).thenReturn(List.of(brokenEvent));
    when(ticketTierRepository.findByEventIdOrderBySortOrderAsc(any())).thenReturn(List.of());
    when(bookingRepository.findByEventIdOrderByCreatedAtDesc(any())).thenReturn(List.of());
    when(financeEntryRepository.findByEventIdAndDeletedAtIsNullOrderByCreatedAtDesc(any())).thenReturn(List.of());

    AdminOperationsService service = new AdminOperationsService(
        eventRepository,
        mock(EventCategoryRepository.class),
        ticketTierRepository,
        bookingRepository,
        mock(TicketRepository.class),
        financeEntryRepository,
        mock(PlatformAuditLogRepository.class),
        mock(BookingReferenceService.class),
        mock(BookingService.class),
        new AdminAuthorizationService());

    assertThat(service.currentEvents(user(AdminType.SUPER_ADMIN, null))).isEmpty();
  }

  @Test
  void pastEventsReturnsEmptyWhenRepositoryThrows() {
    PlatformEventRepository eventRepository = mock(PlatformEventRepository.class);
    when(eventRepository.findByStatusInOrderByStartsAtDesc(any())).thenThrow(new IllegalStateException("broken past events query"));

    AdminOperationsService service = new AdminOperationsService(
        eventRepository,
        mock(EventCategoryRepository.class),
        mock(TicketTierRepository.class),
        mock(BookingRepository.class),
        mock(TicketRepository.class),
        mock(FinanceEntryRepository.class),
        mock(PlatformAuditLogRepository.class),
        mock(BookingReferenceService.class),
        mock(BookingService.class),
        new AdminAuthorizationService());

    assertThat(service.pastEvents(user(AdminType.SUPER_ADMIN, null))).isEmpty();
  }

  @Test
  void dashboardReturnsPartialFailureWhenCurrentEventsThrows() {
    PlatformEventRepository eventRepository = mock(PlatformEventRepository.class);
    when(eventRepository.findByStatusInAndDeletedAtIsNullOrderByStartsAtAsc(any()))
        .thenThrow(new IllegalStateException("broken dashboard metrics query"));

    AdminOperationsService service = new AdminOperationsService(
        eventRepository,
        mock(EventCategoryRepository.class),
        mock(TicketTierRepository.class),
        mock(BookingRepository.class),
        mock(TicketRepository.class),
        mock(FinanceEntryRepository.class),
        mock(PlatformAuditLogRepository.class),
        mock(BookingReferenceService.class),
        mock(BookingService.class),
        new AdminAuthorizationService());

    AdminDashboardResponse dashboard = service.dashboard(user(AdminType.SUPER_ADMIN, null));

    assertThat(dashboard.status()).isEqualTo("partial_failure");
    assertThat(dashboard.currentEvents()).isEmpty();
    assertThat(dashboard.alerts()).contains("Current event metrics are temporarily unavailable.");
    assertThat(dashboard.unavailableServices()).contains("currentEvents");
  }

  private User user(AdminType adminType, String ecosystemSlug) {
    User user = new User("admin@example.com", "password", "Admin", null);
    user.assignAdminScope(adminType, ecosystemSlug);
    return user;
  }

  private PlatformEvent event(String ecosystemSlug) {
    EventCategory category = category();
    ReflectionTestUtils.setField(category, "slug", ecosystemSlug);
    return new PlatformEvent(
        category,
        ecosystemSlug + "-event",
        "Event",
        null,
        "Description",
        "Venue",
        null,
        "Mumbai",
        Instant.now(),
        Instant.now().plusSeconds(3600),
        "Asia/Kolkata",
        10,
        true,
        null);
  }

  private EventCategory category() {
    try {
      var constructor = EventCategory.class.getDeclaredConstructor();
      constructor.setAccessible(true);
      return constructor.newInstance();
    } catch (ReflectiveOperationException exception) {
      throw new IllegalStateException(exception);
    }
  }
}
