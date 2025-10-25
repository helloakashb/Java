package com.digitalwallet.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
//receives login data
public class AuthRequest { //this class acts as a DTO for data transfer, for Data coming IN
    
    @Email(message = "Please provide a valid email")
    @NotBlank(message = "Email is required")
    private String email;
    
    @NotBlank(message = "Password is required")
    private String password;
}