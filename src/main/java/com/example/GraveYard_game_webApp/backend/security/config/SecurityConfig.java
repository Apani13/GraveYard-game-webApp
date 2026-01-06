package com.example.GraveYard_game_webApp.backend.security.config;

import com.example.GraveYard_game_webApp.backend.security.jwt.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final AuthenticationProvider authProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .cors(cors -> {
                })
                .csrf(AbstractHttpConfigurer::disable)
                .headers(headers -> headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::disable))

                .authorizeHttpRequests(auth -> auth

                        .requestMatchers(
                                "/assets/**",
                                "/css/**",
                                "/js/**",
                                "/images/**",
                                "/audio/**"
                        ).permitAll()

                        .requestMatchers(
                                "/",
                                "/login.html",
                                "/register.html",
                                "/game.html"
                        ).permitAll()

                        .requestMatchers("/admin.html").permitAll()

                        .requestMatchers("/auth/**").permitAll()

                        .requestMatchers(
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html"
                        ).permitAll()

                        .requestMatchers("/h2-console/**").permitAll()

                        .requestMatchers("/admin/**").hasRole("ADMIN")


                        .requestMatchers(HttpMethod.GET, "/summons/**").hasAnyRole("USER", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/summons/**").hasAnyRole("USER", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/summons/**").hasAnyRole("USER", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/summons/**").hasAnyRole("USER", "ADMIN")


                        .requestMatchers("/users/me/stats").authenticated()

                        .anyRequest().authenticated()
                )

                .authenticationProvider(authProvider)
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
