package com.web_ban_hang_may_tinh.computershop.repository;

import com.web_ban_hang_may_tinh.computershop.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    Page<Product> findByActiveTrue(Pageable pageable);
    
    Page<Product> findByCategoryIdAndActiveTrue(Long categoryId, Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.active = true AND " +
           "(LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Product> searchProducts(@Param("keyword") String keyword, Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.active = true AND p.category.id = :categoryId AND " +
           "(LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Product> searchProductsByCategory(@Param("keyword") String keyword, 
                                           @Param("categoryId") Long categoryId, 
                                           Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.active = true AND p.category.id = :categoryId AND p.id <> :excludeId")
    Page<Product> findRelatedProducts(@Param("categoryId") Long categoryId, 
                                      @Param("excludeId") Long excludeId, 
                                      Pageable pageable);
}

