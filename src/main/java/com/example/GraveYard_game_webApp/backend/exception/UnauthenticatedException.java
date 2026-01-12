package com.example.GraveYard_game_webApp.backend.exception;

public class UnauthenticatedException extends RuntimeException{
    public UnauthenticatedException() {
        super("User is not authenticated.");
    }

}
