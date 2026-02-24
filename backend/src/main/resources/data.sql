-- Sample data for testing
-- Enable this in application.properties:
-- spring.jpa.defer-datasource-initialization=true
-- spring.sql.init.mode=always

-- ============================================
-- Insert Categories
-- ============================================
INSERT INTO categories (name, description, image_url, created_at, updated_at) VALUES
('Điện thoại', 'Điện thoại di động các loại', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500', GETDATE(), GETDATE()),
('Laptop', 'Máy tính xách tay', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500', GETDATE(), GETDATE()),
('Tai nghe', 'Tai nghe và phụ kiện âm thanh', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', GETDATE(), GETDATE()),
('Đồng hồ thông minh', 'Smartwatch và thiết bị đeo tay', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', GETDATE(), GETDATE()),
('Phụ kiện', 'Phụ kiện điện tử đa dạng', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500', GETDATE(), GETDATE());

-- ============================================
-- Insert Admin User (password: Admin@123)
-- ============================================
INSERT INTO users (username, full_name, email, password, phone, address, role, enabled, created_at, updated_at) VALUES
('admin', 'Admin Computer Shop', 'admin@computershop.com', '$2a$10$8V8Z8Z8Z8Z8Z8Z8Z8Z8Z8u6xN0xV0xV0xV0xV0xV0xV0xV0xV0xV0x', '0901234567', '123 Đường ABC, TP.HCM', 'ADMIN', 1, GETDATE(), GETDATE()),
('customer1', 'Nguyễn Văn A', 'customer1@gmail.com', '$2a$10$8V8Z8Z8Z8Z8Z8Z8Z8Z8Z8u6xN0xV0xV0xV0xV0xV0xV0xV0xV0xV0x', '0912345678', '456 Đường XYZ, Hà Nội', 'CUSTOMER', 1, GETDATE(), GETDATE());

-- Note: Password hash above is for "Admin@123" - you should register normally or update this with proper BCrypt hash

-- ============================================
-- Insert Products - Điện thoại
-- ============================================
INSERT INTO products (name, description, price, stock_quantity, image_url, category_id, active, created_at, updated_at) VALUES
('iPhone 15 Pro Max', 'iPhone 15 Pro Max 256GB - Titan Tự Nhiên. Chip A17 Pro mạnh mẽ, camera 48MP, màn hình Super Retina XDR 6.7 inch', 29990000, 50, 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=500', 1, 1, GETDATE(), GETDATE()),
('Samsung Galaxy S24 Ultra', 'Samsung Galaxy S24 Ultra 12GB/256GB - Màu Đen. Snapdragon 8 Gen 3, camera 200MP, S Pen tích hợp', 27990000, 45, 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500', 1, 1, GETDATE(), GETDATE()),
('iPhone 14 Pro', 'iPhone 14 Pro 128GB - Tím Deep Purple. Chip A16 Bionic, Dynamic Island, camera 48MP Pro', 24990000, 30, 'https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?w=500', 1, 1, GETDATE(), GETDATE()),
('Xiaomi 14 Ultra', 'Xiaomi 14 Ultra 16GB/512GB - Camera Leica, Snapdragon 8 Gen 3, sạc nhanh 90W', 22990000, 35, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500', 1, 1, GETDATE(), GETDATE()),
('OPPO Find X7 Ultra', 'OPPO Find X7 Ultra - Camera kép tiềm vọng, Snapdragon 8 Gen 3, màn hình AMOLED 120Hz', 21990000, 40, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500', 1, 1, GETDATE(), GETDATE()),
('Samsung Galaxy Z Fold 6', 'Samsung Galaxy Z Fold 6 - Điện thoại gập đỉnh cao, màn hình 7.6 inch, S Pen hỗ trợ', 38990000, 20, 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=500', 1, 1, GETDATE(), GETDATE()),
('iPhone 13', 'iPhone 13 128GB - Màu Xanh. Chip A15, camera kép 12MP, pin trâu', 17990000, 60, 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=500', 1, 1, GETDATE(), GETDATE());

-- ============================================
-- Insert Products - Laptop
-- ============================================
INSERT INTO products (name, description, price, stock_quantity, image_url, category_id, active, created_at, updated_at) VALUES
('MacBook Pro 16 M3 Max', 'MacBook Pro 16 inch M3 Max 16GB/512GB - Hiệu năng đỉnh cao cho creator, màn hình Liquid Retina XDR', 89990000, 25, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500', 2, 1, GETDATE(), GETDATE()),
('Dell XPS 15', 'Dell XPS 15 (2024) - Intel Core i7-13700H, RTX 4060, 16GB RAM, màn hình 4K OLED', 52990000, 30, 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500', 2, 1, GETDATE(), GETDATE()),
('ASUS ROG Strix G16', 'ASUS ROG Strix G16 - Gaming laptop, Core i9-14900HX, RTX 4070, 32GB RAM, 1TB SSD', 49990000, 20, 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500', 2, 1, GETDATE(), GETDATE()),
('MacBook Air M3', 'MacBook Air 13 inch M3 8GB/256GB - Mỏng nhẹ, pin 18 giờ, màn hình Liquid Retina', 29990000, 50, 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500', 2, 1, GETDATE(), GETDATE()),
('Lenovo ThinkPad X1 Carbon', 'Lenovo ThinkPad X1 Carbon Gen 12 - Laptop doanh nhân, Core i7, 16GB RAM, bảo mật vân tay', 42990000, 35, 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500', 2, 1, GETDATE(), GETDATE()),
('HP Spectre x360', 'HP Spectre x360 2-in-1 - Màn hình cảm ứng xoay 360°, Core i7, 16GB RAM, bút stylus', 38990000, 25, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500', 2, 1, GETDATE(), GETDATE()),
('Acer Predator Helios 18', 'Acer Predator Helios 18 - Gaming đỉnh cao, Core i9, RTX 4090, 64GB RAM, màn hình 240Hz', 79990000, 15, 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=500', 2, 1, GETDATE(), GETDATE());

-- ============================================
-- Insert Products - Tai nghe
-- ============================================
INSERT INTO products (name, description, price, stock_quantity, image_url, category_id, active, created_at, updated_at) VALUES
('AirPods Pro 2', 'Apple AirPods Pro 2 - Chống ồn chủ động, chip H2, case sạc USB-C, âm thanh 3D', 6990000, 100, 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=500', 3, 1, GETDATE(), GETDATE()),
('Sony WH-1000XM5', 'Sony WH-1000XM5 - Tai nghe chống ồn hàng đầu, pin 30 giờ, âm thanh Hi-Res', 8990000, 80, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', 3, 1, GETDATE(), GETDATE()),
('Samsung Galaxy Buds 2 Pro', 'Samsung Galaxy Buds 2 Pro - Nhỏ gọn, chống ồn ANC, âm thanh 360°, chống nước IPX7', 4490000, 120, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500', 3, 1, GETDATE(), GETDATE()),
('Beats Studio Pro', 'Beats Studio Pro - Thiết kế premium, chống ồn, pin 40 giờ, Spatial Audio', 7990000, 60, 'https://images.unsplash.com/photo-1577174881658-0f30157f073a?w=500', 3, 1, GETDATE(), GETDATE()),
('JBL Tune 760NC', 'JBL Tune 760NC - Tai nghe over-ear, chống ồn, pin 50 giờ, bass mạnh mẽ', 2990000, 150, 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500', 3, 1, GETDATE(), GETDATE()),
('Bose QuietComfort Ultra', 'Bose QuietComfort Ultra - Chống ồn đỉnh cao, âm thanh Immersive, thiết kế sang trọng', 9990000, 45, 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=500', 3, 1, GETDATE(), GETDATE());

-- ============================================
-- Insert Products - Đồng hồ thông minh
-- ============================================
INSERT INTO products (name, description, price, stock_quantity, image_url, category_id, active, created_at, updated_at) VALUES
('Apple Watch Series 9', 'Apple Watch Series 9 GPS 45mm - Chip S9, màn hình Always-On Retina, theo dõi sức khỏe', 10990000, 70, 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=500', 4, 1, GETDATE(), GETDATE()),
('Apple Watch Ultra 2', 'Apple Watch Ultra 2 - Titanium, GPS + Cellular, chống nước 100m, pin 36 giờ', 21990000, 40, 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500', 4, 1, GETDATE(), GETDATE()),
('Samsung Galaxy Watch 6 Classic', 'Samsung Galaxy Watch 6 Classic - Vòng bezel xoay, theo dõi giấc ngủ, đo SpO2', 8990000, 85, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', 4, 1, GETDATE(), GETDATE()),
('Garmin Fenix 7', 'Garmin Fenix 7 - Đồng hồ thể thao đa năng, GPS, pin 18 ngày, chống nước 10 ATM', 18990000, 30, 'https://images.unsplash.com/photo-1617625802912-cde586faf331?w=500', 4, 1, GETDATE(), GETDATE()),
('Xiaomi Watch S3', 'Xiaomi Watch S3 - Màn hình AMOLED 1.43 inch, theo dõi 150+ môn thể thao, pin 15 ngày', 3990000, 100, 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500', 4, 1, GETDATE(), GETDATE());

-- ============================================
-- Insert Products - Phụ kiện
-- ============================================
INSERT INTO products (name, description, price, stock_quantity, image_url, category_id, active, created_at, updated_at) VALUES
('Anker PowerBank 20000mAh', 'Anker PowerCore 20000mAh - Sạc nhanh PD 20W, 2 cổng USB, an toàn đa lớp', 890000, 200, 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500', 5, 1, GETDATE(), GETDATE()),
('Ugreen Cáp USB-C to Lightning', 'Cáp Ugreen USB-C to Lightning 2m - Sạc nhanh 20W, chứng nhận MFi, bền bỉ', 390000, 300, 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500', 5, 1, GETDATE(), GETDATE()),
('Baseus Sạc nhanh GaN 65W', 'Baseus GaN Charger 65W - 3 cổng (2 USB-C + 1 USB-A), nhỏ gọn, sạc laptop/điện thoại', 890000, 150, 'https://images.unsplash.com/photo-1591290619762-c588f80f0fc7?w=500', 5, 1, GETDATE(), GETDATE()),
('Logitech MX Master 3S', 'Logitech MX Master 3S - Chuột không dây cao cấp, 8000 DPI, pin 70 ngày', 2490000, 80, 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500', 5, 1, GETDATE(), GETDATE()),
('Keychron K8 Pro', 'Bàn phím cơ Keychron K8 Pro - Hot-swap, QMK/VIA, 75%, kết nối đa thiết bị', 2990000, 60, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500', 5, 1, GETDATE(), GETDATE()),
('SanDisk Extreme Pro 1TB', 'Ổ cứng SSD di động SanDisk Extreme Pro 1TB - Tốc độ 2000MB/s, chống sốc, IP55', 3990000, 70, 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500', 5, 1, GETDATE(), GETDATE()),
('Apple Magic Keyboard', 'Apple Magic Keyboard - Bàn phím không dây, pin sạc, thiết kế mỏng nhẹ', 2790000, 90, 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500', 5, 1, GETDATE(), GETDATE());

-- ============================================
-- Insert Promotions
-- ============================================
INSERT INTO promotions (code, name, description, discount_type, discount_value, min_order_amount, max_discount_amount, start_date, end_date, usage_limit, used_count, active, created_at, updated_at) VALUES
('WELCOME10', 'Giảm 10% cho khách hàng mới', 'Áp dụng cho đơn hàng đầu tiên', 'PERCENTAGE', 10, 1000000, 500000, GETDATE(), DATEADD(DAY, 30, GETDATE()), 100, 0, 1, GETDATE(), GETDATE()),
('FLASH50', 'Flash Sale - Giảm 50K', 'Giảm 50.000đ cho mọi đơn hàng', 'FIXED_AMOUNT', 50000, 500000, NULL, GETDATE(), DATEADD(DAY, 7, GETDATE()), 500, 0, 1, GETDATE(), GETDATE()),
('FREESHIP', 'Miễn phí vận chuyển', 'Miễn phí ship cho đơn từ 300K', 'FIXED_AMOUNT', 30000, 300000, 30000, GETDATE(), DATEADD(DAY, 15, GETDATE()), 1000, 0, 1, GETDATE(), GETDATE()),
('TECH20', 'Giảm 20% công nghệ', 'Giảm 20% cho sản phẩm công nghệ', 'PERCENTAGE', 20, 2000000, 1000000, GETDATE(), DATEADD(DAY, 10, GETDATE()), 50, 0, 1, GETDATE(), GETDATE()),
('VIP500', 'Ưu đãi VIP - 500K', 'Dành cho khách hàng VIP', 'FIXED_AMOUNT', 500000, 5000000, NULL, GETDATE(), DATEADD(DAY, 60, GETDATE()), 20, 0, 1, GETDATE(), GETDATE());

-- Note: After running this script, you may need to manually create a cart for users
-- Or the application will auto-create cart on first login/registration

