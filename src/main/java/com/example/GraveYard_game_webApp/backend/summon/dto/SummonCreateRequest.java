package com.example.GraveYard_game_webApp.backend.summon.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SummonCreateRequest {

    @NotBlank(message = "creatureType cannot be empty")
    private String creatureType;

    private String name;

    @Min(0)
    @Max(100)
    private Integer soulEnergy;

    @Min(0)
    @Max(100)
    private Integer arcaneStability;

    @Min(0)
    private Integer graveIndex;

    private String epitaph;

}
