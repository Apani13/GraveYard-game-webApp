package com.example.GraveYard_game_webApp.backend.summon.controller;

import com.example.GraveYard_game_webApp.backend.summon.dto.SummonCreateRequest;
import com.example.GraveYard_game_webApp.backend.summon.dto.SummonResponse;
import com.example.GraveYard_game_webApp.backend.summon.dto.SummonUpdateRequest;
import com.example.GraveYard_game_webApp.backend.summon.service.SummonServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/summons")
@RequiredArgsConstructor
public class SummonController {

    private final SummonServiceImpl summonService;

    // ------------------------------------------------------------
    // CREATE — iniciar ritual
    // ------------------------------------------------------------

    @PostMapping
    public ResponseEntity<SummonResponse> createSummon(
            @Valid @RequestBody SummonCreateRequest request,
            UriComponentsBuilder uriBuilder
    ) {
        SummonResponse response = summonService.createSummon(request);

        URI location = uriBuilder
                .path("/summons/{id}")
                .buildAndExpand(response.getId())
                .toUri();

        return ResponseEntity.created(location).body(response);
    }

    // ------------------------------------------------------------
    // READ — totes les tombes del cementiri
    // ------------------------------------------------------------

    @GetMapping
    public ResponseEntity<List<SummonResponse>> getAllSummons() {
        return ResponseEntity.ok(summonService.getAllSummons());
    }

    // ------------------------------------------------------------
    // READ — tomba concreta
    // ------------------------------------------------------------

    @GetMapping("/{id}")
    public ResponseEntity<SummonResponse> getSummonById(@PathVariable Long id) {
        return ResponseEntity.ok(summonService.getSummonById(id));
    }

    // ------------------------------------------------------------
    // UPDATE — actualitzar ritual
    // ------------------------------------------------------------

    @PutMapping("/{id}")
    public ResponseEntity<SummonResponse> updateSummon(
            @PathVariable Long id,
            @Valid @RequestBody SummonUpdateRequest request
    ) {
        return ResponseEntity.ok(summonService.updateSummon(id, request));
    }

    // ------------------------------------------------------------
    // DELETE — cancelar ritual
    // ------------------------------------------------------------

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSummon(@PathVariable Long id) {
        summonService.deleteSummon(id);
        return ResponseEntity.noContent().build();
    }

}
