package com.web_ban_hang_may_tinh.computershop.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    
    @NotBlank(message = "Tên tài khoản không được để trống")
    @Pattern(regexp = "^[a-zA-Z0-9]+$", message = "Tên tài khoản chỉ bao gồm chữ cái và số")
    @Size(min = 3, max = 50, message = "Tên tài khoản phải từ 3-50 ký tự")
    private String username;
    
    @NotBlank(message = "Họ tên không được để trống")
    @Size(max = 100, message = "Họ tên không quá 100 ký tự")
    private String fullName;
    
    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    @Size(max = 100, message = "Email không quá 100 ký tự")
    private String email;
    
    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min = 8, message = "Mật khẩu phải có ít nhất 8 ký tự")
    @Pattern(regexp = "^(?=.*[0-9])(?=.*[!@#$%^&*]).*$", 
             message = "Mật khẩu phải có ít nhất 1 số và 1 ký tự đặc biệt")
    private String password;
}

