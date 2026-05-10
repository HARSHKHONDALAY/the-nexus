package com.thenexus.backend.event.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.Instant;

public record CreateTicketTierRequest(
    @NotBlank @Size(max = 160) String name,
    @Size(max = 800) String description,
    @Min(0) long pricePaise,
    @NotBlank @Size(max = 8) String currency,
    @Min(0) int capacity,
    Instant salesStartAt,
    Instant salesEndAt,
    int sortOrder) {}
