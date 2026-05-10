package com.thenexus.backend.media.dto;

import java.net.URL;
import java.util.UUID;

public record MediaUploadResponse(UUID mediaId, String storageKey, String publicUrl, URL uploadUrl) {}
