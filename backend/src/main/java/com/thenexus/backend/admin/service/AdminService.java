package com.thenexus.backend.admin.service;

import com.thenexus.backend.admin.dto.AssignPermissionsRequest;
import com.thenexus.backend.admin.dto.CreateAdminRequest;
import com.thenexus.backend.admin.dto.ResetAdminPasswordRequest;
import com.thenexus.backend.admin.dto.UpdateAdminScopeRequest;
import com.thenexus.backend.common.exception.ApiException;
import com.thenexus.backend.role.domain.Permission;
import com.thenexus.backend.role.domain.Role;
import com.thenexus.backend.role.domain.RoleCode;
import com.thenexus.backend.role.repository.PermissionRepository;
import com.thenexus.backend.role.repository.RoleRepository;
import com.thenexus.backend.user.domain.AdminPermissionGrant;
import com.thenexus.backend.user.domain.AdminType;
import com.thenexus.backend.user.domain.RefreshToken;
import com.thenexus.backend.user.domain.User;
import com.thenexus.backend.user.dto.UserResponse;
import com.thenexus.backend.user.repository.AdminPermissionGrantRepository;
import com.thenexus.backend.user.repository.RefreshTokenRepository;
import com.thenexus.backend.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

  private final UserRepository userRepository;
  private final RoleRepository roleRepository;
  private final PermissionRepository permissionRepository;
  private final AdminPermissionGrantRepository adminPermissionGrantRepository;
  private final RefreshTokenRepository refreshTokenRepository;
  private final PasswordEncoder passwordEncoder;

  public AdminService(
      UserRepository userRepository,
      RoleRepository roleRepository,
      PermissionRepository permissionRepository,
      AdminPermissionGrantRepository adminPermissionGrantRepository,
      RefreshTokenRepository refreshTokenRepository,
      PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.roleRepository = roleRepository;
    this.permissionRepository = permissionRepository;
    this.adminPermissionGrantRepository = adminPermissionGrantRepository;
    this.refreshTokenRepository = refreshTokenRepository;
    this.passwordEncoder = passwordEncoder;
  }

  @Transactional
  public List<UserResponse> listAdmins() {
    return userRepository.findByAdminTypeIsNotNullOrderByCreatedAtDesc().stream()
        .map(
            admin ->
                UserResponse.from(
                    admin, adminPermissionGrantRepository.findByAdminUserId(admin.getId())))
        .toList();
  }

  @Transactional
  public UserResponse createAdmin(CreateAdminRequest request, User assignedBy) {
    if (userRepository.existsByNormalizedEmail(User.normalizeEmail(request.email()))) {
      throw new ApiException(HttpStatus.CONFLICT, "An account with this email already exists.");
    }
    if (userRepository.existsByNormalizedUsername(User.normalizeUsername(request.username()))) {
      throw new ApiException(HttpStatus.CONFLICT, "An account with this username already exists.");
    }
    AdminType adminType = parseAdminType(request.adminType());
    String ecosystemSlug = ecosystemFor(adminType, request.ecosystemSlug());
    RoleCode roleCode = switch (adminType) {
      case SUPER_ADMIN -> RoleCode.SUPER_ADMIN;
      case CHESS_NEXUS_ADMIN -> RoleCode.CHESS_NEXUS_ADMIN;
      case ART_NEXUS_ADMIN -> RoleCode.ART_NEXUS_ADMIN;
    };
    Role adminRole =
        roleRepository
            .findByCode(roleCode)
            .orElseThrow(() -> new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Admin role is not seeded."));

    User admin =
        new User(
            request.email(),
            request.username(),
            passwordEncoder.encode(request.temporaryPassword()),
            request.fullName(),
            request.phoneNumber());
    admin.addRole(adminRole);
    admin.assignAdminScope(adminType, ecosystemSlug);
    userRepository.save(admin);

    assignPermissionCodes(admin, request.permissionCodes(), assignedBy, "Initial admin access");
    return UserResponse.from(admin, adminPermissionGrantRepository.findByAdminUserId(admin.getId()));
  }

  @Transactional
  public UserResponse updateAdminScope(UUID adminUserId, UpdateAdminScopeRequest request, User assignedBy) {
    User admin =
        userRepository
            .findWithRolesById(adminUserId)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Admin user not found."));
    AdminType adminType = parseAdminType(request.adminType());
    String ecosystemSlug = ecosystemFor(adminType, request.ecosystemSlug());
    RoleCode roleCode =
        switch (adminType) {
          case SUPER_ADMIN -> RoleCode.SUPER_ADMIN;
          case CHESS_NEXUS_ADMIN -> RoleCode.CHESS_NEXUS_ADMIN;
          case ART_NEXUS_ADMIN -> RoleCode.ART_NEXUS_ADMIN;
        };
    Role adminRole =
        roleRepository
            .findByCode(roleCode)
            .orElseThrow(() -> new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Admin role is not seeded."));
    admin.replaceRoles(Set.of(adminRole));
    admin.assignAdminScope(adminType, ecosystemSlug);
    adminPermissionGrantRepository
        .findByAdminUserId(admin.getId())
        .forEach(adminPermissionGrantRepository::delete);
    assignPermissionCodes(admin, request.permissionCodes(), assignedBy, "Admin scope updated");
    return UserResponse.from(admin, adminPermissionGrantRepository.findByAdminUserId(admin.getId()));
  }

  @Transactional
  public UserResponse assignPermissions(UUID adminUserId, AssignPermissionsRequest request, User assignedBy) {
    User admin =
        userRepository
            .findWithRolesById(adminUserId)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Admin user not found."));
    assignPermissionCodes(admin, request.permissionCodes(), assignedBy, request.reason());
    return UserResponse.from(admin, adminPermissionGrantRepository.findByAdminUserId(admin.getId()));
  }

  @Transactional
  public UserResponse disableAdmin(UUID adminUserId, String reason) {
    User admin =
        userRepository
            .findWithRolesById(adminUserId)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Admin user not found."));
    admin.disable(reason == null || reason.isBlank() ? "Disabled by Super Admin" : reason);
    revokeRefreshTokens(admin.getId());
    return UserResponse.from(admin);
  }

  @Transactional
  public UserResponse resetPassword(UUID adminUserId, ResetAdminPasswordRequest request) {
    User admin =
        userRepository
            .findWithRolesById(adminUserId)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Admin user not found."));
    admin.changePassword(passwordEncoder.encode(request.temporaryPassword()));
    revokeRefreshTokens(admin.getId());
    return UserResponse.from(admin, adminPermissionGrantRepository.findByAdminUserId(admin.getId()));
  }

  @Transactional
  public UserResponse revokeAccess(UUID adminUserId, String reason) {
    User admin =
        userRepository
            .findWithRolesById(adminUserId)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Admin user not found."));
    admin.disable(reason == null || reason.isBlank() ? "Access revoked by Super Admin" : reason);
    revokeRefreshTokens(admin.getId());
    return UserResponse.from(admin, adminPermissionGrantRepository.findByAdminUserId(admin.getId()));
  }

  private void assignPermissionCodes(User admin, Set<String> permissionCodes, User assignedBy, String reason) {
    Set<String> safeCodes = permissionCodes == null ? Set.of() : permissionCodes;
    if (safeCodes.isEmpty()) {
      return;
    }
    List<Permission> permissions = permissionRepository.findByCodeIn(safeCodes);
    Set<String> foundCodes = new HashSet<>(permissions.stream().map(Permission::getCode).toList());
    if (!foundCodes.containsAll(safeCodes)) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "One or more permissions do not exist.");
    }
    permissions.forEach(
        permission ->
            {
              if (!adminPermissionGrantRepository.existsByAdminUserIdAndPermissionId(
                  admin.getId(), permission.getId())) {
                adminPermissionGrantRepository.save(
                    new AdminPermissionGrant(admin, permission, true, assignedBy, reason));
              }
            });
  }

  private AdminType parseAdminType(String value) {
    if (value == null || value.isBlank()) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "Admin type must be SUPER_ADMIN, CHESS_NEXUS_ADMIN, or ART_NEXUS_ADMIN.");
    }
    try {
      return AdminType.valueOf(value);
    } catch (RuntimeException exception) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "Admin type must be SUPER_ADMIN, CHESS_NEXUS_ADMIN, or ART_NEXUS_ADMIN.");
    }
  }

  private String ecosystemFor(AdminType adminType, String requestedSlug) {
    return switch (adminType) {
      case SUPER_ADMIN -> null;
      case CHESS_NEXUS_ADMIN -> "chess-nexus";
      case ART_NEXUS_ADMIN -> "art-nexus";
    };
  }

  private void revokeRefreshTokens(UUID userId) {
    refreshTokenRepository.findByUserId(userId).stream()
        .filter(RefreshToken::isActive)
        .forEach(token -> token.revoke(null));
  }
}
