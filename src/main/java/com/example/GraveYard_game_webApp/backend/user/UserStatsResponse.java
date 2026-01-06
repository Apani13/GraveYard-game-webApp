package com.example.GraveYard_game_webApp.backend.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserStatsResponse {

    private String username;
    private int ghostsCollected;
    private int zombiesCollected;
    private int skeletonsCollected;

}
