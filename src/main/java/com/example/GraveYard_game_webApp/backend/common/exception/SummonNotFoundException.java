package com.example.GraveYard_game_webApp.backend.common.exception;

public class SummonNotFoundException extends RuntimeException {
    public SummonNotFoundException(Long id) {
        super("Summon with id" + id + "Not found.");
    }
}
