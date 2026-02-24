package com.web_ban_hang_may_tinh.computershop.repository;

import com.web_ban_hang_may_tinh.computershop.entity.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Long> {
    Optional<Promotion> findByCode(String code);
    boolean existsByCode(String code);
    
    @Query("SELECT p FROM Promotion p WHERE p.active = true AND " +
           "p.startDate <= :now AND p.endDate >= :now AND " +
           "(p.usageLimit = 0 OR p.usedCount < p.usageLimit)")
    List<Promotion> findActivePromotions(@Param("now") LocalDateTime now);
}

