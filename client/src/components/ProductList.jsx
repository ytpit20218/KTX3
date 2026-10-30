import React, { useState, useEffect } from 'react';

/**
 * Component Trang Danh Sách Sản Phẩm (ProductList)
 * Đáp ứng đầy đủ các yêu cầu đề bài:
 * 1. Khai báo 3 state: data, loading, error
 * 2. useEffect khi component mount lấy token từ localStorage
 * 3. Gửi GET request tới /api/products với Authorization: Bearer <token>
 * 4. UX: Set loading = true khi bắt đầu, set loading = false khi xong.
 *    Cập nhật error khi có lỗi.
 *    Hiển thị giao diện tương ứng: Đang tải..., Lỗi..., hoặc danh sách <li>
 */
export default function ProductList({ onLogout }) {
  // BẮT BUỘC THEO ĐỀ BÀI: Khai báo 3 state: data, loading, error
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State phụ trợ phục vụ kiểm thử thêm (không làm ảnh hưởng yêu cầu cốt lõi)
  const [currentToken, setCurrentToken] = useState('');

  // Hàm gọi API lấy danh sách sản phẩm bảo mật
  const layDanhSachSanPham = async (overrideToken = null) => {
    // 1. Khi bắt đầu gọi API -> set loading = true, xóa lỗi cũ
    setLoading(true);
    setError(null);

    // 2. Lấy token từ localStorage (hoặc dùng overrideToken nếu đang test kịch bản giả lập)
    const token = overrideToken !== null ? overrideToken : localStorage.getItem('token');
    setCurrentToken(token || '');

    // Nếu không có token -> cập nhật error, set loading = false
    if (!token) {
      setError('Chưa đăng nhập! Không tìm thấy Token xác thực trong localStorage.');
      setLoading(false);
      return;
    }

    try {
      // 3. Gửi GET request tới /api/products với token gắn trong header Authorization: Bearer <token>
      const response = await fetch('http://localhost:3000/api/products', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();

      // 4. Kiểm tra HTTP Status
      if (!response.ok) {
        // Nếu server trả về lỗi 401 hoặc 403
        throw new Error(result.message || `Lỗi ${response.status}: Yêu cầu bị từ chối.`);
      }

      // 5. Nếu gọi thành công -> cập nhật data, set loading = false
      setData(result.data || []);
      setLoading(false);
    } catch (err) {
      // 6. Nếu thất bại (chưa đăng nhập, token sai, mạng lỗi) -> cập nhật error báo lỗi, set loading = false
      setError(err.message || 'Không thể kết nối đến máy chủ Backend.');
      setData([]); // reset data nếu có lỗi
      setLoading(false);
    }
  };

  // VÒNG ĐỜI (LIFECYCLE): useEffect chạy khi component được mount lần đầu
  useEffect(() => {
    layDanhSachSanPham();
  }, []);

  return (
    <div className="product-card">
      {/* Header trang danh sách sản phẩm */}
      <div className="product-header">
        <div className="header-info">
          <h2>📦 Quản Lý Danh Sách Sản Phẩm Bảo Mật</h2>
          <p className="header-desc">
            Dữ liệu được bảo vệ bằng <strong>JWT Middleware</strong> tại <code>GET /api/products</code>
          </p>
        </div>
        <div className="header-actions">
          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={onLogout}
            title="Xóa token khỏi localStorage và đăng xuất"
          >
            🚪 Đăng Xuất
          </button>
        </div>
      </div>

      {/* Thanh công cụ kiểm thử UX và các tình huống */}
      <div className="toolbar">
        <div className="toolbar-left">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => layDanhSachSanPham()}
            disabled={loading}
          >
            🔄 Tải Lại Dữ Liệu
          </button>
        </div>

        <div className="toolbar-right">
          <span className="toolbar-label">Thử nghiệm kịch bản lỗi:</span>
          <button
            type="button"
            className="btn btn-outline-warning btn-sm"
            onClick={() => layDanhSachSanPham('token_gia_khong_hop_le_xyz123')}
            disabled={loading}
            title="Gửi token sai định dạng để kiểm tra mã lỗi 403"
          >
            ⚠️ Test Token Sai (403)
          </button>
          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={() => layDanhSachSanPham('')}
            disabled={loading}
            title="Gửi không kèm token để kiểm tra lỗi 401"
          >
            ⛔ Test Thiếu Token (401)
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* HIỂN THỊ GIAO DIỆN THEO ĐIỀU KIỆN (BẮT BUỘC THEO ĐỀ BÀI) */}
      {/* ========================================================= */}

      {/* 1. Trạng thái Đang tải (loading === true) */}
      {loading && (
        <div className="status-box status-loading">
          <div className="spinner"></div>
          <p className="status-text">⏳ Đang tải danh sách sản phẩm...</p>
          <span className="status-sub">Vui lòng chờ trong giây lát trong khi máy chủ xác thực JWT Token...</span>
        </div>
      )}

      {/* 2. Trạng thái Báo lỗi (error !== null) */}
      {!loading && error && (
        <div className="status-box status-error">
          <div className="status-icon">❌</div>
          <h3>Đã xảy ra lỗi khi lấy dữ liệu!</h3>
          <p className="error-message">{error}</p>
          <div className="error-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => layDanhSachSanPham()}
            >
              Thử lại với Token gốc
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onLogout}
            >
              Về trang Đăng nhập
            </button>
          </div>
        </div>
      )}

      {/* 3. Trạng thái Thành công: Hiển thị danh sách <li> */}
      {!loading && !error && data && data.length > 0 && (
        <div className="product-content">
          <div className="content-meta">
            <span>Tìm thấy <strong>{data.length}</strong> sản phẩm trong kho bảo mật:</span>
            <span className="badge badge-success">✓ Xác thực JWT thành công</span>
          </div>

          <ul className="product-list">
            {data.map((item) => (
              <li key={item.id} className="product-item">
                <div className="item-icon">🏷️</div>
                <div className="item-details">
                  <div className="item-title-row">
                    <h4 className="item-name">{item.ten}</h4>
                    <span className="item-category">{item.danhMuc}</span>
                  </div>
                  <p className="item-description">{item.moTa}</p>
                  <div className="item-footer">
                    <span className="item-price">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.gia)}
                    </span>
                    <span className="item-stock">
                      Tồn kho: <strong>{item.tonKho}</strong>
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Trường hợp danh sách rỗng */}
      {!loading && !error && (!data || data.length === 0) && (
        <div className="status-box status-empty">
          <p>📭 Hiện chưa có sản phẩm nào trong kho dữ liệu.</p>
        </div>
      )}
    </div>
  );
}
