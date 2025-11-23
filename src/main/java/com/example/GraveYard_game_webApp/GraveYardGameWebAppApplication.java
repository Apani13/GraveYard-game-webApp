package com.example.GraveYard_game_webApp;

import com.example.GraveYard_game_webApp.model.Role;
import com.example.GraveYard_game_webApp.model.User;
import com.example.GraveYard_game_webApp.repository.UserRepository;
import com.example.GraveYard_game_webApp.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class GraveYardGameWebAppApplication {

        public static void main(String[] args) {
                SpringApplication.run(GraveYardGameWebAppApplication.class, args);
        }

        @Bean
        CommandLineRunner initUsers(UserRepository userRepository, UserService userService) {
                return args -> {
                        if (!userRepository.existsByUsername("admin")) {
                                userService.registerUser("admin", "admin123", Role.ADMIN);
                        }
                };
        }

}
