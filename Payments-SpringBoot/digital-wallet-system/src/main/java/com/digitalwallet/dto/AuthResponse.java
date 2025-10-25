package com.digitalwallet.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
//Returns JWT token + safe user info (no password!)
public class AuthResponse { //this class serves as a DTO for the data transfer for Data going OUT
    
    private String token;
    private String tokenType = "Bearer";
    private UserInfo user;
    
    @Data
    @AllArgsConstructor
    public static class UserInfo {
        private Long id;
        private String email;
        private String firstName;
        private String lastName;
    }
    
    public AuthResponse(String token, UserInfo user) {
        this.token = token;
        this.user = user;
    }
}