package com.thenexus.backend.admin.dto;

import com.thenexus.backend.role.domain.Permission;
import com.thenexus.backend.role.domain.Role;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

public record RoleResponse(
    UUID id, String code, String displayName, int hierarchyRank, Set<String> permissions) {

  public static RoleResponse from(Role role) {
    return new RoleResponse(
        role.getId(),
        role.getCode().name(),
        role.getDisplayName(),
        role.getHierarchyRank(),
        role.getPermissions().stream().map(Permission::getCode).collect(Collectors.toSet()));
  }
}
