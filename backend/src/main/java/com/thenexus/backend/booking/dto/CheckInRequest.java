package com.thenexus.backend.booking.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.UUID;

public record CheckInRequest(@NotBlank String qrToken, UUID eventId) {}
