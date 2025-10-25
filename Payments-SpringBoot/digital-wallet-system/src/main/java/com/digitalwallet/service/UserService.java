package com.digitalwallet.service;

import com.digitalwallet.entity.User;
import com.digitalwallet.entity.Wallet;
import com.digitalwallet.repository.UserRepository;
import com.digitalwallet.repository.WalletRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    //create 
    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public User registerUser(User user) {
        // Check if email already exists
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Encode password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Save user first
        User savedUser = userRepository.save(user);

        // Create wallet after user is saved
        Wallet wallet = new Wallet();
        wallet.setUser(savedUser);
        wallet.setWalletNumber(UUID.randomUUID().toString());
        wallet.setBalance(java.math.BigDecimal.valueOf(1000)); // Initial balance
        wallet.setStatus(Wallet.WalletStatus.ACTIVE);
        walletRepository.save(wallet);

        return savedUser;
    }

    public Optional<User> loginUser(String email, String password) {
        Optional<User> user = userRepository.findByEmail(email);
        //if user is present and password is correct
        if (user.isPresent() && passwordEncoder.matches(password, user.get().getPassword())) {
            return user;
        }
        return Optional.empty();
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

}