package com.thenexus.backend.admin.dto;

import com.thenexus.backend.role.domain.Permission;
import java.util.UUID;

public record PermissionResponse(UUID id, String code, String module, String action, String description) {

  public static PermissionResponse from(Permission permission) {
    return new PermissionResponse(
        permission.getId(),
        permission.getCode(),
        permission.getModule(),
        permission.getAction(),
        permission.getDescription());
  }
}
