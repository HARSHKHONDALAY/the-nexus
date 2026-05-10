package com.thenexus.backend.security;

import static org.assertj.core.api.Assertions.assertThat;

import com.thenexus.backend.event.domain.EventCategory;
import com.thenexus.backend.event.domain.PlatformEvent;
import com.thenexus.backend.finance.domain.FinanceEntry;
import com.thenexus.backend.finance.domain.FinanceEntryType;
import com.thenexus.backend.user.domain.AdminType;
import com.thenexus.backend.user.domain.User;
import java.time.Instant;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

class AdminAuthorizationServiceTest {
  private final AdminAuthorizationService service = new AdminAuthorizationService();

  @Test
  void scopedAdminCanOnlyAccessAssignedEcosystem() {
    User chessAdmin = user(AdminType.CHESS_NEXUS_ADMIN, "chess-nexus");

    assertThat(service.canAccessEvent(chessAdmin, event("chess-nexus"))).isTrue();
    assertThat(service.canAccessEvent(chessAdmin, event("art-nexus"))).isFalse();
  }

  @Test
  void scopedAdminCannotAccessGlobalFinanceEntry() {
    User chessAdmin = user(AdminType.CHESS_NEXUS_ADMIN, "chess-nexus");

    assertThat(service.canAccessFinanceEntry(chessAdmin, new FinanceEntry(null, FinanceEntryType.REVENUE, 1000, null, chessAdmin)))
        .isFalse();
  }

  @Test
  void superAdminCanAccessEveryEcosystemAndGlobalFinance() {
    User superAdmin = user(AdminType.SUPER_ADMIN, null);

    assertThat(service.canAccessEvent(superAdmin, event("art-nexus"))).isTrue();
    assertThat(service.canAccessFinanceEntry(superAdmin, new FinanceEntry(null, FinanceEntryType.REVENUE, 1000, null, superAdmin)))
        .isTrue();
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
