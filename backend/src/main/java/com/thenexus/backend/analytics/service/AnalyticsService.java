package com.thenexus.backend.analytics.service;

import com.thenexus.backend.analytics.dto.PlatformAnalyticsResponse;
import com.thenexus.backend.booking.domain.BookingStatus;
import com.thenexus.backend.booking.repository.BookingRepository;
import com.thenexus.backend.event.repository.PlatformEventRepository;
import com.thenexus.backend.payment.repository.PaymentTransactionRepository;
import org.springframework.stereotype.Service;

@Service
public class AnalyticsService {
  private final PlatformEventRepository eventRepository;
  private final BookingRepository bookingRepository;
  private final PaymentTransactionRepository paymentTransactionRepository;
  public AnalyticsService(PlatformEventRepository eventRepository, BookingRepository bookingRepository,
      PaymentTransactionRepository paymentTransactionRepository) {
    this.eventRepository = eventRepository; this.bookingRepository = bookingRepository; this.paymentTransactionRepository = paymentTransactionRepository;
  }
  public PlatformAnalyticsResponse platform() {
    return new PlatformAnalyticsResponse(eventRepository.count(),
        bookingRepository.findAll().stream().filter(b -> b.getStatus() == BookingStatus.CONFIRMED).count(),
        paymentTransactionRepository.grossCapturedRevenue());
  }
}
