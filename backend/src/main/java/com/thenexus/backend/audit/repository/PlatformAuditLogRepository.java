package com.thenexus.backend.audit.repository;

import com.thenexus.backend.audit.domain.PlatformAuditLog;
import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface PlatformAuditLogRepository extends JpaRepository<PlatformAuditLog, UUID> {
  @EntityGraph(attributePaths = "actor")
  List<PlatformAuditLog> findTop100ByOrderByCreatedAtDesc();

  @EntityGraph(attributePaths = "actor")
  List<PlatformAuditLog> findTop100ByEcosystemSlugOrderByCreatedAtDesc(String ecosystemSlug);
}
