package com.web_ban_hang_may_tinh.computershop.payment;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
@Getter
public class VNPayConfig {
    
    @Value("${vnpay.tmn-code}")
    private String tmnCode;
    
    @Value("${vnpay.hash-secret}")
    private String hashSecret;
    
    @Value("${vnpay.url}")
    private String vnpUrl;
    
    @Value("${vnpay.return-url}")
    private String returnUrl;
    
    public static final String VERSION = "2.1.0";
    public static final String COMMAND = "pay";
    public static final String ORDER_TYPE = "other";
}

