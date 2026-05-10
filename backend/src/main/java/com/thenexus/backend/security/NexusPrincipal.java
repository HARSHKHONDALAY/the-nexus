package com.thenexus.backend.security;

import com.thenexus.backend.role.domain.Permission;
import com.thenexus.backend.role.domain.Role;
import com.thenexus.backend.user.domain.AdminPermissionGrant;
import com.thenexus.backend.user.domain.User;
import java.util.Collection;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class NexusPrincipal implements UserDetails {

  private final User user;
  private final Set<GrantedAuthority> authorities;

  public NexusPrincipal(User user) {
    this(user, Set.of());
  }

  public NexusPrincipal(User user, Set<AdminPermissionGrant> permissionGrants) {
    this.user = user;
    this.authorities =
        user.getRoles().stream()
            .flatMap(role -> roleAuthorities(role).stream())
            .collect(Collectors.toSet());
    permissionGrants.stream()
        .filter(AdminPermissionGrant::isGranted)
        .map(AdminPermissionGrant::getPermission)
        .map(Permission::getCode)
        .map(SimpleGrantedAuthority::new)
        .forEach(authorities::add);
  }

  private Set<GrantedAuthority> roleAuthorities(Role role) {
    Set<GrantedAuthority> roleAuthorities =
        role.getPermissions().stream()
            .map(Permission::getCode)
            .map(SimpleGrantedAuthority::new)
            .collect(Collectors.toSet());
    roleAuthorities.add(new SimpleGrantedAuthority("ROLE_" + role.getCode().name()));
    return roleAuthorities;
  }

  public UUID getUserId() {
    return user.getId();
  }

  public User getUser() {
    return user;
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return authorities;
  }

  @Override
  public String getPassword() {
    return user.getPasswordHash();
  }

  @Override
  public String getUsername() {
    return user.getNormalizedEmail();
  }

  @Override
  public boolean isAccountNonExpired() {
    return user.canAuthenticate();
  }

  @Override
  public boolean isAccountNonLocked() {
    return user.canAuthenticate();
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  @Override
  public boolean isEnabled() {
    return user.canAuthenticate();
  }
}
