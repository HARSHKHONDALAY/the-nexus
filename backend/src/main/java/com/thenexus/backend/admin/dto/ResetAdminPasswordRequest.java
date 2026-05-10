package com.thenexus.backend.admin.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ResetAdminPasswordRequest(
    @NotBlank @Size(min = 10, max = 128) String temporaryPassword) {}
