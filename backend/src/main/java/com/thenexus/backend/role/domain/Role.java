package com.thenexus.backend.role.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "roles")
public class Role {

  @Id
  @GeneratedValue
  @UuidGenerator
  private UUID id;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, unique = true, length = 64)
  private RoleCode code;

  @Column(nullable = false, length = 120)
  private String displayName;

  @Column(length = 500)
  private String description;

  @Column(nullable = false)
  private int hierarchyRank;

  @Column(nullable = false)
  private boolean systemRole;

  @ManyToMany(fetch = FetchType.EAGER)
  @JoinTable(
      name = "role_permissions",
      joinColumns = @JoinColumn(name = "role_id"),
      inverseJoinColumns = @JoinColumn(name = "permission_id"))
  private Set<Permission> permissions = new HashSet<>();

  @Column(nullable = false, updatable = false)
  private Instant createdAt = Instant.now();

  @Column(nullable = false)
  private Instant updatedAt = Instant.now();

  protected Role() {}

  public UUID getId() {
    return id;
  }

  public RoleCode getCode() {
    return code;
  }

  public String getDisplayName() {
    return displayName;
  }

  public int getHierarchyRank() {
    return hierarchyRank;
  }

  public Set<Permission> getPermissions() {
    return permissions;
  }
}
