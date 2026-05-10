package com.thenexus.backend.media.domain;

import com.thenexus.backend.event.domain.PlatformEvent;
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
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "media_assets")
public class MediaAsset {
  @Id @GeneratedValue @UuidGenerator private UUID id;
  @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "event_id") private PlatformEvent event;
  @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "uploaded_by") private User uploadedBy;
  @Enumerated(EnumType.STRING) @Column(nullable = false, length = 32) private MediaType mediaType;
  @Column(nullable = false, unique = true, length = 1000) private String storageKey;
  @Column(length = 1000) private String publicUrl;
  @Column(nullable = false, length = 160) private String mimeType;
  @Column(nullable = false) private long sizeBytes;
  @Enumerated(EnumType.STRING) @Column(nullable = false, length = 32) private MediaStatus status = MediaStatus.UPLOADED;
  @Column(length = 300) private String altText;
  @Column(nullable = false) private int sortOrder;
  @Column(nullable = false, updatable = false) private Instant createdAt = Instant.now();
  @Column(nullable = false) private Instant updatedAt = Instant.now();

  protected MediaAsset() {}
  public MediaAsset(PlatformEvent event, User uploadedBy, MediaType mediaType, String storageKey, String publicUrl,
      String mimeType, long sizeBytes, String altText, int sortOrder) {
    this.event = event;
    this.uploadedBy = uploadedBy;
    this.mediaType = mediaType;
    this.storageKey = storageKey;
    this.publicUrl = publicUrl;
    this.mimeType = mimeType;
    this.sizeBytes = sizeBytes;
    this.altText = altText;
    this.sortOrder = sortOrder;
  }
  public UUID getId() { return id; }
  public String getPublicUrl() { return publicUrl; }
  public String getStorageKey() { return storageKey; }
  public MediaType getMediaType() { return mediaType; }
}
