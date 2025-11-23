package com.example.GraveYard_game_webApp.backend.summon.model;


import com.example.GraveYard_game_webApp.backend.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "summon")
public class Summon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String creatureType;
    private String name;
    private Integer soulEnergy;
    private Integer arcaneStability;
    private Integer graveIndex;
    private String epitaph;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private User owner;

}