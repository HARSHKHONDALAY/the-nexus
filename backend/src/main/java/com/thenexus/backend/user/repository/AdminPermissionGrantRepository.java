package com.thenexus.backend.user.repository;

import com.thenexus.backend.user.domain.AdminPermissionGrant;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminPermissionGrantRepository extends JpaRepository<AdminPermissionGrant, UUID> {

  List<AdminPermissionGrant> findByAdminUserId(UUID adminUserId);

  boolean existsByAdminUserIdAndPermissionId(UUID adminUserId, UUID permissionId);
}
