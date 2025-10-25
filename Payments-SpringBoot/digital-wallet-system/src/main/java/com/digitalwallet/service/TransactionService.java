package com.digitalwallet.service;

import com.digitalwallet.entity.Transaction;
import com.digitalwallet.entity.Wallet;
import com.digitalwallet.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final WalletService walletService;

    @Transactional
    public Transaction transfer(Long senderWalletId, Long receiverWalletId, BigDecimal amount) {
        // Check for self-transfer
        if (senderWalletId.equals(receiverWalletId)) {
            throw new RuntimeException("Self-transfer is not allowed");
        }

        // Check if sender wallet exists
        Wallet senderWallet;
        try {
            senderWallet = walletService.findById(senderWalletId);
        } catch (RuntimeException e) {
            throw new RuntimeException("Sender wallet not found");
        }

        // Check if receiver wallet exists
        Wallet receiverWallet;
        try {
            receiverWallet = walletService.findById(receiverWalletId);
        } catch (RuntimeException e) {
            throw new RuntimeException("Receiver wallet not found");
        }

        // Validate sufficient funds
        if (senderWallet.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient balance. Available: $" + senderWallet.getBalance() + ", Required: $" + amount);
        }

        // Update balances
        senderWallet.setBalance(senderWallet.getBalance().subtract(amount));
        receiverWallet.setBalance(receiverWallet.getBalance().add(amount));

        walletService.save(senderWallet);
        walletService.save(receiverWallet);

        // Create transaction record
        Transaction transaction = new Transaction();
        transaction.setTransactionId(UUID.randomUUID().toString());
        transaction.setFromWallet(senderWallet);
        transaction.setToWallet(receiverWallet);
        transaction.setAmount(amount);
        transaction.setStatus(Transaction.TransactionStatus.COMPLETED);
        transaction.setCompletedAt(LocalDateTime.now());

        return transactionRepository.save(transaction);
    }

    public List<Transaction> getTransactionHistory(Long walletId) {
        return transactionRepository.findByFromWalletIdOrToWalletIdOrderByCreatedAtDesc(walletId, walletId);
    }
}
