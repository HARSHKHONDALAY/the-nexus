package com.thenexus.backend.notification.repository;

import com.thenexus.backend.notification.domain.NotificationJob;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationJobRepository extends JpaRepository<NotificationJob, UUID> {}
