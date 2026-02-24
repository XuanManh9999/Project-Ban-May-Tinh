package com.web_ban_hang_may_tinh.computershop.seeder;

import com.web_ban_hang_may_tinh.computershop.entity.Cart;
import com.web_ban_hang_may_tinh.computershop.entity.Category;
import com.web_ban_hang_may_tinh.computershop.entity.Product;
import com.web_ban_hang_may_tinh.computershop.entity.User;
import com.web_ban_hang_may_tinh.computershop.repository.CartRepository;
import com.web_ban_hang_may_tinh.computershop.repository.CategoryRepository;
import com.web_ban_hang_may_tinh.computershop.repository.ProductRepository;
import com.web_ban_hang_may_tinh.computershop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final CartRepository cartRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Kiểm tra xem đã có dữ liệu chưa
        if (userRepository.count() > 0 || productRepository.count() > 0) {
            log.info("Dữ liệu đã tồn tại, bỏ qua việc seed dữ liệu mẫu.");
            return;
        }

        log.info("Bắt đầu seed dữ liệu mẫu...");

        // Seed Categories
        List<Category> categories = seedCategories();
        log.info("Đã tạo {} danh mục", categories.size());

        // Seed Users
        List<User> users = seedUsers();
        log.info("Đã tạo {} người dùng", users.size());

        // Seed Products
        List<Product> products = seedProducts(categories);
        log.info("Đã tạo {} sản phẩm", products.size());

        log.info("Hoàn thành seed dữ liệu mẫu!");
    }

    private List<Category> seedCategories() {
        List<Category> categories = Arrays.asList(
            createCategory("Điện thoại", "Điện thoại di động các loại", "https://picsum.photos/500/500?random=1"),
            createCategory("Laptop", "Máy tính xách tay", "https://picsum.photos/500/500?random=2"),
            createCategory("Tai nghe", "Tai nghe và phụ kiện âm thanh", "https://picsum.photos/500/500?random=3"),
            createCategory("Đồng hồ thông minh", "Smartwatch và thiết bị đeo tay", "https://picsum.photos/500/500?random=4"),
            createCategory("Phụ kiện", "Phụ kiện điện tử đa dạng", "https://picsum.photos/500/500?random=5"),
            createCategory("Máy ảnh", "Máy ảnh và thiết bị quay phim", "https://picsum.photos/500/500?random=6"),
            createCategory("Tablet", "Máy tính bảng", "https://picsum.photos/500/500?random=7"),
            createCategory("Loa", "Loa và hệ thống âm thanh", "https://picsum.photos/500/500?random=8")
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
            createUser("customer5", "Hoàng Văn Em", "customer5@gmail.com", "Customer@123", "0956789012", "987 Đường MNO, Quận 7, TP.HCM", User.Role.CUSTOMER),
            createUser("customer6", "Vũ Thị Phương", "customer6@gmail.com", "Customer@123", "0967890123", "147 Đường PQR, Quận Hai Bà Trưng, Hà Nội", User.Role.CUSTOMER),
            createUser("customer7", "Đặng Văn Quang", "customer7@gmail.com", "Customer@123", "0978901234", "258 Đường STU, Quận Bình Thạnh, TP.HCM", User.Role.CUSTOMER),
            createUser("customer8", "Bùi Thị Hoa", "customer8@gmail.com", "Customer@123", "0989012345", "369 Đường VWX, Quận Thanh Xuân, Hà Nội", User.Role.CUSTOMER),
            createUser("customer9", "Ngô Văn Long", "customer9@gmail.com", "Customer@123", "0990123456", "741 Đường YZA, Quận Tân Bình, TP.HCM", User.Role.CUSTOMER),
            createUser("customer10", "Đỗ Thị Mai", "customer10@gmail.com", "Customer@123", "0901234567", "852 Đường BCD, Quận Hoàn Kiếm, Hà Nội", User.Role.CUSTOMER)
        );

        List<User> savedUsers = userRepository.saveAll(users);

        // Tạo Cart cho mỗi user
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
        List<Product> products = Arrays.asList(
            // Điện thoại
            createProduct("iPhone 15 Pro Max", "iPhone 15 Pro Max 256GB - Điện thoại cao cấp với chip A17 Pro, camera 48MP", 
                new BigDecimal("32990000"), 50, "https://picsum.photos/500/500?random=101", categories.get(0)),
            createProduct("Samsung Galaxy S24 Ultra", "Samsung Galaxy S24 Ultra 512GB - Flagship với S Pen, camera 200MP", 
                new BigDecimal("28990000"), 45, "https://picsum.photos/500/500?random=102", categories.get(0)),
            createProduct("Xiaomi 14 Pro", "Xiaomi 14 Pro 256GB - Flagship với camera Leica, chip Snapdragon 8 Gen 3", 
                new BigDecimal("19990000"), 60, "https://picsum.photos/500/500?random=103", categories.get(0)),
            createProduct("OPPO Find X7 Ultra", "OPPO Find X7 Ultra 512GB - Flagship với camera Hasselblad", 
                new BigDecimal("22990000"), 40, "https://picsum.photos/500/500?random=104", categories.get(0)),
            createProduct("Vivo X100 Pro", "Vivo X100 Pro 256GB - Flagship với camera Zeiss, chip MediaTek Dimensity 9300", 
                new BigDecimal("21990000"), 35, "https://picsum.photos/500/500?random=105", categories.get(0)),
            createProduct("OnePlus 12", "OnePlus 12 256GB - Flagship với chip Snapdragon 8 Gen 3, sạc nhanh 100W", 
                new BigDecimal("18990000"), 55, "https://picsum.photos/500/500?random=106", categories.get(0)),
            createProduct("Google Pixel 8 Pro", "Google Pixel 8 Pro 256GB - Flagship với AI camera, chip Tensor G3", 
                new BigDecimal("23990000"), 30, "https://picsum.photos/500/500?random=107", categories.get(0)),
            createProduct("Realme GT 5 Pro", "Realme GT 5 Pro 256GB - Flagship với chip Snapdragon 8 Gen 3", 
                new BigDecimal("14990000"), 70, "https://picsum.photos/500/500?random=108", categories.get(0)),

            // Laptop
            createProduct("MacBook Pro 16 inch M3", "MacBook Pro 16 inch M3 Pro 1TB - Laptop cao cấp cho chuyên gia", 
                new BigDecimal("69990000"), 25, "https://picsum.photos/500/500?random=201", categories.get(1)),
            createProduct("Dell XPS 15", "Dell XPS 15 OLED 1TB - Laptop cao cấp với màn hình OLED 4K", 
                new BigDecimal("49990000"), 30, "https://picsum.photos/500/500?random=202", categories.get(1)),
            createProduct("ASUS ROG Zephyrus G16", "ASUS ROG Zephyrus G16 RTX 4070 - Laptop gaming cao cấp", 
                new BigDecimal("54990000"), 20, "https://picsum.photos/500/500?random=203", categories.get(1)),
            createProduct("Lenovo ThinkPad X1 Carbon", "Lenovo ThinkPad X1 Carbon Gen 11 - Laptop doanh nhân cao cấp", 
                new BigDecimal("44990000"), 35, "https://picsum.photos/500/500?random=204", categories.get(1)),
            createProduct("HP Spectre x360", "HP Spectre x360 14 inch - Laptop 2-in-1 cao cấp", 
                new BigDecimal("39990000"), 28, "https://picsum.photos/500/500?random=205", categories.get(1)),
            createProduct("Acer Predator Helios 16", "Acer Predator Helios 16 RTX 4060 - Laptop gaming hiệu năng cao", 
                new BigDecimal("34990000"), 40, "https://picsum.photos/500/500?random=206", categories.get(1)),
            createProduct("MSI Stealth 16 Studio", "MSI Stealth 16 Studio RTX 4070 - Laptop gaming mỏng nhẹ", 
                new BigDecimal("59990000"), 22, "https://picsum.photos/500/500?random=207", categories.get(1)),
            createProduct("Razer Blade 15", "Razer Blade 15 RTX 4080 - Laptop gaming cao cấp", 
                new BigDecimal("64990000"), 18, "https://picsum.photos/500/500?random=208", categories.get(1)),

            // Tai nghe
            createProduct("AirPods Pro 2", "AirPods Pro 2 với USB-C - Tai nghe không dây chống ồn chủ động", 
                new BigDecimal("6990000"), 100, "https://picsum.photos/500/500?random=301", categories.get(2)),
            createProduct("Sony WH-1000XM5", "Sony WH-1000XM5 - Tai nghe over-ear chống ồn tốt nhất", 
                new BigDecimal("8990000"), 80, "https://picsum.photos/500/500?random=302", categories.get(2)),
            createProduct("Bose QuietComfort Ultra", "Bose QuietComfort Ultra - Tai nghe chống ồn cao cấp", 
                new BigDecimal("10990000"), 60, "https://picsum.photos/500/500?random=303", categories.get(2)),
            createProduct("Samsung Galaxy Buds2 Pro", "Samsung Galaxy Buds2 Pro - Tai nghe true wireless cao cấp", 
                new BigDecimal("4990000"), 120, "https://picsum.photos/500/500?random=304", categories.get(2)),
            createProduct("JBL Tour Pro 2", "JBL Tour Pro 2 - Tai nghe true wireless với màn hình cảm ứng", 
                new BigDecimal("5990000"), 90, "https://picsum.photos/500/500?random=305", categories.get(2)),
            createProduct("Sennheiser Momentum 4", "Sennheiser Momentum 4 - Tai nghe over-ear cao cấp", 
                new BigDecimal("7990000"), 70, "https://picsum.photos/500/500?random=306", categories.get(2)),
            createProduct("Beats Studio Pro", "Beats Studio Pro - Tai nghe over-ear với ANC", 
                new BigDecimal("6990000"), 85, "https://picsum.photos/500/500?random=307", categories.get(2)),
            createProduct("Xiaomi Buds 4 Pro", "Xiaomi Buds 4 Pro - Tai nghe true wireless giá tốt", 
                new BigDecimal("2990000"), 150, "https://picsum.photos/500/500?random=308", categories.get(2)),

            // Đồng hồ thông minh
            createProduct("Apple Watch Ultra 2", "Apple Watch Ultra 2 49mm - Đồng hồ thông minh cao cấp", 
                new BigDecimal("19990000"), 40, "https://picsum.photos/500/500?random=401", categories.get(3)),
            createProduct("Samsung Galaxy Watch 6 Classic", "Samsung Galaxy Watch 6 Classic 47mm - Đồng hồ thông minh với vòng bezel", 
                new BigDecimal("9990000"), 50, "https://picsum.photos/500/500?random=402", categories.get(3)),
            createProduct("Garmin Fenix 7 Pro", "Garmin Fenix 7 Pro - Đồng hồ thể thao chuyên nghiệp", 
                new BigDecimal("18990000"), 30, "https://picsum.photos/500/500?random=403", categories.get(3)),
            createProduct("Fitbit Charge 6", "Fitbit Charge 6 - Vòng đeo tay theo dõi sức khỏe", 
                new BigDecimal("5990000"), 100, "https://picsum.photos/500/500?random=404", categories.get(3)),
            createProduct("Xiaomi Watch S3", "Xiaomi Watch S3 - Đồng hồ thông minh giá tốt", 
                new BigDecimal("3990000"), 120, "https://picsum.photos/500/500?random=405", categories.get(3)),
            createProduct("Huawei Watch GT 4", "Huawei Watch GT 4 - Đồng hồ thông minh pin lâu", 
                new BigDecimal("6990000"), 80, "https://picsum.photos/500/500?random=406", categories.get(3)),

            // Phụ kiện
            createProduct("Sạc không dây MagSafe", "Sạc không dây MagSafe 15W cho iPhone", 
                new BigDecimal("1990000"), 200, "https://picsum.photos/500/500?random=501", categories.get(4)),
            createProduct("Ốp lưng iPhone 15 Pro Max", "Ốp lưng trong suốt chống sốc cho iPhone 15 Pro Max", 
                new BigDecimal("499000"), 300, "https://picsum.photos/500/500?random=502", categories.get(4)),
            createProduct("Cáp USB-C to Lightning", "Cáp USB-C to Lightning chính hãng Apple 1m", 
                new BigDecimal("899000"), 250, "https://picsum.photos/500/500?random=503", categories.get(4)),
            createProduct("Pin sạc dự phòng 20000mAh", "Pin sạc dự phòng 20000mAh hỗ trợ sạc nhanh", 
                new BigDecimal("1299000"), 180, "https://picsum.photos/500/500?random=504", categories.get(4)),
            createProduct("Giá đỡ laptop", "Giá đỡ laptop nhôm cao cấp điều chỉnh độ cao", 
                new BigDecimal("799000"), 150, "https://picsum.photos/500/500?random=505", categories.get(4)),
            createProduct("Bàn phím cơ không dây", "Bàn phím cơ không dây RGB 87 phím", 
                new BigDecimal("2990000"), 100, "https://picsum.photos/500/500?random=506", categories.get(4)),
            createProduct("Chuột không dây Logitech MX Master 3S", "Chuột không dây cao cấp với nhiều nút bấm", 
                new BigDecimal("3490000"), 90, "https://picsum.photos/500/500?random=507", categories.get(4)),
            createProduct("Webcam 4K Logitech Brio", "Webcam 4K với HDR và micro tích hợp", 
                new BigDecimal("5990000"), 60, "https://picsum.photos/500/500?random=508", categories.get(4)),

            // Máy ảnh
            createProduct("Canon EOS R6 Mark II", "Canon EOS R6 Mark II body - Máy ảnh mirrorless full-frame", 
                new BigDecimal("69990000"), 15, "https://picsum.photos/500/500?random=601", categories.get(5)),
            createProduct("Sony A7 IV", "Sony A7 IV body - Máy ảnh mirrorless full-frame 33MP", 
                new BigDecimal("59990000"), 20, "https://picsum.photos/500/500?random=602", categories.get(5)),
            createProduct("Nikon Z6 III", "Nikon Z6 III body - Máy ảnh mirrorless full-frame", 
                new BigDecimal("64990000"), 18, "https://picsum.photos/500/500?random=603", categories.get(5)),
            createProduct("Fujifilm X-T5", "Fujifilm X-T5 body - Máy ảnh mirrorless APS-C", 
                new BigDecimal("44990000"), 25, "https://picsum.photos/500/500?random=604", categories.get(5)),
            createProduct("GoPro Hero 12", "GoPro Hero 12 Black - Action camera 4K", 
                new BigDecimal("11990000"), 50, "https://picsum.photos/500/500?random=605", categories.get(5)),
            createProduct("DJI Mini 4 Pro", "DJI Mini 4 Pro Fly More Combo - Drone 4K", 
                new BigDecimal("24990000"), 30, "https://picsum.photos/500/500?random=606", categories.get(5)),

            // Tablet
            createProduct("iPad Pro 12.9 inch M2", "iPad Pro 12.9 inch M2 256GB - Tablet cao cấp", 
                new BigDecimal("29990000"), 40, "https://picsum.photos/500/500?random=701", categories.get(6)),
            createProduct("Samsung Galaxy Tab S9 Ultra", "Samsung Galaxy Tab S9 Ultra 256GB - Tablet Android cao cấp", 
                new BigDecimal("24990000"), 35, "https://picsum.photos/500/500?random=702", categories.get(6)),
            createProduct("Microsoft Surface Pro 9", "Microsoft Surface Pro 9 256GB - Tablet 2-in-1", 
                new BigDecimal("34990000"), 30, "https://picsum.photos/500/500?random=703", categories.get(6)),
            createProduct("iPad Air M2", "iPad Air M2 256GB - Tablet đa năng", 
                new BigDecimal("19990000"), 60, "https://picsum.photos/500/500?random=704", categories.get(6)),
            createProduct("Xiaomi Pad 6 Pro", "Xiaomi Pad 6 Pro 256GB - Tablet giá tốt", 
                new BigDecimal("9990000"), 80, "https://picsum.photos/500/500?random=705", categories.get(6)),

            // Loa
            createProduct("Sonos Era 300", "Sonos Era 300 - Loa thông minh 360 độ", 
                new BigDecimal("14990000"), 45, "https://picsum.photos/500/500?random=801", categories.get(7)),
            createProduct("Bose SoundLink Flex", "Bose SoundLink Flex - Loa Bluetooth chống nước", 
                new BigDecimal("5990000"), 70, "https://picsum.photos/500/500?random=802", categories.get(7)),
            createProduct("JBL Charge 5", "JBL Charge 5 - Loa Bluetooth pin lâu", 
                new BigDecimal("4990000"), 90, "https://picsum.photos/500/500?random=803", categories.get(7)),
            createProduct("Sony SRS-XB43", "Sony SRS-XB43 - Loa Bluetooth Extra Bass", 
                new BigDecimal("6990000"), 65, "https://picsum.photos/500/500?random=804", categories.get(7)),
            createProduct("Marshall Acton III", "Marshall Acton III - Loa Bluetooth cổ điển", 
                new BigDecimal("7990000"), 55, "https://picsum.photos/500/500?random=805", categories.get(7)),
            createProduct("Harman Kardon Onyx Studio 8", "Harman Kardon Onyx Studio 8 - Loa Bluetooth cao cấp", 
                new BigDecimal("8990000"), 40, "https://picsum.photos/500/500?random=806", categories.get(7))
        );

        return productRepository.saveAll(products);
    }

    private Product createProduct(String name, String description, BigDecimal price,
                                 Integer stockQuantity, String imageUrl, Category category) {
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);

        // Gán cấu hình cơ bản cho một số nhóm sản phẩm
        String categoryName = category.getName();
        if ("Laptop".equalsIgnoreCase(categoryName)) {
            product.setCpu("Intel Core i7 / Ryzen 7");
            product.setRam("16GB DDR4");
            product.setStorage("512GB SSD");
            product.setGpu("RTX 4060 / Intel Iris Xe");
            product.setScreenSize("15.6\" 2K 165Hz");
            product.setColor("Bạc / Đen");
        } else if ("Điện thoại".equalsIgnoreCase(categoryName)) {
            product.setCpu("Chip 8 nhân mới nhất");
            product.setRam("8GB");
            product.setStorage("256GB");
            product.setScreenSize("6.5\" OLED 120Hz");
            product.setColor("Nhiều màu");
        }

        product.setPrice(price);
        product.setStockQuantity(stockQuantity);
        product.setImageUrl(imageUrl);
        product.setCategory(category);
        product.setActive(true);
        return product;
    }
}

