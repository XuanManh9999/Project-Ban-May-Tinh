package com.web_ban_hang_may_tinh.computershop.controller;

import com.web_ban_hang_may_tinh.computershop.dto.common.ApiResponse;
import com.web_ban_hang_may_tinh.computershop.dto.common.PageResponse;
import com.web_ban_hang_may_tinh.computershop.dto.order.CreateOrderRequest;
import com.web_ban_hang_may_tinh.computershop.dto.order.OrderResponse;
import com.web_ban_hang_may_tinh.computershop.security.UserPrincipal;
import com.web_ban_hang_may_tinh.computershop.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(
            @Valid @RequestBody CreateOrderRequest request,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        OrderResponse response = orderService.createOrder(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Đặt hàng thành công", response));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(
            @PathVariable Long orderId,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        OrderResponse response = orderService.getOrderById(orderId, userId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/my-orders")
    public ResponseEntity<ApiResponse<PageResponse<OrderResponse>>> getMyOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        PageResponse<OrderResponse> response = orderService.getUserOrders(userId, page, size);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PageResponse<OrderResponse>>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageResponse<OrderResponse> response = orderService.getAllOrders(page, size);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PatchMapping("/{orderId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam String status) {
        OrderResponse response = orderService.updateOrderStatus(orderId, status);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật trạng thái đơn hàng thành công", response));
    }

    private Long getUserIdFromAuth(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        return userPrincipal.getId();
    }
}

