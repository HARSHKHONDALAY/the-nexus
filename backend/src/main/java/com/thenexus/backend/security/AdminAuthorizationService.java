package com.thenexus.backend.security;

import com.thenexus.backend.common.exception.ApiException;
import com.thenexus.backend.event.domain.PlatformEvent;
import com.thenexus.backend.finance.domain.FinanceEntry;
import com.thenexus.backend.user.domain.AdminType;
import com.thenexus.backend.user.domain.User;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class AdminAuthorizationService {

  public boolean isSuperAdmin(User actor) {
    return actor != null && actor.getAdminType() == AdminType.SUPER_ADMIN;
  }

  public boolean isAdmin(User actor) {
    return actor != null && actor.getAdminType() != null;
  }

  public boolean canAccessEcosystem(User actor, String ecosystemSlug) {
    if (actor == null || actor.getAdminType() == null) {
      return false;
    }
    if (actor.getAdminType() == AdminType.SUPER_ADMIN) {
      return true;
    }
    return ecosystemSlug != null && ecosystemSlug.equals(actor.getAssignedEcosystemSlug());
  }

  public boolean canAccessEvent(User actor, PlatformEvent event) {
    return event != null
        && event.getCategory() != null
        && canAccessEcosystem(actor, event.getCategory().getSlug());
  }

  public boolean canAccessFinanceEntry(User actor, FinanceEntry entry) {
    if (entry == null) {
      return false;
    }
    if (isSuperAdmin(actor)) {
      return true;
    }
    return entry.getEvent() != null && canAccessEvent(actor, entry.getEvent());
  }

  public String requiredScopedEcosystem(User actor) {
    if (actor == null || actor.getAdminType() == null) {
      throw new ApiException(HttpStatus.UNAUTHORIZED, "Not authenticated.");
    }
    if (actor.getAdminType() == AdminType.SUPER_ADMIN) {
      return null;
    }
    String ecosystemSlug = actor.getAssignedEcosystemSlug();
    if (ecosystemSlug == null || ecosystemSlug.isBlank()) {
      throw new ApiException(HttpStatus.FORBIDDEN, "This admin does not have an ecosystem scope.");
    }
    return ecosystemSlug;
  }

  public void assertCanAccessEcosystem(User actor, String ecosystemSlug) {
    if (!canAccessEcosystem(actor, ecosystemSlug)) {
      throw new ApiException(HttpStatus.FORBIDDEN, "This admin is not assigned to this ecosystem.");
    }
  }

  public void assertCanAccessEvent(User actor, PlatformEvent event) {
    if (!canAccessEvent(actor, event)) {
      throw new ApiException(HttpStatus.FORBIDDEN, "This admin is not assigned to this ecosystem.");
    }
  }
}
