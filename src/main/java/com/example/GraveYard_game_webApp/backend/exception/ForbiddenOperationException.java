package com.example.GraveYard_game_webApp.backend.exception;

public class ForbiddenOperationException extends RuntimeException {
    public ForbiddenOperationException(String message){
        super(message);
    }
}
