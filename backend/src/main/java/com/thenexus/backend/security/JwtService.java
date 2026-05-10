package com.thenexus.backend.security;

import com.thenexus.backend.config.SecurityProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

  private final SecurityProperties securityProperties;
  private final SecretKey signingKey;

  public JwtService(SecurityProperties securityProperties) {
    this.securityProperties = securityProperties;
    this.signingKey = Keys.hmacShaKeyFor(securityProperties.getJwtSecret().getBytes(StandardCharsets.UTF_8));
  }

  public String createAccessToken(NexusPrincipal principal) {
    Instant issuedAt = Instant.now();
    Instant expiresAt = issuedAt.plus(securityProperties.getAccessTokenTtl());
    return Jwts.builder()
        .subject(principal.getUserId().toString())
        .claim("email", principal.getUser().getEmail())
        .claim("authorities", principal.getAuthorities().stream().map(Object::toString).toList())
        .issuedAt(Date.from(issuedAt))
        .expiration(Date.from(expiresAt))
        .signWith(signingKey)
        .compact();
  }

  public Claims parseClaims(String token) {
    return Jwts.parser().verifyWith(signingKey).build().parseSignedClaims(token).getPayload();
  }
}
