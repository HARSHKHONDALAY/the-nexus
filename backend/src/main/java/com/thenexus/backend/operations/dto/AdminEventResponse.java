package com.thenexus.backend.operations.dto;

import com.thenexus.backend.event.domain.PlatformEvent;
import java.time.Instant;
import java.util.UUID;

public record AdminEventResponse(
    UUID id,
    String slug,
    String title,
    String world,
    String status,
    boolean registrationOpen,
    boolean allowWalkIns,
    String venueName,
    String venueAddress,
    String city,
    Instant startsAt,
    Instant endsAt,
    int capacity,
    long ticketPricePaise,
    long venueCostPaise,
    long registrations,
    long checkedIn,
    long revenuePaise,
    long expensePaise,
    long profitPaise,
    Instant createdAt,
    Instant updatedAt) {
  public static AdminEventResponse from(
      PlatformEvent event,
      long ticketPricePaise,
      long registrations,
      long checkedIn,
      long revenuePaise,
      long expensePaise,
      long profitPaise) {
    return new AdminEventResponse(
        event.getId(),
        event.getSlug(),
        event.getTitle(),
        event.getCategory().getName(),
        event.getStatus().name(),
        event.isRegistrationOpen(),
        event.isAllowWalkIns(),
        event.getVenueName(),
        event.getVenueAddress(),
        event.getCity(),
        event.getStartsAt(),
        event.getEndsAt(),
        event.getCapacity(),
        ticketPricePaise,
        event.getVenueCostPaise(),
        registrations,
        checkedIn,
        revenuePaise,
        expensePaise,
        profitPaise,
        event.getCreatedAt(),
        event.getUpdatedAt());
  }
}
