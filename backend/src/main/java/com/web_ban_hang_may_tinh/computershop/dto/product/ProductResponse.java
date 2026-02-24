package com.web_ban_hang_may_tinh.computershop.dto.product;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {
    private Long id;
    private String name;
    private String description;

    // Thông số cấu hình
    private String cpu;
    private String ram;
    private String storage;
    private String gpu;
    private String screenSize;
    private String color;

    private BigDecimal price;
    private Integer stockQuantity;
    private String imageUrl;
    private Long categoryId;
    private String categoryName;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

