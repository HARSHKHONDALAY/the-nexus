package com.thenexus.backend.admin.controller;

import com.thenexus.backend.admin.dto.PermissionResponse;
import com.thenexus.backend.admin.dto.RoleResponse;
import com.thenexus.backend.common.api.ApiResponse;
import com.thenexus.backend.role.repository.PermissionRepository;
import com.thenexus.backend.role.repository.RoleRepository;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin/access-control")
public class RoleController {

  private final RoleRepository roleRepository;
  private final PermissionRepository permissionRepository;

  public RoleController(RoleRepository roleRepository, PermissionRepository permissionRepository) {
    this.roleRepository = roleRepository;
    this.permissionRepository = permissionRepository;
  }

  @GetMapping("/roles")
  @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('roles.read')")
  ApiResponse<List<RoleResponse>> roles() {
    return ApiResponse.ok(roleRepository.findAll().stream().map(RoleResponse::from).toList());
  }

  @GetMapping("/permissions")
  @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('roles.read')")
  ApiResponse<List<PermissionResponse>> permissions() {
    return ApiResponse.ok(permissionRepository.findAll().stream().map(PermissionResponse::from).toList());
  }
}
