package com.web_ban_hang_may_tinh.computershop.dto.promotion;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PromotionRequest {
    
    @NotBlank(message = "Mã khuyến mãi không được để trống")
    @Pattern(regexp = "^[A-Z0-9]+$", message = "Mã khuyến mãi chỉ bao gồm chữ in hoa và số")
    @Size(max = 50, message = "Mã khuyến mãi không quá 50 ký tự")
    private String code;
    
    @NotBlank(message = "Tên khuyến mãi không được để trống")
    @Size(max = 255, message = "Tên khuyến mãi không quá 255 ký tự")
    private String name;
    
    @Size(max = 1000, message = "Mô tả không quá 1000 ký tự")
    private String description;
    
    @NotNull(message = "Loại giảm giá không được để trống")
    private String discountType; // PERCENTAGE, FIXED_AMOUNT
    
    @NotNull(message = "Giá trị giảm giá không được để trống")
    @DecimalMin(value = "0.0", inclusive = false, message = "Giá trị giảm giá phải lớn hơn 0")
    private BigDecimal discountValue;
    
    @DecimalMin(value = "0.0", message = "Giá trị đơn hàng tối thiểu không được âm")
    private BigDecimal minOrderAmount;
    
    @DecimalMin(value = "0.0", message = "Giá trị giảm tối đa không được âm")
    private BigDecimal maxDiscountAmount;
    
    @NotNull(message = "Ngày bắt đầu không được để trống")
    private LocalDateTime startDate;
    
    @NotNull(message = "Ngày kết thúc không được để trống")
    private LocalDateTime endDate;
    
    @Min(value = 0, message = "Giới hạn sử dụng không được âm")
    private Integer usageLimit = 0;
    
    private Boolean active = true;
}

