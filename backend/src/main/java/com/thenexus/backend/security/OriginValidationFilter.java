package com.thenexus.backend.security;

import com.thenexus.backend.config.SecurityProperties;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashSet;
import java.util.Set;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class OriginValidationFilter extends OncePerRequestFilter {
  private final SecurityProperties securityProperties;

  public OriginValidationFilter(SecurityProperties securityProperties) {
    this.securityProperties = securityProperties;
  }

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {
    if (isMutation(request) && !isAllowedOrigin(request)) {
      response.setStatus(HttpServletResponse.SC_FORBIDDEN);
      response.setContentType("application/json");
      response.getWriter().write("{\"success\":false,\"message\":\"Origin is not allowed.\"}");
      return;
    }
    filterChain.doFilter(request, response);
  }

  private boolean isMutation(HttpServletRequest request) {
    return !HttpMethod.GET.matches(request.getMethod())
        && !HttpMethod.HEAD.matches(request.getMethod())
        && !HttpMethod.OPTIONS.matches(request.getMethod());
  }

  private boolean isAllowedOrigin(HttpServletRequest request) {
    String origin = request.getHeader("Origin");
    if (origin == null || origin.isBlank()) {
      return true;
    }
    Set<String> allowedOrigins = new HashSet<>(securityProperties.getAllowedOriginList());
    return allowedOrigins.contains(origin);
  }
}
