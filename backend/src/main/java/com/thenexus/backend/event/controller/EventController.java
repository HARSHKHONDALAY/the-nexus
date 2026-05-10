package com.thenexus.backend.event.controller;

import com.thenexus.backend.common.api.ApiResponse;
import com.thenexus.backend.event.dto.CreateEventRequest;
import com.thenexus.backend.event.dto.CreateTicketTierRequest;
import com.thenexus.backend.event.dto.EventResponse;
import com.thenexus.backend.event.dto.TicketTierResponse;
import com.thenexus.backend.event.service.EventService;
import com.thenexus.backend.security.NexusPrincipal;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/events")
public class EventController {
  private final EventService eventService;
  
  public EventController(EventService eventService) { 
    this.eventService = eventService; 
  }

  @GetMapping("/public")
  ApiResponse<List<EventResponse>> publicEvents() { 
    return ApiResponse.ok(eventService.publicEvents()); 
  }

  @GetMapping("/slug/{slug}")
  ApiResponse<EventResponse> publicEventBySlug(@PathVariable String slug) {
    return ApiResponse.ok(eventService.publicEventBySlug(slug));
  }

  @GetMapping("/{eventId}/ticket-tiers")
  ApiResponse<List<TicketTierResponse>> tiers(@PathVariable UUID eventId) { return ApiResponse.ok(eventService.tiers(eventId)); }

  @GetMapping("/admin")
  @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('events.read')")
  ApiResponse<List<EventResponse>> adminEvents(@AuthenticationPrincipal NexusPrincipal principal) {
    return ApiResponse.ok(eventService.adminEvents(principal.getUser()));
  }

  @PostMapping("/admin")
  @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('events.manage')")
  ApiResponse<EventResponse> create(@Valid @RequestBody CreateEventRequest request, @AuthenticationPrincipal NexusPrincipal principal) {
    return ApiResponse.ok(eventService.create(request, principal.getUser()), "Event created.");
  }

  @PostMapping("/admin/{eventId}/publish")
  @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('events.manage')")
  ApiResponse<EventResponse> publish(@PathVariable UUID eventId, @AuthenticationPrincipal NexusPrincipal principal) {
    return ApiResponse.ok(eventService.publish(eventId, principal.getUser()), "Event published.");
  }

  @PostMapping("/admin/{eventId}/archive")
  @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('events.manage')")
  ApiResponse<EventResponse> archive(@PathVariable UUID eventId, @AuthenticationPrincipal NexusPrincipal principal) {
    return ApiResponse.ok(eventService.archive(eventId, principal.getUser()), "Event archived.");
  }

  @DeleteMapping("/{eventId}")
  @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('events.manage')")
  ApiResponse<Void> delete(@PathVariable UUID eventId, @AuthenticationPrincipal NexusPrincipal principal) {
    eventService.delete(eventId, principal.getUser());
    return ApiResponse.ok(null, "Event deleted successfully.");
  }

  @PostMapping("/admin/{eventId}/ticket-tiers")
  @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('events.manage')")
  ApiResponse<TicketTierResponse> createTier(
      @PathVariable UUID eventId,
      @Valid @RequestBody CreateTicketTierRequest request,
      @AuthenticationPrincipal NexusPrincipal principal) {
    return ApiResponse.ok(eventService.createTier(eventId, request, principal.getUser()), "Ticket tier created.");
  }
}
