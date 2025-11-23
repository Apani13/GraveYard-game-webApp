package com.example.GraveYard_game_webApp.controller;

import com.example.GraveYard_game_webApp.model.Summon;
import com.example.GraveYard_game_webApp.model.User;
import com.example.GraveYard_game_webApp.service.SummonService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/summons")
public class SummonController {

    private final SummonService summonService;

    public SummonController(SummonService summonService) {
        this.summonService = summonService;
    }

    @GetMapping
    public List<Summon> list(@AuthenticationPrincipal User user) {
        return summonService.findByOwner(user);
    }

    @PostMapping
    public ResponseEntity<?> create(@AuthenticationPrincipal User user, @RequestBody Summon summon) {
        try {
            Summon created = summonService.createSummon(summon, user);
            return ResponseEntity.ok(created);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @AuthenticationPrincipal User user, @RequestBody Map<String, Integer> payload) {
        Integer soulDelta = payload.get("soulEnergy");
        Integer arcaneDelta = payload.get("arcaneStability");
        try {
            Summon updated = summonService.updateEnergy(id, user, soulDelta, arcaneDelta);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id, @AuthenticationPrincipal User user) {
        try {
            summonService.deleteSummon(id, user);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }
}
