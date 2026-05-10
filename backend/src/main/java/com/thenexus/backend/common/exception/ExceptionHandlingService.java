package com.thenexus.backend.common.exception;

import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Service for centralized exception handling utilities
 * Provides correlation ID generation and exception classification
 */
@Service
public class ExceptionHandlingService {
  private static final Logger log = LoggerFactory.getLogger(ExceptionHandlingService.class);
  
  /**
   * Generate a correlation ID for tracking requests and exceptions
   */
  public String generateCorrelationId() {
    return UUID.randomUUID().toString().substring(0, 8);
  }
  
  /**
   * Classify exception type for proper handling and user messaging
   */
  public String classifyException(Exception exception) {
    if (exception instanceof NullPointerException) {
      return "NULL_POINTER";
    } else if (exception instanceof org.hibernate.LazyInitializationException) {
      return "LAZY_LOADING";
    } else if (exception instanceof org.hibernate.exception.ConstraintViolationException) {
      return "CONSTRAINT_VIOLATION";
    } else if (exception instanceof org.hibernate.exception.SQLGrammarException) {
      return "SQL_GRAMMAR";
    } else if (exception instanceof org.springframework.dao.InvalidDataAccessResourceUsageException) {
      return "DATA_ACCESS";
    } else if (exception instanceof org.springframework.dao.DataIntegrityViolationException) {
      return "DATA_INTEGRITY";
    } else if (exception instanceof org.springframework.transaction.TransactionSystemException) {
      return "TRANSACTION_ERROR";
    } else if (exception instanceof java.sql.SQLException) {
      return "DATABASE_ERROR";
    } else if (exception instanceof java.io.IOException) {
      return "IO_ERROR";
    } else if (exception instanceof java.net.ConnectException) {
      return "CONNECTION_ERROR";
    } else if (exception instanceof java.util.concurrent.TimeoutException) {
      return "TIMEOUT_ERROR";
    } else if (exception.getMessage() != null) {
      String message = exception.getMessage();
      if (message.contains("could not initialize proxy")) {
        return "PROXY_INITIALIZATION";
      } else if (message.contains("Column") && message.contains("not found")) {
        return "SCHEMA_MISMATCH";
      } else if (message.contains("Connection") && message.contains("refused")) {
        return "CONNECTION_REFUSED";
      } else if (message.contains("timeout") || message.contains("Timeout")) {
        return "TIMEOUT_ERROR";
      } else if (message.contains("duplicate") || message.contains("Duplicate")) {
        return "DUPLICATE_ENTRY";
      }
    }
    return "UNKNOWN_ERROR";
  }
  
  /**
   * Get user-friendly error message based on exception type
   */
  public String getUserFriendlyMessage(String errorType) {
    return switch (errorType) {
      case "NULL_POINTER", "LAZY_LOADING", "PROXY_INITIALIZATION", "TRANSACTION_ERROR" -> 
        "Service temporarily unavailable. Please try again.";
      case "CONSTRAINT_VIOLATION", "DATA_INTEGRITY", "DUPLICATE_ENTRY" -> 
        "Invalid data provided. Please check your input.";
      case "SQL_GRAMMAR", "SCHEMA_MISMATCH", "DATABASE_ERROR", "DATA_ACCESS" -> 
        "Service temporarily unavailable. Please try again later.";
      case "CONNECTION_ERROR", "CONNECTION_REFUSED", "TIMEOUT_ERROR" -> 
        "Service temporarily unavailable. Please try again.";
      case "IO_ERROR" -> 
        "File processing error. Please try again.";
      default -> 
        "An unexpected error occurred. Please try again.";
    };
  }
  
  /**
   * Check if running in development environment
   */
  public boolean isDevelopmentEnvironment() {
    String profile = System.getProperty("spring.profiles.active", "");
    String env = System.getenv("SPRING_PROFILES_ACTIVE");
    return (profile.contains("dev") || profile.contains("local") || 
            env != null && (env.contains("dev") || env.contains("local")));
  }
  
  /**
   * Log structured exception information with correlation ID
   */
  public void logException(String correlationId, String method, String path, 
                          String exceptionType, String message, Throwable exception) {
    log.error("BACKEND_ERROR: correlationId={}, method={}, path={}, exceptionType={}, message={}", 
        correlationId, method, path, exceptionType, message, exception);
  }
  
  /**
   * Log exception response information
   */
  public void logExceptionResponse(String correlationId, String errorType, String userMessage) {
    log.info("BACKEND_ERROR_RESPONSE: correlationId={}, errorType={}, userMessage={}", 
        correlationId, errorType, userMessage);
  }
  
  /**
   * Format validation field errors
   */
  public String formatFieldError(org.springframework.validation.FieldError error) {
    return error.getField() + " " + error.getDefaultMessage();
  }
}
