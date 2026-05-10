package com.thenexus.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "nexus.mail")
public class MailProperties {
  private String fromEmail;
  private String fromName;
  public String getFromEmail() { return fromEmail; }
  public void setFromEmail(String fromEmail) { this.fromEmail = fromEmail; }
  public String getFromName() { return fromName; }
  public void setFromName(String fromName) { this.fromName = fromName; }
}
