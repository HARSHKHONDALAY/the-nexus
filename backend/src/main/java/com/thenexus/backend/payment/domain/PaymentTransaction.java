package com.thenexus.backend.payment.domain;

import com.thenexus.backend.booking.domain.Booking;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@Table(name = "payment_transactions")
public class PaymentTransaction {
  @Id @GeneratedValue @UuidGenerator private UUID id;
  @ManyToOne(fetch = FetchType.EAGER, optional = false) @JoinColumn(name = "booking_id") private Booking booking;
  @Column(nullable = false, length = 40) private String provider = "RAZORPAY";
  @Column(nullable = false, unique = true, length = 120) private String providerOrderId;
  @Column(length = 120) private String providerPaymentId;
  @Column(length = 120) private String providerRefundId;
  @Column(nullable = false) private long amountPaise;
  @Column(nullable = false, length = 8) private String currency = "INR";
  @Enumerated(EnumType.STRING) @Column(nullable = false, length = 40) private PaymentStatus status = PaymentStatus.ORDER_CREATED;
  @Column(nullable = false) private boolean signatureVerified;
  @Column(nullable = false, unique = true, length = 160) private String idempotencyKey;
  @Column(columnDefinition = "jsonb") private String rawPayload;
  @Column(length = 800) private String failureReason;
  @Column(nullable = false, updatable = false) private Instant createdAt = Instant.now();
  @Column(nullable = false) private Instant updatedAt = Instant.now();

  protected PaymentTransaction() {}

  public PaymentTransaction(Booking booking, String providerOrderId, long amountPaise, String currency, String idempotencyKey) {
    this.booking = booking;
    this.providerOrderId = providerOrderId;
    this.amountPaise = amountPaise;
    this.currency = currency;
    this.idempotencyKey = idempotencyKey;
  }

  @PreUpdate void touch() { updatedAt = Instant.now(); }
  public void markCaptured(String providerPaymentId, String rawPayload) {
    if (status == PaymentStatus.CAPTURED) return;
    this.providerPaymentId = providerPaymentId;
    this.rawPayload = rawPayload;
    this.signatureVerified = true;
    this.status = PaymentStatus.CAPTURED;
  }
  public void markFailed(String reason, String rawPayload) {
    if (status == PaymentStatus.CAPTURED || status == PaymentStatus.REFUNDED) return;
    this.failureReason = reason;
    this.rawPayload = rawPayload;
    this.status = PaymentStatus.FAILED;
  }
  public void markRefundPending(String providerRefundId, String rawPayload) {
    this.providerRefundId = providerRefundId;
    this.rawPayload = rawPayload;
    this.status = PaymentStatus.REFUND_PENDING;
  }
  public void markRefunded(String providerRefundId, String rawPayload) {
    this.providerRefundId = providerRefundId;
    this.rawPayload = rawPayload;
    this.status = PaymentStatus.REFUNDED;
  }
  public UUID getId() { return id; }
  public Booking getBooking() { return booking; }
  public String getProviderOrderId() { return providerOrderId; }
  public String getProviderPaymentId() { return providerPaymentId; }
  public long getAmountPaise() { return amountPaise; }
  public String getCurrency() { return currency; }
  public PaymentStatus getStatus() { return status; }
  public String getProviderRefundId() { return providerRefundId; }
}
