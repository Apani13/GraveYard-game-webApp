package com.example.GraveYard_game_webApp.backend.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserStatsUpdateRequest {

    private int ghostDelta;
    private int zombieDelta;
    private int skeletonDelta;

}
