package com.thenexus.backend.payment.service;

import com.thenexus.backend.common.exception.ApiException;
import com.thenexus.backend.config.PaymentProperties;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class RazorpaySignatureService {
  private final PaymentProperties properties;
  public RazorpaySignatureService(PaymentProperties properties) { this.properties = properties; }
  public boolean verifyPayment(String orderId, String paymentId, String signature) {
    return hmac(orderId + "|" + paymentId, properties.getRazorpayKeySecret()).equals(signature);
  }
  public boolean verifyWebhook(String payload, String signature) {
    if (properties.getWebhookSecret() == null || properties.getWebhookSecret().isBlank()) throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Razorpay webhook secret is not configured.");
    return hmac(payload, properties.getWebhookSecret()).equals(signature);
  }
  private String hmac(String payload, String secret) {
    try {
      Mac mac = Mac.getInstance("HmacSHA256");
      mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
      return HexFormat.of().formatHex(mac.doFinal(payload.getBytes(StandardCharsets.UTF_8)));
    } catch (NoSuchAlgorithmException | InvalidKeyException exception) {
      throw new IllegalStateException("Unable to verify Razorpay signature.", exception);
    }
  }
}
