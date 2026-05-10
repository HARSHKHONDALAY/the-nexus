package com.thenexus.backend.user.domain;

import com.thenexus.backend.role.domain.Role;
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
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.HashSet;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "users")
public class User {

  @Id
  @GeneratedValue
  @UuidGenerator
  private UUID id;

  @Column(nullable = false, length = 320)
  private String email;

  @Column(nullable = false, unique = true, length = 320)
  private String normalizedEmail;

  @Column(length = 80)
  private String username;

  @Column(length = 80)
  private String normalizedUsername;

  @Column(nullable = false)
  private String passwordHash;

  @Column(nullable = false, length = 160)
  private String fullName;

  @Column(length = 40)
  private String phoneNumber;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 32)
  private UserStatus status = UserStatus.ACTIVE;

  @Column(nullable = false)
  private boolean emailVerified;

  private Instant lastLoginAt;

  private Instant passwordChangedAt;

  private Instant disabledAt;

  @Column(length = 500)
  private String disabledReason;

  @Enumerated(EnumType.STRING)
  @Column(length = 64)
  private AdminType adminType;

  @Column(length = 120)
  private String assignedEcosystemSlug;

  @ManyToMany(fetch = FetchType.EAGER)
  @JoinTable(
      name = "user_roles",
      joinColumns = @JoinColumn(name = "user_id"),
      inverseJoinColumns = @JoinColumn(name = "role_id"))
  private Set<Role> roles = new HashSet<>();

  @Column(nullable = false, updatable = false)
  private Instant createdAt = Instant.now();

  @Column(nullable = false)
  private Instant updatedAt = Instant.now();

  protected User() {}

  public User(String email, String passwordHash, String fullName, String phoneNumber) {
    this(email, null, passwordHash, fullName, phoneNumber);
  }

  public User(String email, String username, String passwordHash, String fullName, String phoneNumber) {
    this.email = email;
    this.username = username;
    this.normalizedUsername = normalizeUsername(username);
    this.normalizedEmail = normalizeEmail(email);
    this.passwordHash = passwordHash;
    this.fullName = fullName;
    this.phoneNumber = phoneNumber;
    this.passwordChangedAt = Instant.now();
  }

  @PrePersist
  @PreUpdate
  void normalize() {
    normalizedEmail = normalizeEmail(email);
    normalizedUsername = normalizeUsername(username);
    updatedAt = Instant.now();
  }

  public static String normalizeEmail(String email) {
    return email == null ? null : email.trim().toLowerCase(Locale.ROOT);
  }

  public static String normalizeUsername(String username) {
    return username == null || username.isBlank() ? null : username.trim().toLowerCase(Locale.ROOT);
  }

  public boolean canAuthenticate() {
    return status == UserStatus.ACTIVE;
  }

  public void addRole(Role role) {
    roles.add(role);
  }

  public void replaceRoles(Set<Role> roles) {
    this.roles.clear();
    this.roles.addAll(roles);
  }

  public void assignAdminScope(AdminType adminType, String assignedEcosystemSlug) {
    this.adminType = adminType;
    this.assignedEcosystemSlug = assignedEcosystemSlug;
  }

  public void changePassword(String passwordHash) {
    this.passwordHash = passwordHash;
    this.passwordChangedAt = Instant.now();
  }

  public void markLoggedIn() {
    lastLoginAt = Instant.now();
  }

  public void disable(String reason) {
    status = UserStatus.DISABLED;
    disabledReason = reason;
    disabledAt = Instant.now();
  }

  public UUID getId() {
    return id;
  }

  public String getEmail() {
    return email;
  }

  public String getNormalizedEmail() {
    return normalizedEmail;
  }

  public String getUsername() {
    return username;
  }

  public String getNormalizedUsername() {
    return normalizedUsername;
  }

  public String getPasswordHash() {
    return passwordHash;
  }

  public String getFullName() {
    return fullName;
  }

  public String getPhoneNumber() {
    return phoneNumber;
  }

  public UserStatus getStatus() {
    return status;
  }

  public Set<Role> getRoles() {
    return roles;
  }

  public AdminType getAdminType() {
    return adminType;
  }

  public String getAssignedEcosystemSlug() {
    return assignedEcosystemSlug;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }
}
