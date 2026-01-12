package com.example.GraveYard_game_webApp.backend.common.exception;

public class ForbiddenOperationException extends RuntimeException {
    public ForbiddenOperationException(String message){
        super(message);
    }
}
