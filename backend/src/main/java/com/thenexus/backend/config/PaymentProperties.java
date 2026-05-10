package com.thenexus.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "nexus.payments")
public class PaymentProperties {
  private String razorpayKeyId;
  private String razorpayKeySecret;
  private String webhookSecret;
  private String currency = "INR";
  public String getRazorpayKeyId() { return razorpayKeyId; }
  public void setRazorpayKeyId(String razorpayKeyId) { this.razorpayKeyId = razorpayKeyId; }
  public String getRazorpayKeySecret() { return razorpayKeySecret; }
  public void setRazorpayKeySecret(String razorpayKeySecret) { this.razorpayKeySecret = razorpayKeySecret; }
  public String getWebhookSecret() { return webhookSecret; }
  public void setWebhookSecret(String webhookSecret) { this.webhookSecret = webhookSecret; }
  public String getCurrency() { return currency; }
  public void setCurrency(String currency) { this.currency = currency; }
}
