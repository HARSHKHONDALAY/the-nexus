package com.thenexus.backend.auth.service;

import com.thenexus.backend.auth.dto.AuthResponse;
import com.thenexus.backend.auth.dto.LoginRequest;
import com.thenexus.backend.auth.dto.RefreshTokenRequest;
import com.thenexus.backend.auth.dto.SignupRequest;
import com.thenexus.backend.common.exception.ApiException;
import com.thenexus.backend.config.SecurityProperties;
import com.thenexus.backend.role.domain.Role;
import com.thenexus.backend.role.domain.RoleCode;
import com.thenexus.backend.role.repository.RoleRepository;
import com.thenexus.backend.security.JwtService;
import com.thenexus.backend.security.NexusPrincipal;
import com.thenexus.backend.user.domain.RefreshToken;
import com.thenexus.backend.user.domain.User;
import com.thenexus.backend.user.dto.UserResponse;
import com.thenexus.backend.user.repository.RefreshTokenRepository;
import com.thenexus.backend.user.repository.AdminPermissionGrantRepository;
import com.thenexus.backend.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import java.time.Instant;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

  private final UserRepository userRepository;
  private final RoleRepository roleRepository;
  private final RefreshTokenRepository refreshTokenRepository;
  private final AdminPermissionGrantRepository adminPermissionGrantRepository;
  private final PasswordEncoder passwordEncoder;
  private final AuthenticationManager authenticationManager;
  private final JwtService jwtService;
  private final TokenHashingService tokenHashingService;
  private final SecurityProperties securityProperties;

  public AuthService(
      UserRepository userRepository,
      RoleRepository roleRepository,
      RefreshTokenRepository refreshTokenRepository,
      AdminPermissionGrantRepository adminPermissionGrantRepository,
      PasswordEncoder passwordEncoder,
      AuthenticationManager authenticationManager,
      JwtService jwtService,
      TokenHashingService tokenHashingService,
      SecurityProperties securityProperties) {
    this.userRepository = userRepository;
    this.roleRepository = roleRepository;
    this.refreshTokenRepository = refreshTokenRepository;
    this.adminPermissionGrantRepository = adminPermissionGrantRepository;
    this.passwordEncoder = passwordEncoder;
    this.authenticationManager = authenticationManager;
    this.jwtService = jwtService;
    this.tokenHashingService = tokenHashingService;
    this.securityProperties = securityProperties;
  }

  @Transactional
  public AuthResponse signup(SignupRequest request, String ipAddress, String userAgent) {
    String normalizedEmail = User.normalizeEmail(request.email());
    if (userRepository.existsByNormalizedEmail(normalizedEmail)) {
      throw new ApiException(HttpStatus.CONFLICT, "An account with this email already exists.");
    }

    Role userRole =
        roleRepository
            .findByCode(RoleCode.USER)
            .orElseThrow(() -> new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "USER role is not seeded."));
    User user =
        new User(
            request.email(),
            passwordEncoder.encode(request.password()),
            request.fullName(),
            request.phoneNumber());
    user.addRole(userRole);
    userRepository.save(user);
    return issueTokens(user, ipAddress, userAgent);
  }

  @Transactional
  public AuthResponse login(LoginRequest request, String ipAddress, String userAgent) {
    String identifier = request.email();
    User user = findLoginUser(identifier)
        .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Invalid credentials."));
    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(user.getNormalizedEmail(), request.password()));
    if (!user.canAuthenticate()) {
      throw new ApiException(HttpStatus.FORBIDDEN, "This account is not active.");
    }
    user.markLoggedIn();
    return issueTokens(user, ipAddress, userAgent);
  }

  private java.util.Optional<User> findLoginUser(String identifier) {
    if (identifier != null && identifier.contains("@")) {
      return userRepository.findByNormalizedEmail(User.normalizeEmail(identifier));
    }
    return userRepository.findByNormalizedUsername(User.normalizeUsername(identifier));
  }

  @Transactional
  public AuthResponse refresh(RefreshTokenRequest request, String ipAddress, String userAgent) {
    String tokenHash = tokenHashingService.sha256(request.refreshToken());
    RefreshToken existing =
        refreshTokenRepository
            .findByTokenHash(tokenHash)
            .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Refresh token is invalid."));
    if (!existing.isActive()) {
      throw new ApiException(HttpStatus.UNAUTHORIZED, "Refresh token has expired or was revoked.");
    }

    AuthResponse response = issueTokens(existing.getUser(), ipAddress, userAgent, existing.getFamilyId());
    RefreshToken replacement =
        refreshTokenRepository
            .findByTokenHash(tokenHashingService.sha256(response.refreshToken()))
            .orElseThrow();
    existing.revoke(replacement.getId());
    return response;
  }

  @Transactional
  public void logout(RefreshTokenRequest request) {
    refreshTokenRepository
        .findByTokenHash(tokenHashingService.sha256(request.refreshToken()))
        .ifPresent(token -> token.revoke(null));
  }

  private AuthResponse issueTokens(User user, String ipAddress, String userAgent) {
    return issueTokens(user, ipAddress, userAgent, UUID.randomUUID());
  }

  private AuthResponse issueTokens(User user, String ipAddress, String userAgent, UUID familyId) {
    NexusPrincipal principal =
        new NexusPrincipal(
            user, new java.util.HashSet<>(adminPermissionGrantRepository.findByAdminUserId(user.getId())));
    String accessToken = jwtService.createAccessToken(principal);
    String refreshToken = tokenHashingService.newOpaqueToken();
    Instant refreshExpiresAt = Instant.now().plus(securityProperties.getRefreshTokenTtl());
    refreshTokenRepository.save(
        new RefreshToken(
            user,
            tokenHashingService.sha256(refreshToken),
            familyId,
            refreshExpiresAt,
            ipAddress,
            userAgent));
    return new AuthResponse(
        accessToken,
        refreshToken,
        "Bearer",
        Instant.now().plus(securityProperties.getAccessTokenTtl()),
        UserResponse.from(user, adminPermissionGrantRepository.findByAdminUserId(user.getId())));
  }
}
