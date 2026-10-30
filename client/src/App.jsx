import React, { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import ProductList from './components/ProductList';
import './App.css';

export default function App() {
  // State quản lý token đăng nhập
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Cập nhật khi đăng nhập thành công
  const handleLoginSuccess = (newToken) => {
    setToken(newToken);
    try {
      const saved = localStorage.getItem('user');
      setCurrentUser(saved ? JSON.parse(saved) : { email: 'admin@gmail.com' });
    } catch {
      setCurrentUser({ email: 'admin@gmail.com' });
    }
  };

  // Đăng xuất: xóa token khỏi localStorage và cập nhật state
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken('');
    setCurrentUser(null);
  };

  return (
    <div className="app-container">
      {/* Thanh điều hướng Header */}
      <header className="navbar">
        <div className="nav-brand">
          <span className="brand-logo">🛡️</span>
          <div>
            <h1 className="brand-title">Hệ Thống Quản Lý Sản Phẩm Bảo Mật</h1>
            <p className="brand-subtitle">Dự án Mini-Project: React Client + Express JWT Server</p>
          </div>
        </div>

        <div className="nav-status">
          {token ? (
            <div className="user-badge">
              <span className="dot dot-online"></span>
              <span>Đã đăng nhập: <strong>{currentUser?.email || 'admin@gmail.com'}</strong></span>
            </div>
          ) : (
            <div className="user-badge guest">
              <span className="dot dot-offline"></span>
              <span>Chưa xác thực</span>
            </div>
          )}
        </div>
      </header>

      {/* Nội dung chính: Hiển thị có điều kiện */}
      <main className="main-content">
        {!token ? (
          <LoginForm onLoginSuccess={handleLoginSuccess} />
        ) : (
          <ProductList onLogout={handleLogout} />
        )}
      </main>

      {/* Footer báo cáo */}
      <footer className="footer">
        <p>Báo cáo Bài tập thực hành: Xác thực JWT & Quản lý vòng đời UX trong React</p>
        <p className="text-muted">Client Port: 5173 | Server Port: 3000</p>
      </footer>
    </div>
  );
}
