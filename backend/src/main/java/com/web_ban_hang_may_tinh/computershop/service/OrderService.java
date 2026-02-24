package com.web_ban_hang_may_tinh.computershop.service;

import com.web_ban_hang_may_tinh.computershop.dto.common.PageResponse;
import com.web_ban_hang_may_tinh.computershop.dto.order.CreateOrderRequest;
import com.web_ban_hang_may_tinh.computershop.dto.order.OrderItemResponse;
import com.web_ban_hang_may_tinh.computershop.dto.order.OrderResponse;
import com.web_ban_hang_may_tinh.computershop.entity.*;
import com.web_ban_hang_may_tinh.computershop.repository.*;
import com.web_ban_hang_may_tinh.computershop.entity.*;
import com.web_ban_hang_may_tinh.computershop.exception.BadRequestException;
import com.web_ban_hang_may_tinh.computershop.exception.ResourceNotFoundException;
import com.web_ban_hang_may_tinh.computershop.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final PromotionRepository promotionRepository;

    @Transactional
    public OrderResponse createOrder(Long userId, CreateOrderRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng"));

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy giỏ hàng"));

        if (cart.getCartItems().isEmpty()) {
            throw new BadRequestException("Giỏ hàng trống");
        }

        // Calculate total
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (CartItem item : cart.getCartItems()) {
            Product product = item.getProduct();
            if (!product.getActive()) {
                throw new BadRequestException("Sản phẩm " + product.getName() + " không còn bán");
            }
            if (product.getStockQuantity() < item.getQuantity()) {
                throw new BadRequestException("Sản phẩm " + product.getName() + " không đủ số lượng");
            }
            totalAmount = totalAmount.add(product.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
        }

        // Apply promotion if exists
        BigDecimal discountAmount = BigDecimal.ZERO;
        Promotion promotion = null;
        if (StringUtils.hasText(request.getPromotionCode())) {
            promotion = promotionRepository.findByCode(request.getPromotionCode())
                    .orElseThrow(() -> new BadRequestException("Mã khuyến mãi không tồn tại"));

            if (!promotion.getActive()) {
                throw new BadRequestException("Mã khuyến mãi đã hết hiệu lực");
            }

            LocalDateTime now = LocalDateTime.now();
            if (now.isBefore(promotion.getStartDate()) || now.isAfter(promotion.getEndDate())) {
                throw new BadRequestException("Mã khuyến mãi đã hết hạn");
            }

            if (promotion.getUsageLimit() > 0 && promotion.getUsedCount() >= promotion.getUsageLimit()) {
                throw new BadRequestException("Mã khuyến mãi đã hết lượt sử dụng");
            }

            if (promotion.getMinOrderAmount() != null && totalAmount.compareTo(promotion.getMinOrderAmount()) < 0) {
                throw new BadRequestException("Đơn hàng chưa đạt giá trị tối thiểu để sử dụng mã khuyến mãi");
            }

            if (promotion.getDiscountType() == Promotion.DiscountType.PERCENTAGE) {
                discountAmount = totalAmount.multiply(promotion.getDiscountValue()).divide(BigDecimal.valueOf(100));
            } else {
                discountAmount = promotion.getDiscountValue();
            }

            if (promotion.getMaxDiscountAmount() != null && 
                discountAmount.compareTo(promotion.getMaxDiscountAmount()) > 0) {
                discountAmount = promotion.getMaxDiscountAmount();
            }
        }

        BigDecimal finalAmount = totalAmount.subtract(discountAmount);

        // Create order
        Order order = new Order();
        order.setOrderNumber(generateOrderNumber());
        order.setUser(user);
        order.setTotalAmount(totalAmount);
        order.setDiscountAmount(discountAmount);
        order.setFinalAmount(finalAmount);
        order.setStatus(Order.OrderStatus.PENDING);
        order.setPaymentMethod(Order.PaymentMethod.valueOf(request.getPaymentMethod()));
        order.setPaymentStatus(Order.PaymentStatus.UNPAID);
        order.setShippingAddress(request.getShippingAddress());
        order.setPhoneNumber(request.getPhoneNumber());
        order.setNote(request.getNote());
        order.setPromotion(promotion);

        Order savedOrder = orderRepository.save(order);

        // Create order items and update stock
        for (CartItem cartItem : cart.getCartItems()) {
            Product product = cartItem.getProduct();
            
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setProduct(product);
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(product.getPrice());
            orderItem.setSubtotal(product.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
            
            orderItemRepository.save(orderItem);

            // Update stock
            product.setStockQuantity(product.getStockQuantity() - cartItem.getQuantity());
        }

        // Update promotion usage
        if (promotion != null) {
            promotion.setUsedCount(promotion.getUsedCount() + 1);
            promotionRepository.save(promotion);
        }

        // Clear cart
        cartItemRepository.deleteByCartId(cart.getId());

        return mapToResponse(savedOrder);
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng"));

        order.setStatus(Order.OrderStatus.valueOf(status));
        Order updatedOrder = orderRepository.save(order);

        return mapToResponse(updatedOrder);
    }

    public OrderResponse getOrderById(Long orderId, Long userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng"));

        if (!order.getUser().getId().equals(userId)) {
            throw new BadRequestException("Không có quyền truy cập");
        }

        return mapToResponse(order);
    }

    public PageResponse<OrderResponse> getUserOrders(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Order> orderPage = orderRepository.findByUserId(userId, pageable);
        return mapToPageResponse(orderPage);
    }

    public PageResponse<OrderResponse> getAllOrders(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Order> orderPage = orderRepository.findAll(pageable);
        return mapToPageResponse(orderPage);
    }

    private String generateOrderNumber() {
        return "ORD-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private OrderResponse mapToResponse(Order order) {
        List<OrderItemResponse> items = order.getOrderItems().stream()
                .map(this::mapToOrderItemResponse)
                .collect(Collectors.toList());

        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setOrderNumber(order.getOrderNumber());
        response.setUserId(order.getUser().getId());
        response.setUserName(order.getUser().getFullName());
        response.setItems(items);
        response.setTotalAmount(order.getTotalAmount());
        response.setDiscountAmount(order.getDiscountAmount());
        response.setFinalAmount(order.getFinalAmount());
        response.setStatus(order.getStatus().name());
        response.setPaymentMethod(order.getPaymentMethod().name());
        response.setPaymentStatus(order.getPaymentStatus().name());
        response.setShippingAddress(order.getShippingAddress());
        response.setPhoneNumber(order.getPhoneNumber());
        response.setNote(order.getNote());
        response.setPromotionCode(order.getPromotion() != null ? order.getPromotion().getCode() : null);
        response.setCreatedAt(order.getCreatedAt());
        response.setUpdatedAt(order.getUpdatedAt());

        return response;
    }

    private OrderItemResponse mapToOrderItemResponse(OrderItem item) {
        OrderItemResponse response = new OrderItemResponse();
        response.setId(item.getId());
        response.setProductId(item.getProduct().getId());
        response.setProductName(item.getProduct().getName());
        response.setProductImage(item.getProduct().getImageUrl());
        response.setQuantity(item.getQuantity());
        response.setPrice(item.getPrice());
        response.setSubtotal(item.getSubtotal());
        return response;
    }

    private PageResponse<OrderResponse> mapToPageResponse(Page<Order> orderPage) {
        List<OrderResponse> content = orderPage.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return new PageResponse<>(
                content,
                orderPage.getNumber(),
                orderPage.getSize(),
                orderPage.getTotalElements(),
                orderPage.getTotalPages(),
                orderPage.isLast()
        );
    }
}

