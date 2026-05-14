package com.thenexus.backend.payment.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.thenexus.backend.audit.domain.PlatformAuditLog;
import com.thenexus.backend.audit.repository.PlatformAuditLogRepository;
import com.thenexus.backend.booking.domain.Booking;
import com.thenexus.backend.booking.domain.BookingStatus;
import com.thenexus.backend.booking.dto.BookingResponse;
import com.thenexus.backend.booking.service.BookingService;
import com.thenexus.backend.auth.service.TokenHashingService;
import com.thenexus.backend.common.exception.ApiException;
import com.thenexus.backend.config.PaymentProperties;
import com.thenexus.backend.payment.domain.PaymentTransaction;
import com.thenexus.backend.payment.domain.PaymentWebhookEvent;
import com.thenexus.backend.payment.domain.PaymentWebhookStatus;
import com.thenexus.backend.payment.dto.CreatePaymentOrderRequest;
import com.thenexus.backend.payment.dto.PaymentOrderResponse;
import com.thenexus.backend.payment.dto.VerifyPaymentRequest;
import com.thenexus.backend.payment.repository.PaymentTransactionRepository;
import com.thenexus.backend.payment.repository.PaymentWebhookEventRepository;
import jakarta.transaction.Transactional;
import java.time.Instant;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {
  private final BookingService bookingService;
  private final PaymentTransactionRepository transactionRepository;
  private final RazorpayClient razorpayClient;
  private final RazorpaySignatureService signatureService;
  private final PaymentProperties properties;
  private final PaymentWebhookEventRepository webhookEventRepository;
  private final PlatformAuditLogRepository auditLogRepository;
  private final ObjectMapper objectMapper;
  private final TokenHashingService tokenHashingService;

  public PaymentService(BookingService bookingService, PaymentTransactionRepository transactionRepository,
      RazorpayClient razorpayClient, RazorpaySignatureService signatureService, PaymentProperties properties,
      PaymentWebhookEventRepository webhookEventRepository, PlatformAuditLogRepository auditLogRepository,
      ObjectMapper objectMapper, TokenHashingService tokenHashingService) {
    this.bookingService = bookingService; this.transactionRepository = transactionRepository;
    this.razorpayClient = razorpayClient; this.signatureService = signatureService; this.properties = properties;
    this.webhookEventRepository = webhookEventRepository; this.auditLogRepository = auditLogRepository;
    this.objectMapper = objectMapper; this.tokenHashingService = tokenHashingService;
  }

  @Transactional
  public PaymentOrderResponse createOrder(CreatePaymentOrderRequest request) {
    Booking booking = bookingService.getBooking(request.getBookingId());
    ensurePayable(booking);
    String idempotencyKey = "razorpay-order-" + booking.getId();
    return transactionRepository.findByIdempotencyKey(idempotencyKey)
        .map(tx -> new PaymentOrderResponse(tx.getId(), "RAZORPAY", tx.getProviderOrderId(), tx.getAmountPaise(), tx.getCurrency(), properties.getRazorpayKeyId()))
        .orElseGet(() -> {
          String orderId = razorpayClient.createOrder(booking.getAmountPaise(), booking.getCurrency(), booking.getBookingReference());
          PaymentTransaction tx = transactionRepository.save(new PaymentTransaction(booking, orderId, booking.getAmountPaise(), booking.getCurrency(), idempotencyKey));
          return new PaymentOrderResponse(tx.getId(), "RAZORPAY", tx.getProviderOrderId(), tx.getAmountPaise(), tx.getCurrency(), properties.getRazorpayKeyId());
        });
  }

  @Transactional
  public BookingResponse verify(VerifyPaymentRequest request) {
    if (!signatureService.verifyPayment(request.razorpayOrderId(), request.razorpayPaymentId(), request.razorpaySignature())) {
      throw new ApiException(HttpStatus.UNAUTHORIZED, "Payment signature verification failed.");
    }
    PaymentTransaction transaction = transactionRepository.findByProviderOrderId(request.razorpayOrderId())
        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Payment order not found."));
    ensurePayable(transaction.getBooking());
    transaction.markCaptured(request.razorpayPaymentId(), "{}");
    BookingResponse response = bookingService.confirmPaidBooking(transaction.getBooking());
    audit(transaction.getBooking(), "payment.captured", "{\"paymentId\":\"" + request.razorpayPaymentId() + "\"}");
    return response;
  }

  @Transactional
  public void handleWebhook(String payload, String signature) {
    if (!signatureService.verifyWebhook(payload, signature)) throw new ApiException(HttpStatus.UNAUTHORIZED, "Invalid Razorpay webhook signature.");
    try {
      JsonNode json = objectMapper.readTree(payload);
      String eventId = text(json, "id");
      String eventType = text(json, "event");
      if (eventId == null || eventType == null) {
        throw new ApiException(HttpStatus.BAD_REQUEST, "Webhook payload is missing event identity.");
      }
      PaymentWebhookEvent webhookEvent = webhookEventRepository.findByProviderEventId(eventId)
          .orElseGet(() -> webhookEventRepository.save(new PaymentWebhookEvent(eventId, eventType, tokenHashingService.sha256(payload), payload)));
      if (webhookEvent.getStatus() == PaymentWebhookStatus.PROCESSED || webhookEvent.getStatus() == PaymentWebhookStatus.IGNORED) {
        return;
      }
      switch (eventType) {
        case "payment.captured", "order.paid" -> handleCapturedWebhook(json, payload);
        case "payment.failed" -> handleFailedWebhook(json, payload);
        case "refund.processed" -> handleRefundWebhook(json, payload);
        default -> webhookEvent.markIgnored();
      }
      if (webhookEvent.getStatus() != PaymentWebhookStatus.IGNORED) {
        webhookEvent.markProcessed();
      }
    } catch (ApiException exception) {
      throw exception;
    } catch (Exception exception) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "Unable to process Razorpay webhook.");
    }
  }

  private void handleCapturedWebhook(JsonNode json, String payload) {
    JsonNode payment = firstPresent(json.at("/payload/payment/entity"), json.at("/payload/order/entity/payments/0"));
    String orderId = text(payment, "order_id");
    String paymentId = text(payment, "id");
    if (orderId == null) {
      orderId = text(json.at("/payload/order/entity"), "id");
    }
    if (paymentId == null) paymentId = orderId;
    PaymentTransaction transaction = transactionRepository.findByProviderOrderId(orderId)
        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Payment order not found."));
    if (transaction.getStatus().name().equals("CAPTURED")) return;
    transaction.markCaptured(paymentId, payload);
    bookingService.confirmPaidBooking(transaction.getBooking());
    audit(transaction.getBooking(), "payment.webhook_captured", "{\"paymentId\":\"" + (paymentId == null ? "" : paymentId) + "\"}");
  }

  private void handleFailedWebhook(JsonNode json, String payload) {
    JsonNode payment = json.at("/payload/payment/entity");
    String orderId = text(payment, "order_id");
    String paymentId = text(payment, "id");
    PaymentTransaction transaction = transactionRepository.findByProviderOrderId(orderId)
        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Payment order not found."));
    transaction.markFailed(text(payment, "error_description"), payload);
    bookingService.failBookingPayment(transaction.getBooking(), "Payment failed.");
    audit(transaction.getBooking(), "payment.failed", "{\"paymentId\":\"" + (paymentId == null ? "" : paymentId) + "\"}");
  }

  private void handleRefundWebhook(JsonNode json, String payload) {
    JsonNode refund = json.at("/payload/refund/entity");
    String paymentId = text(refund, "payment_id");
    String refundId = text(refund, "id");
    PaymentTransaction transaction = transactionRepository.findByProviderPaymentId(paymentId)
        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Payment transaction not found."));
    transaction.markRefunded(refundId, payload);
    bookingService.refundBooking(transaction.getBooking(), "Refund processed.");
    audit(transaction.getBooking(), "payment.refunded", "{\"refundId\":\"" + (refundId == null ? "" : refundId) + "\"}");
  }

  private JsonNode firstPresent(JsonNode first, JsonNode second) {
    return first == null || first.isMissingNode() || first.isNull() ? second : first;
  }

  private String text(JsonNode json, String field) {
    if (json == null || json.isMissingNode() || json.get(field) == null || json.get(field).isNull()) return null;
    return json.get(field).asText();
  }

  private void audit(Booking booking, String action, String metadata) {
    auditLogRepository.save(new PlatformAuditLog(null, "payment", booking.getId(), action,
        booking.getEvent().getCategory().getSlug(), metadata));
  }

  private void ensurePayable(Booking booking) {
    if (booking.getStatus() == BookingStatus.CONFIRMED) {
      throw new ApiException(HttpStatus.CONFLICT, "Booking is already confirmed.");
    }
    if (booking.getStatus() != BookingStatus.PENDING_PAYMENT) {
      throw new ApiException(HttpStatus.CONFLICT, "Booking is not awaiting payment.");
    }
    if (booking.getPaymentDeadlineAt() != null && booking.getPaymentDeadlineAt().isBefore(Instant.now())) {
      booking.expire();
      throw new ApiException(HttpStatus.CONFLICT, "Payment window expired. Create a new booking.");
    }
  }
}
