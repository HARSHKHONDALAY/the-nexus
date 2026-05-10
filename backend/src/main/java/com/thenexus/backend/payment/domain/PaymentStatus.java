package com.thenexus.backend.payment.domain;

public enum PaymentStatus {
  ORDER_CREATED,
  AUTHORIZED,
  CAPTURED,
  FAILED,
  REFUND_PENDING,
  REFUNDED
}
