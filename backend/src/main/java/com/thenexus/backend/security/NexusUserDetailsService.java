package com.thenexus.backend.security;

import com.thenexus.backend.user.domain.User;
import com.thenexus.backend.user.repository.AdminPermissionGrantRepository;
import com.thenexus.backend.user.repository.UserRepository;
import java.util.HashSet;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class NexusUserDetailsService implements UserDetailsService {

  private final UserRepository userRepository;
  private final AdminPermissionGrantRepository adminPermissionGrantRepository;

  public NexusUserDetailsService(
      UserRepository userRepository, AdminPermissionGrantRepository adminPermissionGrantRepository) {
    this.userRepository = userRepository;
    this.adminPermissionGrantRepository = adminPermissionGrantRepository;
  }

  @Override
  public UserDetails loadUserByUsername(String username) {
    User user =
        userRepository
            .findByNormalizedEmail(User.normalizeEmail(username))
            .orElseThrow(() -> new UsernameNotFoundException("User not found."));
    return new NexusPrincipal(user, new HashSet<>(adminPermissionGrantRepository.findByAdminUserId(user.getId())));
  }
}
