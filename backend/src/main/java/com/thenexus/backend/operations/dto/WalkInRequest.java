package com.thenexus.backend.operations.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public record WalkInRequest(
    @NotNull UUID eventId,
    UUID ticketTierId,
    @NotBlank @Size(max = 160) String name,
    @NotBlank @Email @Size(max = 320) String email,
    @Size(max = 40) String phone,
    @Size(max = 120) String instagram,
    @Min(1) @Max(120) Integer age,
    @Size(max = 160) String city,
    @Size(max = 160) String occupation,
    @Size(max = 80) String paymentMethod,
    @Min(0) long amountPaidPaise,
    @Size(max = 40) String source,
    @Size(max = 1000) String notes,
    boolean checkedIn) {}
