package com.thenexus.backend.event.dto;

import com.thenexus.backend.event.domain.PlatformEvent;
import java.time.Instant;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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
  
  private static final Logger log = LoggerFactory.getLogger(EventResponse.class);
  
  public static EventResponse from(PlatformEvent event) {
    try {
      // Null-safe category handling
      String categorySlug = "unknown";
      if (event.getCategory() != null) {
        categorySlug = event.getCategory().getSlug();
        if (categorySlug == null) {
          categorySlug = "unknown";
          log.warn("Event {} has category with null slug", event.getId());
        }
      } else {
        log.warn("Event {} has null category", event.getId());
      }
      
      // Null-safe field handling
      String subtitle = event.getSubtitle();
      if (subtitle == null) subtitle = "";
      
      String venueAddress = event.getVenueAddress();
      if (venueAddress == null) venueAddress = "";
      
      String timezone = event.getTimezone();
      if (timezone == null) timezone = "UTC";
      
      return new EventResponse(
          event.getId(), 
          categorySlug, 
          event.getSlug(), 
          event.getTitle(), 
          subtitle,
          event.getDescription(), 
          event.getStatus().name(), 
          event.getVenueName(), 
          venueAddress,
          event.getCity(), 
          event.getStartsAt(), 
          event.getEndsAt(), 
          timezone, 
          event.getCapacity(),
          event.isWaitlistEnabled());
    } catch (Exception e) {
      log.error("Failed to create EventResponse from event: {}", event.getId(), e);
      // Return a safe fallback response
      return new EventResponse(
          event.getId(),
          "unknown",
          event.getSlug() != null ? event.getSlug() : "unknown",
          event.getTitle() != null ? event.getTitle() : "Unknown Event",
          "",
          event.getDescription() != null ? event.getDescription() : "",
          event.getStatus() != null ? event.getStatus().name() : "UNKNOWN",
          event.getVenueName() != null ? event.getVenueName() : "Unknown Venue",
          "",
          event.getCity() != null ? event.getCity() : "Unknown City",
          event.getStartsAt(),
          event.getEndsAt(),
          "UTC",
          event.getCapacity(),
          event.isWaitlistEnabled());
    }
  }
}
