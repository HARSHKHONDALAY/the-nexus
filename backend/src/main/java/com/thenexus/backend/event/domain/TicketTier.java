package com.thenexus.backend.event.domain;

import com.thenexus.backend.common.exception.ApiException;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;
import org.hibernate.annotations.UuidGenerator;
import org.springframework.http.HttpStatus;

@Entity
@Table(name = "ticket_tiers")
public class TicketTier {
  @Id @GeneratedValue @UuidGenerator private UUID id;
  @ManyToOne(fetch = FetchType.EAGER, optional = false) @JoinColumn(name = "event_id") private PlatformEvent event;
  @Column(nullable = false, length = 160) private String name;
  @Column(length = 800) private String description;
  @Column(nullable = false) private long pricePaise;
  @Column(nullable = false, length = 8) private String currency = "INR";
  @Column(nullable = false) private int capacity;
  @Column(nullable = false) private int soldCount;
  @Column(nullable = false) private int reservedCount;
  private Instant salesStartAt;
  private Instant salesEndAt;
  @Column(nullable = false) private boolean active = true;
  @Column(nullable = false) private int sortOrder;
  @Column(nullable = false, updatable = false) private Instant createdAt = Instant.now();
  @Column(nullable = false) private Instant updatedAt = Instant.now();

  protected TicketTier() {}

  public TicketTier(PlatformEvent event, String name, String description, long pricePaise, String currency,
      int capacity, Instant salesStartAt, Instant salesEndAt, int sortOrder) {
    this.event = event;
    this.name = name;
    this.description = description;
    this.pricePaise = pricePaise;
    this.currency = currency;
    this.capacity = capacity;
    this.salesStartAt = salesStartAt;
    this.salesEndAt = salesEndAt;
    this.sortOrder = sortOrder;
  }

  @PreUpdate void touch() { updatedAt = Instant.now(); }

  public boolean hasCapacity(int quantity) { return soldCount + reservedCount + quantity <= capacity; }
  public void reserve(int quantity) {
    if (!active || !hasCapacity(quantity)) throw new ApiException(HttpStatus.CONFLICT, "Ticket tier is sold out.");
    reservedCount += quantity;
  }
  public void confirmReserved(int quantity) {
    if (reservedCount < quantity) throw new ApiException(HttpStatus.CONFLICT, "Reserved inventory is inconsistent.");
    reservedCount -= quantity;
    soldCount += quantity;
  }
  public void releaseReserved(int quantity) { reservedCount = Math.max(0, reservedCount - quantity); }

  public UUID getId() { return id; }
  public PlatformEvent getEvent() { return event; }
  public String getName() { return name; }
  public String getDescription() { return description; }
  public long getPricePaise() { return pricePaise; }
  public String getCurrency() { return currency; }
  public int getCapacity() { return capacity; }
  public int getSoldCount() { return soldCount; }
  public int getReservedCount() { return reservedCount; }
  public boolean isActive() { return active; }
}
