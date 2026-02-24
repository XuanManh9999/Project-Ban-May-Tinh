package com.web_ban_hang_may_tinh.computershop.dto.order;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private Long id;
    private String orderNumber;
    private Long userId;
    private String userName;
    private List<OrderItemResponse> items;
    private BigDecimal totalAmount;
    private BigDecimal discountAmount;
    private BigDecimal finalAmount;
    private String status;
    private String paymentMethod;
    private String paymentStatus;
    private String shippingAddress;
    private String phoneNumber;
    private String note;
    private String promotionCode;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

