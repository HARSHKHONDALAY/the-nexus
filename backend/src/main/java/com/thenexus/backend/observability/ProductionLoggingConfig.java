package com.thenexus.backend.observability;

import org.slf4j.MDC;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.UUID;

/**
 * Production logging configuration with request correlation and structured logging
 */
@Configuration
public class ProductionLoggingConfig {

    /**
     * Request interceptor for adding correlation IDs to all logs
     */
    public static class CorrelationInterceptor implements HandlerInterceptor {
        
        private static final String CORRELATION_ID_HEADER = "X-Correlation-ID";
        private static final String CORRELATION_ID_KEY = "correlationId";

        @Override
        public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
            String correlationId = request.getHeader(CORRELATION_ID_HEADER);
            if (correlationId == null || correlationId.trim().isEmpty()) {
                correlationId = UUID.randomUUID().toString().substring(0, 8);
            }
            
            MDC.put(CORRELATION_ID_KEY, correlationId);
            response.setHeader(CORRELATION_ID_HEADER, correlationId);
            
            return true;
        }

        @Override
        public void afterCompletion(HttpServletRequest request, HttpServletResponse response, 
                Object handler, Exception ex) {
            MDC.remove(CORRELATION_ID_KEY);
        }
    }

    /**
     * Structured logging utility for production monitoring
     */
    public static class StructuredLogger {
        
        public static void logApiCall(String method, String path, int status, long duration) {
            org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger("API_ACCESS");
            logger.info("method={} path={} status={} duration_ms={} correlation_id={}", 
                method, path, status, duration, MDC.get("correlationId"));
        }

        public static void logDatabaseQuery(String query, long duration, boolean success) {
            org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger("DATABASE");
            if (success) {
                logger.info("query_type={} duration_ms={} success=true correlation_id={}", 
                    query, duration, MDC.get("correlationId"));
            } else {
                logger.error("query_type={} duration_ms={} success=false correlation_id={}", 
                    query, duration, MDC.get("correlationId"));
            }
        }

        public static void logSecurityEvent(String event, String user, String details) {
            org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger("SECURITY");
            logger.warn("event={} user={} details={} correlation_id={}", 
                event, user, details, MDC.get("correlationId"));
        }

        public static void logBusinessEvent(String event, String entityType, String entityId, String details) {
            org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger("BUSINESS");
            logger.info("event={} entity_type={} entity_id={} details={} correlation_id={}", 
                event, entityType, entityId, details, MDC.get("correlationId"));
        }

        public static void logPerformanceMetric(String metric, double value, String unit) {
            org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger("PERFORMANCE");
            logger.info("metric={} value={} unit={} correlation_id={}", 
                metric, value, unit, MDC.get("correlationId"));
        }

        public static void logSystemEvent(String component, String event, String details) {
            org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger("SYSTEM");
            logger.info("component={} event={} details={} correlation_id={}", 
                component, event, details, MDC.get("correlationId"));
        }
    }
}
