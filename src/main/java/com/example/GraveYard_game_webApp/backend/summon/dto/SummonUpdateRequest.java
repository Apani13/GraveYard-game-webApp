package com.example.GraveYard_game_webApp.backend.summon.dto;

import lombok.Data;

@Data
public class SummonUpdateRequest {

    private String creatureType;

    private String name;

    private Integer soulEnergy;

    private Integer arcaneStability;

    private Integer graveIndex;

    private String epitaph;

}
