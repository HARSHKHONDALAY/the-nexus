package com.thenexus.backend.operations.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;

public record CreateAdminEventRequest(
    @NotBlank @Size(max = 220) String title,
    @NotBlank @Size(max = 120) String eventType,
    @NotNull @Future Instant startsAt,
    @NotNull Instant endsAt,
    @NotBlank @Size(max = 220) String venueName,
    @Size(max = 600) String venueAddress,
    @NotBlank @Size(max = 120) String city,
    @Min(0) long ticketPricePaise,
    @Min(0) long venueCostPaise,
    @Min(0) int maxCapacity,
    @NotBlank String description,
    boolean registrationOpen,
    boolean publish,
    boolean allowWalkIns,
    @Size(max = 32) String visibility,
    @Size(max = 220) String seoTitle,
    @Size(max = 320) String seoDescription,
    String posterImageUrl) {}
