package com.thenexus.backend.payment.controller;

import com.thenexus.backend.config.PaymentProperties;
import com.thenexus.backend.payment.service.RazorpayClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/payments/test")
public class PaymentTestController {
    
    private final RazorpayClient razorpayClient;
    private final PaymentProperties properties;
    
    public PaymentTestController(RazorpayClient razorpayClient, PaymentProperties properties) {
        this.razorpayClient = razorpayClient;
        this.properties = properties;
    }
    
    @PostMapping("/direct-order")
    public ResponseEntity<?> testDirectOrder() {
        try {
            String orderId = razorpayClient.createOrder(60000, "INR", "test-receipt");
            return ResponseEntity.ok(Map.of(
                "success", true,
                "orderId", orderId,
                "amount", 60000,
                "currency", "INR"
            ));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of(
                "success", false,
                "error", e.getMessage(),
                "errorType", e.getClass().getSimpleName()
            ));
        }
    }
}
