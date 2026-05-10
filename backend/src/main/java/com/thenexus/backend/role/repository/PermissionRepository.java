package com.thenexus.backend.role.repository;

import com.thenexus.backend.role.domain.Permission;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PermissionRepository extends JpaRepository<Permission, UUID> {

  Optional<Permission> findByCode(String code);

  List<Permission> findByCodeIn(Collection<String> codes);
}
