package com.thenexus.backend.event.repository;

import com.thenexus.backend.event.domain.EventStatus;
import com.thenexus.backend.event.domain.PlatformEvent;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface PlatformEventRepository extends JpaRepository<PlatformEvent, UUID> {
  boolean existsBySlug(String slug);
  Optional<PlatformEvent> findBySlug(String slug);
  List<PlatformEvent> findByStatusInOrderByStartsAtAsc(List<EventStatus> statuses);
  List<PlatformEvent> findByStatusInAndDeletedAtIsNullOrderByStartsAtAsc(List<EventStatus> statuses);
  List<PlatformEvent> findByStatusInOrderByStartsAtDesc(List<EventStatus> statuses);
  
  // Safe query that explicitly joins categories to prevent lazy loading issues
  @Query("SELECT e FROM PlatformEvent e LEFT JOIN FETCH e.category WHERE e.status IN :statuses AND e.deletedAt IS NULL AND e.visibility = 'PUBLIC' ORDER BY e.startsAt ASC")
  List<PlatformEvent> findByStatusInOrderByStartsAtAscWithCategories(List<EventStatus> statuses);
  
  // Find event by slug with category to prevent lazy loading issues
  @Query("SELECT e FROM PlatformEvent e LEFT JOIN FETCH e.category WHERE e.slug = :slug")
  Optional<PlatformEvent> findBySlugWithCategory(String slug);
}
