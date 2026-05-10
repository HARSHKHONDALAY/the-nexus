package com.thenexus.backend.user.repository;

import com.thenexus.backend.user.domain.RefreshToken;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {

  Optional<RefreshToken> findByTokenHash(String tokenHash);

  List<RefreshToken> findByUserId(UUID userId);

  void deleteByUserId(UUID userId);
}
