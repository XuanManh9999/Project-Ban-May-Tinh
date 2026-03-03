# WEBSITE BÁN MÁY TÍNH TRỰC TUYẾN – COMPUTER SHOP

## Mô tả chi tiết dự án

---

## 1. TỔNG QUAN DỰ ÁN

### 1.1. Giới thiệu

Computer Shop là website thương mại điện tử chuyên bán máy tính và các sản phẩm công nghệ liên quan. Hệ thống bao gồm:

- **Giao diện người dùng (Customer):** Cho phép khách hàng duyệt sản phẩm, tìm kiếm, thêm vào giỏ hàng, đặt hàng, thanh toán trực tuyến qua VNPay, quản lý đơn hàng và thông tin cá nhân.
- **Giao diện quản trị (Admin):** Cho phép quản trị viên quản lý toàn bộ sản phẩm, danh mục, đơn hàng, khuyến mãi, theo dõi doanh thu và xuất báo cáo thống kê trực quan.

### 1.2. Mục tiêu

- Xây dựng website bán hàng trực tuyến hoàn chỉnh với đầy đủ chức năng mua sắm.
- Áp dụng kiến trúc **RESTful API** tách biệt Backend và Frontend.
- Tích hợp thanh toán điện tử qua **VNPay**.
- Thiết kế hệ thống thuộc tính sản phẩm **đa cấp (dynamic attributes)** – cho phép bán đa dạng loại sản phẩm (laptop, linh kiện, phụ kiện, phần mềm...) với thông số kỹ thuật khác nhau.
- Xây dựng hệ thống **báo cáo, thống kê** trực quan bằng biểu đồ cho quản trị viên.
- Hỗ trợ gửi **OTP qua email** để đặt lại mật khẩu.

---

## 2. CÔNG NGHỆ SỬ DỤNG

### 2.1. Backend

| Công nghệ | Phiên bản | Vai trò |
|---|---|---|
| **Java** | 21 (LTS) | Ngôn ngữ lập trình chính |
| **Spring Boot** | 3.5.7 | Framework phát triển ứng dụng web |
| **Spring Security** | (theo Spring Boot) | Bảo mật, xác thực, phân quyền |
| **Spring Data JPA** | (theo Spring Boot) | ORM – tương tác cơ sở dữ liệu |
| **Spring Validation** | (theo Spring Boot) | Xác thực dữ liệu đầu vào |
| **Spring Mail** | (theo Spring Boot) | Gửi email OTP qua SMTP |
| **Hibernate** | (theo Spring Boot) | Triển khai JPA, tự động tạo/cập nhật schema |
| **JWT (jjwt)** | 0.11.5 | Tạo và xác thực JSON Web Token |
| **SQL Server** | SQLEXPRESS | Hệ quản trị cơ sở dữ liệu |
| **Lombok** | (theo Spring Boot) | Giảm boilerplate code (getter, setter, constructor...) |
| **Maven** | – | Quản lý dependency và build |

### 2.2. Frontend

| Công nghệ | Phiên bản | Vai trò |
|---|---|---|
| **React** | 18.2.0 | Thư viện xây dựng giao diện người dùng |
| **Vite** | 5.0.8 | Build tool và dev server nhanh |
| **React Router** | 6.20.0 | Điều hướng (SPA routing) |
| **Tailwind CSS** | 3.3.6 | CSS utility-first framework |
| **Axios** | 1.6.2 | HTTP client gọi API |
| **Recharts** | 3.7.0 | Thư viện vẽ biểu đồ (Area, Bar, Pie, Line, Composed) |
| **React Toastify** | 9.1.3 | Thông báo toast |
| **React Icons** | 4.12.0 | Bộ icon (FontAwesome, ...) |
| **React Quill** | 2.0.0 | Trình soạn thảo văn bản giàu (rich text editor) |

### 2.3. Công cụ & hạ tầng

| Công cụ | Vai trò |
|---|---|
| **VNPay Sandbox** | Cổng thanh toán điện tử (môi trường test) |
| **Gmail SMTP** | Gửi email OTP đặt lại mật khẩu |
| **SQL Server Management Studio** | Quản lý cơ sở dữ liệu |
| **Git** | Quản lý mã nguồn |

---

## 3. KIẾN TRÚC HỆ THỐNG

### 3.1. Mô hình tổng quan

```
┌──────────────────┐     HTTP/JSON     ┌──────────────────────┐     JDBC     ┌──────────────┐
│   React Frontend │ ◄──────────────► │  Spring Boot Backend  │ ◄──────────► │  SQL Server  │
│   (Port 3000)    │     RESTful API  │     (Port 8080)       │              │  (SQLEXPRESS) │
└──────────────────┘                   └──────────┬───────────┘              └──────────────┘
                                                  │
                                          ┌───────┴───────┐
                                          │               │
                                     ┌────▼────┐    ┌─────▼─────┐
                                     │  VNPay  │    │   Gmail   │
                                     │ Sandbox │    │   SMTP    │
                                     └─────────┘    └───────────┘
```

### 3.2. Kiến trúc Backend (Layered Architecture)

```
Controller  →  Service  →  Repository  →  Database
    ↓              ↓
   DTO          Entity
```

| Tầng | Vai trò |
|---|---|
| **Controller** | Nhận request HTTP, gọi Service, trả response JSON |
| **Service** | Chứa business logic, gọi Repository |
| **Repository** | Truy vấn cơ sở dữ liệu thông qua JPA |
| **Entity** | Ánh xạ bảng trong CSDL (ORM) |
| **DTO** | Đối tượng truyền dữ liệu giữa các tầng (Request/Response) |
| **Security** | Xác thực JWT, phân quyền ADMIN/CUSTOMER |
| **Exception** | Xử lý lỗi tập trung (GlobalExceptionHandler) |

### 3.3. Kiến trúc Frontend

```
App.jsx (Routing)
├── Context (AuthContext, CartContext)     ← State toàn cục
├── Pages                                 ← Các trang giao diện
│   ├── Public (Home, Products, Login...)
│   └── Admin (Dashboard, Reports...)
├── Components                            ← Thành phần tái sử dụng
├── Services (api.js)                     ← Gọi API Backend
└── Utils (format.js)                     ← Tiện ích dùng chung
```

---

## 4. CƠ SỞ DỮ LIỆU

### 4.1. Sơ đồ các bảng (Entity Relationship)

Hệ thống gồm **11 bảng** chính:

| STT | Bảng | Mô tả |
|-----|------|-------|
| 1 | `users` | Người dùng (admin, khách hàng) |
| 2 | `products` | Sản phẩm |
| 3 | `product_attributes` | Thuộc tính động của sản phẩm (key-value) |
| 4 | `categories` | Danh mục sản phẩm |
| 5 | `carts` | Giỏ hàng (1-1 với user) |
| 6 | `cart_items` | Chi tiết giỏ hàng |
| 7 | `orders` | Đơn hàng |
| 8 | `order_items` | Chi tiết đơn hàng |
| 9 | `promotions` | Mã khuyến mãi |
| 10 | `password_reset_tokens` | Token đặt lại mật khẩu (OTP) |
| 11 | `search_history` | Lịch sử tìm kiếm |

### 4.2. Chi tiết các bảng

#### Bảng `users`

| Cột | Kiểu | Ràng buộc | Mô tả |
|-----|------|-----------|-------|
| id | BIGINT | PK, Identity | Mã người dùng |
| username | NVARCHAR(50) | Unique, Not Null | Tên đăng nhập |
| full_name | NVARCHAR(100) | Not Null | Họ tên |
| email | NVARCHAR(100) | Unique, Not Null | Email |
| password | NVARCHAR(255) | Not Null | Mật khẩu (BCrypt hash) |
| phone | NVARCHAR(20) | | Số điện thoại |
| address | NVARCHAR(500) | | Địa chỉ |
| role | NVARCHAR(20) | Not Null | Vai trò: ADMIN / CUSTOMER |
| enabled | BIT | Not Null | Trạng thái kích hoạt |
| created_at | DATETIME2 | Not Null | Ngày tạo |
| updated_at | DATETIME2 | | Ngày cập nhật |

#### Bảng `products`

| Cột | Kiểu | Ràng buộc | Mô tả |
|-----|------|-----------|-------|
| id | BIGINT | PK, Identity | Mã sản phẩm |
| name | NVARCHAR(255) | Not Null | Tên sản phẩm |
| description | NVARCHAR(2000) | | Mô tả (hỗ trợ HTML) |
| price | DECIMAL(10,2) | Not Null | Giá bán |
| stock_quantity | INT | Not Null | Số lượng tồn kho |
| image_url | NVARCHAR(255) | | Đường dẫn hình ảnh |
| category_id | BIGINT | FK → categories | Danh mục |
| active | BIT | Not Null | Trạng thái bán |
| created_at | DATETIME2 | Not Null | Ngày tạo |
| updated_at | DATETIME2 | | Ngày cập nhật |

#### Bảng `product_attributes`

| Cột | Kiểu | Ràng buộc | Mô tả |
|-----|------|-----------|-------|
| id | BIGINT | PK, Identity | Mã thuộc tính |
| attribute_name | NVARCHAR(100) | Not Null | Tên thuộc tính (VD: CPU, RAM, Kích thước) |
| attribute_value | NVARCHAR(500) | Not Null | Giá trị (VD: Intel Core i7, 16GB) |
| product_id | BIGINT | FK → products, Not Null | Sản phẩm sở hữu |

#### Bảng `categories`

| Cột | Kiểu | Ràng buộc | Mô tả |
|-----|------|-----------|-------|
| id | BIGINT | PK, Identity | Mã danh mục |
| name | NVARCHAR(100) | Unique, Not Null | Tên danh mục |
| description | NVARCHAR(500) | | Mô tả |
| image_url | NVARCHAR(255) | | Hình ảnh đại diện |
| created_at | DATETIME2 | Not Null | Ngày tạo |
| updated_at | DATETIME2 | | Ngày cập nhật |

#### Bảng `orders`

| Cột | Kiểu | Ràng buộc | Mô tả |
|-----|------|-----------|-------|
| id | BIGINT | PK, Identity | Mã đơn hàng |
| order_number | NVARCHAR(50) | Unique, Not Null | Số đơn hàng |
| user_id | BIGINT | FK → users, Not Null | Người đặt |
| total_amount | DECIMAL(10,2) | Not Null | Tổng tiền trước giảm giá |
| discount_amount | DECIMAL(10,2) | | Số tiền giảm |
| final_amount | DECIMAL(10,2) | Not Null | Tổng tiền sau giảm giá |
| status | NVARCHAR(20) | Not Null | Trạng thái đơn hàng |
| payment_method | NVARCHAR(20) | Not Null | Phương thức thanh toán |
| payment_status | NVARCHAR(20) | Not Null | Trạng thái thanh toán |
| shipping_address | NVARCHAR(500) | | Địa chỉ giao hàng |
| phone_number | NVARCHAR(20) | | SĐT nhận hàng |
| note | NVARCHAR(1000) | | Ghi chú |
| promotion_id | BIGINT | FK → promotions | Mã khuyến mãi áp dụng |
| created_at | DATETIME2 | Not Null | Ngày đặt |
| updated_at | DATETIME2 | | Ngày cập nhật |

**Enum trạng thái đơn hàng:** PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED / CANCELLED

**Enum phương thức thanh toán:** COD, VNPAY, BANK_TRANSFER

**Enum trạng thái thanh toán:** UNPAID, PAID, REFUNDED

#### Bảng `order_items`

| Cột | Kiểu | Ràng buộc | Mô tả |
|-----|------|-----------|-------|
| id | BIGINT | PK, Identity | Mã chi tiết |
| order_id | BIGINT | FK → orders, Not Null | Đơn hàng |
| product_id | BIGINT | FK → products, Not Null | Sản phẩm |
| quantity | INT | Not Null | Số lượng |
| price | DECIMAL(10,2) | Not Null | Đơn giá tại thời điểm mua |
| subtotal | DECIMAL(10,2) | Not Null | Thành tiền (price × quantity) |

#### Bảng `promotions`

| Cột | Kiểu | Ràng buộc | Mô tả |
|-----|------|-----------|-------|
| id | BIGINT | PK, Identity | Mã khuyến mãi |
| code | NVARCHAR(50) | Unique, Not Null | Mã giảm giá (VD: WELCOME10) |
| name | NVARCHAR(255) | Not Null | Tên chương trình |
| description | NVARCHAR(1000) | | Mô tả |
| discount_type | NVARCHAR(20) | Not Null | PERCENTAGE / FIXED_AMOUNT |
| discount_value | DECIMAL(10,2) | Not Null | Giá trị giảm (% hoặc VNĐ) |
| min_order_amount | DECIMAL(10,2) | | Đơn hàng tối thiểu |
| max_discount_amount | DECIMAL(10,2) | | Giảm tối đa (cho loại %) |
| start_date | DATETIME2 | Not Null | Ngày bắt đầu |
| end_date | DATETIME2 | Not Null | Ngày kết thúc |
| usage_limit | INT | Not Null | Giới hạn sử dụng (0 = vô hạn) |
| used_count | INT | Not Null | Số lần đã dùng |
| active | BIT | Not Null | Trạng thái |
| created_at | DATETIME2 | Not Null | Ngày tạo |
| updated_at | DATETIME2 | | Ngày cập nhật |

#### Bảng `password_reset_tokens`

| Cột | Kiểu | Ràng buộc | Mô tả |
|-----|------|-----------|-------|
| id | BIGINT | PK, Identity | |
| email | NVARCHAR(255) | Not Null | Email yêu cầu |
| reset_code | NVARCHAR(255) | Not Null | Mã OTP 6 chữ số |
| expiry_date | DATETIME2 | Not Null | Hạn hiệu lực (15 phút) |
| used | BIT | Not Null | Đã sử dụng chưa |
| created_at | DATETIME2 | Not Null | Ngày tạo |

---

## 5. DANH SÁCH API ENDPOINTS

### 5.1. Xác thực (Authentication)

| Method | Endpoint | Mô tả | Quyền |
|--------|----------|-------|-------|
| POST | `/api/auth/register` | Đăng ký tài khoản mới | Public |
| POST | `/api/auth/login` | Đăng nhập, nhận JWT | Public |
| POST | `/api/auth/forgot-password` | Gửi OTP qua email | Public |
| POST | `/api/auth/reset-password` | Đặt lại mật khẩu bằng OTP | Public |

### 5.2. Sản phẩm (Products)

| Method | Endpoint | Mô tả | Quyền |
|--------|----------|-------|-------|
| GET | `/api/products?page=&size=` | Danh sách sản phẩm (phân trang) | Public |
| GET | `/api/products/search?keyword=&categoryId=` | Tìm kiếm sản phẩm | Public |
| GET | `/api/products/{id}` | Chi tiết sản phẩm | Public |
| GET | `/api/products/{id}/related` | Sản phẩm liên quan | Public |
| POST | `/api/products` | Tạo sản phẩm mới | Admin |
| PUT | `/api/products/{id}` | Cập nhật sản phẩm | Admin |
| DELETE | `/api/products/{id}` | Xóa sản phẩm | Admin |

### 5.3. Danh mục (Categories)

| Method | Endpoint | Mô tả | Quyền |
|--------|----------|-------|-------|
| GET | `/api/categories` | Lấy tất cả danh mục | Public |
| GET | `/api/categories/{id}` | Chi tiết danh mục | Public |
| POST | `/api/categories` | Tạo danh mục | Admin |
| PUT | `/api/categories/{id}` | Cập nhật danh mục | Admin |
| DELETE | `/api/categories/{id}` | Xóa danh mục | Admin |

### 5.4. Giỏ hàng (Cart)

| Method | Endpoint | Mô tả | Quyền |
|--------|----------|-------|-------|
| GET | `/api/cart` | Lấy giỏ hàng của user | Customer |
| POST | `/api/cart/add` | Thêm sản phẩm vào giỏ | Customer |
| PUT | `/api/cart/items/{itemId}` | Cập nhật số lượng | Customer |
| DELETE | `/api/cart/items/{itemId}` | Xóa sản phẩm khỏi giỏ | Customer |
| DELETE | `/api/cart/clear` | Xóa toàn bộ giỏ hàng | Customer |

### 5.5. Đơn hàng (Orders)

| Method | Endpoint | Mô tả | Quyền |
|--------|----------|-------|-------|
| POST | `/api/orders` | Đặt hàng | Customer |
| GET | `/api/orders/{id}` | Chi tiết đơn hàng | Customer |
| GET | `/api/orders/my-orders?page=&size=` | Đơn hàng của tôi | Customer |
| GET | `/api/orders/admin/all?page=&size=` | Tất cả đơn hàng | Admin |
| PATCH | `/api/orders/{id}/status?status=` | Cập nhật trạng thái | Admin |

### 5.6. Thanh toán (Payment)

| Method | Endpoint | Mô tả | Quyền |
|--------|----------|-------|-------|
| POST | `/api/payment/vnpay/create?orderId=` | Tạo URL thanh toán VNPay | Customer |
| GET | `/api/payment/vnpay-return` | Callback xác thực từ VNPay | Public |

### 5.7. Khuyến mãi (Promotions)

| Method | Endpoint | Mô tả | Quyền |
|--------|----------|-------|-------|
| GET | `/api/promotions` | Tất cả mã khuyến mãi | Admin |
| GET | `/api/promotions/active` | Mã đang hoạt động | Customer |
| GET | `/api/promotions/{id}` | Chi tiết | Admin |
| GET | `/api/promotions/code/{code}` | Tra cứu theo mã | Customer |
| POST | `/api/promotions` | Tạo khuyến mãi | Admin |
| PUT | `/api/promotions/{id}` | Cập nhật | Admin |
| DELETE | `/api/promotions/{id}` | Xóa | Admin |

### 5.8. Người dùng (User)

| Method | Endpoint | Mô tả | Quyền |
|--------|----------|-------|-------|
| GET | `/api/user/profile` | Xem thông tin cá nhân | Customer |
| PUT | `/api/user/profile` | Cập nhật thông tin | Customer |
| POST | `/api/user/change-password` | Đổi mật khẩu | Customer |

---

## 6. CHỨC NĂNG CHI TIẾT

### 6.1. Phía khách hàng (Customer)

#### 6.1.1. Đăng ký / Đăng nhập
- Đăng ký tài khoản với thông tin: tên đăng nhập, họ tên, email, mật khẩu.
- Đăng nhập bằng tên đăng nhập + mật khẩu, nhận JWT token.
- Token lưu trong `localStorage`, tự động đính kèm vào mọi request API qua Axios Interceptor.
- Tự động đăng xuất khi token hết hạn (server trả 401).

#### 6.1.2. Quên mật khẩu (OTP qua Email)
- Bước 1: Nhập email → backend gửi mã OTP 6 chữ số qua Gmail SMTP.
- Bước 2: Nhập mã OTP + mật khẩu mới → backend xác thực mã (chưa dùng, chưa hết hạn 15 phút) → cập nhật mật khẩu.
- Email gửi dưới dạng HTML đẹp với branding "Computer Shop".

#### 6.1.3. Duyệt & Tìm kiếm sản phẩm
- Trang chủ: Hero banner, danh mục nổi bật, sản phẩm mới.
- Trang sản phẩm: Lọc theo danh mục, tìm kiếm theo từ khóa, phân trang.
- Chi tiết sản phẩm: Hình ảnh, giá, mô tả (rich text HTML), bảng thông số kỹ thuật (dynamic attributes), sản phẩm liên quan.
- Hệ thống lưu lịch sử tìm kiếm.

#### 6.1.4. Giỏ hàng
- Thêm sản phẩm vào giỏ (kiểm tra tồn kho).
- Cập nhật số lượng, xóa từng sản phẩm, xóa toàn bộ.
- Hiển thị tổng tiền, số lượng sản phẩm trên header.
- State quản lý qua `CartContext` (React Context API).

#### 6.1.5. Đặt hàng & Thanh toán
- Nhập địa chỉ giao hàng (tích hợp API tỉnh/thành phố Việt Nam).
- Áp dụng mã khuyến mãi (hệ thống tự tính giảm giá theo %, hoặc số tiền cố định).
- Chọn phương thức thanh toán:
  - **COD** (Thanh toán khi nhận hàng): Đặt hàng xong, trạng thái UNPAID.
  - **VNPay**: Redirect sang cổng thanh toán VNPay → callback xác thực → cập nhật trạng thái PAID.
- Trang xác thực thanh toán VNPay: Kiểm tra chữ ký (secure hash), hiển thị kết quả thành công/thất bại.

#### 6.1.6. Quản lý đơn hàng
- Danh sách đơn hàng của tôi với trạng thái.
- Chi tiết đơn hàng: sản phẩm, số lượng, giá, giảm giá, tổng tiền, thông tin giao hàng.

#### 6.1.7. Quản lý tài khoản
- Xem và cập nhật thông tin cá nhân (họ tên, email, SĐT, địa chỉ).
- Đổi mật khẩu (nhập mật khẩu cũ + mới).

### 6.2. Phía quản trị viên (Admin)

#### 6.2.1. Dashboard (Bảng điều khiển)
- 4 thẻ thống kê: Tổng sản phẩm, Tổng đơn hàng, Doanh thu hôm nay, Đơn chờ xử lý.
- Banner tổng doanh thu.
- **Biểu đồ Area Chart**: Doanh thu 14 ngày gần nhất.
- **Biểu đồ Pie Chart**: Phân bố trạng thái đơn hàng.
- **Biểu đồ Pie Chart**: Phương thức thanh toán.
- **Biểu đồ Bar Chart**: Sản phẩm theo danh mục.
- Bảng đơn hàng gần đây.
- Nút truy cập nhanh các chức năng.

#### 6.2.2. Quản lý sản phẩm
- CRUD sản phẩm (tạo, sửa, xóa).
- Form tạo/sửa: tên, mô tả (rich text editor ReactQuill), giá, tồn kho, hình ảnh, danh mục.
- **Thuộc tính động (Dynamic Attributes)**: Admin tự thêm/xóa/sửa các cặp key-value (VD: CPU = Intel Core i7, RAM = 16GB).
- Template thuộc tính tự động gợi ý theo danh mục (Laptop → CPU, RAM, GPU...; Màn hình → Kích thước, Tần số quét...).
- Tìm kiếm, lọc theo danh mục, lọc trạng thái.
- Phân trang với tuỳ chọn số lượng/trang.

#### 6.2.3. Quản lý danh mục
- CRUD danh mục (tên, mô tả, hình ảnh).
- Hiển thị dạng grid card.

#### 6.2.4. Quản lý đơn hàng
- Danh sách tất cả đơn hàng.
- Lọc theo trạng thái đơn, phương thức thanh toán.
- Cập nhật trạng thái đơn hàng (PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED).
- Phân trang.

#### 6.2.5. Quản lý khuyến mãi
- CRUD mã khuyến mãi.
- Hỗ trợ 2 loại: giảm theo phần trăm (%) và giảm số tiền cố định.
- Cấu hình: đơn tối thiểu, giảm tối đa, thời gian hiệu lực, giới hạn sử dụng.
- Hiển thị trạng thái, số lần đã dùng.
- Phân trang.

#### 6.2.6. Báo cáo & Thống kê
Trang báo cáo riêng với 4 tab:

| Tab | Nội dung |
|-----|---------|
| **Doanh thu** | Composed Chart (doanh thu + số đơn theo ngày), Bar Chart (doanh thu theo danh mục) |
| **Đơn hàng** | Pie Chart trạng thái, Donut Chart phương thức thanh toán, Line Chart số đơn theo ngày |
| **Sản phẩm** | Pie Chart sản phẩm theo danh mục, Bar Chart top bán chạy, Stacked Bar tồn kho |
| **Chi tiết** | Bảng top sản phẩm bán chạy, bảng doanh thu theo danh mục, bảng tổng hợp trạng thái |

- 6 thẻ tổng hợp: Tổng doanh thu, Tổng đơn, Đã thanh toán, Đã hủy, Giá trị trung bình/đơn, Tổng sản phẩm.

---

## 7. BẢO MẬT

### 7.1. Xác thực (Authentication)
- Sử dụng **JWT (JSON Web Token)** với thuật toán **HS512**.
- Token có hiệu lực **24 giờ**.
- Token gửi qua header `Authorization: Bearer <token>`.
- Mật khẩu được mã hóa bằng **BCrypt** trước khi lưu vào CSDL.

### 7.2. Phân quyền (Authorization)
- 2 vai trò: **ADMIN** và **CUSTOMER**.
- API phân quyền rõ ràng:
  - **Public**: Xem sản phẩm, danh mục, đăng ký, đăng nhập.
  - **Customer**: Giỏ hàng, đặt hàng, xem đơn hàng cá nhân.
  - **Admin**: Quản lý sản phẩm, danh mục, đơn hàng, khuyến mãi, xem tất cả đơn hàng.
- Frontend: `PrivateRoute` bảo vệ trang yêu cầu đăng nhập, `AdminRoute` bảo vệ trang quản trị.

### 7.3. Bảo mật khác
- CORS chỉ cho phép `http://localhost:3000`.
- VNPay callback xác thực bằng **Secure Hash (HMAC SHA-512)**.
- OTP đặt lại mật khẩu hết hạn sau **15 phút**, dùng 1 lần.
- Xử lý lỗi tập trung qua `GlobalExceptionHandler` (không lộ stack trace ra API response).
- Dữ liệu đầu vào được validate bằng `@Valid` (Jakarta Validation).

---

## 8. CẤU TRÚC THƯ MỤC DỰ ÁN

### 8.1. Backend

```
backend/
├── pom.xml
└── src/main/
    ├── java/com/web_ban_hang_may_tinh/computershop/
    │   ├── ComputerApplication.java              (Main class)
    │   ├── controller/                           (8 controllers)
    │   │   ├── AuthController.java
    │   │   ├── CartController.java
    │   │   ├── CategoryController.java
    │   │   ├── OrderController.java
    │   │   ├── PaymentController.java
    │   │   ├── ProductController.java
    │   │   ├── PromotionController.java
    │   │   └── UserController.java
    │   ├── service/                              (10 services)
    │   │   ├── AuthService.java
    │   │   ├── CartService.java
    │   │   ├── CategoryService.java
    │   │   ├── EmailService.java
    │   │   ├── OrderService.java
    │   │   ├── ProductService.java
    │   │   ├── PromotionService.java
    │   │   ├── SearchHistoryService.java
    │   │   ├── UserService.java
    │   │   └── VNPayService.java
    │   ├── repository/                           (10 repositories)
    │   ├── entity/                               (11 entities)
    │   │   ├── User.java
    │   │   ├── Product.java
    │   │   ├── ProductAttribute.java
    │   │   ├── Category.java
    │   │   ├── Cart.java
    │   │   ├── CartItem.java
    │   │   ├── Order.java
    │   │   ├── OrderItem.java
    │   │   ├── Promotion.java
    │   │   ├── PasswordResetToken.java
    │   │   └── SearchHistory.java
    │   ├── dto/                                  (24 DTOs)
    │   │   ├── auth/     (5 DTO)
    │   │   ├── cart/     (4 DTO)
    │   │   ├── category/ (2 DTO)
    │   │   ├── common/   (2 DTO: ApiResponse, PageResponse)
    │   │   ├── order/    (3 DTO)
    │   │   ├── product/  (3 DTO)
    │   │   ├── promotion/(2 DTO)
    │   │   └── user/     (3 DTO)
    │   ├── security/                             (5 files)
    │   │   ├── SecurityConfig.java
    │   │   ├── JwtTokenProvider.java
    │   │   ├── JwtAuthenticationFilter.java
    │   │   ├── CustomUserDetailsService.java
    │   │   └── UserPrincipal.java
    │   ├── exception/                            (3 files)
    │   │   ├── GlobalExceptionHandler.java
    │   │   ├── BadRequestException.java
    │   │   └── ResourceNotFoundException.java
    │   ├── payment/
    │   │   └── VNPayConfig.java
    │   └── seeder/
    │       └── DataSeeder.java
    └── resources/
        ├── application.properties
        └── data.sql
```

### 8.2. Frontend

```
front-end/
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── index.html
└── src/
    ├── main.jsx                                  (Entry point)
    ├── App.jsx                                   (Routing chính)
    ├── index.css                                 (Tailwind imports)
    ├── context/
    │   ├── AuthContext.jsx                        (Quản lý xác thực)
    │   └── CartContext.jsx                        (Quản lý giỏ hàng)
    ├── services/
    │   ├── api.js                                (Axios instance + tất cả API)
    │   └── vietnamProvinces.js                   (API tỉnh/thành phố)
    ├── utils/
    │   └── format.js                             (formatVND, formatDiscount)
    ├── components/
    │   ├── Header.jsx
    │   ├── Footer.jsx
    │   ├── Logo.jsx
    │   ├── ProductCard.jsx
    │   ├── AddressForm.jsx
    │   ├── PrivateRoute.jsx
    │   ├── AdminRoute.jsx
    │   ├── PasswordInput.jsx
    │   └── admin/
    │       ├── AdminLayout.jsx
    │       └── Pagination.jsx
    └── pages/
        ├── Home.jsx
        ├── Login.jsx
        ├── Register.jsx
        ├── ForgotPassword.jsx
        ├── Products.jsx
        ├── ProductDetail.jsx
        ├── Cart.jsx
        ├── Checkout.jsx
        ├── Orders.jsx
        ├── OrderDetail.jsx
        ├── PaymentReturn.jsx
        ├── Profile.jsx
        └── admin/
            ├── Dashboard.jsx
            ├── Products.jsx
            ├── ProductsEnhanced.jsx
            ├── Orders.jsx
            ├── Categories.jsx
            ├── Promotions.jsx
            └── Reports.jsx
```

---

## 9. HƯỚNG DẪN CÀI ĐẶT VÀ CHẠY DỰ ÁN

### 9.1. Yêu cầu hệ thống

- Java JDK 21+
- Node.js 18+
- SQL Server (SQLEXPRESS)
- Maven 3.8+

### 9.2. Cài đặt Backend

```bash
# 1. Tạo database trong SQL Server
CREATE DATABASE ComputerShopDb;

# 2. Cấu hình application.properties
#    - Sửa username/password SQL Server
#    - Sửa email SMTP (nếu dùng tính năng quên mật khẩu)

# 3. Chạy backend
cd backend
mvn spring-boot:run
# Backend chạy tại http://localhost:8080
```

### 9.3. Cài đặt Frontend

```bash
cd front-end
npm install
npm run dev
# Frontend chạy tại http://localhost:3000
```

### 9.4. Tài khoản mặc định (DataSeeder)

| Vai trò | Username | Password | Email |
|---------|----------|----------|-------|
| Admin | admin | Admin@123 | admin@computershop.com |
| Customer | customer1 | Customer@123 | customer1@gmail.com |

---

## 10. ĐÁNH GIÁ VÀ HƯỚNG PHÁT TRIỂN

### 10.1. Điểm mạnh
- Kiến trúc rõ ràng, tách biệt Backend/Frontend.
- Hệ thống thuộc tính sản phẩm linh hoạt – mở rộng bán đa dạng mặt hàng.
- Tích hợp thanh toán thực tế (VNPay).
- Gửi OTP qua email thật.
- Dashboard và báo cáo trực quan với biểu đồ.
- Bảo mật JWT + phân quyền RBAC.
- Giao diện responsive, hiện đại.

### 10.2. Hướng phát triển
- Upload hình ảnh sản phẩm (thay vì URL).
- Tích hợp tìm kiếm nâng cao (Elasticsearch).
- Đánh giá & bình luận sản phẩm.
- Hệ thống wishlist.
- Thông báo realtime (WebSocket).
- Xuất báo cáo PDF/Excel.
- Tích hợp thêm phương thức thanh toán (MoMo, ZaloPay).
- Deploy lên cloud (AWS, Azure, Vercel).

---

*Tài liệu được tạo cho dự án Computer Shop – Website bán máy tính trực tuyến.*
