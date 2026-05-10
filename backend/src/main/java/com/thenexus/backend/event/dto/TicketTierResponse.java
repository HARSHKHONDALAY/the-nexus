package com.thenexus.backend.event.dto;

import com.thenexus.backend.event.domain.TicketTier;
import java.util.UUID;

public record TicketTierResponse(
    UUID id, String name, String description, long pricePaise, String currency, int capacity, int soldCount,
    int reservedCount, boolean active) {
  public static TicketTierResponse from(TicketTier tier) {
    return new TicketTierResponse(tier.getId(), tier.getName(), tier.getDescription(), tier.getPricePaise(),
        tier.getCurrency(), tier.getCapacity(), tier.getSoldCount(), tier.getReservedCount(), tier.isActive());
  }
}
