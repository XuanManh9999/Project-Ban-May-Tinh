package com.web_ban_hang_may_tinh.computershop.service;

import com.web_ban_hang_may_tinh.computershop.dto.auth.AuthResponse;
import com.web_ban_hang_may_tinh.computershop.dto.auth.ForgotPasswordRequest;
import com.web_ban_hang_may_tinh.computershop.dto.auth.LoginRequest;
import com.web_ban_hang_may_tinh.computershop.dto.auth.RegisterRequest;
import com.web_ban_hang_may_tinh.computershop.dto.auth.ResetPasswordRequest;
import com.web_ban_hang_may_tinh.computershop.entity.Cart;
import com.web_ban_hang_may_tinh.computershop.entity.PasswordResetToken;
import com.web_ban_hang_may_tinh.computershop.entity.User;
import com.web_ban_hang_may_tinh.computershop.exception.BadRequestException;
import com.web_ban_hang_may_tinh.computershop.exception.ResourceNotFoundException;
import com.web_ban_hang_may_tinh.computershop.repository.CartRepository;
import com.web_ban_hang_may_tinh.computershop.repository.PasswordResetTokenRepository;
import com.web_ban_hang_may_tinh.computershop.repository.UserRepository;
import jakarta.mail.MessagingException;
import com.web_ban_hang_may_tinh.computershop.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final EmailService emailService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Validate username
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Tên tài khoản đã tồn tại");
        }

        // Validate email
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email đã được sử dụng");
        }

        // Capitalize full name
        String capitalizedFullName = capitalizeFullName(request.getFullName());

        // Create new user
        User user = new User();
        user.setUsername(request.getUsername());
        user.setFullName(capitalizedFullName);
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(User.Role.CUSTOMER);
        user.setEnabled(true);

        User savedUser = userRepository.save(user);

        // Create cart for user
        Cart cart = new Cart();
        cart.setUser(savedUser);
        cartRepository.save(cart);

        // Authenticate and generate token
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        String token = tokenProvider.generateToken(authentication);

        return new AuthResponse(
                token,
                savedUser.getId(),
                savedUser.getUsername(),
                savedUser.getFullName(),
                savedUser.getEmail(),
                savedUser.getRole().name()
        );
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        String token = tokenProvider.generateToken(authentication);

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BadRequestException("Không tìm thấy người dùng"));

        return new AuthResponse(
                token,
                user.getId(),
                user.getUsername(),
                user.getFullName(),
                user.getEmail(),
                user.getRole().name()
        );
    }

    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tài khoản với email này"));

        // Generate 6-digit reset code
        String resetCode = generateResetCode();

        // Create reset token
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setEmail(request.getEmail());
        resetToken.setResetCode(resetCode);
        resetToken.setExpiryDate(LocalDateTime.now().plusMinutes(15)); // Valid for 15 minutes
        resetToken.setUsed(false);
        resetToken.setCreatedAt(LocalDateTime.now());

        passwordResetTokenRepository.save(resetToken);

        try {
            emailService.sendPasswordResetOtp(request.getEmail(), resetCode);
        } catch (MessagingException e) {
            throw new BadRequestException("Không thể gửi email xác thực. Vui lòng kiểm tra lại địa chỉ email hoặc thử lại sau.");
        } catch (IllegalStateException e) {
            throw new BadRequestException(e.getMessage());
        }
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        // Find valid reset token
        PasswordResetToken resetToken = passwordResetTokenRepository
                .findByEmailAndResetCodeAndUsedFalseAndExpiryDateAfter(
                        request.getEmail(), 
                        request.getResetCode(), 
                        LocalDateTime.now())
                .orElseThrow(() -> new BadRequestException("Mã xác thực không hợp lệ hoặc đã hết hạn"));

        // Find user
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng"));

        // Update password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        // Mark token as used
        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);
    }

    private String generateResetCode() {
        Random random = new Random();
        return String.format("%06d", random.nextInt(1000000));
    }

    private String capitalizeFullName(String fullName) {
        return Arrays.stream(fullName.trim().split("\\s+"))
                .map(word -> word.substring(0, 1).toUpperCase() + word.substring(1).toLowerCase())
                .collect(Collectors.joining(" "));
    }
}

