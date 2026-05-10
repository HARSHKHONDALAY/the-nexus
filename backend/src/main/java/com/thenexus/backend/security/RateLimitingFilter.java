package com.thenexus.backend.security;

import com.thenexus.backend.config.SecurityProperties;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class RateLimitingFilter extends OncePerRequestFilter {
  private final SecurityProperties securityProperties;
  private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

  public RateLimitingFilter(SecurityProperties securityProperties) {
    this.securityProperties = securityProperties;
  }

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {
    Limit limit = limitFor(request);
    if (limit != null && !consume(limit.key(request), limit.requestsPerMinute())) {
      response.setStatus(429);
      response.setContentType("application/json");
      response.getWriter().write("{\"success\":false,\"message\":\"Too many requests.\"}");
      return;
    }
    filterChain.doFilter(request, response);
  }

  private Limit limitFor(HttpServletRequest request) {
    String path = request.getRequestURI();
    String method = request.getMethod();
    if (path.matches(".*/auth/(login|signup|refresh|forgot-password|reset-password)$")) {
      return new Limit("auth", securityProperties.getAuthRateLimitPerMinute());
    }
    if (path.endsWith("/bookings") && HttpMethod.POST.matches(method)) {
      return new Limit("booking", securityProperties.getBookingRateLimitPerMinute());
    }
    if ((path.contains("/admin/") || path.contains("/operations/admin/")) && !HttpMethod.GET.matches(method)) {
      return new Limit("admin", securityProperties.getAdminMutationRateLimitPerMinute());
    }
    return null;
  }

  private boolean consume(String key, int requestsPerMinute) {
    long minute = Instant.now().getEpochSecond() / 60;
    Bucket bucket = buckets.compute(key, (ignored, current) -> {
      if (current == null || current.minute() != minute) {
        return new Bucket(minute, 1);
      }
      return new Bucket(minute, current.count() + 1);
    });
    return bucket.count() <= requestsPerMinute;
  }

  private record Limit(String namespace, int requestsPerMinute) {
    String key(HttpServletRequest request) {
      return namespace + ":" + clientIp(request);
    }

    private String clientIp(HttpServletRequest request) {
      String forwardedFor = request.getHeader("X-Forwarded-For");
      if (forwardedFor != null && !forwardedFor.isBlank()) {
        return forwardedFor.split(",")[0].trim();
      }
      return request.getRemoteAddr();
    }
  }

  private record Bucket(long minute, int count) {}
}
