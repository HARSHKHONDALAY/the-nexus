package com.thenexus.backend.payment.service;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.thenexus.backend.audit.repository.PlatformAuditLogRepository;
import com.thenexus.backend.auth.service.TokenHashingService;
import com.thenexus.backend.booking.domain.Booking;
import com.thenexus.backend.booking.service.BookingService;
import com.thenexus.backend.config.PaymentProperties;
import com.thenexus.backend.event.domain.EventCategory;
import com.thenexus.backend.event.domain.PlatformEvent;
import com.thenexus.backend.event.domain.TicketTier;
import com.thenexus.backend.payment.domain.PaymentTransaction;
import com.thenexus.backend.payment.domain.PaymentWebhookEvent;
import com.thenexus.backend.payment.repository.PaymentTransactionRepository;
import com.thenexus.backend.payment.repository.PaymentWebhookEventRepository;
import java.time.Instant;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

class PaymentServiceWebhookTest {

  @Test
  void capturedWebhookConfirmsBookingOnce() {
    BookingService bookingService = mock(BookingService.class);
    PaymentTransactionRepository transactionRepository = mock(PaymentTransactionRepository.class);
    PaymentWebhookEventRepository webhookRepository = mock(PaymentWebhookEventRepository.class);
    RazorpaySignatureService signatureService = mock(RazorpaySignatureService.class);
    PaymentTransaction transaction = transaction();

    when(signatureService.verifyWebhook(any(), any())).thenReturn(true);
    when(webhookRepository.findByProviderEventId("evt_capture")).thenReturn(Optional.empty());
    when(webhookRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
    when(transactionRepository.findByProviderOrderId("order_123")).thenReturn(Optional.of(transaction));

    service(bookingService, transactionRepository, webhookRepository, signatureService).handleWebhook("""
        {"id":"evt_capture","event":"payment.captured","payload":{"payment":{"entity":{"id":"pay_123","order_id":"order_123"}}}}
        """, "signature");

    verify(bookingService).confirmPaidBooking(transaction.getBooking());
  }

  @Test
  void processedWebhookReplayDoesNothing() {
    BookingService bookingService = mock(BookingService.class);
    PaymentTransactionRepository transactionRepository = mock(PaymentTransactionRepository.class);
    PaymentWebhookEventRepository webhookRepository = mock(PaymentWebhookEventRepository.class);
    RazorpaySignatureService signatureService = mock(RazorpaySignatureService.class);
    PaymentWebhookEvent event = new PaymentWebhookEvent("evt_capture", "payment.captured", "hash", "{}");
    event.markProcessed();

    when(signatureService.verifyWebhook(any(), any())).thenReturn(true);
    when(webhookRepository.findByProviderEventId("evt_capture")).thenReturn(Optional.of(event));

    service(bookingService, transactionRepository, webhookRepository, signatureService).handleWebhook("""
        {"id":"evt_capture","event":"payment.captured","payload":{"payment":{"entity":{"id":"pay_123","order_id":"order_123"}}}}
        """, "signature");

    verify(bookingService, never()).confirmPaidBooking(any());
  }

  private PaymentService service(
      BookingService bookingService,
      PaymentTransactionRepository transactionRepository,
      PaymentWebhookEventRepository webhookRepository,
      RazorpaySignatureService signatureService) {
    return new PaymentService(
        bookingService,
        transactionRepository,
        mock(RazorpayClient.class),
        signatureService,
        new PaymentProperties(),
        webhookRepository,
        mock(PlatformAuditLogRepository.class),
        new ObjectMapper(),
        new TokenHashingService());
  }

  private PaymentTransaction transaction() {
    Booking booking = booking();
    return new PaymentTransaction(booking, "order_123", booking.getAmountPaise(), booking.getCurrency(), "payment-order-test");
  }

  private Booking booking() {
    EventCategory category = category();
    ReflectionTestUtils.setField(category, "slug", "chess-nexus");
    PlatformEvent event = new PlatformEvent(category, "checkmate-chaos", "Checkmate Chaos", null, "Desc", "Venue",
        null, "Mumbai", Instant.now(), Instant.now().plusSeconds(3600), "Asia/Kolkata", 100, true, null);
    TicketTier tier = new TicketTier(event, "General Entry", "Entry", 600_00, "INR", 100, null, null, 0);
    return new Booking("NX-TEST", null, event, tier, "Guest", "guest@example.com", "9999999999", 1, 600_00, "INR",
        Instant.now().plusSeconds(900));
  }

  private EventCategory category() {
    try {
      var constructor = EventCategory.class.getDeclaredConstructor();
      constructor.setAccessible(true);
      return constructor.newInstance();
    } catch (ReflectiveOperationException exception) {
      throw new IllegalStateException(exception);
    }
  }
}
