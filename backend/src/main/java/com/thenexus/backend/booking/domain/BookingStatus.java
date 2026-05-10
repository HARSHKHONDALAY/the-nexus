package com.thenexus.backend.booking.domain;

public enum BookingStatus {
  PENDING_PAYMENT,
  CONFIRMED,
  WAITLISTED,
  CANCELLED,
  EXPIRED,
  REFUND_PENDING,
  REFUNDED
}
