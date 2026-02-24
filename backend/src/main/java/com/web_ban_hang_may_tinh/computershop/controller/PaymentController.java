package com.web_ban_hang_may_tinh.computershop.controller;

import com.web_ban_hang_may_tinh.computershop.dto.common.ApiResponse;
import com.web_ban_hang_may_tinh.computershop.service.VNPayService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final VNPayService vnPayService;

    @PostMapping("/vnpay/create")
    public ResponseEntity<ApiResponse<Map<String, String>>> createPayment(
            @RequestParam Long orderId,
            HttpServletRequest request) throws UnsupportedEncodingException {
        String paymentUrl = vnPayService.createPaymentUrl(orderId, request);
        Map<String, String> response = new HashMap<>();
        response.put("paymentUrl", paymentUrl);
        return ResponseEntity.ok(ApiResponse.success("Tạo URL thanh toán thành công", response));
    }

    @GetMapping("/vnpay-return")
    public ResponseEntity<ApiResponse<Map<String, Object>>> handleVNPayReturn(
            @RequestParam Map<String, String> params) {
        boolean success = vnPayService.handlePaymentReturn(params);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", success);
        response.put("orderNumber", params.get("vnp_TxnRef"));
        response.put("transactionNo", params.get("vnp_TransactionNo"));
        
        if (success) {
            return ResponseEntity.ok(ApiResponse.success("Thanh toán thành công", response));
        } else {
            return ResponseEntity.ok(ApiResponse.error("Thanh toán thất bại"));
        }
    }
}

