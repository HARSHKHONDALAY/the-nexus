package com.thenexus.backend.booking.controller;

import com.thenexus.backend.booking.dto.BookingResponse;
import com.thenexus.backend.booking.dto.CheckInRequest;
import com.thenexus.backend.booking.dto.CreateBookingRequest;
import com.thenexus.backend.booking.dto.TicketResponse;
import com.thenexus.backend.booking.service.BookingService;
import com.thenexus.backend.common.api.ApiResponse;
import com.thenexus.backend.common.exception.ApiException;
import com.thenexus.backend.security.NexusPrincipal;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import java.util.List;
import java.util.UUID;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/bookings")
public class BookingController {
  private final BookingService bookingService;
  public BookingController(BookingService bookingService) { this.bookingService = bookingService; }

  @PostMapping
  ApiResponse<BookingResponse> create(@Valid @RequestBody CreateBookingRequest request,
      @AuthenticationPrincipal NexusPrincipal principal) {
    // Validate authentication
    if (principal == null || principal.getUser() == null) {
      throw new ApiException(HttpStatus.UNAUTHORIZED, "Authentication required");
    }
    
    return ApiResponse.ok(bookingService.create(request, principal.getUser()), "Booking reserved.");
  }

  @GetMapping("/admin/events/{eventId}")
  @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('registrations.read')")
  ApiResponse<List<BookingResponse>> eventBookings(@PathVariable UUID eventId) {
    return ApiResponse.ok(bookingService.eventBookings(eventId));
  }

  @PostMapping("/admin/check-in")
  @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('registrations.manage')")
  ApiResponse<TicketResponse> checkIn(@Valid @RequestBody CheckInRequest request, @AuthenticationPrincipal NexusPrincipal principal) {
    return ApiResponse.ok(bookingService.checkIn(request.qrToken(), request.eventId(), principal.getUser()), "Ticket checked in.");
  }
}
