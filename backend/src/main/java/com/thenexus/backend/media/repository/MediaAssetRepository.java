package com.thenexus.backend.media.repository;

import com.thenexus.backend.media.domain.MediaAsset;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MediaAssetRepository extends JpaRepository<MediaAsset, UUID> {
  List<MediaAsset> findByEventIdOrderBySortOrderAsc(UUID eventId);
}
