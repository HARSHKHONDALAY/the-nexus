package com.thenexus.backend.event.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;

public record CreateEventRequest(
    @NotBlank @Size(max = 120) String categorySlug,
    @NotBlank @Size(max = 160) String slug,
    @NotBlank @Size(max = 220) String title,
    @Size(max = 260) String subtitle,
    @NotBlank String description,
    @NotBlank @Size(max = 220) String venueName,
    @Size(max = 600) String venueAddress,
    @NotBlank @Size(max = 120) String city,
    @NotNull @Future Instant startsAt,
    @NotNull Instant endsAt,
    @NotBlank @Size(max = 80) String timezone,
    @Min(0) int capacity,
    boolean waitlistEnabled) {}
