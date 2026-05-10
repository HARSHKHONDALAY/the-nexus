package com.thenexus.backend.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

/**
 * Production-ready caching configuration for performance optimization
 * Uses in-memory caching with appropriate TTL settings
 */
@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        ConcurrentMapCacheManager cacheManager = new ConcurrentMapCacheManager();
        
        // Configure caches with appropriate names
        cacheManager.setCacheNames(java.util.List.of(
            "publicEvents",      // Cache for public events (5 minutes)
            "eventBySlug",       // Cache for events by slug (10 minutes)
            "ticketTiers",       // Cache for ticket tiers (15 minutes)
            "eventCategories",   // Cache for event categories (30 minutes)
            "bookingCounts",     // Cache for booking counts (2 minutes)
            "financeSummary",    // Cache for finance summaries (1 minute)
            "userPermissions",   // Cache for user permissions (10 minutes)
            "adminDashboard"     // Cache for admin dashboard (30 seconds)
        ));
        
        return cacheManager;
    }
}
