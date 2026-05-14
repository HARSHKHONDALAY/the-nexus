package com.thenexus.backend.booking.controller;

import com.thenexus.backend.booking.dto.BookingResponse;
import com.thenexus.backend.booking.dto.CreateBookingRequest;
import com.thenexus.backend.booking.service.BookingService;
import com.thenexus.backend.common.api.ApiResponse;
import com.thenexus.backend.common.exception.ApiException;
import com.thenexus.backend.user.domain.User;
import com.thenexus.backend.user.repository.UserRepository;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/public/bookings")
public class PublicBookingController {
  private final BookingService bookingService;
  private final UserRepository userRepository;
  
  public PublicBookingController(BookingService bookingService, UserRepository userRepository) { 
    this.bookingService = bookingService;
    this.userRepository = userRepository;
  }

  @PostMapping
  ApiResponse<BookingResponse> create(@Valid @RequestBody CreateBookingRequest request) {
    // Find or create system user for public bookings
    User systemUser = userRepository.findByNormalizedEmail("SYSTEM@THENEXUS.LOCAL")
        .orElseThrow(() -> new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "System user not found"));
    
    try {
      return ApiResponse.ok(bookingService.create(request, systemUser), "Booking reserved.");
    } catch (Exception e) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "Booking failed: " + e.getMessage());
    }
  }
}
