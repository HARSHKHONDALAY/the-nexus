package com.thenexus.backend.admin.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.Set;

public record CreateAdminRequest(
    @NotBlank @Size(max = 160) String fullName,
    @NotBlank @Size(min = 3, max = 80) String username,
    @NotBlank @Email @Size(max = 320) String email,
    @NotBlank @Size(min = 10, max = 128) String temporaryPassword,
    @Size(max = 40) String phoneNumber,
    @NotBlank String adminType,
    @Size(max = 120) String ecosystemSlug,
    Set<String> permissionCodes) {}
