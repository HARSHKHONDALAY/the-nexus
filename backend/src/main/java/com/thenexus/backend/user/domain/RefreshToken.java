package com.thenexus.backend.user.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "refresh_tokens")
public class RefreshToken {

  @Id
  @GeneratedValue
  @UuidGenerator
  private UUID id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "user_id")
  private User user;

  @Column(nullable = false, unique = true, length = 128)
  private String tokenHash;

  @Column(nullable = false)
  private UUID familyId;

  @Column(nullable = false)
  private Instant expiresAt;

  private Instant revokedAt;

  private UUID replacedByTokenId;

  @Column(length = 80)
  private String ipAddress;

  @Column(length = 500)
  private String userAgent;

  @Column(nullable = false, updatable = false)
  private Instant createdAt = Instant.now();

  protected RefreshToken() {}

  public RefreshToken(
      User user,
      String tokenHash,
      UUID familyId,
      Instant expiresAt,
      String ipAddress,
      String userAgent) {
    this.user = user;
    this.tokenHash = tokenHash;
    this.familyId = familyId;
    this.expiresAt = expiresAt;
    this.ipAddress = ipAddress;
    this.userAgent = userAgent;
  }

  @PreUpdate
  void touch() {}

  public boolean isActive() {
    return revokedAt == null && expiresAt.isAfter(Instant.now());
  }

  public void revoke(UUID replacementId) {
    revokedAt = Instant.now();
    replacedByTokenId = replacementId;
  }

  public UUID getId() {
    return id;
  }

  public User getUser() {
    return user;
  }

  public String getTokenHash() {
    return tokenHash;
  }

  public UUID getFamilyId() {
    return familyId;
  }

  public Instant getExpiresAt() {
    return expiresAt;
  }
}
