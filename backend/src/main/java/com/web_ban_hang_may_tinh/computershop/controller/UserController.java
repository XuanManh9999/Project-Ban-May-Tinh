package com.web_ban_hang_may_tinh.computershop.controller;

import com.web_ban_hang_may_tinh.computershop.dto.common.ApiResponse;
import com.web_ban_hang_may_tinh.computershop.dto.user.ChangePasswordRequest;
import com.web_ban_hang_may_tinh.computershop.dto.user.UpdateProfileRequest;
import com.web_ban_hang_may_tinh.computershop.dto.user.UserProfileResponse;
import com.web_ban_hang_may_tinh.computershop.security.UserPrincipal;
import com.web_ban_hang_may_tinh.computershop.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * Get current user profile
     * GET /api/user/profile
     */
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getProfile(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        UserProfileResponse profile = userService.getProfile(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Lấy thông tin người dùng thành công", profile));
    }

    /**
     * Update user profile
     * PUT /api/user/profile
     */
    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateProfile(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody UpdateProfileRequest request) {
        UserProfileResponse profile = userService.updateProfile(userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật thông tin thành công", profile));
    }

    /**
     * Change password
     * POST /api/user/change-password
     */
    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Đổi mật khẩu thành công"));
    }
}

