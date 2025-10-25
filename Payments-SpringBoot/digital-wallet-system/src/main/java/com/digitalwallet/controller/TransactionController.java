package com.digitalwallet.controller;

import com.digitalwallet.dto.TransferRequest;
import com.digitalwallet.entity.Transaction;
import com.digitalwallet.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping("/transfer")
    public ResponseEntity<Transaction> transfer(@RequestBody TransferRequest request) {
        Transaction transaction = transactionService.transfer(
            request.getSenderWalletId(),
            request.getReceiverWalletId(),
            request.getAmount()
        );
        return ResponseEntity.ok(transaction);
    }

    @GetMapping("/wallet/{walletId}")
    public ResponseEntity<List<Transaction>> getTransactionHistory(@PathVariable Long walletId) {
        List<Transaction> transactions = transactionService.getTransactionHistory(walletId);
        return ResponseEntity.ok(transactions);
    }
}
