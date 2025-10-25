package com.digitalwallet.repository;

import com.digitalwallet.entity.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WalletRepository extends JpaRepository<Wallet, Long> {
    // Get user's wallet after login
    Optional<Wallet> findByUserId(Long userId);

    // Find recipient wallet for money transfer
    Optional<Wallet> findByWalletNumber(String walletNumber);
   
    // Validate wallet number exists before transfer
    boolean existsByWalletNumber(String walletNumber);
}

