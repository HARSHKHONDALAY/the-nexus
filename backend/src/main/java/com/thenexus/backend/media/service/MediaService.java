package com.thenexus.backend.media.service;

import com.thenexus.backend.common.exception.ApiException;
import com.thenexus.backend.config.StorageProperties;
import com.thenexus.backend.event.domain.PlatformEvent;
import com.thenexus.backend.event.repository.PlatformEventRepository;
import com.thenexus.backend.media.domain.MediaAsset;
import com.thenexus.backend.media.domain.MediaType;
import com.thenexus.backend.media.dto.CreateMediaUploadRequest;
import com.thenexus.backend.media.dto.MediaUploadResponse;
import com.thenexus.backend.media.repository.MediaAssetRepository;
import com.thenexus.backend.user.domain.User;
import jakarta.transaction.Transactional;
import java.net.URL;
import java.time.Duration;
import java.util.Set;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Service
public class MediaService {
  private static final Set<String> IMAGE_TYPES = Set.of("image/jpeg", "image/png", "image/webp");
  private static final Set<String> VIDEO_TYPES = Set.of("video/mp4", "video/quicktime", "video/webm");
  private final StorageProperties properties;
  private final PlatformEventRepository eventRepository;
  private final MediaAssetRepository mediaAssetRepository;

  public MediaService(StorageProperties properties, PlatformEventRepository eventRepository, MediaAssetRepository mediaAssetRepository) {
    this.properties = properties; this.eventRepository = eventRepository; this.mediaAssetRepository = mediaAssetRepository;
  }

  @Transactional
  public MediaUploadResponse createUpload(CreateMediaUploadRequest request, User uploadedBy) {
    validate(request);
    PlatformEvent event = request.eventId() == null ? null : eventRepository.findById(request.eventId())
        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Event not found."));
    String storageKey = buildStorageKey(event, request);
    String publicUrl = publicUrl(storageKey);
    MediaAsset asset = mediaAssetRepository.save(new MediaAsset(event, uploadedBy, request.mediaType(), storageKey, publicUrl,
        request.mimeType(), request.sizeBytes(), request.altText(), 0));
    return new MediaUploadResponse(asset.getId(), storageKey, publicUrl, presignPut(storageKey, request.mimeType()));
  }

  private void validate(CreateMediaUploadRequest request) {
    if (request.sizeBytes() > properties.getMaxUploadBytes()) throw new ApiException(HttpStatus.BAD_REQUEST, "File exceeds upload limit.");
    boolean allowed = request.mediaType() == MediaType.IMAGE ? IMAGE_TYPES.contains(request.mimeType()) : VIDEO_TYPES.contains(request.mimeType());
    if (!allowed) throw new ApiException(HttpStatus.BAD_REQUEST, "File type is not allowed.");
    if (properties.getS3Bucket() == null || properties.getS3Bucket().isBlank()) throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "S3 bucket is not configured.");
  }

  private String buildStorageKey(PlatformEvent event, CreateMediaUploadRequest request) {
    String scope = event == null ? "platform" : "events/" + event.getSlug();
    String sanitized = request.fileName().replaceAll("[^a-zA-Z0-9._-]", "-");
    return scope + "/" + request.mediaType().name().toLowerCase() + "/" + UUID.randomUUID() + "-" + sanitized;
  }

  private URL presignPut(String storageKey, String mimeType) {
    try (S3Presigner presigner = S3Presigner.builder().region(Region.of(properties.getS3Region())).build()) {
      PutObjectRequest objectRequest = PutObjectRequest.builder().bucket(properties.getS3Bucket()).key(storageKey).contentType(mimeType).build();
      PresignedPutObjectRequest presigned = presigner.presignPutObject(PutObjectPresignRequest.builder()
          .signatureDuration(Duration.ofMinutes(10)).putObjectRequest(objectRequest).build());
      return presigned.url();
    }
  }

  private String publicUrl(String storageKey) {
    if (properties.getPublicBaseUrl() == null || properties.getPublicBaseUrl().isBlank()) return null;
    return properties.getPublicBaseUrl().replaceAll("/$", "") + "/" + storageKey;
  }
}
