package com.digitalwallet.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class TransferRequest {
    private Long senderWalletId;
    private Long receiverWalletId;
    private BigDecimal amount;
}
