package com.thenexus.backend.payment.controller;

import com.thenexus.backend.booking.domain.Booking;
import com.thenexus.backend.booking.service.BookingService;
import com.thenexus.backend.payment.domain.PaymentTransaction;
import com.thenexus.backend.payment.repository.PaymentTransactionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/payments/test")
public class PaymentTransactionTestController {
    
    private final BookingService bookingService;
    private final PaymentTransactionRepository transactionRepository;
    
    public PaymentTransactionTestController(BookingService bookingService, PaymentTransactionRepository transactionRepository) {
        this.bookingService = bookingService;
        this.transactionRepository = transactionRepository;
    }
    
    @PostMapping("/test-transaction-save")
    public ResponseEntity<?> testTransactionSave() {
        try {
            // Test 1: Get a booking
            UUID bookingId = UUID.fromString("2f4f4c28-adb8-4269-88da-1682658f5f88");
            Booking booking = bookingService.getBooking(bookingId);
            
            // Test 2: Create a PaymentTransaction
            String orderId = "test_order_" + System.currentTimeMillis();
            String idempotencyKey = "test-idempotency-" + bookingId;
            PaymentTransaction transaction = new PaymentTransaction(booking, orderId, 60000, "INR", idempotencyKey);
            
            // Test 3: Save the transaction
            PaymentTransaction savedTransaction = transactionRepository.save(transaction);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "transactionId", savedTransaction.getId(),
                "orderId", savedTransaction.getProviderOrderId(),
                "idempotencyKey", savedTransaction.getIdempotencyKey(),
                "message", "PaymentTransaction saved successfully"
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
}
