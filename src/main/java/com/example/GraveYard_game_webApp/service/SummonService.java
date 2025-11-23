package com.example.GraveYard_game_webApp.service;

import com.example.GraveYard_game_webApp.model.Summon;
import com.example.GraveYard_game_webApp.model.User;
import com.example.GraveYard_game_webApp.repository.SummonRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SummonService {

    private final SummonRepository summonRepository;

    public SummonService(SummonRepository summonRepository) {
        this.summonRepository = summonRepository;
    }

    public List<Summon> findByOwner(User owner) {
        return summonRepository.findByOwner(owner);
    }

    public Summon createSummon(Summon summon, User owner) {
        if (summonRepository.existsByOwnerAndGraveIndex(owner, summon.getGraveIndex())) {
            throw new IllegalArgumentException("A ritual already exists in this grave");
        }
        summon.setOwner(owner);
        summon.setSoulEnergy(Math.max(0, summon.getSoulEnergy()));
        summon.setArcaneStability(Math.max(0, summon.getArcaneStability()));
        return summonRepository.save(summon);
    }

    public Summon updateEnergy(Long id, User owner, Integer soulDelta, Integer arcaneDelta) {
        Summon summon = summonRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Summon not found"));
        if (!summon.getOwner().getId().equals(owner.getId())) {
            throw new IllegalArgumentException("Not allowed");
        }
        if (soulDelta != null) {
            summon.setSoulEnergy(Math.max(0, summon.getSoulEnergy() + soulDelta));
        }
        if (arcaneDelta != null) {
            summon.setArcaneStability(Math.max(0, summon.getArcaneStability() + arcaneDelta));
        }
        return summonRepository.save(summon);
    }

    @Transactional
    public void deleteSummon(Long id, User owner) {
        Summon summon = summonRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Summon not found"));
        if (!summon.getOwner().getId().equals(owner.getId())) {
            throw new IllegalArgumentException("Not allowed");
        }
        summonRepository.delete(summon);
    }
}
