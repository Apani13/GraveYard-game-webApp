package com.example.GraveYard_game_webApp.repository;

import com.example.GraveYard_game_webApp.model.Summon;
import com.example.GraveYard_game_webApp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SummonRepository extends JpaRepository<Summon, Long> {
    List<Summon> findByOwner(User owner);
    boolean existsByOwnerAndGraveIndex(User owner, int graveIndex);
}
