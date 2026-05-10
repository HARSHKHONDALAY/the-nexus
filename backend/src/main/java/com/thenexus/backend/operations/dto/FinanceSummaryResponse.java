package com.thenexus.backend.operations.dto;

import java.util.List;

public record FinanceSummaryResponse(
    long totalRevenuePaise,
    long totalVenueCostPaise,
    long totalExpensePaise,
    long totalRefundPaise,
    long totalProfitPaise,
    List<AdminEventResponse> events,
    List<FinanceEntryResponse> entries) {}
