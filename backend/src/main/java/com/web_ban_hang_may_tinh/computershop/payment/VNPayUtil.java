package com.web_ban_hang_may_tinh.computershop.payment;

import jakarta.servlet.http.HttpServletRequest;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

public class VNPayUtil {

    public static String hmacSHA512(String key, String data) {
        try {
            Mac hmac512 = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            hmac512.init(secretKey);
            byte[] result = hmac512.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : result) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception e) {
            return "";
        }
    }

    public static String getIpAddress(HttpServletRequest request) {
        String ipAddress = request.getHeader("X-FORWARDED-FOR");
        if (ipAddress == null || ipAddress.isEmpty()) {
            ipAddress = request.getRemoteAddr();
        }
        return ipAddress;
    }

    public static String getRandomNumber(int length) {
        Random random = new Random();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < length; i++) {
            sb.append(random.nextInt(10));
        }
        return sb.toString();
    }

    /**
     * Build query URL for VNPay payment (encode both key and value)
     * Similar to Node.js: getPaymentURL(params, true)
     */
    public static String buildQueryUrl(Map<String, String> params) throws UnsupportedEncodingException {
        List<String> fieldNames = new ArrayList<>(params.keySet());
        Collections.sort(fieldNames);
        
        StringBuilder query = new StringBuilder();
        boolean first = true;
        for (String fieldName : fieldNames) {
            String fieldValue = params.get(fieldName);
            if (fieldValue != null && fieldValue.length() > 0) {
                if (!first) {
                    query.append("&");
                }
                // Encode both key and value, replace %20 with +
                query.append(URLEncoder.encode(fieldName, StandardCharsets.UTF_8.toString()));
                query.append("=");
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.UTF_8.toString()).replace("%20", "+"));
                first = false;
            }
        }
        return query.toString();
    }

    /**
     * Build hash data for VNPay signature (encode value only, not key)
     * Similar to Node.js: getPaymentURL(params, false)
     */
    public static String buildHashData(Map<String, String> params) throws UnsupportedEncodingException {
        List<String> fieldNames = new ArrayList<>(params.keySet());
        Collections.sort(fieldNames);
        
        StringBuilder hashData = new StringBuilder();
        boolean first = true;
        for (String fieldName : fieldNames) {
            String fieldValue = params.get(fieldName);
            if (fieldValue != null && fieldValue.length() > 0) {
                if (!first) {
                    hashData.append("&");
                }
                // Do NOT encode key, encode value and replace %20 with +
                hashData.append(fieldName);
                hashData.append("=");
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.UTF_8.toString()).replace("%20", "+"));
                first = false;
            }
        }
        return hashData.toString();
    }

    /**
     * Create secure hash for payment request
     */
    public static String hashAllFields(Map<String, String> params, String hashSecret) throws UnsupportedEncodingException {
        String hashData = buildHashData(params);
        System.out.println("VNPay Hash Data: " + hashData);
        String hash = hmacSHA512(hashSecret, hashData);
        System.out.println("VNPay Secure Hash: " + hash);
        return hash;
    }

    /**
     * Verify callback signature (NO encoding at all)
     * Similar to Node.js: qs.stringify(sorted, { encode: false })
     */
    public static String buildCallbackHashData(Map<String, String> params) {
        List<String> fieldNames = new ArrayList<>(params.keySet());
        Collections.sort(fieldNames);
        
        StringBuilder hashData = new StringBuilder();
        boolean first = true;
        for (String fieldName : fieldNames) {
            String fieldValue = params.get(fieldName);
            if (fieldValue != null && fieldValue.length() > 0) {
                if (!first) {
                    hashData.append("&");
                }
                // Do NOT encode anything (params already decoded from VNPay)
                hashData.append(fieldName);
                hashData.append("=");
                hashData.append(fieldValue);
                first = false;
            }
        }
        return hashData.toString();
    }

    /**
     * Verify secure hash from VNPay callback
     */
    public static String hashCallbackFields(Map<String, String> params, String hashSecret) {
        String hashData = buildCallbackHashData(params);
        System.out.println("VNPay Callback Hash Data: " + hashData);
        String hash = hmacSHA512(hashSecret, hashData);
        System.out.println("VNPay Callback Hash: " + hash);
        return hash;
    }
}

