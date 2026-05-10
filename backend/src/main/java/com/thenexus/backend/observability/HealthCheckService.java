package com.thenexus.backend.observability;

import com.thenexus.backend.booking.repository.BookingRepository;
import com.thenexus.backend.event.repository.PlatformEventRepository;
import com.thenexus.backend.finance.repository.FinanceEntryRepository;
import com.thenexus.backend.user.repository.UserRepository;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.boot.actuate.health.Status;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

/**
 * Comprehensive health check service for production monitoring
 * Provides detailed diagnostics for all critical system components
 */
@Component
public class HealthCheckService {

    private final DataSource dataSource;
    private final UserRepository userRepository;
    private final PlatformEventRepository eventRepository;
    private final BookingRepository bookingRepository;
    private final FinanceEntryRepository financeEntryRepository;

    public HealthCheckService(DataSource dataSource, UserRepository userRepository,
                             PlatformEventRepository eventRepository, BookingRepository bookingRepository,
                             FinanceEntryRepository financeEntryRepository) {
        this.dataSource = dataSource;
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
        this.bookingRepository = bookingRepository;
        this.financeEntryRepository = financeEntryRepository;
    }

    /**
     * Database connectivity health check
     */
    @Component
    public static class DatabaseHealth implements HealthIndicator {
        private final DataSource dataSource;

        public DatabaseHealth(DataSource dataSource) {
            this.dataSource = dataSource;
        }

        @Override
        public Health health() {
            Map<String, Object> details = new HashMap<>();
            
            try (Connection connection = dataSource.getConnection()) {
                boolean isValid = connection.isValid(5);
                String databaseName = connection.getCatalog();
                String databaseUrl = connection.getMetaData().getURL();
                
                details.put("database", databaseName);
                details.put("url", databaseUrl);
                details.put("valid", isValid);
                details.put("timestamp", Instant.now());
                
                if (isValid) {
                    return Health.up()
                        .withDetails(details)
                        .build();
                } else {
                    return Health.down()
                        .withDetails(details)
                        .withDetail("error", "Database connection validation failed")
                        .build();
                }
            } catch (Exception e) {
                details.put("error", e.getMessage());
                details.put("timestamp", Instant.now());
                return Health.down()
                    .withDetails(details)
                    .withException(e)
                    .build();
            }
        }
    }

    /**
     * Application data health check
     */
    @Component
    public static class ApplicationDataHealth implements HealthIndicator {
        private final UserRepository userRepository;
        private final PlatformEventRepository eventRepository;
        private final BookingRepository bookingRepository;
        private final FinanceEntryRepository financeEntryRepository;

        public ApplicationDataHealth(UserRepository userRepository, PlatformEventRepository eventRepository,
                                     BookingRepository bookingRepository, FinanceEntryRepository financeEntryRepository) {
            this.userRepository = userRepository;
            this.eventRepository = eventRepository;
            this.bookingRepository = bookingRepository;
            this.financeEntryRepository = financeEntryRepository;
        }

        @Override
        public Health health() {
            Map<String, Object> details = new HashMap<>();
            
            try {
                long userCount = userRepository.count();
                long eventCount = eventRepository.count();
                long bookingCount = bookingRepository.count();
                long financeEntryCount = financeEntryRepository.count();
                
                details.put("users", userCount);
                details.put("events", eventCount);
                details.put("bookings", bookingCount);
                details.put("finance_entries", financeEntryCount);
                details.put("timestamp", Instant.now());
                
                // Basic sanity checks
                if (userCount >= 0 && eventCount >= 0 && bookingCount >= 0) {
                    return Health.up()
                        .withDetails(details)
                        .build();
                } else {
                    return Health.down()
                        .withDetails(details)
                        .withDetail("error", "Data integrity check failed")
                        .build();
                }
            } catch (Exception e) {
                details.put("error", e.getMessage());
                details.put("timestamp", Instant.now());
                return Health.down()
                    .withDetails(details)
                    .withException(e)
                    .build();
            }
        }
    }

    /**
     * Memory usage health check
     */
    @Component
    public static class MemoryHealth implements HealthIndicator {
        @Override
        public Health health() {
            Map<String, Object> details = new HashMap<>();
            
            Runtime runtime = Runtime.getRuntime();
            long maxMemory = runtime.maxMemory();
            long totalMemory = runtime.totalMemory();
            long freeMemory = runtime.freeMemory();
            long usedMemory = totalMemory - freeMemory;
            
            double memoryUsagePercent = (double) usedMemory / maxMemory * 100;
            
            details.put("max_memory_mb", maxMemory / 1024 / 1024);
            details.put("total_memory_mb", totalMemory / 1024 / 1024);
            details.put("used_memory_mb", usedMemory / 1024 / 1024);
            details.put("free_memory_mb", freeMemory / 1024 / 1024);
            details.put("usage_percent", Math.round(memoryUsagePercent * 100.0) / 100.0);
            details.put("timestamp", Instant.now());
            
            if (memoryUsagePercent < 85) {
                return Health.up()
                    .withDetails(details)
                    .build();
            } else if (memoryUsagePercent < 95) {
                return Health.status(new Status("WARNING"))
                    .withDetails(details)
                    .withDetail("warning", "Memory usage is high")
                    .build();
            } else {
                return Health.down()
                    .withDetails(details)
                    .withDetail("error", "Memory usage is critical")
                    .build();
            }
        }
    }
}
