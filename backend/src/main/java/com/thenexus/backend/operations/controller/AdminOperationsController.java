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
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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

  public AdminOperationsController(AdminOperationsService service) {
    this.service = service;
  }

  @GetMapping("/dashboard")
  @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('events.read') or hasAuthority('registrations.read')")
  ApiResponse<AdminDashboardResponse> dashboard(@AuthenticationPrincipal NexusPrincipal principal) {
    return ApiResponse.ok(service.dashboard(principal.getUser()));
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
      @Valid @RequestBody CreateAdminEventRequest request,
      @AuthenticationPrincipal NexusPrincipal principal) {
    return ApiResponse.ok(service.createEvent(request, principal.getUser()), "Event created.");
  }

  @PatchMapping("/events/{eventId}/status")
  @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('events.manage')")
  ApiResponse<AdminEventResponse> updateStatus(
      @PathVariable UUID eventId,
      @Valid @RequestBody EventStatusRequest request,
      @AuthenticationPrincipal NexusPrincipal principal) {
    return ApiResponse.ok(service.updateEventStatus(eventId, request.action(), principal.getUser()), "Event updated.");
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
