package com.thenexus.backend.auth.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;

import com.thenexus.backend.auth.service.AuthService;
import com.thenexus.backend.common.exception.ApiException;
import com.thenexus.backend.user.repository.AdminPermissionGrantRepository;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

class AuthControllerTest {

  @Test
  void meReturnsUnauthorizedWhenPrincipalIsMissing() {
    AuthController controller = new AuthController(mock(AuthService.class), mock(AdminPermissionGrantRepository.class));

    assertThatThrownBy(() -> controller.me(null))
        .isInstanceOf(ApiException.class)
        .satisfies(exception ->
            assertThat(((ApiException) exception).getStatus()).isEqualTo(HttpStatus.UNAUTHORIZED));
  }
}
