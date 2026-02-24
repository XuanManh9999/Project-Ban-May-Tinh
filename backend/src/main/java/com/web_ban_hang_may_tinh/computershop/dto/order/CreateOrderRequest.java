package com.web_ban_hang_may_tinh.computershop.dto.order;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequest {
    
    @NotBlank(message = "Địa chỉ giao hàng không được để trống")
    @Size(max = 500, message = "Địa chỉ không quá 500 ký tự")
    private String shippingAddress;
    
    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(regexp = "^[0-9]{10,11}$", message = "Số điện thoại không hợp lệ")
    private String phoneNumber;
    
    @Size(max = 1000, message = "Ghi chú không quá 1000 ký tự")
    private String note;
    
    @NotNull(message = "Phương thức thanh toán không được để trống")
    private String paymentMethod; // COD, VNPAY, BANK_TRANSFER
    
    private String promotionCode;
}

