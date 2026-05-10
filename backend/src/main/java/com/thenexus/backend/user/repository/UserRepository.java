package com.thenexus.backend.user.repository;

import com.thenexus.backend.user.domain.User;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, UUID> {

  boolean existsByNormalizedEmail(String normalizedEmail);

  boolean existsByNormalizedUsername(String normalizedUsername);

  @EntityGraph(attributePaths = {"roles", "roles.permissions"})
  Optional<User> findByNormalizedEmail(String normalizedEmail);

  @EntityGraph(attributePaths = {"roles", "roles.permissions"})
  Optional<User> findByNormalizedUsername(String normalizedUsername);

  @EntityGraph(attributePaths = {"roles", "roles.permissions"})
  Optional<User> findWithRolesById(UUID id);

  @EntityGraph(attributePaths = {"roles", "roles.permissions"})
  List<User> findByAdminTypeIsNotNullOrderByCreatedAtDesc();
}
