package com.thenexus.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "nexus.storage")
public class StorageProperties {
  private String s3Bucket;
  private String s3Region = "ap-south-1";
  private String publicBaseUrl;
  private long maxUploadBytes = 10485760;
  public String getS3Bucket() { return s3Bucket; }
  public void setS3Bucket(String s3Bucket) { this.s3Bucket = s3Bucket; }
  public String getS3Region() { return s3Region; }
  public void setS3Region(String s3Region) { this.s3Region = s3Region; }
  public String getPublicBaseUrl() { return publicBaseUrl; }
  public void setPublicBaseUrl(String publicBaseUrl) { this.publicBaseUrl = publicBaseUrl; }
  public long getMaxUploadBytes() { return maxUploadBytes; }
  public void setMaxUploadBytes(long maxUploadBytes) { this.maxUploadBytes = maxUploadBytes; }
}
