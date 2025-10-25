package com.digitalwallet.service;

import com.digitalwallet.entity.Wallet;
import com.digitalwallet.repository.WalletRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class WalletService {
    
    private final WalletRepository walletRepository;
    
    public Optional<Wallet> findByUserId(Long userId) {
        return walletRepository.findByUserId(userId);
    }
    
    public Optional<Wallet> findByWalletNumber(String walletNumber) {
        return walletRepository.findByWalletNumber(walletNumber);
    }
    //Optional class helps to prevent code breaks when wallet does not exist
    public Wallet getUserWallet(Long userId) {
        return walletRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Wallet not found for user"));
    }

    public Wallet findById(Long walletId) {
        return walletRepository.findById(walletId)
            .orElseThrow(() -> new RuntimeException("Wallet not found"));
    }

    public List<Wallet> findAll() {
        return walletRepository.findAll();
    }

    public Wallet save(Wallet wallet) {
        return walletRepository.save(wallet);
    }
}
