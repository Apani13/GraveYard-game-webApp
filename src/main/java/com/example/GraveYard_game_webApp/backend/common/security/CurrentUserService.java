package com.example.GraveYard_game_webApp.backend.common.security;

import com.example.GraveYard_game_webApp.backend.user.User;

public interface CurrentUserService {
    String getCurrentUsername();
    User getCurrentUser();
    boolean isCurrentUserAdmin();
}
