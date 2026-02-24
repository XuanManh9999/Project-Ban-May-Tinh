package com.web_ban_hang_may_tinh.computershop.repository;

import com.web_ban_hang_may_tinh.computershop.entity.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByEmailAndResetCodeAndUsedFalseAndExpiryDateAfter(
            String email, String resetCode, LocalDateTime now);
    
    void deleteByExpiryDateBefore(LocalDateTime now);
}

