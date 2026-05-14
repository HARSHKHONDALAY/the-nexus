package com.thenexus.backend.payment.controller;

import com.thenexus.backend.config.PaymentProperties;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/payments/health")
public class PaymentHealthController {
    
    private final PaymentProperties properties;
    
    public PaymentHealthController(PaymentProperties properties) {
        this.properties = properties;
    }
    
    @GetMapping("/razorpay")
    public ResponseEntity<?> checkRazorpayConfig() {
        boolean hasKeyId = properties.getRazorpayKeyId() != null && !properties.getRazorpayKeyId().isBlank();
        boolean hasKeySecret = properties.getRazorpayKeySecret() != null && !properties.getRazorpayKeySecret().isBlank();
        
        return ResponseEntity.ok(Map.of(
            "hasKeyId", hasKeyId,
            "hasKeySecret", hasKeySecret,
            "keyIdPrefix", hasKeyId ? properties.getRazorpayKeyId().substring(0, Math.min(10, properties.getRazorpayKeyId().length())) : null,
            "configured", hasKeyId && hasKeySecret
        ));
    }
}
