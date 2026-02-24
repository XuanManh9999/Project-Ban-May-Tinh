package com.web_ban_hang_may_tinh.computershop.controller;

import com.web_ban_hang_may_tinh.computershop.dto.cart.AddToCartRequest;
import com.web_ban_hang_may_tinh.computershop.dto.cart.CartResponse;
import com.web_ban_hang_may_tinh.computershop.dto.cart.UpdateCartItemRequest;
import com.web_ban_hang_may_tinh.computershop.dto.common.ApiResponse;
import com.web_ban_hang_may_tinh.computershop.security.UserPrincipal;
import com.web_ban_hang_may_tinh.computershop.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<ApiResponse<CartResponse>> getCart(Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        CartResponse response = cartService.getCart(userId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<CartResponse>> addToCart(
            @Valid @RequestBody AddToCartRequest request,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        CartResponse response = cartService.addToCart(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Sản phẩm đã được thêm vào giỏ hàng", response));
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<ApiResponse<CartResponse>> updateCartItem(
            @PathVariable Long itemId,
            @Valid @RequestBody UpdateCartItemRequest request,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        CartResponse response = cartService.updateCartItem(userId, itemId, request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật giỏ hàng thành công", response));
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<ApiResponse<CartResponse>> removeFromCart(
            @PathVariable Long itemId,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        CartResponse response = cartService.removeFromCart(userId, itemId);
        return ResponseEntity.ok(ApiResponse.success("Đã xóa sản phẩm khỏi giỏ hàng", response));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<ApiResponse<Void>> clearCart(Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        cartService.clearCart(userId);
        return ResponseEntity.ok(ApiResponse.success("Đã xóa tất cả sản phẩm trong giỏ hàng", null));
    }

    private Long getUserIdFromAuth(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        return userPrincipal.getId();
    }
}

