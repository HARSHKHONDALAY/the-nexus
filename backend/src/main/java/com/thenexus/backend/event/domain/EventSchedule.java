package com.thenexus.backend.event.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "event_schedules")
public class EventSchedule {
  @Id @GeneratedValue @UuidGenerator private UUID id;
  @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "event_id") private PlatformEvent event;
  @Column(nullable = false, length = 220) private String title;
  @Column(length = 1000) private String description;
  @Column(nullable = false) private Instant startsAt;
  private Instant endsAt;
  @Column(nullable = false) private int sortOrder;
  @Column(nullable = false, updatable = false) private Instant createdAt = Instant.now();
  protected EventSchedule() {}
}
