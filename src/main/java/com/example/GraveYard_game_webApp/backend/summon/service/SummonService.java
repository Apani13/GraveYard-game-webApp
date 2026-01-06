package com.example.GraveYard_game_webApp.backend.summon.service;

import com.example.GraveYard_game_webApp.backend.summon.dto.SummonCreateRequest;
import com.example.GraveYard_game_webApp.backend.summon.dto.SummonResponse;
import com.example.GraveYard_game_webApp.backend.summon.dto.SummonUpdateRequest;

import java.util.List;

public interface SummonService {

    SummonResponse createSummon(SummonCreateRequest request);

    List<SummonResponse> getAllSummons();

    SummonResponse getSummonById(Long id);

    SummonResponse updateSummon(Long id, SummonUpdateRequest request);

    void deleteSummon(Long id);


}
