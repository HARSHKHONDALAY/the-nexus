package com.thenexus.backend.booking.domain;

import com.thenexus.backend.common.exception.ApiException;
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
import org.springframework.http.HttpStatus;

@Entity
@Table(name = "tickets")
public class Ticket {
  @Id @GeneratedValue @UuidGenerator private UUID id;
  @ManyToOne(fetch = FetchType.EAGER, optional = false) @JoinColumn(name = "booking_id") private Booking booking;
  @Column(nullable = false, unique = true, length = 64) private String ticketCode;
  @Column(nullable = false, unique = true, length = 128) private String qrTokenHash;
  @Column(nullable = false, columnDefinition = "TEXT") private String qrTokenCiphertext;
  @Column(nullable = false, length = 160) private String attendeeName;
  @Enumerated(EnumType.STRING) @Column(nullable = false, length = 32) private TicketStatus status = TicketStatus.ACTIVE;
  private Instant checkedInAt;
  @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "checked_in_by") private User checkedInBy;
  @Column(nullable = false, updatable = false) private Instant createdAt = Instant.now();
  @Column(nullable = false) private Instant updatedAt = Instant.now();

  protected Ticket() {}

  public Ticket(Booking booking, String ticketCode, String qrTokenHash, String qrTokenCiphertext, String attendeeName) {
    this.booking = booking;
    this.ticketCode = ticketCode;
    this.qrTokenHash = qrTokenHash;
    this.qrTokenCiphertext = qrTokenCiphertext;
    this.attendeeName = attendeeName;
  }

  @PreUpdate void touch() { updatedAt = Instant.now(); }
  public void checkIn(User actor) {
    if (status == TicketStatus.CHECKED_IN) throw new ApiException(HttpStatus.CONFLICT, "Ticket already checked in.");
    if (status != TicketStatus.ACTIVE) throw new ApiException(HttpStatus.CONFLICT, "Ticket is not active.");
    status = TicketStatus.CHECKED_IN;
    checkedInAt = Instant.now();
    checkedInBy = actor;
  }
  public void undoCheckIn() {
    if (status != TicketStatus.CHECKED_IN) throw new ApiException(HttpStatus.CONFLICT, "Ticket is not checked in.");
    status = TicketStatus.ACTIVE;
    checkedInAt = null;
    checkedInBy = null;
  }
  public void markRefunded() { status = TicketStatus.REFUNDED; }
  public void voidTicket() { status = TicketStatus.VOID; }

  public UUID getId() { return id; }
  public Booking getBooking() { return booking; }
  public String getTicketCode() { return ticketCode; }
  public String getQrTokenHash() { return qrTokenHash; }
  public String getQrTokenCiphertext() { return qrTokenCiphertext; }
  public String getAttendeeName() { return attendeeName; }
  public TicketStatus getStatus() { return status; }
  public Instant getCheckedInAt() { return checkedInAt; }
  public Instant getCreatedAt() { return createdAt; }
}
