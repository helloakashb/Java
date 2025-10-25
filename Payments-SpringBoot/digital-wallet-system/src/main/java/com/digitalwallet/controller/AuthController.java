package com.digitalwallet.controller;

import com.digitalwallet.dto.AuthRequest;
import com.digitalwallet.dto.AuthResponse;
import com.digitalwallet.dto.RegisterRequest;
import com.digitalwallet.entity.User;
import com.digitalwallet.security.JwtUtil;
import com.digitalwallet.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController{

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest registerRequest){
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(registerRequest.getPassword());
        user.setFirstName(registerRequest.getUsername());
        user.setLastName("User"); // Default last name
        
        userService.registerUser(user);
        return ResponseEntity.ok("User registered successfully");
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest authRequest){
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword())
        );
        String token = jwtUtil.generateToken(authRequest.getEmail());

        // Get user from database instead of casting
        User user = userService.findByEmail(authRequest.getEmail())
            .orElseThrow(() -> new RuntimeException("User not found"));

        AuthResponse.UserInfo userInfo = new AuthResponse.UserInfo(user.getId(), user.getEmail(), user.getFirstName(), user.getLastName());
        return ResponseEntity.ok(new AuthResponse(token, userInfo));
    }

    @GetMapping("/test")
    public String test() {
        return "Auth endpoints are working!";
    }
}