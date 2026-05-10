package com.thenexus.backend.user.dto;

import com.thenexus.backend.role.domain.Permission;
import com.thenexus.backend.role.domain.Role;
import com.thenexus.backend.user.domain.AdminPermissionGrant;
import com.thenexus.backend.user.domain.User;
import java.time.Instant;
import java.util.Collection;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

public record UserResponse(
    UUID id,
    String email,
    String username,
    String fullName,
    String phoneNumber,
    String status,
    String adminType,
    String assignedEcosystemSlug,
    Set<String> roles,
    Set<String> permissions,
    Instant createdAt) {

  public static UserResponse from(User user) {
    return from(user, Set.of());
  }

  public static UserResponse from(User user, Collection<AdminPermissionGrant> grants) {
    Set<String> roles = user.getRoles().stream().map(role -> role.getCode().name()).collect(Collectors.toSet());
    Set<String> permissions =
        user.getRoles().stream()
            .flatMap((Role role) -> role.getPermissions().stream())
            .map(Permission::getCode)
            .collect(Collectors.toSet());
    grants.stream()
        .filter(AdminPermissionGrant::isGranted)
        .map(AdminPermissionGrant::getPermission)
        .map(Permission::getCode)
        .forEach(permissions::add);
    return new UserResponse(
        user.getId(),
        user.getEmail(),
        user.getUsername(),
        user.getFullName(),
        user.getPhoneNumber(),
        user.getStatus().name(),
        user.getAdminType() == null ? null : user.getAdminType().name(),
        user.getAssignedEcosystemSlug(),
        roles,
        permissions,
        user.getCreatedAt());
  }
}
