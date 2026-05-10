package com.thenexus.backend.auth.controller;

import com.thenexus.backend.auth.dto.AuthResponse;
import com.thenexus.backend.auth.dto.LoginRequest;
import com.thenexus.backend.auth.dto.RefreshTokenRequest;
import com.thenexus.backend.auth.dto.SignupRequest;
import com.thenexus.backend.auth.service.AuthService;
import com.thenexus.backend.common.api.ApiResponse;
import com.thenexus.backend.security.NexusPrincipal;
import com.thenexus.backend.user.dto.UserResponse;
import com.thenexus.backend.user.repository.AdminPermissionGrantRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

  private final AuthService authService;
  private final AdminPermissionGrantRepository adminPermissionGrantRepository;

  public AuthController(AuthService authService, AdminPermissionGrantRepository adminPermissionGrantRepository) {
    this.authService = authService;
    this.adminPermissionGrantRepository = adminPermissionGrantRepository;
  }

  @PostMapping("/signup")
  ApiResponse<AuthResponse> signup(@Valid @RequestBody SignupRequest request, HttpServletRequest servletRequest) {
    return ApiResponse.ok(
        authService.signup(request, servletRequest.getRemoteAddr(), servletRequest.getHeader("User-Agent")),
        "Account created.");
  }

  @PostMapping("/login")
  ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest request, HttpServletRequest servletRequest) {
    return ApiResponse.ok(
        authService.login(request, servletRequest.getRemoteAddr(), servletRequest.getHeader("User-Agent")),
        "Login successful.");
  }

  @PostMapping("/refresh")
  ApiResponse<AuthResponse> refresh(
      @Valid @RequestBody RefreshTokenRequest request, HttpServletRequest servletRequest) {
    return ApiResponse.ok(
        authService.refresh(request, servletRequest.getRemoteAddr(), servletRequest.getHeader("User-Agent")));
  }

  @PostMapping("/logout")
  ApiResponse<Void> logout(@Valid @RequestBody RefreshTokenRequest request) {
    authService.logout(request);
    return ApiResponse.ok(null, "Logged out.");
  }

  @GetMapping("/me")
  ApiResponse<UserResponse> me(@AuthenticationPrincipal NexusPrincipal principal) {
    if (principal == null || principal.getUser() == null) {
      throw new com.thenexus.backend.common.exception.ApiException(HttpStatus.UNAUTHORIZED, "Not authenticated.");
    }
    return ApiResponse.ok(
        UserResponse.from(
            principal.getUser(),
            adminPermissionGrantRepository.findByAdminUserId(principal.getUser().getId())));
  }
}
