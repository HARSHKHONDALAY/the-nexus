package com.thenexus.backend.payment.dto;

import java.util.UUID;

public record PaymentOrderResponse(UUID transactionId, String provider, String orderId, long amountPaise, String currency, String keyId) {}
