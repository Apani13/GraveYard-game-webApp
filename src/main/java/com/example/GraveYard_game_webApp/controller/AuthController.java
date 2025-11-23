package com.example.GraveYard_game_webApp.controller;

import com.example.GraveYard_game_webApp.model.Role;
import com.example.GraveYard_game_webApp.model.User;
import com.example.GraveYard_game_webApp.security.JwtService;
import com.example.GraveYard_game_webApp.service.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtService jwtService;

    public AuthController(AuthenticationManager authenticationManager, UserService userService, JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody AuthRequest request) {
        if (userService.existsByUsername(request.username())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username already taken"));
        }
        User user = userService.registerUser(request.username(), request.password(), Role.USER);
        String token = jwtService.generateToken(user, Map.of("role", user.getRole().name()));
        return ResponseEntity.ok(new AuthResponse(token, user.getUsername(), user.getRole()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.username(), request.password())
            );
            User user = (User) authentication.getPrincipal();
            String token = jwtService.generateToken(user, Map.of("role", user.getRole().name()));
            return ResponseEntity.ok(new AuthResponse(token, user.getUsername(), user.getRole()));
        } catch (AuthenticationException ex) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }
    }

    public record AuthRequest(@NotBlank String username, @NotBlank String password) { }
    public record AuthResponse(String token, String username, Role role) { }
}
