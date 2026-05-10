package com.thenexus.backend.admin.controller;

import com.thenexus.backend.admin.dto.AssignPermissionsRequest;
import com.thenexus.backend.admin.dto.CreateAdminRequest;
import com.thenexus.backend.admin.dto.ResetAdminPasswordRequest;
import com.thenexus.backend.admin.dto.UpdateAdminScopeRequest;
import com.thenexus.backend.admin.service.AdminService;
import com.thenexus.backend.common.api.ApiResponse;
import com.thenexus.backend.security.NexusPrincipal;
import com.thenexus.backend.user.dto.UserResponse;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin/users")
public class AdminManagementController {

  private final AdminService adminService;

  public AdminManagementController(AdminService adminService) {
    this.adminService = adminService;
  }

  @GetMapping
  @PreAuthorize("hasRole('SUPER_ADMIN')")
  ApiResponse<List<UserResponse>> listAdmins() {
    return ApiResponse.ok(adminService.listAdmins());
  }

  @PostMapping
  @PreAuthorize("hasRole('SUPER_ADMIN')")
  ApiResponse<UserResponse> createAdmin(
      @Valid @RequestBody CreateAdminRequest request,
      @AuthenticationPrincipal NexusPrincipal principal) {
    return ApiResponse.ok(adminService.createAdmin(request, principal.getUser()), "Admin created.");
  }

  @PatchMapping("/{adminUserId}/permissions")
  @PreAuthorize("hasRole('SUPER_ADMIN')")
  ApiResponse<UserResponse> assignPermissions(
      @PathVariable UUID adminUserId,
      @Valid @RequestBody AssignPermissionsRequest request,
      @AuthenticationPrincipal NexusPrincipal principal) {
    return ApiResponse.ok(
        adminService.assignPermissions(adminUserId, request, principal.getUser()), "Permissions updated.");
  }

  @PatchMapping("/{adminUserId}/disable")
  @PreAuthorize("hasRole('SUPER_ADMIN')")
  ApiResponse<UserResponse> disableAdmin(@PathVariable UUID adminUserId, @RequestParam(required = false) String reason) {
    return ApiResponse.ok(adminService.disableAdmin(adminUserId, reason), "Admin disabled.");
  }

  @PatchMapping("/{adminUserId}/revoke-access")
  @PreAuthorize("hasRole('SUPER_ADMIN')")
  ApiResponse<UserResponse> revokeAccess(@PathVariable UUID adminUserId, @RequestParam(required = false) String reason) {
    return ApiResponse.ok(adminService.revokeAccess(adminUserId, reason), "Admin access revoked.");
  }

  @PatchMapping("/{adminUserId}/scope")
  @PreAuthorize("hasRole('SUPER_ADMIN')")
  ApiResponse<UserResponse> updateScope(
      @PathVariable UUID adminUserId,
      @Valid @RequestBody UpdateAdminScopeRequest request,
      @AuthenticationPrincipal NexusPrincipal principal) {
    return ApiResponse.ok(adminService.updateAdminScope(adminUserId, request, principal.getUser()), "Admin scope updated.");
  }

  @PatchMapping("/{adminUserId}/reset-password")
  @PreAuthorize("hasRole('SUPER_ADMIN')")
  ApiResponse<UserResponse> resetPassword(
      @PathVariable UUID adminUserId, @Valid @RequestBody ResetAdminPasswordRequest request) {
    return ApiResponse.ok(adminService.resetPassword(adminUserId, request), "Admin password reset.");
  }
}
