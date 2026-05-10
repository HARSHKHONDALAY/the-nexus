package com.thenexus.backend.booking.service;

import java.security.SecureRandom;
import org.springframework.stereotype.Service;

@Service
public class BookingReferenceService {
  private static final char[] ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789".toCharArray();
  private final SecureRandom random = new SecureRandom();
  public String nextReference() {
    StringBuilder builder = new StringBuilder("NX-");
    for (int i = 0; i < 10; i++) builder.append(ALPHABET[random.nextInt(ALPHABET.length)]);
    return builder.toString();
  }
}
