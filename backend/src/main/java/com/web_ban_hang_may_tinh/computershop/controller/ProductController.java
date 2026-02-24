package com.web_ban_hang_may_tinh.computershop.controller;

import jakarta.validation.Valid;
import com.web_ban_hang_may_tinh.computershop.dto.common.ApiResponse;
import com.web_ban_hang_may_tinh.computershop.dto.common.PageResponse;
import com.web_ban_hang_may_tinh.computershop.dto.product.ProductRequest;
import com.web_ban_hang_may_tinh.computershop.dto.product.ProductResponse;
import com.web_ban_hang_may_tinh.computershop.dto.product.ProductSearchRequest;
import com.web_ban_hang_may_tinh.computershop.security.UserPrincipal;
import com.web_ban_hang_may_tinh.computershop.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ProductResponse>> createProduct(@Valid @RequestBody ProductRequest request) {
        ProductResponse response = productService.createProduct(request);
        return ResponseEntity.ok(ApiResponse.success("Tạo sản phẩm thành công", response));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request) {
        ProductResponse response = productService.updateProduct(id, request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật sản phẩm thành công", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa sản phẩm thành công", null));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> getProductById(@PathVariable Long id) {
        ProductResponse response = productService.getProductById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<ProductResponse>>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageResponse<ProductResponse> response = productService.getAllProducts(page, size);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PageResponse<ProductResponse>>> searchProducts(
            @Valid ProductSearchRequest request,
            Authentication authentication) {
        Long userId = null;
        if (authentication != null && authentication.isAuthenticated()) {
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            userId = userPrincipal.getId();
        }
        
        PageResponse<ProductResponse> response = productService.searchProducts(request, userId);
        
        if (response.getContent().isEmpty()) {
            return ResponseEntity.ok(ApiResponse.success(
                    "Không tìm thấy sản phẩm phù hợp với từ khóa: " + request.getKeyword(), 
                    response));
        }
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}/related")
    public ResponseEntity<ApiResponse<PageResponse<ProductResponse>>> getRelatedProducts(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size) {
        PageResponse<ProductResponse> response = productService.getRelatedProducts(id, page, size);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}

