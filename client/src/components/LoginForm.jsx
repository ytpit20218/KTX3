import React, { useState } from 'react';

/**
 * Component Trang Đăng Nhập (LoginForm)
 * - Quản lý form nhập Email và Mật khẩu (matKhau)
 * - Gửi POST request tới http://localhost:3000/login
 * - Xử lý lưu JWT token vào localStorage khi đăng nhập thành công
 */
export default function LoginForm({ onLoginSuccess }) {
  const [email, setEmail] = useState('admin@gmail.com');
  const [matKhau, setMatKhau] = useState('123456');
  const [submitting, setSubmitting] = useState(false);
  const [loginError, setLoginError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setLoginError(null);

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email.trim(),
          matKhau: matKhau
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Đăng nhập thất bại (Mã lỗi ${response.status})`);
      }

      // Lưu JWT Token vào localStorage theo đúng yêu cầu đề bài
      if (data.token) {
        localStorage.setItem('token', data.token);
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        // Gọi callback báo cho component cha biết đăng nhập thành công
        onLoginSuccess(data.token);
      } else {
        throw new Error('Server không trả về token hợp lệ!');
      }
    } catch (err) {
      setLoginError(err.message || 'Lỗi kết nối tới Server Backend!');
    } finally {
      setSubmitting(false);
    }
  };

  // Nút hỗ trợ điền nhanh tài khoản mẫu để chấm bài / demo nhanh chóng
  const fillSample = (type) => {
    if (type === 'valid') {
      setEmail('admin@gmail.com');
      setMatKhau('123456');
    } else {
      setEmail('khachhang@gmail.com');
      setMatKhau('matkhau_sai_123');
    }
    setLoginError(null);
  };

  return (
    <div className="login-card">
      <div className="card-header">
        <div className="card-icon">🔐</div>
        <h2>Đăng Nhập Hệ Thống</h2>
        <p className="card-subtitle">Vui lòng đăng nhập tài khoản quản trị để xem danh sách sản phẩm bảo mật</p>
      </div>

      {loginError && (
        <div className="alert alert-error">
          <span className="alert-icon">⚠️</span>
          <span>{loginError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email tài khoản:</label>
          <input
            id="email"
            type="email"
            required
            placeholder="VD: admin@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={submitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="matKhau">Mật khẩu:</label>
          <input
            id="matKhau"
            type="password"
            required
            placeholder="Nhập mật khẩu (VD: 123456)"
            value={matKhau}
            onChange={(e) => setMatKhau(e.target.value)}
            disabled={submitting}
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Đang xác thực...' : 'Đăng Nhập'}
        </button>
      </form>

      <div className="test-helpers">
        <span className="helper-title">Dữ liệu kiểm thử nhanh:</span>
        <div className="helper-buttons">
          <button
            type="button"
            className="btn btn-sm btn-outline-success"
            onClick={() => fillSample('valid')}
          >
            ✓ Điền đúng (admin@gmail.com / 123456)
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-warning"
            onClick={() => fillSample('invalid')}
          >
            ✕ Điền sai (để test lỗi 401)
          </button>
        </div>
      </div>
    </div>
  );
}
