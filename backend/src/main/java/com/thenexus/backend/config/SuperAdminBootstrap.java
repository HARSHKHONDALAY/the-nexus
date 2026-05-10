package com.thenexus.backend.config;

import com.thenexus.backend.role.domain.Role;
import com.thenexus.backend.role.domain.RoleCode;
import com.thenexus.backend.role.repository.RoleRepository;
import com.thenexus.backend.user.domain.AdminType;
import com.thenexus.backend.user.domain.User;
import com.thenexus.backend.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class SuperAdminBootstrap implements CommandLineRunner {

  private final String email;
  private final String password;
  private final String fullName;
  private final UserRepository userRepository;
  private final RoleRepository roleRepository;
  private final PasswordEncoder passwordEncoder;

  public SuperAdminBootstrap(
      @Value("${SUPER_ADMIN_EMAIL:}") String email,
      @Value("${SUPER_ADMIN_PASSWORD:}") String password,
      @Value("${SUPER_ADMIN_NAME:The Nexus Founder}") String fullName,
      UserRepository userRepository,
      RoleRepository roleRepository,
      PasswordEncoder passwordEncoder) {
    this.email = email;
    this.password = password;
    this.fullName = fullName;
    this.userRepository = userRepository;
    this.roleRepository = roleRepository;
    this.passwordEncoder = passwordEncoder;
  }

  @Override
  @Transactional
  public void run(String... args) {
    if (email.isBlank() || password.isBlank()) {
      return;
    }
    String normalizedEmail = User.normalizeEmail(email);
    if (userRepository.existsByNormalizedEmail(normalizedEmail)) {
      return;
    }
    Role superAdminRole = roleRepository.findByCode(RoleCode.SUPER_ADMIN).orElseThrow();
    User superAdmin = new User(email, null, passwordEncoder.encode(password), fullName, null);
    superAdmin.addRole(superAdminRole);
    superAdmin.assignAdminScope(AdminType.SUPER_ADMIN, null);
    userRepository.save(superAdmin);
  }
}
