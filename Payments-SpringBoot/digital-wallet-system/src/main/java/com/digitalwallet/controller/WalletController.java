package com.digitalwallet.controller;

import com.digitalwallet.entity.Wallet;
import com.digitalwallet.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wallets")
@RequiredArgsConstructor
public class WalletController {

    private final WalletService walletService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<Wallet> getUserWallet(@PathVariable Long userId) {
        Wallet wallet = walletService.getUserWallet(userId);
        return ResponseEntity.ok(wallet);
    }

    @GetMapping("/{walletId}")
    public ResponseEntity<Wallet> getWallet(@PathVariable Long walletId) {
        Wallet wallet = walletService.findById(walletId);
        return ResponseEntity.ok(wallet);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Wallet>> getAllWallets() {
        List<Wallet> wallets = walletService.findAll();
        return ResponseEntity.ok(wallets);
    }
}
