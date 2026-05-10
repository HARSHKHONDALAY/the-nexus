package com.thenexus.backend.media.controller;

import com.thenexus.backend.common.api.ApiResponse;
import com.thenexus.backend.media.dto.CreateMediaUploadRequest;
import com.thenexus.backend.media.dto.MediaUploadResponse;
import com.thenexus.backend.media.service.MediaService;
import com.thenexus.backend.security.NexusPrincipal;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/media")
public class MediaController {
  private final MediaService mediaService;
  public MediaController(MediaService mediaService) { this.mediaService = mediaService; }

  @PostMapping("/admin/uploads")
  @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('moments.manage') or hasAuthority('events.manage')")
  ApiResponse<MediaUploadResponse> createUpload(@Valid @RequestBody CreateMediaUploadRequest request,
      @AuthenticationPrincipal NexusPrincipal principal) {
    return ApiResponse.ok(mediaService.createUpload(request, principal.getUser()), "Upload URL created.");
  }
}
