package com.digitalwallet.repository;

import com.digitalwallet.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Login: Find user by email address
    Optional<User> findByEmail(String email);

    // Registration: Check if email already taken
    boolean existsByEmail(String email);
    
    // Registration: Check if phone already used
    boolean existsByPhoneNumber(String phoneNumber);
}
