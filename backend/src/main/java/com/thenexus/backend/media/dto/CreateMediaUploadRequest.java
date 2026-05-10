package com.thenexus.backend.media.dto;

import com.thenexus.backend.media.domain.MediaType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public record CreateMediaUploadRequest(
    UUID eventId,
    @NotNull MediaType mediaType,
    @NotBlank @Size(max = 180) String fileName,
    @NotBlank @Size(max = 160) String mimeType,
    @Min(1) long sizeBytes,
    @Size(max = 300) String altText) {}
