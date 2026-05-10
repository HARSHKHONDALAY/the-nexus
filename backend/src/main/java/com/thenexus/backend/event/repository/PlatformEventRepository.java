package com.thenexus.backend.event.repository;

import com.thenexus.backend.event.domain.EventStatus;
import com.thenexus.backend.event.domain.PlatformEvent;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlatformEventRepository extends JpaRepository<PlatformEvent, UUID> {
  boolean existsBySlug(String slug);
  Optional<PlatformEvent> findBySlug(String slug);
  List<PlatformEvent> findByStatusInOrderByStartsAtAsc(List<EventStatus> statuses);
  List<PlatformEvent> findByStatusInAndDeletedAtIsNullOrderByStartsAtAsc(List<EventStatus> statuses);
  List<PlatformEvent> findByStatusInOrderByStartsAtDesc(List<EventStatus> statuses);
}
