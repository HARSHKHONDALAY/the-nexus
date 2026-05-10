package com.thenexus.backend.event.repository;

import com.thenexus.backend.event.domain.EventCategory;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventCategoryRepository extends JpaRepository<EventCategory, UUID> {
  Optional<EventCategory> findBySlug(String slug);
}
