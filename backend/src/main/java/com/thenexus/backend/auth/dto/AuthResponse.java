package com.thenexus.backend.auth.dto;

import com.thenexus.backend.user.dto.UserResponse;
import java.time.Instant;

public record AuthResponse(
    String accessToken,
    String refreshToken,
    String tokenType,
    Instant accessTokenExpiresAt,
    UserResponse user) {}
