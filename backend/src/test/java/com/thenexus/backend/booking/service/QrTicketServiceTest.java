package com.thenexus.backend.booking.service;

import static org.assertj.core.api.Assertions.assertThat;

import com.thenexus.backend.auth.service.TokenHashingService;
import com.thenexus.backend.config.SecurityProperties;
import org.junit.jupiter.api.Test;

class QrTicketServiceTest {

  @Test
  void createsOpaqueQrTokensAndPngPayloads() {
    QrTicketService service = new QrTicketService(new TokenHashingService(), securityProperties());

    String token = service.newQrToken();
    byte[] png = service.png(token);

    assertThat(token).hasSizeGreaterThan(40);
    assertThat(service.hash(token)).isNotEqualTo(token);
    assertThat(service.decrypt(service.encrypt(token))).isEqualTo(token);
    assertThat(png).startsWith(new byte[] {(byte) 0x89, 0x50, 0x4e, 0x47});
  }

  private SecurityProperties securityProperties() {
    SecurityProperties properties = new SecurityProperties();
    properties.setJwtSecret("0123456789012345678901234567890123456789");
    return properties;
  }
}
