package com.thenexus.backend.payment.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.thenexus.backend.common.exception.ApiException;
import com.thenexus.backend.config.PaymentProperties;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class RazorpayClient {
  private final PaymentProperties properties;
  private final ObjectMapper objectMapper;
  private final HttpClient httpClient = HttpClient.newHttpClient();

  public RazorpayClient(PaymentProperties properties, ObjectMapper objectMapper) {
    this.properties = properties; this.objectMapper = objectMapper;
  }

  public String createOrder(long amountPaise, String currency, String receipt) {
    if (properties.getRazorpayKeyId() == null || properties.getRazorpayKeyId().isBlank()
        || properties.getRazorpayKeySecret() == null || properties.getRazorpayKeySecret().isBlank()) {
      throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Razorpay credentials are not configured.");
    }
    try {
      String body = objectMapper.writeValueAsString(Map.of("amount", amountPaise, "currency", currency, "receipt", receipt));
      HttpRequest request = HttpRequest.newBuilder(URI.create("https://api.razorpay.com/v1/orders"))
          .header("Authorization", "Basic " + Base64.getEncoder().encodeToString((properties.getRazorpayKeyId() + ":" + properties.getRazorpayKeySecret()).getBytes(StandardCharsets.UTF_8)))
          .header("Content-Type", "application/json")
          .POST(HttpRequest.BodyPublishers.ofString(body))
          .build();
      HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
      if (response.statusCode() >= 300) throw new ApiException(HttpStatus.BAD_GATEWAY, "Razorpay order creation failed.");
      JsonNode json = objectMapper.readTree(response.body());
      return json.get("id").asText();
    } catch (IOException exception) {
      throw new ApiException(HttpStatus.BAD_GATEWAY, "Unable to communicate with Razorpay.");
    } catch (InterruptedException exception) {
      Thread.currentThread().interrupt();
      throw new ApiException(HttpStatus.BAD_GATEWAY, "Razorpay request was interrupted.");
    }
  }
}
