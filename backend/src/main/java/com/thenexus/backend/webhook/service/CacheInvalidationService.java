package com.thenexus.backend.webhook.service;

import com.thenexus.backend.common.exception.ApiException;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.concurrent.CompletableFuture;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class CacheInvalidationService {
  private static final Logger log = LoggerFactory.getLogger(CacheInvalidationService.class);

  private final HttpClient httpClient;
  private final String frontendUrl;

  public CacheInvalidationService(@Value("${app.frontend.url:http://localhost:3000}") String frontendUrl) {
    this.httpClient = HttpClient.newBuilder()
        .connectTimeout(Duration.ofSeconds(10))
        .build();
    this.frontendUrl = frontendUrl;
  }

  @Async
  public CompletableFuture<Void> invalidateAllEvents() {
    return CompletableFuture.runAsync(() -> {
      try {
        String url = frontendUrl + "/api/revalidate/events";
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(url))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString("{}"))
            .timeout(Duration.ofSeconds(30))
            .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        
        if (response.statusCode() == 200) {
          log.info("Successfully invalidated all event pages");
        } else {
          log.warn("Failed to invalidate event pages, status: {}", response.statusCode());
        }
      } catch (IOException | InterruptedException e) {
        log.error("Failed to invalidate all event pages", e);
        // Don't rethrow - cache invalidation failure shouldn't break the main operation
      }
    });
  }

  @Async
  public CompletableFuture<Void> invalidateEventPage(String slug) {
    return CompletableFuture.runAsync(() -> {
      try {
        String url = frontendUrl + "/api/revalidate/events/" + slug;
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(url))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString("{}"))
            .timeout(Duration.ofSeconds(30))
            .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        
        if (response.statusCode() == 200) {
          log.info("Successfully invalidated event page: {}", slug);
        } else {
          log.warn("Failed to invalidate event page {}, status: {}", slug, response.statusCode());
        }
      } catch (IOException | InterruptedException e) {
        log.error("Failed to invalidate event page: {}", slug, e);
        // Don't rethrow - cache invalidation failure shouldn't break the main operation
      }
    });
  }

  @Async
  public CompletableFuture<Void> invalidateHomePage() {
    return CompletableFuture.runAsync(() -> {
      try {
        String url = frontendUrl + "/api/revalidate/events"; // This also invalidates homepage
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(url))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString("{}"))
            .timeout(Duration.ofSeconds(30))
            .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        
        if (response.statusCode() == 200) {
          log.info("Successfully invalidated homepage");
        } else {
          log.warn("Failed to invalidate homepage, status: {}", response.statusCode());
        }
      } catch (IOException | InterruptedException e) {
        log.error("Failed to invalidate homepage", e);
        // Don't rethrow - cache invalidation failure shouldn't break the main operation
      }
    });
  }
}
