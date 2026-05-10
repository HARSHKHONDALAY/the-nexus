package com.thenexus.backend.operations.dto;

import com.thenexus.backend.finance.domain.FinanceEntryType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public record FinanceEntryRequest(
    UUID eventId,
    @NotNull FinanceEntryType entryType,
    @Min(0) long amountPaise,
    @Size(max = 1000) String note) {}
