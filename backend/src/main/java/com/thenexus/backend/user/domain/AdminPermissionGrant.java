package com.thenexus.backend.user.domain;

import com.thenexus.backend.role.domain.Permission;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "admin_permission_grants")
public class AdminPermissionGrant {

  @Id
  @GeneratedValue
  @UuidGenerator
  private UUID id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "admin_user_id")
  private User adminUser;

  @ManyToOne(fetch = FetchType.EAGER, optional = false)
  @JoinColumn(name = "permission_id")
  private Permission permission;

  @Column(nullable = false)
  private boolean granted = true;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "assigned_by")
  private User assignedBy;

  @Column(length = 500)
  private String reason;

  @Column(nullable = false, updatable = false)
  private Instant createdAt = Instant.now();

  @Column(nullable = false)
  private Instant updatedAt = Instant.now();

  protected AdminPermissionGrant() {}

  public AdminPermissionGrant(User adminUser, Permission permission, boolean granted, User assignedBy, String reason) {
    this.adminUser = adminUser;
    this.permission = permission;
    this.granted = granted;
    this.assignedBy = assignedBy;
    this.reason = reason;
  }

  public Permission getPermission() {
    return permission;
  }

  public boolean isGranted() {
    return granted;
  }
}
