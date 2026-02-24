package com.web_ban_hang_may_tinh.computershop.service;

import com.web_ban_hang_may_tinh.computershop.dto.promotion.PromotionRequest;
import com.web_ban_hang_may_tinh.computershop.dto.promotion.PromotionResponse;
import com.web_ban_hang_may_tinh.computershop.entity.Promotion;
import com.web_ban_hang_may_tinh.computershop.exception.BadRequestException;
import com.web_ban_hang_may_tinh.computershop.exception.ResourceNotFoundException;
import com.web_ban_hang_may_tinh.computershop.repository.PromotionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PromotionService {

    private final PromotionRepository promotionRepository;

    @Transactional
    public PromotionResponse createPromotion(PromotionRequest request) {
        if (promotionRepository.existsByCode(request.getCode())) {
            throw new BadRequestException("Mã khuyến mãi đã tồn tại");
        }

        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new BadRequestException("Ngày kết thúc phải sau ngày bắt đầu");
        }

        Promotion promotion = new Promotion();
        promotion.setCode(request.getCode());
        promotion.setName(request.getName());
        promotion.setDescription(request.getDescription());
        promotion.setDiscountType(Promotion.DiscountType.valueOf(request.getDiscountType()));
        promotion.setDiscountValue(request.getDiscountValue());
        promotion.setMinOrderAmount(request.getMinOrderAmount());
        promotion.setMaxDiscountAmount(request.getMaxDiscountAmount());
        promotion.setStartDate(request.getStartDate());
        promotion.setEndDate(request.getEndDate());
        promotion.setUsageLimit(request.getUsageLimit());
        promotion.setActive(request.getActive());

        Promotion savedPromotion = promotionRepository.save(promotion);
        return mapToResponse(savedPromotion);
    }

    @Transactional
    public PromotionResponse updatePromotion(Long id, PromotionRequest request) {
        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy khuyến mãi"));

        // Check if code already exists for another promotion
        promotionRepository.findByCode(request.getCode()).ifPresent(existingPromotion -> {
            if (!existingPromotion.getId().equals(id)) {
                throw new BadRequestException("Mã khuyến mãi đã tồn tại");
            }
        });

        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new BadRequestException("Ngày kết thúc phải sau ngày bắt đầu");
        }

        promotion.setCode(request.getCode());
        promotion.setName(request.getName());
        promotion.setDescription(request.getDescription());
        promotion.setDiscountType(Promotion.DiscountType.valueOf(request.getDiscountType()));
        promotion.setDiscountValue(request.getDiscountValue());
        promotion.setMinOrderAmount(request.getMinOrderAmount());
        promotion.setMaxDiscountAmount(request.getMaxDiscountAmount());
        promotion.setStartDate(request.getStartDate());
        promotion.setEndDate(request.getEndDate());
        promotion.setUsageLimit(request.getUsageLimit());
        promotion.setActive(request.getActive());

        Promotion updatedPromotion = promotionRepository.save(promotion);
        return mapToResponse(updatedPromotion);
    }

    @Transactional
    public void deletePromotion(Long id) {
        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy khuyến mãi"));
        promotionRepository.delete(promotion);
    }

    public PromotionResponse getPromotionById(Long id) {
        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy khuyến mãi"));
        return mapToResponse(promotion);
    }

    public PromotionResponse getPromotionByCode(String code) {
        Promotion promotion = promotionRepository.findByCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy khuyến mãi"));
        return mapToResponse(promotion);
    }

    public List<PromotionResponse> getAllPromotions() {
        return promotionRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<PromotionResponse> getActivePromotions() {
        LocalDateTime now = LocalDateTime.now();
        return promotionRepository.findActivePromotions(now).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private PromotionResponse mapToResponse(Promotion promotion) {
        PromotionResponse response = new PromotionResponse();
        response.setId(promotion.getId());
        response.setCode(promotion.getCode());
        response.setName(promotion.getName());
        response.setDescription(promotion.getDescription());
        response.setDiscountType(promotion.getDiscountType().name());
        response.setDiscountValue(promotion.getDiscountValue());
        response.setMinOrderAmount(promotion.getMinOrderAmount());
        response.setMaxDiscountAmount(promotion.getMaxDiscountAmount());
        response.setStartDate(promotion.getStartDate());
        response.setEndDate(promotion.getEndDate());
        response.setUsageLimit(promotion.getUsageLimit());
        response.setUsedCount(promotion.getUsedCount());
        response.setActive(promotion.getActive());
        response.setCreatedAt(promotion.getCreatedAt());
        response.setUpdatedAt(promotion.getUpdatedAt());
        return response;
    }
}

