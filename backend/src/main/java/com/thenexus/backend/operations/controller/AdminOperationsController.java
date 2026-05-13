package com.thenexus.backend.operations.controller;

import com.thenexus.backend.common.api.ApiResponse;
import com.thenexus.backend.operations.dto.AdminDashboardResponse;
import com.thenexus.backend.operations.dto.AdminEventResponse;
import com.thenexus.backend.operations.dto.AttendeeResponse;
import com.thenexus.backend.operations.dto.AuditLogResponse;
import com.thenexus.backend.operations.dto.CreateAdminEventRequest;
import com.thenexus.backend.operations.dto.EventStatusRequest;
import com.thenexus.backend.operations.dto.FinanceEntryRequest;
import com.thenexus.backend.operations.dto.FinanceEntryResponse;
import com.thenexus.backend.operations.dto.FinanceSummaryResponse;
import com.thenexus.backend.operations.dto.WalkInRequest;
import com.thenexus.backend.operations.service.AdminOperationsService;
import com.thenexus.backend.security.NexusPrincipal;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.thenexus.backend.common.exception.ApiException;
import jakarta.validation.Valid;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/operations/admin")
public class AdminOperationsController {
  private final AdminOperationsService service;
  private final ObjectMapper objectMapper;

  public AdminOperationsController(AdminOperationsService service, ObjectMapper objectMapper) {
    this.service = service;
    this.objectMapper = objectMapper;
  }

  @GetMapping("/dashboard")
  @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('events.read') or hasAuthority('registrations.read')")
  ApiResponse<AdminDashboardResponse> dashboard(@AuthenticationPrincipal NexusPrincipal principal) {
    return ApiResponse.ok(service.dashboard(principal.getUser()));
  }

  @GetMapping("/events")
  @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('events.read') or hasAuthority('registrations.read')")
  ApiResponse<List<AdminEventResponse>> allEvents(@AuthenticationPrincipal NexusPrincipal principal) {
    List<AdminEventResponse> currentEvents = service.currentEvents(principal.getUser());
    List<AdminEventResponse> pastEvents = service.pastEvents(principal.getUser());
    List<AdminEventResponse> allEvents = new ArrayList<>();
    allEvents.addAll(currentEvents);
    allEvents.addAll(pastEvents);
    return ApiResponse.ok(allEvents);
  }

  @GetMapping("/events/current")
  @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('events.read') or hasAuthority('registrations.read')")
  ApiResponse<List<AdminEventResponse>> currentEvents(@AuthenticationPrincipal NexusPrincipal principal) {
    return ApiResponse.ok(service.currentEvents(principal.getUser()));
  }

  @GetMapping("/events/past")
  @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('events.read')")
  ApiResponse<List<AdminEventResponse>> pastEvents(@AuthenticationPrincipal NexusPrincipal principal) {
    return ApiResponse.ok(service.pastEvents(principal.getUser()));
  }

  @PostMapping("/events")
  @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('events.manage')")
  ApiResponse<AdminEventResponse> createEvent(
      @RequestParam("eventData") String eventDataJson,
      @RequestParam(value = "posterImage", required = false) MultipartFile posterImage,
      @AuthenticationPrincipal NexusPrincipal principal) {
    try {
      // Parse the JSON event data
      CreateAdminEventRequest request = objectMapper.readValue(eventDataJson, CreateAdminEventRequest.class);
      
      // Handle poster image upload if present
      String posterImageUrl = null;
      if (posterImage != null && !posterImage.isEmpty()) {
        try {
          // Generate unique filename
          String originalFilename = posterImage.getOriginalFilename();
          String fileExtension = originalFilename != null && originalFilename.contains(".") 
            ? originalFilename.substring(originalFilename.lastIndexOf(".")) 
            : ".jpg";
          String uniqueFilename = UUID.randomUUID().toString() + fileExtension;
          
          // Create uploads directory if it doesn't exist
          java.io.File uploadDir = new java.io.File("uploads/events");
          if (!uploadDir.exists()) {
            uploadDir.mkdirs();
          }
          
          // Save file locally
          java.io.File destinationFile = new java.io.File(uploadDir, uniqueFilename);
          posterImage.transferTo(destinationFile);
          
          // Set the image URL (relative path for now)
          posterImageUrl = "/uploads/events/" + uniqueFilename;
          
          System.out.println("Successfully uploaded poster image: " + uniqueFilename + " (" + posterImage.getSize() + " bytes)");
        } catch (Exception e) {
          System.err.println("Failed to upload poster image: " + e.getMessage());
          // Continue without image - don't fail the whole event creation
        }
      }
      
      // Create new request with poster image URL
      CreateAdminEventRequest requestWithImage = new CreateAdminEventRequest(
          request.title(),
          request.eventType(),
          request.startsAt(),
          request.endsAt(),
          request.venueName(),
          request.venueAddress(),
          request.city(),
          request.ticketPricePaise(),
          request.venueCostPaise(),
          request.maxCapacity(),
          request.description(),
          request.registrationOpen(),
          request.publish(),
          request.allowWalkIns(),
          request.visibility(),
          request.seoTitle(),
          request.seoDescription(),
          posterImageUrl
      );
      
      return ApiResponse.ok(service.createEvent(requestWithImage, principal.getUser()), "Event created.");
    } catch (Exception e) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "Invalid event data: " + e.getMessage());
    }
  }

  @PatchMapping("/events/{eventId}/status")
  @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('events.manage')")
  ApiResponse<AdminEventResponse> updateStatus(
      @PathVariable UUID eventId,
      @Valid @RequestBody EventStatusRequest request,
      @AuthenticationPrincipal NexusPrincipal principal) {
    return ApiResponse.ok(service.updateEventStatus(eventId, request, principal.getUser()), "Event status updated.");
  }

  @DeleteMapping("/events/{eventId}")
  @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('events.manage')")
  ApiResponse<Void> deleteEvent(@PathVariable UUID eventId, @AuthenticationPrincipal NexusPrincipal principal) {
    service.deleteEvent(eventId, principal.getUser());
    return ApiResponse.ok(null, "Event deleted successfully.");
  }

  @PostMapping("/events/{eventId}/duplicate")
  @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('events.manage')")
  ApiResponse<AdminEventResponse> duplicate(@PathVariable UUID eventId, @AuthenticationPrincipal NexusPrincipal principal) {
    return ApiResponse.ok(service.duplicateEvent(eventId, principal.getUser()), "Event duplicated.");
  }

  @GetMapping("/events/{eventId}/attendees")
  @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('registrations.read')")
  ApiResponse<List<AttendeeResponse>> attendees(
      @PathVariable UUID eventId,
      @RequestParam(required = false) String query,
      @AuthenticationPrincipal NexusPrincipal principal) {
    return ApiResponse.ok(service.attendees(eventId, query, principal.getUser()));
  }

  @PostMapping("/walk-ins")
  @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('registrations.manage')")
  ApiResponse<AttendeeResponse> walkIn(@Valid @RequestBody WalkInRequest request, @AuthenticationPrincipal NexusPrincipal principal) {
    return ApiResponse.ok(service.addWalkIn(request, principal.getUser()), "Walk-in added.");
  }

  @PostMapping("/tickets/{ticketId}/check-in")
  @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('registrations.manage')")
  ApiResponse<AttendeeResponse> checkIn(@PathVariable UUID ticketId, @AuthenticationPrincipal NexusPrincipal principal) {
    return ApiResponse.ok(service.checkIn(ticketId, principal.getUser()), "Checked in.");
  }

  @PostMapping("/tickets/{ticketId}/undo-check-in")
  @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('registrations.manage')")
  ApiResponse<AttendeeResponse> undoCheckIn(@PathVariable UUID ticketId, @AuthenticationPrincipal NexusPrincipal principal) {
    return ApiResponse.ok(service.undoCheckIn(ticketId, principal.getUser()), "Check-in undone.");
  }

  @DeleteMapping("/attendees/{bookingId}")
  @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('registrations.manage')")
  ApiResponse<Void> deleteAttendee(@PathVariable UUID bookingId, @AuthenticationPrincipal NexusPrincipal principal) {
    service.deleteAttendee(bookingId, principal.getUser());
    return ApiResponse.ok(null, "Attendee deleted.");
  }

  @GetMapping("/finance")
  @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('finance.read')")
  ApiResponse<FinanceSummaryResponse> finance(@AuthenticationPrincipal NexusPrincipal principal) {
    return ApiResponse.ok(service.financeSummary(principal.getUser()));
  }

  @PostMapping("/finance/entries")
  @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('finance.manage')")
  ApiResponse<FinanceEntryResponse> addFinanceEntry(
      @Valid @RequestBody FinanceEntryRequest request,
      @AuthenticationPrincipal NexusPrincipal principal) {
    return ApiResponse.ok(service.addFinanceEntry(request, principal.getUser()), "Finance entry added.");
  }

  @DeleteMapping("/finance/entries/{entryId}")
  @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('finance.manage')")
  ApiResponse<Void> deleteFinanceEntry(@PathVariable UUID entryId, @AuthenticationPrincipal NexusPrincipal principal) {
    service.deleteFinanceEntry(entryId, principal.getUser());
    return ApiResponse.ok(null, "Finance entry deleted.");
  }

  @GetMapping("/audit-logs")
  @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('audit.read')")
  ApiResponse<List<AuditLogResponse>> auditLogs(@AuthenticationPrincipal NexusPrincipal principal) {
    return ApiResponse.ok(service.auditLogs(principal.getUser()));
  }
}
