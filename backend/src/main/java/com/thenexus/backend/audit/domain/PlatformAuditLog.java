package com.thenexus.backend.audit.domain;

import com.thenexus.backend.user.domain.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "platform_audit_logs")
public class PlatformAuditLog {
  @Id @GeneratedValue @UuidGenerator private UUID id;
  @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "actor_user_id") private User actor;
  @Column(nullable = false, length = 100) private String entityType;
  private UUID entityId;
  @Column(nullable = false, length = 120) private String action;
  @Column(length = 120) private String ecosystemSlug;
  @Column(columnDefinition = "jsonb") private String metadata;
  @Column(length = 80) private String ipAddress;
  @Column(length = 500) private String userAgent;
  @Column(nullable = false, updatable = false) private Instant createdAt = Instant.now();

  protected PlatformAuditLog() {}

  public PlatformAuditLog(User actor, String entityType, UUID entityId, String action, String metadata) {
    this(actor, entityType, entityId, action, null, metadata);
  }

  public PlatformAuditLog(User actor, String entityType, UUID entityId, String action, String ecosystemSlug, String metadata) {
    this.actor = actor;
    this.entityType = entityType;
    this.entityId = entityId;
    this.action = action;
    this.ecosystemSlug = ecosystemSlug;
    this.metadata = metadata;
  }

  public UUID getId() { return id; }
  public User getActor() { return actor; }
  public String getEntityType() { return entityType; }
  public UUID getEntityId() { return entityId; }
  public String getAction() { return action; }
  public String getEcosystemSlug() { return ecosystemSlug; }
  public String getMetadata() { return metadata; }
  public Instant getCreatedAt() { return createdAt; }
}
