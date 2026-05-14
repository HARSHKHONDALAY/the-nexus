package com.thenexus.backend.payment.dto;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record CreatePaymentOrderRequest(@NotNull String bookingId) {
    public UUID getBookingId() {
        return UUID.fromString(bookingId);
    }
}
