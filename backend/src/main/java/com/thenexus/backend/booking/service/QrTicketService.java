package com.thenexus.backend.booking.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.qrcode.QRCodeWriter;
import com.thenexus.backend.auth.service.TokenHashingService;
import com.thenexus.backend.config.SecurityProperties;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.SecureRandom;
import java.util.Base64;
import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.stereotype.Service;

@Service
public class QrTicketService {
  private final SecureRandom random = new SecureRandom();
  private final TokenHashingService hashingService;
  private final SecretKeySpec encryptionKey;

  public QrTicketService(TokenHashingService hashingService, SecurityProperties securityProperties) {
    this.hashingService = hashingService;
    byte[] keyBytes = hashingService.sha256(securityProperties.getJwtSecret()).substring(0, 32).getBytes(StandardCharsets.UTF_8);
    this.encryptionKey = new SecretKeySpec(keyBytes, "AES");
  }
  public String newQrToken() {
    byte[] bytes = new byte[40];
    random.nextBytes(bytes);
    return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
  }
  public String hash(String token) { return hashingService.sha256(token); }
  public String encrypt(String token) {
    try {
      byte[] iv = new byte[12];
      random.nextBytes(iv);
      Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
      cipher.init(Cipher.ENCRYPT_MODE, encryptionKey, new GCMParameterSpec(128, iv));
      byte[] encrypted = cipher.doFinal(token.getBytes(StandardCharsets.UTF_8));
      return Base64.getUrlEncoder().withoutPadding().encodeToString(iv) + "." +
          Base64.getUrlEncoder().withoutPadding().encodeToString(encrypted);
    } catch (GeneralSecurityException exception) {
      throw new IllegalStateException("Unable to encrypt QR token.", exception);
    }
  }
  public String decrypt(String ciphertext) {
    try {
      String[] parts = ciphertext.split("\\.", 2);
      Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
      cipher.init(Cipher.DECRYPT_MODE, encryptionKey, new GCMParameterSpec(128, Base64.getUrlDecoder().decode(parts[0])));
      return new String(cipher.doFinal(Base64.getUrlDecoder().decode(parts[1])), StandardCharsets.UTF_8);
    } catch (RuntimeException | GeneralSecurityException exception) {
      throw new IllegalStateException("Unable to decrypt QR token.", exception);
    }
  }
  public byte[] png(String token) {
    try {
      ByteArrayOutputStream output = new ByteArrayOutputStream();
      MatrixToImageWriter.writeToStream(new QRCodeWriter().encode(token, BarcodeFormat.QR_CODE, 512, 512), "PNG", output);
      return output.toByteArray();
    } catch (WriterException | IOException exception) {
      throw new IllegalStateException("Unable to generate QR code.", exception);
    }
  }
}
