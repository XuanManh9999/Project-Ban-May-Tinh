package com.web_ban_hang_may_tinh.computershop.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    @Value("${app.mail.from-name:Computer Shop}")
    private String fromName;

    /**
     * Gửi email chứa mã OTP đặt lại mật khẩu.
     *
     * @param toEmail Email người nhận
     * @param otp     Mã OTP 6 chữ số
     */
    public void sendPasswordResetOtp(String toEmail, String otp) throws MessagingException {
        if (fromEmail == null || fromEmail.isBlank() || fromEmail.contains("your-email")) {
            log.warn("Mail chưa cấu hình (spring.mail.username / MAIL_USERNAME). Mã OTP (chỉ để dev): {}", otp);
            throw new IllegalStateException("Hệ thống chưa được cấu hình gửi email. Vui lòng liên hệ quản trị viên.");
        }

        String subject = "Mã xác thực đặt lại mật khẩu - Computer Shop";
        String htmlBody = buildOtpEmailHtml(otp);

        MimeMessage message = mailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true, StandardCharsets.UTF_8.name());
            helper.setFrom(fromEmail, fromName);
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
        } catch (UnsupportedEncodingException e) {
            throw new MessagingException("Lỗi encoding khi tạo email", e);
        }
        mailSender.send(message);
        log.info("Đã gửi email OTP đến {}", toEmail);
    }

    private String buildOtpEmailHtml(String otp) {
        return """
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
                <h2 style="color: #1e40af;">Computer Shop</h2>
                <p>Bạn đã yêu cầu đặt lại mật khẩu. Sử dụng mã xác thực bên dưới:</p>
                <div style="background: #f1f5f9; border-radius: 8px; padding: 16px; text-align: center; margin: 20px 0;">
                    <span style="font-size: 28px; font-weight: bold; letter-spacing: 6px;">%s</span>
                </div>
                <p style="color: #64748b; font-size: 14px;">Mã có hiệu lực trong 15 phút. Không chia sẻ mã này với bất kỳ ai.</p>
                <p style="color: #64748b; font-size: 12px;">Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này.</p>
            </div>
            """.formatted(otp);
    }
}
