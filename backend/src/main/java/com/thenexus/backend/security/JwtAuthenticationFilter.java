package com.thenexus.backend.security;

import com.thenexus.backend.user.repository.UserRepository;
import com.thenexus.backend.user.repository.AdminPermissionGrantRepository;
import com.thenexus.backend.user.domain.User;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.UUID;
import java.util.HashSet;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

  private final JwtService jwtService;
  private final UserRepository userRepository;
  private final AdminPermissionGrantRepository adminPermissionGrantRepository;

  public JwtAuthenticationFilter(
      JwtService jwtService,
      UserRepository userRepository,
      AdminPermissionGrantRepository adminPermissionGrantRepository) {
    this.jwtService = jwtService;
    this.userRepository = userRepository;
    this.adminPermissionGrantRepository = adminPermissionGrantRepository;
  }

  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {
    String header = request.getHeader("Authorization");
    if (header == null || !header.startsWith("Bearer ")) {
      filterChain.doFilter(request, response);
      return;
    }

    try {
      String token = header.substring(7);
      UUID userId = UUID.fromString(jwtService.parseClaims(token).getSubject());
      userRepository
          .findWithRolesById(userId)
          .filter(User::canAuthenticate)
          .filter(user -> SecurityContextHolder.getContext().getAuthentication() == null)
          .ifPresent(
              user -> {
                NexusPrincipal principal =
                    new NexusPrincipal(
                        user, new HashSet<>(adminPermissionGrantRepository.findByAdminUserId(user.getId())));
                UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                        principal, null, principal.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
              });
    } catch (IllegalArgumentException | JwtException ignored) {
      SecurityContextHolder.clearContext();
    }

    filterChain.doFilter(request, response);
  }
}
