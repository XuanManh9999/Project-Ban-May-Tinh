package com.web_ban_hang_may_tinh.computershop.controller;

import com.web_ban_hang_may_tinh.computershop.dto.common.ApiResponse;
import com.web_ban_hang_may_tinh.computershop.dto.promotion.PromotionRequest;
import com.web_ban_hang_may_tinh.computershop.dto.promotion.PromotionResponse;
import com.web_ban_hang_may_tinh.computershop.service.PromotionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/promotions")
@RequiredArgsConstructor
public class PromotionController {

    private final PromotionService promotionService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PromotionResponse>> createPromotion(@Valid @RequestBody PromotionRequest request) {
        PromotionResponse response = promotionService.createPromotion(request);
        return ResponseEntity.ok(ApiResponse.success("Tạo khuyến mãi thành công", response));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PromotionResponse>> updatePromotion(
            @PathVariable Long id,
            @Valid @RequestBody PromotionRequest request) {
        PromotionResponse response = promotionService.updatePromotion(id, request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật khuyến mãi thành công", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deletePromotion(@PathVariable Long id) {
        promotionService.deletePromotion(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa khuyến mãi thành công", null));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PromotionResponse>> getPromotionById(@PathVariable Long id) {
        PromotionResponse response = promotionService.getPromotionById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<ApiResponse<PromotionResponse>> getPromotionByCode(@PathVariable String code) {
        PromotionResponse response = promotionService.getPromotionByCode(code);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<PromotionResponse>>> getAllPromotions() {
        List<PromotionResponse> response = promotionService.getAllPromotions();
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<PromotionResponse>>> getActivePromotions() {
        List<PromotionResponse> response = promotionService.getActivePromotions();
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}

