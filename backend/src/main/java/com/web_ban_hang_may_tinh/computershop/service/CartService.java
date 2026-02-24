package com.web_ban_hang_may_tinh.computershop.service;

import com.web_ban_hang_may_tinh.computershop.dto.cart.AddToCartRequest;
import com.web_ban_hang_may_tinh.computershop.dto.cart.CartItemResponse;
import com.web_ban_hang_may_tinh.computershop.dto.cart.CartResponse;
import com.web_ban_hang_may_tinh.computershop.dto.cart.UpdateCartItemRequest;
import com.web_ban_hang_may_tinh.computershop.dto.cart.*;
import com.web_ban_hang_may_tinh.computershop.entity.Cart;
import com.web_ban_hang_may_tinh.computershop.entity.CartItem;
import com.web_ban_hang_may_tinh.computershop.entity.Product;
import com.web_ban_hang_may_tinh.computershop.exception.BadRequestException;
import com.web_ban_hang_may_tinh.computershop.exception.ResourceNotFoundException;
import com.web_ban_hang_may_tinh.computershop.repository.CartItemRepository;
import com.web_ban_hang_may_tinh.computershop.repository.CartRepository;
import com.web_ban_hang_may_tinh.computershop.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    @Transactional
    public CartResponse addToCart(Long userId, AddToCartRequest request) {
        Cart cart = getOrCreateCart(userId);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm"));

        // Check if product is available
        if (!product.getActive()) {
            throw new BadRequestException("Sản phẩm này hiện đã hết hàng");
        }

        // Check stock
        if (product.getStockQuantity() < request.getQuantity()) {
            throw new BadRequestException("Số lượng vượt quá tồn kho");
        }

        // Check if item already exists in cart
        CartItem cartItem = cartItemRepository.findByCartIdAndProductId(cart.getId(), product.getId())
                .orElse(null);

        if (cartItem != null) {
            int newQuantity = cartItem.getQuantity() + request.getQuantity();
            if (newQuantity > product.getStockQuantity()) {
                throw new BadRequestException("Số lượng vượt quá tồn kho");
            }
            cartItem.setQuantity(newQuantity);
        } else {
            cartItem = new CartItem();
            cartItem.setCart(cart);
            cartItem.setProduct(product);
            cartItem.setQuantity(request.getQuantity());
        }

        cartItemRepository.save(cartItem);
        return getCartResponse(userId);
    }

    @Transactional
    public CartResponse updateCartItem(Long userId, Long itemId, UpdateCartItemRequest request) {
        Cart cart = getOrCreateCart(userId);
        CartItem cartItem = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm trong giỏ hàng"));

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Không có quyền truy cập");
        }

        Product product = cartItem.getProduct();
        if (request.getQuantity() > product.getStockQuantity()) {
            throw new BadRequestException("Số lượng vượt quá tồn kho");
        }

        cartItem.setQuantity(request.getQuantity());
        cartItemRepository.save(cartItem);

        return getCartResponse(userId);
    }

    @Transactional
    public CartResponse removeFromCart(Long userId, Long itemId) {
        Cart cart = getOrCreateCart(userId);
        CartItem cartItem = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm trong giỏ hàng"));

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Không có quyền truy cập");
        }

        cartItemRepository.delete(cartItem);
        cartItemRepository.flush(); // Force the deletion to be executed
        cartRepository.flush(); // Flush cart changes
        
        // Refresh the cart to get updated items
        return getCartResponse(userId);
    }

    @Transactional
    public void clearCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        cartItemRepository.deleteByCartId(cart.getId());
        cartItemRepository.flush();
    }

    @Transactional(readOnly = true)
    public CartResponse getCart(Long userId) {
        return getCartResponse(userId);
    }

    private Cart getOrCreateCart(Long userId) {
        return cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy giỏ hàng"));
    }

    @Transactional(readOnly = true)
    private CartResponse getCartResponse(Long userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy giỏ hàng"));
        
        // Get fresh cart items from database
        List<CartItem> cartItems = cartItemRepository.findByCartId(cart.getId());
        
        List<CartItemResponse> items = cartItems.stream()
                .map(this::mapToCartItemResponse)
                .collect(Collectors.toList());

        BigDecimal totalAmount = items.stream()
                .map(CartItemResponse::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Count total number of items (sum of all quantities)
        int totalItems = items.stream()
                .mapToInt(CartItemResponse::getQuantity)
                .sum();

        CartResponse response = new CartResponse();
        response.setId(cart.getId());
        response.setItems(items);
        response.setTotalAmount(totalAmount);
        response.setTotalItems(totalItems);

        return response;
    }

    private CartItemResponse mapToCartItemResponse(CartItem cartItem) {
        Product product = cartItem.getProduct();
        BigDecimal subtotal = product.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity()));

        CartItemResponse response = new CartItemResponse();
        response.setId(cartItem.getId());
        response.setProductId(product.getId());
        response.setProductName(product.getName());
        response.setProductImage(product.getImageUrl());
        response.setPrice(product.getPrice());
        response.setQuantity(cartItem.getQuantity());
        response.setStockQuantity(product.getStockQuantity());
        response.setSubtotal(subtotal);

        return response;
    }
}

