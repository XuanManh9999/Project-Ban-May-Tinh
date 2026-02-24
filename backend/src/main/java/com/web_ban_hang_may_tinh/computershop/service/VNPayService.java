package com.web_ban_hang_may_tinh.computershop.service;

import com.web_ban_hang_may_tinh.computershop.entity.Order;
import com.web_ban_hang_may_tinh.computershop.exception.ResourceNotFoundException;
import com.web_ban_hang_may_tinh.computershop.payment.VNPayConfig;
import com.web_ban_hang_may_tinh.computershop.payment.VNPayUtil;
import com.web_ban_hang_may_tinh.computershop.repository.OrderRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.UnsupportedEncodingException;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class VNPayService {

    private final VNPayConfig vnPayConfig;
    private final OrderRepository orderRepository;

    public String createPaymentUrl(Long orderId, HttpServletRequest request) throws UnsupportedEncodingException {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng"));

        String vnp_Version = VNPayConfig.VERSION;
        String vnp_Command = VNPayConfig.COMMAND;
        String vnp_TmnCode = vnPayConfig.getTmnCode();
        String vnp_Amount = String.valueOf(order.getFinalAmount().multiply(java.math.BigDecimal.valueOf(100)).longValue());
        String vnp_CurrCode = "VND";
        String vnp_TxnRef = order.getOrderNumber();
        // Use underscore instead of space (similar to Node.js code)
        String vnp_OrderInfo = "Thanh_toan_don_hang_" + order.getOrderNumber().replace("-", "_");
        String vnp_OrderType = VNPayConfig.ORDER_TYPE;
        String vnp_Locale = "vn";
        String vnp_ReturnUrl = vnPayConfig.getReturnUrl();
        String vnp_IpAddr = VNPayUtil.getIpAddress(request);

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", vnp_Amount);
        vnp_Params.put("vnp_CurrCode", vnp_CurrCode);
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", vnp_OrderInfo);
        vnp_Params.put("vnp_OrderType", vnp_OrderType);
        vnp_Params.put("vnp_Locale", vnp_Locale);
        vnp_Params.put("vnp_ReturnUrl", vnp_ReturnUrl);
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        formatter.setTimeZone(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        // Build query string (encode both key and value)
        // Similar to Node.js: getPaymentURL(params, true)
        String queryUrl = VNPayUtil.buildQueryUrl(vnp_Params);
        
        // Create secure hash (encode value only, not key)
        // Similar to Node.js: hmacSHA512(SECRET_KEY, getPaymentURL(params, false))
        String vnp_SecureHash = VNPayUtil.hashAllFields(vnp_Params, vnPayConfig.getHashSecret());
        
        // Add secure hash to query
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        
        String paymentUrl = vnPayConfig.getVnpUrl() + "?" + queryUrl;
        
        log.info("=== VNPay Payment URL Debug ===");
        log.info("TMN Code: {}", vnPayConfig.getTmnCode());
        log.info("Amount: {}", vnp_Amount);
        log.info("TxnRef: {}", vnp_TxnRef);
        log.info("OrderInfo: {}", vnp_OrderInfo);
        log.info("Return URL: {}", vnPayConfig.getReturnUrl());
        log.info("Create Date: {}", vnp_CreateDate);
        log.info("Expire Date: {}", vnp_ExpireDate);
        log.info("Secure Hash: {}", vnp_SecureHash);
        log.info("Payment URL: {}", paymentUrl);
        
        return paymentUrl;
    }

    @Transactional
    public boolean handlePaymentReturn(Map<String, String> params) {
        log.info("=== VNPay Callback Debug ===");
        log.info("Received params: {}", params);
        
        String vnp_SecureHash = params.get("vnp_SecureHash");
        params.remove("vnp_SecureHashType");
        params.remove("vnp_SecureHash");

        // Verify signature (NO encoding, params already decoded from VNPay)
        // Similar to Node.js: qs.stringify(sorted, { encode: false })
        String signValue = VNPayUtil.hashCallbackFields(params, vnPayConfig.getHashSecret());
        
        log.info("VNPay Hash: {}", vnp_SecureHash);
        log.info("Local Hash: {}", signValue);
        log.info("Hash Match: {}", signValue.equals(vnp_SecureHash));

        if (signValue.equals(vnp_SecureHash)) {
            log.info("✅ Chữ ký hợp lệ");
            
            String orderNumber = params.get("vnp_TxnRef");
            String responseCode = params.get("vnp_ResponseCode");
            
            log.info("Order Number: {}", orderNumber);
            log.info("Response Code: {}", responseCode);

            Order order = orderRepository.findByOrderNumber(orderNumber)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng"));

            if ("00".equals(responseCode)) {
                log.info("✅ Giao dịch thành công");
                order.setPaymentStatus(Order.PaymentStatus.PAID);
                order.setStatus(Order.OrderStatus.CONFIRMED);
                orderRepository.save(order);
                return true;
            } else {
                log.warn("❌ Giao dịch thất bại - Response Code: {}", responseCode);
                order.setStatus(Order.OrderStatus.CANCELLED);
                orderRepository.save(order);
                return false;
            }
        } else {
            log.error("❌ Sai chữ ký");
        }
        return false;
    }
}

