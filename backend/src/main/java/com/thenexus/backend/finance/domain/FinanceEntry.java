package com.thenexus.backend.finance.domain;

import com.thenexus.backend.event.domain.PlatformEvent;
import com.thenexus.backend.user.domain.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "finance_entries")
public class FinanceEntry {
  @Id @GeneratedValue @UuidGenerator private UUID id;
  @ManyToOne(fetch = FetchType.EAGER) @JoinColumn(name = "event_id") private PlatformEvent event;
  @Enumerated(EnumType.STRING) @Column(nullable = false, length = 40) private FinanceEntryType entryType;
  @Column(nullable = false) private long amountPaise;
  @Column(length = 1000) private String note;
  @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "created_by") private User createdBy;
  private Instant deletedAt;
  @Column(nullable = false, updatable = false) private Instant createdAt = Instant.now();
  @Column(nullable = false) private Instant updatedAt = Instant.now();

  protected FinanceEntry() {}

  public FinanceEntry(PlatformEvent event, FinanceEntryType entryType, long amountPaise, String note, User createdBy) {
    this.event = event;
    this.entryType = entryType;
    this.amountPaise = amountPaise;
    this.note = note;
    this.createdBy = createdBy;
  }

  @PreUpdate void touch() { updatedAt = Instant.now(); }
  public void delete() { deletedAt = Instant.now(); }
  public boolean isDeleted() { return deletedAt != null; }

  public UUID getId() { return id; }
  public PlatformEvent getEvent() { return event; }
  public FinanceEntryType getEntryType() { return entryType; }
  public long getAmountPaise() { return amountPaise; }
  public String getNote() { return note; }
  public User getCreatedBy() { return createdBy; }
  public Instant getCreatedAt() { return createdAt; }
  public Instant getUpdatedAt() { return updatedAt; }
}
