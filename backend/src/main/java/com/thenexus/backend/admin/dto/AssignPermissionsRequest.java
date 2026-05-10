package com.thenexus.backend.admin.dto;

import jakarta.validation.constraints.NotNull;
import java.util.Set;

public record AssignPermissionsRequest(@NotNull Set<String> permissionCodes, String reason) {}
