import { useEffect, useState } from 'react';
import { ArrowUpRight, Building2, Menu, X } from 'lucide-react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';

const navItems = [
  ['/', 'Trang chủ'], ['/about', 'Giới thiệu'], ['/services', 'Dịch vụ'], ['/projects', 'Dự án'], ['/contact', 'Liên hệ'],
];

export function PublicLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  useEffect(() => setMenuOpen(false), [location.pathname]);
  return (
    <div className="public-shell">
      <header className="public-header">
        <div className="public-container header-inner">
          <Link className="brand" to="/" aria-label="HDHOME - Trang chủ">
            <span className="brand-mark"><Building2 size={22} /></span>
            <span><strong>HDHOME</strong><small>DESIGN & CONSTRUCTION</small></span>
          </Link>
          <nav className={menuOpen ? 'public-nav is-open' : 'public-nav'} aria-label="Điều hướng chính">
            {navItems.map(([to, label]) => <NavLink key={to} to={to} end={to === '/'}>{label}</NavLink>)}
            <Link className="login-link" to="/login">Đăng nhập <ArrowUpRight size={16} /></Link>
          </nav>
          <button className="menu-button" aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
        </div>
      </header>
      <main><Outlet /></main>
      <footer className="public-footer">
        <div className="public-container footer-grid">
          <div><div className="footer-brand">HDHOME<span>.</span></div><p>Giải pháp thiết kế, thi công và quản lý công trình phù hợp nhu cầu khách hàng.</p></div>
          <div><h3>Khám phá</h3>{navItems.slice(1).map(([to, label]) => <Link key={to} to={to}>{label}</Link>)}</div>
          <div><h3>Văn phòng</h3><p>121 Phạm Nhữ Tăng, phường Thanh Khê Đông, quận Thanh Khê, thành phố Đà Nẵng</p><small>Thông tin liên hệ khác: minh họa cho báo cáo thực tập.</small></div>
        </div>
        <div className="public-container footer-bottom"><span>© 2026 HDHOME. Dự án minh họa phục vụ báo cáo thực tập.</span><Link to="/login">Hệ thống nội bộ</Link></div>
      </footer>
    </div>
  );
}
