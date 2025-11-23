package com.example.GraveYard_game_webApp.controller;

import com.example.GraveYard_game_webApp.model.User;
import com.example.GraveYard_game_webApp.service.UserService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users/me")
    public Map<String, Object> currentUser(@AuthenticationPrincipal User user) {
        return Map.of(
                "username", user.getUsername(),
                "role", user.getRole().name()
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @RequestMapping("/admin/users")
    public List<User> listUsers() {
        return userService.findAll();
    }
}
