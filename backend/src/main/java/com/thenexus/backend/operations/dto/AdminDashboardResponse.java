package com.thenexus.backend.operations.dto;

import java.util.List;

public record AdminDashboardResponse(
    String status,
    long activeEvents,
    long totalRegistrations,
    long checkedIn,
    long revenuePaise,
    long venueCostPaise,
    long expensePaise,
    long profitPaise,
    List<AdminEventResponse> currentEvents,
    List<AuditLogResponse> recentActivity,
    List<String> alerts,
    List<String> unavailableServices) {}
