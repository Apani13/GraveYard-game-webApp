package com.example.GraveYard_game_webApp.backend.summon.repository;

import com.example.GraveYard_game_webApp.backend.summon.model.Summon;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SummonRepository extends JpaRepository<Summon, Long> {

    List<Summon> findByOwner_Username(String username);

    Optional<Summon> findByIdAndOwner_Username(Long id, String username);

}
