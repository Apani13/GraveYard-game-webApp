package com.example.GraveYard_game_webApp.backend.security;

import com.example.GraveYard_game_webApp.backend.exception.UnauthenticatedException;
import com.example.GraveYard_game_webApp.backend.user.Role;
import com.example.GraveYard_game_webApp.backend.user.User;
import com.example.GraveYard_game_webApp.backend.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SpringSecurityCurrentUserService implements CurrentUserService {

    private final UserRepository userRepository;

    @Override
    public String getCurrentUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getName() == null) {
            throw new UnauthenticatedException();
        }
        return auth.getName();
    }

    @Override
    public User getCurrentUser() {
        String username = getCurrentUsername();
        return userRepository.findByUsername(username)
                .orElseThrow(UnauthenticatedException::new);
    }

    @Override
    public boolean isCurrentUserAdmin() {
        return getCurrentUser().getRole() == Role.ADMIN;
    }
}
