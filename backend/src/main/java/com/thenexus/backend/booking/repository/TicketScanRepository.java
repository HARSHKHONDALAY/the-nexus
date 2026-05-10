package com.thenexus.backend.booking.repository;

import com.thenexus.backend.booking.domain.TicketScan;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketScanRepository extends JpaRepository<TicketScan, UUID> {}
