package com.digitalwallet.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "transaction_id", unique = true, nullable = false)
    private String transactionId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_wallet_id", nullable = false)
    private Wallet fromWallet;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_wallet_id", nullable = false)
    private Wallet toWallet;
    
    @Column(precision = 19, scale = 2, nullable = false)
    private BigDecimal amount;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_type")
    private TransactionType transactionType = TransactionType.TRANSFER;
    
    @Enumerated(EnumType.STRING)
    private TransactionStatus status = TransactionStatus.PENDING;
    
    @Column(length = 255)
    private String description;
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "completed_at")
    private LocalDateTime completedAt;
    
    public enum TransactionType {
        TRANSFER, DEPOSIT, WITHDRAWAL
    }
    
    public enum TransactionStatus {
        PENDING, COMPLETED, FAILED, CANCELLED
    }
}