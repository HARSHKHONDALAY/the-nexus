package com.thenexus.backend.event.domain;

import com.thenexus.backend.user.domain.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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

@Entity
@Table(name = "platform_events")
public class PlatformEvent {
  @Id
  @GeneratedValue
  @UuidGenerator
  private UUID id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "category_id")
  private EventCategory category;

  @Column(nullable = false, unique = true, length = 160)
  private String slug;

  @Column(nullable = false, length = 220)
  private String title;

  @Column(length = 260)
  private String subtitle;

  @Column(nullable = false, columnDefinition = "TEXT")
  private String description;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 32)
  private EventStatus status = EventStatus.DRAFT;

  @Column(nullable = false, length = 220)
  private String venueName;

  @Column(length = 600)
  private String venueAddress;

  @Column(nullable = false, length = 120)
  private String city;

  @Column(name = "starts_at", nullable = false)
  private Instant startsAt;

  @Column(name = "ends_at", nullable = false)
  private Instant endsAt;

  @Column(nullable = false, length = 80)
  private String timezone = "Asia/Kolkata";

  @Column(length = 1000)
  private String bannerUrl;

  @Column(length = 1000)
  private String heroMediaUrl;

  @Column(nullable = false)
  private int capacity;

  @Column(nullable = false)
  private boolean waitlistEnabled = true;

  @Column(nullable = false)
  private boolean registrationOpen = true;

  @Column(nullable = false)
  private boolean allowWalkIns = true;

  @Column(nullable = false, length = 32)
  private String visibility = "PUBLIC";

  @Column(length = 220)
  private String seoTitle;

  @Column(length = 320)
  private String seoDescription;

  @Column(nullable = false)
  private long venueCostPaise;

  private Instant publishedAt;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "created_by")
  private User createdBy;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "updated_by")
  private User updatedBy;

  @Column(name = "deleted_at")
private Instant deletedAt;

  @Column(nullable = false, updatable = false)
  private Instant createdAt = Instant.now();

  @Column(nullable = false)
  private Instant updatedAt = Instant.now();

  protected PlatformEvent() {}

  public PlatformEvent(EventCategory category, String slug, String title, String subtitle, String description,
      String venueName, String venueAddress, String city, Instant startsAt, Instant endsAt, String timezone,
      int capacity, boolean waitlistEnabled, User createdBy) {
    this.category = category;
    this.slug = slug;
    this.title = title;
    this.subtitle = subtitle;
    this.description = description;
    this.venueName = venueName;
    this.venueAddress = venueAddress;
    this.city = city;
    this.startsAt = startsAt;
    this.endsAt = endsAt;
    this.timezone = timezone;
    this.capacity = capacity;
    this.waitlistEnabled = waitlistEnabled;
    this.createdBy = createdBy;
    this.updatedBy = createdBy;
  }

  @PreUpdate
  void touch() { updatedAt = Instant.now(); }

  public void updateDetails(String title, String subtitle, String description, String venueName, String venueAddress,
      String city, Instant startsAt, Instant endsAt, String timezone, int capacity, boolean waitlistEnabled, User actor) {
    this.title = title;
    this.subtitle = subtitle;
    this.description = description;
    this.venueName = venueName;
    this.venueAddress = venueAddress;
    this.city = city;
    this.startsAt = startsAt;
    this.endsAt = endsAt;
    this.timezone = timezone;
    this.capacity = capacity;
    this.waitlistEnabled = waitlistEnabled;
    this.updatedBy = actor;
  }

  public void updateOperations(boolean registrationOpen, boolean allowWalkIns, String visibility, long venueCostPaise,
      String seoTitle, String seoDescription, User actor) {
    this.registrationOpen = registrationOpen;
    this.allowWalkIns = allowWalkIns;
    this.visibility = visibility == null || visibility.isBlank() ? "PUBLIC" : visibility;
    this.venueCostPaise = Math.max(0, venueCostPaise);
    this.seoTitle = seoTitle;
    this.seoDescription = seoDescription;
    this.updatedBy = actor;
  }

  public void openRegistrations(User actor) {
    registrationOpen = true;
    updatedBy = actor;
  }

  public void closeRegistrations(User actor) {
    registrationOpen = false;
    updatedBy = actor;
  }

  public void markLive(User actor) {
    status = EventStatus.LIVE;
    updatedBy = actor;
  }

  public void close(User actor) {
    status = EventStatus.CLOSED;
    registrationOpen = false;
    updatedBy = actor;
  }

  public void publish(User actor) {
    status = EventStatus.PUBLISHED;
    publishedAt = Instant.now();
    updatedBy = actor;
  }

  public void archive(User actor) {
    status = EventStatus.ARCHIVED;
    deletedAt = Instant.now();
    updatedBy = actor;
  }

  public UUID getId() { return id; }
  public EventCategory getCategory() { return category; }
  public String getSlug() { return slug; }
  public String getTitle() { return title; }
  public String getSubtitle() { return subtitle; }
  public String getDescription() { return description; }
  public EventStatus getStatus() { return status; }
  public String getVenueName() { return venueName; }
  public String getVenueAddress() { return venueAddress; }
  public String getCity() { return city; }
  public Instant getStartsAt() { return startsAt; }
  public Instant getEndsAt() { return endsAt; }
  public String getTimezone() { return timezone; }
  public String getBannerUrl() { return bannerUrl; }
  public void setBannerUrl(String bannerUrl) { this.bannerUrl = bannerUrl; }
  public String getHeroMediaUrl() { return heroMediaUrl; }
  public void setHeroMediaUrl(String heroMediaUrl) { this.heroMediaUrl = heroMediaUrl; }
  public int getCapacity() { return capacity; }
  public boolean isWaitlistEnabled() { return waitlistEnabled; }
  public Instant getCreatedAt() { return createdAt; }
  public Instant getUpdatedAt() { return updatedAt; }
  public Instant getPublishedAt() { return publishedAt; }
  public boolean isRegistrationOpen() { return registrationOpen; }
  public boolean isAllowWalkIns() { return allowWalkIns; }
  public String getVisibility() { return visibility; }
  public String getSeoTitle() { return seoTitle; }
  public String getSeoDescription() { return seoDescription; }
  public long getVenueCostPaise() { return venueCostPaise; }
}
