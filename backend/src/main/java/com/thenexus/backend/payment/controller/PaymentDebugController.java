package com.thenexus.backend.payment.controller;

import com.thenexus.backend.config.PaymentProperties;
import com.thenexus.backend.payment.service.RazorpayClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/payments/debug")
public class PaymentDebugController {
    
    private final RazorpayClient razorpayClient;
    private final PaymentProperties properties;
    
    public PaymentDebugController(RazorpayClient razorpayClient, PaymentProperties properties) {
        this.razorpayClient = razorpayClient;
        this.properties = properties;
    }
    
    @PostMapping("/test-razorpay")
    public ResponseEntity<?> testRazorpayDirect() {
        try {
            // Test direct Razorpay API call
            String orderId = razorpayClient.createOrder(60000, "INR", "debug-test-receipt");
            return ResponseEntity.ok(Map.of(
                "success", true,
                "orderId", orderId,
                "message", "Razorpay API call successful"
            ));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of(
                "success", false,
                "error", e.getMessage(),
                "errorType", e.getClass().getSimpleName(),
                "stackTrace", e.getStackTrace()[0].toString()
            ));
        }
    }
    
    @PostMapping("/test-config")
    public ResponseEntity<?> testConfig() {
        try {
            return ResponseEntity.ok(Map.of(
                "success", true,
                "keyId", properties.getRazorpayKeyId(),
                "hasKeySecret", properties.getRazorpayKeySecret() != null && !properties.getRazorpayKeySecret().isBlank(),
                "currency", properties.getCurrency()
            ));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
}
