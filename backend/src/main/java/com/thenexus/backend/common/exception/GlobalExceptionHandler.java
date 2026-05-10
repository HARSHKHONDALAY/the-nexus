package com.thenexus.backend.common.exception;

import com.thenexus.backend.common.api.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
  private final ExceptionHandlingService exceptionHandlingService;

  public GlobalExceptionHandler(ExceptionHandlingService exceptionHandlingService) {
    this.exceptionHandlingService = exceptionHandlingService;
  }

  @ExceptionHandler(ApiException.class)
  ResponseEntity<ApiResponse<Void>> handleApiException(ApiException exception) {
    String correlationId = exceptionHandlingService.generateCorrelationId();
    exceptionHandlingService.logException(correlationId, "UNKNOWN", "UNKNOWN", 
        "API_EXCEPTION", exception.getMessage(), exception);
    
    return ResponseEntity.status(exception.getStatus())
        .body(ApiResponse.error(exception.getMessage()));
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  ResponseEntity<ApiResponse<Void>> handleValidation(MethodArgumentNotValidException exception) {
    String correlationId = exceptionHandlingService.generateCorrelationId();
    String message =
        exception.getBindingResult().getFieldErrors().stream()
            .map(exceptionHandlingService::formatFieldError)
            .collect(Collectors.joining("; "));
    
    exceptionHandlingService.logException(correlationId, "UNKNOWN", "UNKNOWN", 
        "VALIDATION_ERROR", message, exception);
    
    return ResponseEntity.badRequest().body(ApiResponse.error(message));
  }

  @ExceptionHandler({BadCredentialsException.class})
  ResponseEntity<ApiResponse<Void>> handleBadCredentials(BadCredentialsException exception) {
    String correlationId = exceptionHandlingService.generateCorrelationId();
    exceptionHandlingService.logException(correlationId, "UNKNOWN", "UNKNOWN", 
        "BAD_CREDENTIALS", exception.getMessage(), exception);
    
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Invalid credentials."));
  }

  @ExceptionHandler(AccessDeniedException.class)
  ResponseEntity<ApiResponse<Void>> handleAccessDenied(AccessDeniedException exception) {
    String correlationId = exceptionHandlingService.generateCorrelationId();
    exceptionHandlingService.logException(correlationId, "UNKNOWN", "UNKNOWN", 
        "ACCESS_DENIED", exception.getMessage(), exception);
    
    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.error("Access denied."));
  }

  @ExceptionHandler(Exception.class)
  ResponseEntity<ApiResponse<Void>> handleUnexpected(Exception exception, HttpServletRequest request) {
    // Generate correlation ID for tracking
    String correlationId = exceptionHandlingService.generateCorrelationId();
    
    // Log structured exception information
    exceptionHandlingService.logException(correlationId, request.getMethod(), request.getRequestURI(),
        exception.getClass().getSimpleName(), exception.getMessage(), exception);
    
    // Determine error type for response
    String errorType = exceptionHandlingService.classifyException(exception);
    String userMessage = exceptionHandlingService.getUserFriendlyMessage(errorType);
    
    // Only include detailed error in development
    String errorMessage = exceptionHandlingService.isDevelopmentEnvironment() 
        ? String.format("[%s] %s: %s", errorType, userMessage, exception.getMessage())
        : userMessage;
    
    exceptionHandlingService.logExceptionResponse(correlationId, errorType, userMessage);
    
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body(ApiResponse.error(errorMessage));
  }
}
