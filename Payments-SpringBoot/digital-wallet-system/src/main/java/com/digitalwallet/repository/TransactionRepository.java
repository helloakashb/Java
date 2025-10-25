package com.digitalwallet.repository;

import com.digitalwallet.entity.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    // Get specific transaction details
    Optional<Transaction> findByTransactionId(String transactionId);
    // Get user's transaction history (sent + received)
    @Query("SELECT t FROM Transaction t WHERE t.fromWallet.user.id = :userId OR t.toWallet.user.id = :userId")
    Page<Transaction> findByUserId(@Param("userId") Long userId, Pageable pageable);
    // Get all transactions for a specific wallet
    @Query("SELECT t FROM Transaction t WHERE t.fromWallet.id = :walletId OR t.toWallet.id = :walletId")
    Page<Transaction> findByWalletId(@Param("walletId") Long walletId, Pageable pageable);
    
    // Get transaction history for a wallet (ordered by date)
    @Query("SELECT t FROM Transaction t WHERE t.fromWallet.id = :fromWalletId OR t.toWallet.id = :toWalletId ORDER BY t.createdAt DESC")
    java.util.List<Transaction> findByFromWalletIdOrToWalletIdOrderByCreatedAtDesc(@Param("fromWalletId") Long fromWalletId, @Param("toWalletId") Long toWalletId);
}