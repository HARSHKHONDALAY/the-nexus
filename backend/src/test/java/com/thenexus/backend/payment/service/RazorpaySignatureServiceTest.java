package com.thenexus.backend.payment.service;

import static org.assertj.core.api.Assertions.assertThat;

import com.thenexus.backend.config.PaymentProperties;
import java.nio.charset.StandardCharsets;
import java.util.HexFormat;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.junit.jupiter.api.Test;

class RazorpaySignatureServiceTest {

  @Test
  void verifiesRazorpayPaymentSignature() throws Exception {
    PaymentProperties properties = new PaymentProperties();
    properties.setRazorpayKeySecret("test_secret");
    RazorpaySignatureService service = new RazorpaySignatureService(properties);

    String signature = hmac("order_123|pay_456", "test_secret");

    assertThat(service.verifyPayment("order_123", "pay_456", signature)).isTrue();
    assertThat(service.verifyPayment("order_123", "pay_456", "bad")).isFalse();
  }

  private String hmac(String payload, String secret) throws Exception {
    Mac mac = Mac.getInstance("HmacSHA256");
    mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
    return HexFormat.of().formatHex(mac.doFinal(payload.getBytes(StandardCharsets.UTF_8)));
  }
}
