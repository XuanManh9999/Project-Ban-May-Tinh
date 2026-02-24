package com.web_ban_hang_may_tinh.computershop.dto.product;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductRequest {
    
    @NotBlank(message = "Tên sản phẩm không được để trống")
    @Size(max = 255, message = "Tên sản phẩm không quá 255 ký tự")
    private String name;
    
    @Size(max = 2000, message = "Mô tả không quá 2000 ký tự")
    private String description;

    // Thông số cấu hình (tùy chọn)
    @Size(max = 255, message = "CPU không quá 255 ký tự")
    private String cpu;

    @Size(max = 255, message = "RAM không quá 255 ký tự")
    private String ram;

    @Size(max = 255, message = "Ổ cứng không quá 255 ký tự")
    private String storage;

    @Size(max = 255, message = "GPU không quá 255 ký tự")
    private String gpu;

    @Size(max = 255, message = "Kích thước màn hình không quá 255 ký tự")
    private String screenSize;

    @Size(max = 255, message = "Màu sắc không quá 255 ký tự")
    private String color;
    
    @NotNull(message = "Giá không được để trống")
    @DecimalMin(value = "0.0", inclusive = false, message = "Giá phải lớn hơn 0")
    private BigDecimal price;
    
    @NotNull(message = "Số lượng tồn kho không được để trống")
    @Min(value = 0, message = "Số lượng tồn kho không được âm")
    private Integer stockQuantity;
    
    private String imageUrl;
    
    @NotNull(message = "Danh mục không được để trống")
    private Long categoryId;
    
    private Boolean active = true;
}

