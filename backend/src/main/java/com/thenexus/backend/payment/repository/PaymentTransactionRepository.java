package com.thenexus.backend.payment.repository;

import com.thenexus.backend.payment.domain.PaymentTransaction;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, UUID> {
  Optional<PaymentTransaction> findByProviderOrderId(String providerOrderId);
  Optional<PaymentTransaction> findByProviderPaymentId(String providerPaymentId);
  Optional<PaymentTransaction> findByProviderRefundId(String providerRefundId);
  Optional<PaymentTransaction> findByIdempotencyKey(String idempotencyKey);
  @Query("select coalesce(sum(p.amountPaise), 0) from PaymentTransaction p where p.status = 'CAPTURED'")
  long grossCapturedRevenue();
}
