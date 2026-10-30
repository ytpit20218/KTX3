const jwt = require('jsonwebtoken');

// Khóa bí mật dùng để ký và xác thực token JWT
const JWT_SECRET = 'bi_mat_khong_the_bat_mi_123!@#';

/**
 * Middleware xác thực người dùng dựa trên JWT Token
 * - Kiểm tra req.headers.authorization
 * - Giải mã và kiểm tra tính hợp lệ với jwt.verify()
 * - Trả về 401 (chưa đăng nhập / thiếu token) hoặc 403 (token không hợp lệ / hết hạn)
 * - Tiếp tục next() khi token hợp lệ
 */
function xacThuc(req, res, next) {
  const authHeader = req.headers.authorization || req.headers['authorization'];

  // 1. Kiểm tra xem header Authorization có tồn tại không
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Không tìm thấy token xác thực (Thiếu header Authorization).'
    });
  }

  // 2. Lấy chuỗi token (xử lý tiền tố "Bearer " nếu có)
  let token = authHeader;
  if (authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token rỗng hoặc không đúng định dạng "Bearer <token>".'
    });
  }

  // 3. Xác minh token với jwt.verify
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại!',
        detail: err.message
      });
    }

    // Lưu thông tin payload đã giải mã vào req.user để các route tiếp theo có thể sử dụng
    req.user = decoded;
    next();
  });
}

module.exports = {
  xacThuc,
  JWT_SECRET
};
