package com.example.GraveYard_game_webApp.backend.summon.service;

import com.example.GraveYard_game_webApp.backend.common.exception.SummonNotFoundException;
import com.example.GraveYard_game_webApp.backend.common.security.CurrentUserService;
import com.example.GraveYard_game_webApp.backend.summon.dto.SummonCreateRequest;
import com.example.GraveYard_game_webApp.backend.summon.dto.SummonResponse;
import com.example.GraveYard_game_webApp.backend.summon.dto.SummonUpdateRequest;
import com.example.GraveYard_game_webApp.backend.summon.model.Summon;
import com.example.GraveYard_game_webApp.backend.summon.repository.SummonRepository;
import com.example.GraveYard_game_webApp.backend.user.User;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SummonServiceImpl implements SummonService {


    private final SummonRepository summonRepository;
    private final CurrentUserService currentUserService;


    private Summon findSummonForCurrentUserOrThrow(Long id) {
        if (currentUserService.isCurrentUserAdmin()) {
            return summonRepository.findById(id)
                    .orElseThrow(() -> new SummonNotFoundException(id));
        }

        String username = currentUserService.getCurrentUsername();
        return summonRepository.findByIdAndOwner_Username(id, username)
                .orElseThrow(() -> new SummonNotFoundException(id));
    }


    @Transactional
    public SummonResponse createSummon(SummonCreateRequest request) {
        User owner = currentUserService.getCurrentUser();

        Summon summon = toEntity(request);
        summon.setOwner(owner);

        if (summon.getSoulEnergy() == null) summon.setSoulEnergy(0);
        if (summon.getArcaneStability() == null) summon.setArcaneStability(0);
        if (summon.getGraveIndex() == null) summon.setGraveIndex(0);
        if (summon.getEpitaph() == null) summon.setEpitaph("A mysterious silence surrounds the grave...");

        Summon saved = summonRepository.save(summon);
        return toResponse(saved);
    }


    @Transactional(readOnly = true)
    public List<SummonResponse> getAllSummons() {
        if (currentUserService.isCurrentUserAdmin()) {
            return summonRepository.findAll().stream().map(this::toResponse).toList();
        }

        String username = currentUserService.getCurrentUsername();
        return summonRepository.findByOwner_Username(username)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public SummonResponse getSummonById(Long id) {
        Summon summon = findSummonForCurrentUserOrThrow(id);
        return toResponse(summon);
    }


    @Transactional
    public SummonResponse updateSummon(Long id, SummonUpdateRequest request) {
        Summon summon = findSummonForCurrentUserOrThrow(id);

        // Nom i tipus de criatura
        if (request.getName() != null) summon.setName(request.getName());
        if (request.getCreatureType() != null) summon.setCreatureType(request.getCreatureType());

        // Energies del ritual
        if (request.getSoulEnergy() != null) summon.setSoulEnergy(request.getSoulEnergy());
        if (request.getArcaneStability() != null) summon.setArcaneStability(request.getArcaneStability());

        // Tomba
        if (request.getGraveIndex() != null) summon.setGraveIndex(request.getGraveIndex());

        // Epitafi
        if (request.getEpitaph() != null) summon.setEpitaph(request.getEpitaph());

        Summon updated = summonRepository.save(summon);
        return toResponse(updated);
    }

    @Transactional
    public void deleteSummon(Long id) {
        Summon summon = findSummonForCurrentUserOrThrow(id);
        summonRepository.delete(summon);
    }

    // ------------------------------------------------------------
    // MAPPERS
    // ------------------------------------------------------------

    private Summon toEntity(SummonCreateRequest request) {
        return Summon.builder()
                .creatureType(request.getCreatureType())
                .name(request.getName())
                .soulEnergy(request.getSoulEnergy())
                .arcaneStability(request.getArcaneStability())
                .graveIndex(request.getGraveIndex())
                .epitaph(request.getEpitaph())
                .build();
    }

    private SummonResponse toResponse(Summon summon) {
        return SummonResponse.builder()
                .id(summon.getId())
                .creatureType(summon.getCreatureType())
                .name(summon.getName())
                .soulEnergy(summon.getSoulEnergy())
                .arcaneStability(summon.getArcaneStability())
                .graveIndex(summon.getGraveIndex())
                .epitaph(summon.getEpitaph())
                .ownerUsername(
                        summon.getOwner() != null ? summon.getOwner().getUsername() : null
                )
                .build();
    }

}
