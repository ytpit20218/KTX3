const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { xacThuc, JWT_SECRET } = require('./middleware');

const app = express();
const PORT = 3000;

// ==========================================
// 1. CẤU HÌNH MIDDLEWARE HỆ THỐNG
// ==========================================

// Cấu hình CORS cho phép React Client (port 5173) truy cập
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Đọc request body dạng JSON
app.use(express.json());

// Log các request đến server để dễ dàng theo dõi và debug
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Route kiểm tra trạng thái server (Health Check)
app.get('/', (req, res) => {
  res.json({
    message: 'Backend API Server đang hoạt động!',
    routes: {
      login: 'POST /login',
      products: 'GET /api/products (Cần Authorization token)'
    }
  });
});

// ==========================================
// 2. API ĐĂNG NHẬP (POST /login)
// ==========================================
app.post('/login', (req, res) => {
  const { email, matKhau } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!email || !matKhau) {
    return res.status(400).json({
      success: false,
      message: 'Vui lòng nhập đầy đủ Email và Mật khẩu!'
    });
  }

  // Hardcode kiểm tra tài khoản theo yêu cầu đề bài:
  // email === "admin@gmail.com" và matKhau === "123456"
  if (email === 'admin@gmail.com' && matKhau === '123456') {
    // Tạo JWT token với thời hạn 1 giờ
    const payload = {
      email: email,
      role: 'admin',
      name: 'Quản trị viên'
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    console.log(`-> Đăng nhập thành công cho: ${email}`);
    return res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công!',
      token: token,
      user: payload
    });
  }

  // Nếu sai thông tin đăng nhập, trả về HTTP status 401
  console.log(`-> Đăng nhập thất bại: email=${email}`);
  return res.status(401).json({
    success: false,
    message: 'Email hoặc mật khẩu không chính xác! Vui lòng thử lại.'
  });
});

// ==========================================
// 3. API SẢN PHẨM (GET /api/products)
// ==========================================
// Route này được bảo vệ bởi middleware `xacThuc`.
// Chỉ người dùng có token hợp lệ mới lấy được dữ liệu.
const danhSachSanPham = [
  {
    id: 1,
    ten: 'Bút bi Thiên Long Gel-08',
    danhMuc: 'Dụng cụ học tập',
    gia: 12000,
    tonKho: 150,
    moTa: 'Bút mực gel màu xanh, nét viết êm trơn 0.5mm.'
  },
  {
    id: 2,
    ten: 'Vở ô ly Hồng Hà 200 trang',
    danhMuc: 'Vở viết',
    gia: 25000,
    tonKho: 85,
    moTa: 'Giấy trắng tự nhiên chống lóa mắt, định lượng 80gsm.'
  },
  {
    id: 3,
    ten: 'Thước kẻ nhôm Deli 30cm',
    danhMuc: 'Thước kẻ',
    gia: 18000,
    tonKho: 60,
    moTa: 'Thước hợp kim nhôm bền chắc, vạch chia milimet sắc nét.'
  },
  {
    id: 4,
    ten: 'Balo học sinh chống gù KTX-Pro',
    danhMuc: 'Cặp - Balo',
    gia: 350000,
    tonKho: 25,
    moTa: 'Balo đệm lưng êm ái, chất liệu chống thấm nước cao cấp.'
  },
  {
    id: 5,
    ten: 'Hộp bút màu Colokit 24 màu',
    danhMuc: 'Mỹ thuật',
    gia: 65000,
    tonKho: 40,
    moTa: 'Màu sắc tươi sáng, an toàn cho da, đạt tiêu chuẩn xuất khẩu.'
  },
  {
    id: 6,
    ten: 'Gọt bút chì bấm tự động',
    danhMuc: 'Dụng cụ học tập',
    gia: 32000,
    tonKho: 45,
    moTa: 'Lưỡi gọt thép carbon siêu bén, ngăn chứa vỏ rộng rãi.'
  }
];

app.get('/api/products', xacThuc, (req, res) => {
  console.log(`-> Lấy danh sách sản phẩm thành công bởi: ${req.user.email}`);

  // Thêm độ trễ nhẹ (ví dụ 400ms) để giao diện client thể hiện rõ hiệu ứng loading UX
  setTimeout(() => {
    res.status(200).json({
      success: true,
      data: danhSachSanPham,
      requestedBy: req.user
    });
  }, 400);
});

// ==========================================
// 4. KHỞI CHẠY SERVER
// ==========================================
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(` Server đang chạy tại: http://localhost:${PORT}`);
  console.log(` Cho phép Client:      http://localhost:5173`);
  console.log(` API Đăng nhập:        POST http://localhost:${PORT}/login`);
  console.log(` API Sản phẩm:         GET  http://localhost:${PORT}/api/products`);
  console.log(`===============================================`);
});
