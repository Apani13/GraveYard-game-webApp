package com.example.GraveYard_game_webApp.model;

import jakarta.persistence.*;

@Entity
public class Summon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String epitaph;

    @Column(nullable = false)
    private String creatureType;

    @Column(nullable = false)
    private int soulEnergy = 0;

    @Column(nullable = false)
    private int arcaneStability = 0;

    @Column(nullable = false)
    private int graveIndex;

    @ManyToOne(fetch = FetchType.LAZY)
    private User owner;

    public Summon() {
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEpitaph() {
        return epitaph;
    }

    public void setEpitaph(String epitaph) {
        this.epitaph = epitaph;
    }

    public String getCreatureType() {
        return creatureType;
    }

    public void setCreatureType(String creatureType) {
        this.creatureType = creatureType;
    }

    public int getSoulEnergy() {
        return soulEnergy;
    }

    public void setSoulEnergy(int soulEnergy) {
        this.soulEnergy = soulEnergy;
    }

    public int getArcaneStability() {
        return arcaneStability;
    }

    public void setArcaneStability(int arcaneStability) {
        this.arcaneStability = arcaneStability;
    }

    public int getGraveIndex() {
        return graveIndex;
    }

    public void setGraveIndex(int graveIndex) {
        this.graveIndex = graveIndex;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }
}
