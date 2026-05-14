package com.thenexus.backend.event.dto;

import com.thenexus.backend.event.domain.PlatformEvent;
import com.thenexus.backend.event.domain.TicketTier;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public record PublicEventWithTiersResponse(
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
    boolean waitlistEnabled,
    List<TicketTierResponse> ticketTiers) {
  
  private static final Logger log = LoggerFactory.getLogger(PublicEventWithTiersResponse.class);
  
  public static PublicEventWithTiersResponse from(PlatformEvent event, List<TicketTier> tiers) {
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
      
      // Debug: Log the ticket tiers being processed
      log.info("Processing {} ticket tiers for event {}", tiers.size(), event.getId());
      
      // Convert ticket tiers
      List<TicketTierResponse> tierResponses = new java.util.ArrayList<>();
      for (TicketTier tier : tiers) {
        log.info("Converting ticket tier: {} - {} - {}", tier.getId(), tier.getName(), tier.getPricePaise());
        try {
          TicketTierResponse response = TicketTierResponse.from(tier);
          tierResponses.add(response);
          log.info("Successfully converted ticket tier: {}", tier.getId());
        } catch (Exception e) {
          log.error("Failed to convert ticket tier: {} - {}", tier.getId(), e.getMessage(), e);
          throw e;
        }
      }
      
      return new PublicEventWithTiersResponse(
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
          event.isWaitlistEnabled(),
          tierResponses);
    } catch (Exception e) {
      log.error("Failed to create PublicEventWithTiersResponse from event: {}", event.getId(), e);
      // Return a safe fallback response
      return new PublicEventWithTiersResponse(
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
          event.isWaitlistEnabled(),
          List.of());
    }
  }
}
