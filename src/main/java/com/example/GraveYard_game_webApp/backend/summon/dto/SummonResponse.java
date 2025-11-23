package com.example.GraveYard_game_webApp.backend.summon.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SummonResponse {

    private Long id;
    private String creatureType;
    private String name;
    private Integer soulEnergy;
    private Integer arcaneStability;
    private Integer graveIndex;
    private String epitaph;

    private String ownerUsername;

}
