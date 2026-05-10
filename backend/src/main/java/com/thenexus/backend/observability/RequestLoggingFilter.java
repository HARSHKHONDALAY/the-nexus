package com.thenexus.backend.observability;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class RequestLoggingFilter extends OncePerRequestFilter {
  private static final Logger log = LoggerFactory.getLogger(RequestLoggingFilter.class);
  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {
    long started = System.currentTimeMillis();
    try {
      filterChain.doFilter(request, response);
    } finally {
      log.info("http_request request_id={} method={} path={} status={} duration_ms={}",
          response.getHeader(RequestIdFilter.HEADER), request.getMethod(), request.getRequestURI(),
          response.getStatus(), System.currentTimeMillis() - started);
    }
  }
}
