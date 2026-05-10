package com.thenexus.backend.booking.domain;

import com.thenexus.backend.event.domain.PlatformEvent;
import com.thenexus.backend.event.domain.TicketTier;
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
@Table(name = "bookings")
public class Booking {
  @Id @GeneratedValue @UuidGenerator private UUID id;
  @Column(nullable = false, unique = true, length = 40) private String bookingReference;
  @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "user_id") private User user;
  @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "event_id") private PlatformEvent event;
  @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "ticket_tier_id") private TicketTier ticketTier;
  @Column(nullable = false, length = 160) private String attendeeName;
  @Column(nullable = false, length = 320) private String attendeeEmail;
  @Column(length = 40) private String attendeePhone;
  @Column(nullable = false) private int quantity;
  @Column(nullable = false) private long amountPaise;
  @Column(nullable = false, length = 8) private String currency;
  @Enumerated(EnumType.STRING) @Column(nullable = false, length = 32) private BookingStatus status = BookingStatus.PENDING_PAYMENT;
  private Instant paymentDeadlineAt;
  private Instant confirmedAt;
  private Instant cancelledAt;
  @Column(length = 600) private String cancellationReason;
  @Column(nullable = false, length = 40) private String sourceType = "website";
  @Column(length = 120) private String instagramId;
  private Integer attendeeAge;
  @Column(length = 160) private String attendeeLocation;
  @Column(length = 160) private String occupation;
  @Column(length = 80) private String paymentMethod;
  @Column(length = 1000) private String notes;
  @Column(nullable = false) private boolean walkIn;
  @Column(nullable = false, updatable = false) private Instant createdAt = Instant.now();
  @Column(nullable = false) private Instant updatedAt = Instant.now();

  protected Booking() {}

  public Booking(String bookingReference, User user, PlatformEvent event, TicketTier ticketTier, String attendeeName,
      String attendeeEmail, String attendeePhone, int quantity, long amountPaise, String currency, Instant paymentDeadlineAt) {
    this.bookingReference = bookingReference;
    this.user = user;
    this.event = event;
    this.ticketTier = ticketTier;
    this.attendeeName = attendeeName;
    this.attendeeEmail = attendeeEmail;
    this.attendeePhone = attendeePhone;
    this.quantity = quantity;
    this.amountPaise = amountPaise;
    this.currency = currency;
    this.paymentDeadlineAt = paymentDeadlineAt;
  }

  @PreUpdate void touch() { updatedAt = Instant.now(); }
  public void confirm() { status = BookingStatus.CONFIRMED; confirmedAt = Instant.now(); }
  public void expire() { status = BookingStatus.EXPIRED; cancelledAt = Instant.now(); cancellationReason = "Payment deadline expired."; }
  public void cancel(String reason) { status = BookingStatus.CANCELLED; cancelledAt = Instant.now(); cancellationReason = reason; }
  public void markRefundPending() { status = BookingStatus.REFUND_PENDING; }
  public void markRefunded(String reason) { status = BookingStatus.REFUNDED; cancelledAt = Instant.now(); cancellationReason = reason; }
  public void markWalkIn(String sourceType, String instagramId, Integer attendeeAge, String attendeeLocation,
      String occupation, String paymentMethod, String notes) {
    this.walkIn = true;
    this.sourceType = sourceType == null || sourceType.isBlank() ? "walk_in" : sourceType;
    this.instagramId = instagramId;
    this.attendeeAge = attendeeAge;
    this.attendeeLocation = attendeeLocation;
    this.occupation = occupation;
    this.paymentMethod = paymentMethod;
    this.notes = notes;
  }

  public void updateOperationalDetails(String sourceType, String instagramId, Integer attendeeAge,
      String attendeeLocation, String occupation, String paymentMethod, String notes) {
    this.sourceType = sourceType == null || sourceType.isBlank() ? this.sourceType : sourceType;
    this.instagramId = instagramId;
    this.attendeeAge = attendeeAge;
    this.attendeeLocation = attendeeLocation;
    this.occupation = occupation;
    this.paymentMethod = paymentMethod;
    this.notes = notes;
  }

  public UUID getId() { return id; }
  public String getBookingReference() { return bookingReference; }
  public PlatformEvent getEvent() { return event; }
  public TicketTier getTicketTier() { return ticketTier; }
  public String getAttendeeName() { return attendeeName; }
  public String getAttendeeEmail() { return attendeeEmail; }
  public String getAttendeePhone() { return attendeePhone; }
  public int getQuantity() { return quantity; }
  public long getAmountPaise() { return amountPaise; }
  public String getCurrency() { return currency; }
  public BookingStatus getStatus() { return status; }
  public Instant getPaymentDeadlineAt() { return paymentDeadlineAt; }
  public Instant getCreatedAt() { return createdAt; }
  public Instant getUpdatedAt() { return updatedAt; }
  public String getSourceType() { return sourceType; }
  public String getInstagramId() { return instagramId; }
  public Integer getAttendeeAge() { return attendeeAge; }
  public String getAttendeeLocation() { return attendeeLocation; }
  public String getOccupation() { return occupation; }
  public String getPaymentMethod() { return paymentMethod; }
  public String getNotes() { return notes; }
  public boolean isWalkIn() { return walkIn; }
}
