package com.thenexus.backend.payment.domain;

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
@Table(name = "payment_webhook_events")
public class PaymentWebhookEvent {
  @Id @GeneratedValue @UuidGenerator private UUID id;
  @Column(nullable = false, unique = true, length = 160) private String providerEventId;
  @Column(nullable = false, length = 80) private String eventType;
  @Column(nullable = false, length = 128) private String payloadHash;
  @Enumerated(EnumType.STRING) @Column(nullable = false, length = 32) private PaymentWebhookStatus status = PaymentWebhookStatus.RECEIVED;
  @Column(columnDefinition = "jsonb", nullable = false) private String rawPayload;
  @Column(length = 1000) private String errorMessage;
  @Column(nullable = false, updatable = false) private Instant receivedAt = Instant.now();
  private Instant processedAt;

  protected PaymentWebhookEvent() {}

  public PaymentWebhookEvent(String providerEventId, String eventType, String payloadHash, String rawPayload) {
    this.providerEventId = providerEventId;
    this.eventType = eventType;
    this.payloadHash = payloadHash;
    this.rawPayload = rawPayload;
  }

  public void markProcessed() {
    status = PaymentWebhookStatus.PROCESSED;
    processedAt = Instant.now();
    errorMessage = null;
  }

  public void markIgnored() {
    status = PaymentWebhookStatus.IGNORED;
    processedAt = Instant.now();
    errorMessage = null;
  }

  public void markFailed(String errorMessage) {
    status = PaymentWebhookStatus.FAILED;
    processedAt = Instant.now();
    this.errorMessage = errorMessage;
  }

  public PaymentWebhookStatus getStatus() { return status; }
}
