package com.thenexus.backend.analytics.controller;

import com.thenexus.backend.analytics.dto.PlatformAnalyticsResponse;
import com.thenexus.backend.analytics.service.AnalyticsService;
import com.thenexus.backend.common.api.ApiResponse;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/analytics")
public class AnalyticsController {
  private final AnalyticsService analyticsService;
  public AnalyticsController(AnalyticsService analyticsService) { this.analyticsService = analyticsService; }
  @GetMapping("/admin/platform")
  @PreAuthorize("hasRole('SUPER_ADMIN')")
  ApiResponse<PlatformAnalyticsResponse> platform() { return ApiResponse.ok(analyticsService.platform()); }
}
