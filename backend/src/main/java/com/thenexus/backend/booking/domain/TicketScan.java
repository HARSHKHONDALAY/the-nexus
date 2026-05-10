package com.thenexus.backend.booking.domain;

import com.thenexus.backend.user.domain.User;
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
@Table(name = "ticket_scans")
public class TicketScan {
  @Id @GeneratedValue @UuidGenerator private UUID id;
  @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "ticket_id") private Ticket ticket;
  @Column(length = 128) private String qrTokenHash;
  @Column(nullable = false, length = 40) private String result;
  @Column(length = 600) private String reason;
  @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "scanned_by") private User scannedBy;
  @Column(length = 80) private String ipAddress;
  @Column(length = 500) private String userAgent;
  @Column(nullable = false, updatable = false) private Instant scannedAt = Instant.now();

  protected TicketScan() {}

  public TicketScan(Ticket ticket, String qrTokenHash, String result, String reason, User scannedBy) {
    this.ticket = ticket;
    this.qrTokenHash = qrTokenHash;
    this.result = result;
    this.reason = reason;
    this.scannedBy = scannedBy;
  }
}
