package com.thenexus.backend.payment.repository;

import com.thenexus.backend.payment.domain.PaymentWebhookEvent;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentWebhookEventRepository extends JpaRepository<PaymentWebhookEvent, UUID> {
  Optional<PaymentWebhookEvent> findByProviderEventId(String providerEventId);
}
