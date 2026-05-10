package com.thenexus.backend.payment.controller;

import com.thenexus.backend.booking.dto.BookingResponse;
import com.thenexus.backend.common.api.ApiResponse;
import com.thenexus.backend.payment.dto.CreatePaymentOrderRequest;
import com.thenexus.backend.payment.dto.PaymentOrderResponse;
import com.thenexus.backend.payment.dto.VerifyPaymentRequest;
import com.thenexus.backend.payment.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/payments/razorpay")
public class PaymentController {
  private final PaymentService paymentService;
  public PaymentController(PaymentService paymentService) { this.paymentService = paymentService; }

  @PostMapping("/orders")
  ApiResponse<PaymentOrderResponse> createOrder(@Valid @RequestBody CreatePaymentOrderRequest request) {
    return ApiResponse.ok(paymentService.createOrder(request), "Payment order created.");
  }

  @PostMapping("/verify")
  ApiResponse<BookingResponse> verify(@Valid @RequestBody VerifyPaymentRequest request) {
    return ApiResponse.ok(paymentService.verify(request), "Payment verified.");
  }

  @PostMapping("/webhook")
  ApiResponse<Void> webhook(@RequestBody String payload, @RequestHeader("X-Razorpay-Signature") String signature) {
    paymentService.handleWebhook(payload, signature);
    return ApiResponse.ok(null, "Webhook accepted.");
  }
}
