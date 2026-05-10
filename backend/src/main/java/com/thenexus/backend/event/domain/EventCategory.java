package com.thenexus.backend.event.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "event_categories")
public class EventCategory {
  @Id
  @GeneratedValue
  @UuidGenerator
  private UUID id;

  @Column(nullable = false, unique = true, length = 120)
  private String slug;

  @Column(nullable = false, length = 160)
  private String name;

  @Column(length = 800)
  private String description;

  @Column(nullable = false)
  private boolean active = true;

  @Column(nullable = false, updatable = false)
  private Instant createdAt = Instant.now();

  @Column(nullable = false)
  private Instant updatedAt = Instant.now();

  protected EventCategory() {}

  public UUID getId() { return id; }
  public String getSlug() { return slug; }
  public String getName() { return name; }
  public String getDescription() { return description; }
  public boolean isActive() { return active; }
}
