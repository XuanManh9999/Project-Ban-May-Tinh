package com.web_ban_hang_may_tinh.computershop.seeder;

import com.web_ban_hang_may_tinh.computershop.entity.Cart;
import com.web_ban_hang_may_tinh.computershop.entity.Category;
import com.web_ban_hang_may_tinh.computershop.entity.Product;
import com.web_ban_hang_may_tinh.computershop.entity.ProductAttribute;
import com.web_ban_hang_may_tinh.computershop.entity.Promotion;
import com.web_ban_hang_may_tinh.computershop.entity.User;
import com.web_ban_hang_may_tinh.computershop.repository.CartRepository;
import com.web_ban_hang_may_tinh.computershop.repository.CategoryRepository;
import com.web_ban_hang_may_tinh.computershop.repository.ProductRepository;
import com.web_ban_hang_may_tinh.computershop.repository.PromotionRepository;
import com.web_ban_hang_may_tinh.computershop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final CartRepository cartRepository;
    private final PromotionRepository promotionRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0 || productRepository.count() > 0) {
            log.info("Dữ liệu đã tồn tại, bỏ qua việc seed dữ liệu mẫu.");
            return;
        }

        log.info("Bắt đầu seed dữ liệu mẫu...");

        List<Category> categories = seedCategories();
        log.info("Đã tạo {} danh mục", categories.size());

        List<User> users = seedUsers();
        log.info("Đã tạo {} người dùng", users.size());

        List<Product> products = seedProducts(categories);
        log.info("Đã tạo {} sản phẩm", products.size());

        List<Promotion> promotions = seedPromotions();
        log.info("Đã tạo {} mã giảm giá", promotions.size());

        log.info("Hoàn thành seed dữ liệu mẫu!");
    }

    private List<Promotion> seedPromotions() {
        LocalDateTime now = LocalDateTime.now();
        List<Promotion> promotions = Arrays.asList(
            createPromotion(
                "WELCOME10",
                "Giảm 10% cho khách hàng mới",
                "Áp dụng cho đơn hàng đầu tiên, đơn từ 1 triệu",
                Promotion.DiscountType.PERCENTAGE,
                new BigDecimal("10"),
                new BigDecimal("1000000"),
                new BigDecimal("500000"),
                now,
                now.plusDays(90),
                500,
                0
            ),
            createPromotion(
                "TECH15",
                "Giảm 15% sản phẩm công nghệ",
                "Áp dụng cho đơn từ 2 triệu, tối đa giảm 1 triệu",
                Promotion.DiscountType.PERCENTAGE,
                new BigDecimal("15"),
                new BigDecimal("2000000"),
                new BigDecimal("1000000"),
                now,
                now.plusDays(60),
                200,
                0
            ),
            createPromotion(
                "FREESHIP",
                "Miễn phí vận chuyển",
                "Giảm 30.000đ phí ship cho đơn từ 300.000đ",
                Promotion.DiscountType.FIXED_AMOUNT,
                new BigDecimal("30000"),
                new BigDecimal("300000"),
                new BigDecimal("30000"),
                now,
                now.plusDays(30),
                1000,
                0
            ),
            createPromotion(
                "FLASH50K",
                "Flash Sale - Giảm 50.000đ",
                "Giảm 50.000đ cho mọi đơn từ 500.000đ",
                Promotion.DiscountType.FIXED_AMOUNT,
                new BigDecimal("50000"),
                new BigDecimal("500000"),
                null,
                now,
                now.plusDays(7),
                300,
                0
            ),
            createPromotion(
                "VIP500K",
                "Ưu đãi VIP - Giảm 500.000đ",
                "Dành cho đơn từ 5 triệu trở lên",
                Promotion.DiscountType.FIXED_AMOUNT,
                new BigDecimal("500000"),
                new BigDecimal("5000000"),
                null,
                now,
                now.plusDays(120),
                50,
                0
            ),
            createPromotion(
                "LAPTOP5",
                "Giảm 5% laptop",
                "Giảm thêm 5% khi mua laptop, đơn từ 10 triệu, tối đa 2 triệu",
                Promotion.DiscountType.PERCENTAGE,
                new BigDecimal("5"),
                new BigDecimal("10000000"),
                new BigDecimal("2000000"),
                now,
                now.plusDays(45),
                100,
                0
            )
        );
        return promotionRepository.saveAll(promotions);
    }

    private Promotion createPromotion(String code, String name, String description,
                                      Promotion.DiscountType discountType, BigDecimal discountValue,
                                      BigDecimal minOrderAmount, BigDecimal maxDiscountAmount,
                                      LocalDateTime startDate, LocalDateTime endDate,
                                      int usageLimit, int usedCount) {
        Promotion p = new Promotion();
        p.setCode(code);
        p.setName(name);
        p.setDescription(description);
        p.setDiscountType(discountType);
        p.setDiscountValue(discountValue);
        p.setMinOrderAmount(minOrderAmount);
        p.setMaxDiscountAmount(maxDiscountAmount);
        p.setStartDate(startDate);
        p.setEndDate(endDate);
        p.setUsageLimit(usageLimit);
        p.setUsedCount(usedCount);
        p.setActive(true);
        return p;
    }

    private List<Category> seedCategories() {
        List<Category> categories = Arrays.asList(
            createCategory("Laptop", "Laptop văn phòng, gaming, đồ họa", "https://picsum.photos/500/500?random=1"),
            createCategory("PC - Máy tính bộ", "Máy tính để bàn lắp ráp và nguyên bộ", "https://picsum.photos/500/500?random=2"),
            createCategory("Màn hình", "Màn hình máy tính các loại", "https://picsum.photos/500/500?random=3"),
            createCategory("Linh kiện", "CPU, RAM, SSD, VGA, Mainboard, PSU...", "https://picsum.photos/500/500?random=4"),
            createCategory("Phụ kiện", "Chuột, bàn phím, tai nghe, webcam...", "https://picsum.photos/500/500?random=5"),
            createCategory("Thiết bị mạng", "Router, switch, access point, cáp mạng", "https://picsum.photos/500/500?random=6"),
            createCategory("Thiết bị lưu trữ", "Ổ cứng, USB, thẻ nhớ, NAS", "https://picsum.photos/500/500?random=7"),
            createCategory("Phần mềm & Bản quyền", "Windows, Office, Antivirus...", "https://picsum.photos/500/500?random=8")
        );
        return categoryRepository.saveAll(categories);
    }

    private Category createCategory(String name, String description, String imageUrl) {
        Category category = new Category();
        category.setName(name);
        category.setDescription(description);
        category.setImageUrl(imageUrl);
        return category;
    }

    private List<User> seedUsers() {
        List<User> users = Arrays.asList(
            createUser("admin", "Admin Computer Shop", "admin@computershop.com", "Admin@123", "0901234567", "123 Đường ABC, Quận 1, TP.HCM", User.Role.ADMIN),
            createUser("customer1", "Nguyễn Văn An", "customer1@gmail.com", "Customer@123", "0912345678", "456 Đường XYZ, Quận Ba Đình, Hà Nội", User.Role.CUSTOMER),
            createUser("customer2", "Trần Thị Bình", "customer2@gmail.com", "Customer@123", "0923456789", "789 Đường DEF, Quận Đống Đa, Hà Nội", User.Role.CUSTOMER),
            createUser("customer3", "Lê Văn Cường", "customer3@gmail.com", "Customer@123", "0934567890", "321 Đường GHI, Quận 3, TP.HCM", User.Role.CUSTOMER),
            createUser("customer4", "Phạm Thị Dung", "customer4@gmail.com", "Customer@123", "0945678901", "654 Đường JKL, Quận Cầu Giấy, Hà Nội", User.Role.CUSTOMER),
            createUser("customer5", "Hoàng Văn Em", "customer5@gmail.com", "Customer@123", "0956789012", "987 Đường MNO, Quận 7, TP.HCM", User.Role.CUSTOMER)
        );

        List<User> savedUsers = userRepository.saveAll(users);
        for (User user : savedUsers) {
            Cart cart = new Cart();
            cart.setUser(user);
            cartRepository.save(cart);
        }
        return savedUsers;
    }

    private User createUser(String username, String fullName, String email, String password,
                           String phone, String address, User.Role role) {
        User user = new User();
        user.setUsername(username);
        user.setFullName(fullName);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setPhone(phone);
        user.setAddress(address);
        user.setRole(role);
        user.setEnabled(true);
        return user;
    }

    private List<Product> seedProducts(List<Category> categories) {
        Category laptop = categories.get(0);
        Category pc = categories.get(1);
        Category monitor = categories.get(2);
        Category component = categories.get(3);
        Category accessory = categories.get(4);
        Category network = categories.get(5);
        Category storage = categories.get(6);
        Category software = categories.get(7);

        List<Product> products = Arrays.asList(
            // === Laptop ===
            createProduct("MacBook Pro 16 M3 Pro", "MacBook Pro 16 inch chip M3 Pro, hiệu năng vượt trội cho lập trình và sáng tạo nội dung",
                new BigDecimal("69990000"), 25, "https://picsum.photos/500/500?random=101", laptop,
                Map.of("CPU", "Apple M3 Pro 12-core", "RAM", "18GB Unified", "Ổ cứng", "512GB SSD", "GPU", "Apple M3 Pro 18-core GPU", "Màn hình", "16.2\" Liquid Retina XDR", "Pin", "22 giờ", "Hệ điều hành", "macOS Sonoma", "Màu sắc", "Space Black")),

            createProduct("ASUS ROG Zephyrus G16", "Laptop gaming cao cấp RTX 4070, màn hình OLED",
                new BigDecimal("54990000"), 20, "https://picsum.photos/500/500?random=102", laptop,
                Map.of("CPU", "Intel Core i9-13900H", "RAM", "16GB DDR5", "Ổ cứng", "1TB SSD NVMe", "GPU", "NVIDIA RTX 4070 8GB", "Màn hình", "16\" 2K OLED 240Hz", "Pin", "90Wh", "Cân nặng", "2.0 kg", "Màu sắc", "Eclipse Gray")),

            createProduct("Dell XPS 15 OLED", "Ultrabook cao cấp với màn hình OLED 3.5K",
                new BigDecimal("49990000"), 30, "https://picsum.photos/500/500?random=103", laptop,
                Map.of("CPU", "Intel Core i7-13700H", "RAM", "16GB DDR5", "Ổ cứng", "512GB SSD", "GPU", "Intel Iris Xe", "Màn hình", "15.6\" 3.5K OLED", "Pin", "86Wh", "Cân nặng", "1.86 kg")),

            createProduct("Lenovo ThinkPad X1 Carbon Gen 11", "Laptop doanh nhân cao cấp, bền bỉ theo chuẩn quân đội",
                new BigDecimal("44990000"), 35, "https://picsum.photos/500/500?random=104", laptop,
                Map.of("CPU", "Intel Core i7-1365U", "RAM", "16GB LPDDR5", "Ổ cứng", "512GB SSD", "Màn hình", "14\" 2.8K OLED", "Pin", "57Wh", "Cân nặng", "1.12 kg", "Bảo mật", "Vân tay + IR Camera")),

            createProduct("Acer Nitro 5 Gaming", "Laptop gaming phổ thông hiệu năng tốt",
                new BigDecimal("22990000"), 50, "https://picsum.photos/500/500?random=105", laptop,
                Map.of("CPU", "AMD Ryzen 7 7735HS", "RAM", "16GB DDR5", "Ổ cứng", "512GB SSD", "GPU", "NVIDIA RTX 4050 6GB", "Màn hình", "15.6\" FHD 144Hz", "Cân nặng", "2.5 kg")),

            createProduct("HP Pavilion 15", "Laptop văn phòng mỏng nhẹ, pin trâu",
                new BigDecimal("15990000"), 60, "https://picsum.photos/500/500?random=106", laptop,
                Map.of("CPU", "Intel Core i5-1335U", "RAM", "8GB DDR4", "Ổ cứng", "256GB SSD", "GPU", "Intel Iris Xe", "Màn hình", "15.6\" FHD IPS", "Pin", "41Wh")),

            // === PC - Máy tính bộ ===
            createProduct("PC Gaming RTX 4060 - i5 13400F", "Bộ máy tính gaming lắp ráp tầm trung",
                new BigDecimal("18990000"), 15, "https://picsum.photos/500/500?random=201", pc,
                Map.of("CPU", "Intel Core i5-13400F", "RAM", "16GB DDR4 3200MHz", "Ổ cứng", "500GB SSD NVMe", "GPU", "NVIDIA RTX 4060 8GB", "Mainboard", "MSI B660M-A", "Nguồn", "650W 80+ Bronze", "Vỏ case", "NZXT H5 Flow")),

            createProduct("PC Workstation Ryzen 9", "Máy trạm chuyên đồ họa 3D, render video",
                new BigDecimal("45990000"), 10, "https://picsum.photos/500/500?random=202", pc,
                Map.of("CPU", "AMD Ryzen 9 7950X", "RAM", "64GB DDR5 5600MHz", "Ổ cứng", "2TB SSD NVMe", "GPU", "NVIDIA RTX 4080 16GB", "Mainboard", "ASUS ProArt X670E", "Nguồn", "850W 80+ Gold", "Tản nhiệt", "NZXT Kraken X63")),

            createProduct("PC Văn phòng i3 12100", "Máy tính văn phòng nhỏ gọn, tiết kiệm điện",
                new BigDecimal("8990000"), 30, "https://picsum.photos/500/500?random=203", pc,
                Map.of("CPU", "Intel Core i3-12100", "RAM", "8GB DDR4", "Ổ cứng", "256GB SSD", "GPU", "Intel UHD 730", "Mainboard", "Gigabyte H610M", "Nguồn", "400W")),

            // === Màn hình ===
            createProduct("LG UltraGear 27GP850-B", "Màn hình gaming 27 inch Nano IPS 165Hz",
                new BigDecimal("10990000"), 40, "https://picsum.photos/500/500?random=301", monitor,
                Map.of("Kích thước", "27 inch", "Độ phân giải", "2560x1440 (QHD)", "Tấm nền", "Nano IPS", "Tần số quét", "165Hz", "Thời gian phản hồi", "1ms", "Cổng kết nối", "2x HDMI, 1x DP", "HDR", "HDR400")),

            createProduct("Dell UltraSharp U2723QE", "Màn hình 4K IPS Black chuyên đồ họa",
                new BigDecimal("15990000"), 25, "https://picsum.photos/500/500?random=302", monitor,
                Map.of("Kích thước", "27 inch", "Độ phân giải", "3840x2160 (4K)", "Tấm nền", "IPS Black", "Tần số quét", "60Hz", "Cổng kết nối", "HDMI, DP, USB-C 90W", "Độ phủ màu", "98% DCI-P3")),

            createProduct("Samsung Odyssey G5 34\"", "Màn hình cong Ultrawide 34 inch gaming",
                new BigDecimal("12990000"), 30, "https://picsum.photos/500/500?random=303", monitor,
                Map.of("Kích thước", "34 inch", "Độ phân giải", "3440x1440 (UWQHD)", "Tấm nền", "VA Cong 1000R", "Tần số quét", "165Hz", "Thời gian phản hồi", "1ms", "FreeSync", "Premium")),

            // === Linh kiện ===
            createProduct("CPU Intel Core i7-14700K", "Bộ vi xử lý thế hệ 14, 20 nhân 28 luồng",
                new BigDecimal("11990000"), 40, "https://picsum.photos/500/500?random=401", component,
                Map.of("Thế hệ", "Raptor Lake Refresh (14th)", "Số nhân/luồng", "20 nhân / 28 luồng", "Xung nhịp", "3.4GHz - 5.6GHz Turbo", "Socket", "LGA 1700", "TDP", "125W", "Cache", "33MB L3")),

            createProduct("RAM Kingston Fury Beast 16GB DDR5", "RAM DDR5 5600MHz cho gaming và workstation",
                new BigDecimal("1690000"), 100, "https://picsum.photos/500/500?random=402", component,
                Map.of("Dung lượng", "16GB (1x16GB)", "Loại", "DDR5", "Bus", "5600MHz", "Độ trễ", "CL36", "Điện áp", "1.25V", "Tản nhiệt", "Nhôm anodized")),

            createProduct("VGA NVIDIA GeForce RTX 4070 Ti SUPER", "Card đồ họa hiệu năng cao cho gaming 4K",
                new BigDecimal("21990000"), 20, "https://picsum.photos/500/500?random=403", component,
                Map.of("GPU", "AD103", "VRAM", "16GB GDDR6X", "Bus", "256-bit", "Boost Clock", "2610 MHz", "TDP", "285W", "Cổng", "3x DP 1.4, 1x HDMI 2.1", "Ray Tracing", "Có", "DLSS", "DLSS 3.5")),

            createProduct("SSD Samsung 990 Pro 1TB", "SSD NVMe PCIe Gen4 tốc độ cao",
                new BigDecimal("3490000"), 80, "https://picsum.photos/500/500?random=404", component,
                Map.of("Dung lượng", "1TB", "Giao tiếp", "PCIe Gen 4.0 x4 NVMe", "Đọc tuần tự", "7450 MB/s", "Ghi tuần tự", "6900 MB/s", "Tuổi thọ (TBW)", "600 TBW", "Form Factor", "M.2 2280")),

            createProduct("Mainboard ASUS ROG STRIX B760-F", "Bo mạch chủ ATX cho Intel thế hệ 12/13/14",
                new BigDecimal("5990000"), 35, "https://picsum.photos/500/500?random=405", component,
                Map.of("Socket", "LGA 1700", "Chipset", "Intel B760", "Form Factor", "ATX", "RAM hỗ trợ", "DDR5, tối đa 128GB", "Khe M.2", "3 khe NVMe", "Cổng USB", "USB 3.2 Gen2, Type-C")),

            createProduct("Nguồn Corsair RM850x 2023", "Nguồn máy tính 850W Full Modular",
                new BigDecimal("3490000"), 50, "https://picsum.photos/500/500?random=406", component,
                Map.of("Công suất", "850W", "Hiệu suất", "80+ Gold", "Modular", "Full Modular", "Quạt", "135mm FDB", "Bảo hành", "10 năm", "Chuẩn ATX", "ATX 3.0 / PCIe 5.0")),

            // === Phụ kiện ===
            createProduct("Chuột Logitech MX Master 3S", "Chuột không dây cao cấp cho chuyên gia",
                new BigDecimal("2790000"), 70, "https://picsum.photos/500/500?random=501", accessory,
                Map.of("Kết nối", "Bluetooth / USB Receiver", "DPI", "200 - 8000 DPI", "Pin", "Sạc USB-C, 70 ngày", "Số nút", "7 nút", "Cân nặng", "141g", "Tương thích", "Windows, macOS, Linux")),

            createProduct("Bàn phím cơ Keychron K8 Pro", "Bàn phím cơ không dây TKL hot-swap",
                new BigDecimal("2490000"), 55, "https://picsum.photos/500/500?random=502", accessory,
                Map.of("Layout", "TKL 87 phím", "Switch", "Gateron G Pro (Hot-swap)", "Kết nối", "Bluetooth 5.1 / USB-C", "Đèn", "RGB per-key", "Pin", "4000mAh", "Tương thích", "Windows / macOS")),

            createProduct("Tai nghe SteelSeries Arctis Nova Pro", "Tai nghe gaming cao cấp Hi-Res Audio",
                new BigDecimal("7990000"), 35, "https://picsum.photos/500/500?random=503", accessory,
                Map.of("Loại", "Over-ear", "Driver", "40mm Neodymium", "Kết nối", "USB-C / 3.5mm", "Micro", "ClearCast Gen 2, khử ồn AI", "ANC", "Có, 4 mức", "Pin", "22 giờ (không ANC)")),

            createProduct("Webcam Logitech C920s Pro HD", "Webcam Full HD 1080p cho họp online & stream",
                new BigDecimal("2290000"), 60, "https://picsum.photos/500/500?random=504", accessory,
                Map.of("Độ phân giải", "1080p / 30fps", "Ống kính", "Glass lens, autofocus", "Micro", "Stereo dual mic", "Kết nối", "USB-A", "Bảo mật", "Nắp che camera")),

            createProduct("Lót chuột SteelSeries QcK Heavy XXL", "Mousepad vải cỡ lớn cho gaming",
                new BigDecimal("890000"), 100, "https://picsum.photos/500/500?random=505", accessory,
                Map.of("Kích thước", "900 x 400 x 6mm", "Chất liệu", "Vải micro-woven", "Đế", "Cao su chống trượt", "Phù hợp", "Gaming, văn phòng")),

            // === Thiết bị mạng ===
            createProduct("Router ASUS RT-AX86U Pro", "Router WiFi 6 gaming AX5700",
                new BigDecimal("5990000"), 30, "https://picsum.photos/500/500?random=601", network,
                Map.of("Chuẩn WiFi", "WiFi 6 (802.11ax)", "Tốc độ", "AX5700 (4804 + 861 Mbps)", "Cổng LAN", "4x Gigabit + 1x 2.5G", "Cổng USB", "USB 3.2 + USB 2.0", "Vùng phủ", "~230m²", "Bảo mật", "AiProtection Pro")),

            createProduct("Bộ phát Mesh TP-Link Deco X50 (3-pack)", "Hệ thống Mesh WiFi 6 cho nhà rộng",
                new BigDecimal("4990000"), 40, "https://picsum.photos/500/500?random=602", network,
                Map.of("Chuẩn WiFi", "WiFi 6 AX3000", "Vùng phủ", "Tới 650m² (3 pack)", "Cổng LAN", "2x Gigabit mỗi node", "Băng tần", "Dual-band", "Số thiết bị", "Tối đa 150")),

            // === Thiết bị lưu trữ ===
            createProduct("Ổ cứng di động WD My Passport 2TB", "HDD portable USB 3.0 nhỏ gọn",
                new BigDecimal("1890000"), 80, "https://picsum.photos/500/500?random=701", storage,
                Map.of("Dung lượng", "2TB", "Giao tiếp", "USB 3.0 / USB 2.0", "Tốc độ đọc", "Tới 5Gbps", "Bảo mật", "Mã hóa AES 256-bit", "Kích thước", "107 x 75 x 11.15mm", "Tương thích", "Windows, macOS")),

            createProduct("USB Kingston DataTraveler Max 256GB", "USB-C 3.2 Gen2 tốc độ cao",
                new BigDecimal("990000"), 120, "https://picsum.photos/500/500?random=702", storage,
                Map.of("Dung lượng", "256GB", "Giao tiếp", "USB 3.2 Gen2 Type-C", "Đọc", "Tới 1000 MB/s", "Ghi", "Tới 900 MB/s")),

            createProduct("NAS Synology DS220+", "Ổ cứng mạng 2-bay cho gia đình và văn phòng nhỏ",
                new BigDecimal("8990000"), 15, "https://picsum.photos/500/500?random=703", storage,
                Map.of("Số bay", "2 (tối đa 32TB)", "CPU", "Intel Celeron J4025 Dual-core", "RAM", "2GB DDR4 (mở rộng 6GB)", "Cổng LAN", "2x Gigabit", "Cổng USB", "2x USB 3.2", "Hệ điều hành", "DiskStation Manager")),

            // === Phần mềm & Bản quyền ===
            createProduct("Windows 11 Pro - Key bản quyền", "Bản quyền vĩnh viễn Windows 11 Professional",
                new BigDecimal("3290000"), 200, "https://picsum.photos/500/500?random=801", software,
                Map.of("Phiên bản", "Windows 11 Pro", "Loại key", "Retail (vĩnh viễn)", "Ngôn ngữ", "Đa ngôn ngữ", "Số máy", "1 máy")),

            createProduct("Microsoft Office 2021 Home & Business", "Bộ Office bản quyền vĩnh viễn",
                new BigDecimal("5490000"), 150, "https://picsum.photos/500/500?random=802", software,
                Map.of("Phiên bản", "Office 2021 H&B", "Gồm", "Word, Excel, PowerPoint, Outlook", "Loại key", "Retail (vĩnh viễn)", "Số máy", "1 PC/Mac")),

            createProduct("Kaspersky Total Security 1 năm", "Phần mềm bảo mật toàn diện cho 3 thiết bị",
                new BigDecimal("890000"), 300, "https://picsum.photos/500/500?random=803", software,
                Map.of("Thời hạn", "1 năm", "Số thiết bị", "3", "Nền tảng", "Windows, macOS, Android, iOS", "Tính năng", "Antivirus, VPN, Password Manager"))
        );

        return productRepository.saveAll(products);
    }

    private Product createProduct(String name, String description, BigDecimal price,
                                 Integer stockQuantity, String imageUrl, Category category,
                                 Map<String, String> attrs) {
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        product.setStockQuantity(stockQuantity);
        product.setImageUrl(imageUrl);
        product.setCategory(category);
        product.setActive(true);

        if (attrs != null) {
            attrs.forEach((key, value) -> {
                ProductAttribute attr = new ProductAttribute();
                attr.setAttributeName(key);
                attr.setAttributeValue(value);
                attr.setProduct(product);
                product.getAttributes().add(attr);
            });
        }

        return product;
    }
}
