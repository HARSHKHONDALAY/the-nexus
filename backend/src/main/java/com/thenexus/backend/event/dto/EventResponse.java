package com.thenexus.backend.event.dto;

import com.thenexus.backend.event.domain.PlatformEvent;
import java.time.Instant;
import java.util.UUID;

public record EventResponse(
    UUID id,
    String categorySlug,
    String slug,
    String title,
    String subtitle,
    String description,
    String status,
    String venueName,
    String venueAddress,
    String city,
    Instant startsAt,
    Instant endsAt,
    String timezone,
    int capacity,
    boolean waitlistEnabled) {
  public static EventResponse from(PlatformEvent event) {
    return new EventResponse(
        event.getId(), event.getCategory().getSlug(), event.getSlug(), event.getTitle(), event.getSubtitle(),
        event.getDescription(), event.getStatus().name(), event.getVenueName(), event.getVenueAddress(),
        event.getCity(), event.getStartsAt(), event.getEndsAt(), event.getTimezone(), event.getCapacity(),
        event.isWaitlistEnabled());
  }
}
