package com.web_ban_hang_may_tinh.computershop.service;

import com.web_ban_hang_may_tinh.computershop.dto.common.PageResponse;
import com.web_ban_hang_may_tinh.computershop.dto.product.ProductRequest;
import com.web_ban_hang_may_tinh.computershop.dto.product.ProductResponse;
import com.web_ban_hang_may_tinh.computershop.dto.product.ProductSearchRequest;
import com.web_ban_hang_may_tinh.computershop.entity.Category;
import com.web_ban_hang_may_tinh.computershop.entity.Product;
import com.web_ban_hang_may_tinh.computershop.exception.ResourceNotFoundException;
import com.web_ban_hang_may_tinh.computershop.repository.CategoryRepository;
import com.web_ban_hang_may_tinh.computershop.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final SearchHistoryService searchHistoryService;

    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục"));

        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setCpu(request.getCpu());
        product.setRam(request.getRam());
        product.setStorage(request.getStorage());
        product.setGpu(request.getGpu());
        product.setScreenSize(request.getScreenSize());
        product.setColor(request.getColor());
        product.setPrice(request.getPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setImageUrl(request.getImageUrl());
        product.setCategory(category);
        product.setActive(request.getActive());

        Product savedProduct = productRepository.save(product);
        return mapToResponse(savedProduct);
    }

    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm"));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục"));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setCpu(request.getCpu());
        product.setRam(request.getRam());
        product.setStorage(request.getStorage());
        product.setGpu(request.getGpu());
        product.setScreenSize(request.getScreenSize());
        product.setColor(request.getColor());
        product.setPrice(request.getPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setImageUrl(request.getImageUrl());
        product.setCategory(category);
        product.setActive(request.getActive());

        Product updatedProduct = productRepository.save(product);
        return mapToResponse(updatedProduct);
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm"));
        productRepository.delete(product);
    }

    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm"));
        return mapToResponse(product);
    }

    public PageResponse<ProductResponse> getAllProducts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Product> productPage = productRepository.findByActiveTrue(pageable);
        return mapToPageResponse(productPage);
    }

    public PageResponse<ProductResponse> searchProducts(ProductSearchRequest request, Long userId) {
        Pageable pageable = PageRequest.of(request.getPage(), request.getSize(), 
                Sort.by("createdAt").descending());

        Page<Product> productPage;
        
        if (!StringUtils.hasText(request.getKeyword()) || request.getKeyword().trim().isEmpty()) {
            if (request.getCategoryId() != null) {
                productPage = productRepository.findByCategoryIdAndActiveTrue(request.getCategoryId(), pageable);
            } else {
                productPage = productRepository.findByActiveTrue(pageable);
            }
        } else {
            String keyword = request.getKeyword().trim();
            
            if (request.getCategoryId() != null) {
                productPage = productRepository.searchProductsByCategory(keyword, request.getCategoryId(), pageable);
            } else {
                productPage = productRepository.searchProducts(keyword, pageable);
            }
            
            // Save search history
            if (userId != null) {
                searchHistoryService.saveSearchHistory(userId, keyword, (int) productPage.getTotalElements());
            }
        }

        return mapToPageResponse(productPage);
    }

    public PageResponse<ProductResponse> getRelatedProducts(Long productId, int page, int size) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm"));
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Product> relatedProducts = productRepository.findRelatedProducts(
                product.getCategory().getId(), 
                productId, 
                pageable);
        
        return mapToPageResponse(relatedProducts);
    }

    private ProductResponse mapToResponse(Product product) {
        ProductResponse response = new ProductResponse();
        response.setId(product.getId());
        response.setName(product.getName());
        response.setDescription(product.getDescription());
        response.setCpu(product.getCpu());
        response.setRam(product.getRam());
        response.setStorage(product.getStorage());
        response.setGpu(product.getGpu());
        response.setScreenSize(product.getScreenSize());
        response.setColor(product.getColor());
        response.setPrice(product.getPrice());
        response.setStockQuantity(product.getStockQuantity());
        response.setImageUrl(product.getImageUrl());
        response.setCategoryId(product.getCategory().getId());
        response.setCategoryName(product.getCategory().getName());
        response.setActive(product.getActive());
        response.setCreatedAt(product.getCreatedAt());
        response.setUpdatedAt(product.getUpdatedAt());
        return response;
    }

    private PageResponse<ProductResponse> mapToPageResponse(Page<Product> productPage) {
        List<ProductResponse> content = productPage.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return new PageResponse<>(
                content,
                productPage.getNumber(),
                productPage.getSize(),
                productPage.getTotalElements(),
                productPage.getTotalPages(),
                productPage.isLast()
        );
    }
}

