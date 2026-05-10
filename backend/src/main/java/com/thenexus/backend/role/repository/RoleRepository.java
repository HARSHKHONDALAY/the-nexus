package com.thenexus.backend.role.repository;

import com.thenexus.backend.role.domain.Role;
import com.thenexus.backend.role.domain.RoleCode;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, UUID> {

  @EntityGraph(attributePaths = "permissions")
  Optional<Role> findByCode(RoleCode code);
}
