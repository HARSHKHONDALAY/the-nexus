package com.thenexus.backend.notification.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "notification_jobs")
public class NotificationJob {
  @Id @GeneratedValue @UuidGenerator private UUID id;
  @Column(nullable = false, length = 320) private String recipientEmail;
  @Column(nullable = false, length = 120) private String templateKey;
  @Column(nullable = false, length = 240) private String subject;
  @Column(nullable = false, columnDefinition = "jsonb") private String payload;
  @Enumerated(EnumType.STRING) @Column(nullable = false, length = 32) private NotificationStatus status = NotificationStatus.QUEUED;
  @Column(nullable = false) private int attempts;
  @Column(length = 1000) private String lastError;
  @Column(nullable = false) private Instant scheduledAt = Instant.now();
  private Instant sentAt;
  @Column(nullable = false, updatable = false) private Instant createdAt = Instant.now();
  @Column(nullable = false) private Instant updatedAt = Instant.now();
  protected NotificationJob() {}
  public NotificationJob(String recipientEmail, String templateKey, String subject, String payload) {
    this.recipientEmail = recipientEmail; this.templateKey = templateKey; this.subject = subject; this.payload = payload;
  }
  public void markSent() { status = NotificationStatus.SENT; sentAt = Instant.now(); }
  public void markFailed(String error) { status = NotificationStatus.FAILED; attempts++; lastError = error; }
  public String getRecipientEmail() { return recipientEmail; }
  public String getSubject() { return subject; }
}
