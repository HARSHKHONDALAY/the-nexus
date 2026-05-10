package com.thenexus.backend.admin.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.Set;

public record UpdateAdminScopeRequest(
    @NotBlank String adminType,
    @Size(max = 120) String ecosystemSlug,
    Set<String> permissionCodes) {}
