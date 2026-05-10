package com.thenexus.backend.operations.dto;

import jakarta.validation.constraints.NotBlank;

public record EventStatusRequest(@NotBlank String action) {}
