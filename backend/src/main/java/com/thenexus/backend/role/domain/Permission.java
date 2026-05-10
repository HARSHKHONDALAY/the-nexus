package com.thenexus.backend.role.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "permissions")
public class Permission {

  @Id
  @GeneratedValue
  @UuidGenerator
  private UUID id;

  @Column(nullable = false, unique = true, length = 120)
  private String code;

  @Column(nullable = false, length = 80)
  private String module;

  @Column(nullable = false, length = 80)
  private String action;

  @Column(length = 500)
  private String description;

  @Column(nullable = false, updatable = false)
  private Instant createdAt = Instant.now();

  @Column(nullable = false)
  private Instant updatedAt = Instant.now();

  protected Permission() {}

  public Permission(String code, String module, String action, String description) {
    this.code = code;
    this.module = module;
    this.action = action;
    this.description = description;
  }

  public UUID getId() {
    return id;
  }

  public String getCode() {
    return code;
  }

  public String getModule() {
    return module;
  }

  public String getAction() {
    return action;
  }

  public String getDescription() {
    return description;
  }
}
