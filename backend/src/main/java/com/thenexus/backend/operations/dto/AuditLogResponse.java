package com.thenexus.backend.operations.dto;

import com.thenexus.backend.audit.domain.PlatformAuditLog;
import java.time.Instant;
import java.util.UUID;

public record AuditLogResponse(
    UUID id,
    String actor,
    String entityType,
    UUID entityId,
    String action,
    String metadata,
    Instant createdAt) {
  public static AuditLogResponse from(PlatformAuditLog log) {
    return new AuditLogResponse(
        log.getId(),
        log.getActor() == null ? "System" : log.getActor().getFullName(),
        log.getEntityType(),
        log.getEntityId(),
        log.getAction(),
        log.getMetadata(),
        log.getCreatedAt());
  }
}
