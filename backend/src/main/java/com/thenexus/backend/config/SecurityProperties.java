package com.thenexus.backend.config;

import java.time.Duration;
import java.util.Arrays;
import java.util.List;
import jakarta.annotation.PostConstruct;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "nexus.security")
public class SecurityProperties {

  private String jwtSecret;
  private long accessTokenMinutes = 15;
  private long refreshTokenDays = 30;
  private String allowedOrigins = "";
  private int authRateLimitPerMinute = 12;
  private int adminMutationRateLimitPerMinute = 60;
  private int bookingRateLimitPerMinute = 20;

  @PostConstruct
  void validate() {
    if (jwtSecret == null || jwtSecret.length() < 32) {
      throw new IllegalStateException("nexus.security.jwt-secret must be set to at least 32 characters.");
    }
    if (accessTokenMinutes < 5 || accessTokenMinutes > 60) {
      throw new IllegalStateException("nexus.security.access-token-minutes must be between 5 and 60.");
    }
    if (refreshTokenDays < 1 || refreshTokenDays > 60) {
      throw new IllegalStateException("nexus.security.refresh-token-days must be between 1 and 60.");
    }
  }

  public String getJwtSecret() {
    return jwtSecret;
  }

  public void setJwtSecret(String jwtSecret) {
    this.jwtSecret = jwtSecret;
  }

  public Duration getAccessTokenTtl() {
    return Duration.ofMinutes(accessTokenMinutes);
  }

  public void setAccessTokenMinutes(long accessTokenMinutes) {
    this.accessTokenMinutes = accessTokenMinutes;
  }

  public Duration getRefreshTokenTtl() {
    return Duration.ofDays(refreshTokenDays);
  }

  public void setRefreshTokenDays(long refreshTokenDays) {
    this.refreshTokenDays = refreshTokenDays;
  }

  public List<String> getAllowedOriginList() {
    return Arrays.stream(allowedOrigins.split(",")).map(String::trim).filter(value -> !value.isBlank()).toList();
  }

  public void setAllowedOrigins(String allowedOrigins) {
    this.allowedOrigins = allowedOrigins;
  }

  public int getAuthRateLimitPerMinute() {
    return authRateLimitPerMinute;
  }

  public void setAuthRateLimitPerMinute(int authRateLimitPerMinute) {
    this.authRateLimitPerMinute = authRateLimitPerMinute;
  }

  public int getAdminMutationRateLimitPerMinute() {
    return adminMutationRateLimitPerMinute;
  }

  public void setAdminMutationRateLimitPerMinute(int adminMutationRateLimitPerMinute) {
    this.adminMutationRateLimitPerMinute = adminMutationRateLimitPerMinute;
  }

  public int getBookingRateLimitPerMinute() {
    return bookingRateLimitPerMinute;
  }

  public void setBookingRateLimitPerMinute(int bookingRateLimitPerMinute) {
    this.bookingRateLimitPerMinute = bookingRateLimitPerMinute;
  }
}
