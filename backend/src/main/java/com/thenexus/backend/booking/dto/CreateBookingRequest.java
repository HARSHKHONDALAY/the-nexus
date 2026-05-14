package com.thenexus.backend.booking.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public record CreateBookingRequest(
    @NotNull UUID eventId,
    @NotNull UUID ticketTierId,
    @NotBlank @Size(max = 160) String attendeeName,
    @NotBlank @Email @Size(max = 320) String attendeeEmail,
    @NotBlank @Size(max = 40) String attendeePhone,
    @Size(max = 120) String instagramId,
    @NotNull @Min(1) @Max(120) Integer attendeeAge,
    @Size(max = 80) String sourceType,
    @Size(max = 1000) String notes,
    @Min(1) @Max(1) int quantity,
    @NotNull Boolean privacyConsent,
    @NotNull Boolean mediaConsent) {}
