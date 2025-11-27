package com.example.GraveYard_game_webApp.backend.user;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserStatsController {

    private final UserRepository userRepository;

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
    }


    @GetMapping("/me/stats")
    public UserStatsResponse getMyStats() {
        User user = getCurrentUser();

        return UserStatsResponse.builder()
                .username(user.getUsername())
                .ghostsCollected(user.getGhostsCollected())
                .zombiesCollected(user.getZombiesCollected())
                .skeletonsCollected(user.getSkeletonsCollected())
                .build();
    }


    @PostMapping("/me/stats")
    public UserStatsResponse incrementMyStats(@RequestBody UserStatsUpdateRequest request) {
        User user = getCurrentUser();

        user.setGhostsCollected(user.getGhostsCollected() + request.getGhostDelta());
        user.setZombiesCollected(user.getZombiesCollected() + request.getZombieDelta());
        user.setSkeletonsCollected(user.getSkeletonsCollected() + request.getSkeletonDelta());

        userRepository.save(user);

        return UserStatsResponse.builder()
                .username(user.getUsername())
                .ghostsCollected(user.getGhostsCollected())
                .zombiesCollected(user.getZombiesCollected())
                .skeletonsCollected(user.getSkeletonsCollected())
                .build();
    }

}
