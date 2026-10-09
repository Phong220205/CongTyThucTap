import { useState, type FormEvent } from 'react';
import { ArrowLeft, ArrowRight, Building2, Eye, EyeOff, LockKeyhole, UserRound } from 'lucide-react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { getApiError } from '../../api/client';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

export function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('Admin@123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(username, password);
      showToast('Đăng nhập thành công.');
      navigate((location.state as { from?: string })?.from || '/dashboard');
    } catch (err) {
      const message = getApiError(err);
      setError(message);
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-visual">
        <Link to="/" className="back-link">
          <ArrowLeft size={16} /> Trở về website
        </Link>

        <div className="login-visual-content">
          <span className="brand-mark brand-mark--large">
            <Building2 />
          </span>
          <span className="eyebrow eyebrow--light">HDHOME PROJECT MANAGEMENT SYSTEM</span>
          <h1>
            Quản lý tập trung.
            <br />
            <em>Triển khai rõ ràng.</em>
          </h1>
          <p>
            Nền tảng nội bộ quản lý dự án, khách hàng, nhân sự, vật tư, hồ sơ và tiến độ thi công.
          </p>
          <div className="login-stats">
            <div>
              <strong>06</strong>
              <span>Dự án demo</span>
            </div>
            <div>
              <strong>03</strong>
              <span>Vai trò hệ thống</span>
            </div>
            <div>
              <strong>01</strong>
              <span>Nguồn dữ liệu</span>
            </div>
          </div>
        </div>

        <span className="login-disclaimer">Dữ liệu minh họa phục vụ báo cáo thực tập</span>
      </section>

      <section className="login-form-panel">
        <form onSubmit={submit}>
          <div className="login-brand-mobile">
            <Building2 />
            <strong>HDHOME</strong>
          </div>
          <span className="eyebrow">ĐĂNG NHẬP NỘI BỘ</span>
          <h2>Chào mừng trở lại</h2>
          <p>Nhập tài khoản được cấp để truy cập hệ thống.</p>

          {error && <div className="form-error">{error}</div>}

          <label>
            Tên đăng nhập
            <div className="input-with-icon">
              <UserRound />
              <input
                autoComplete="username"
                required
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Nhập tên đăng nhập"
              />
            </div>
          </label>

          <label>
            Mật khẩu
            <div className="input-with-icon">
              <LockKeyhole />
              <input
                autoComplete="current-password"
                required
                minLength={8}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Nhập mật khẩu"
              />
              <button
                type="button"
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>

          <button className="button button--wide" disabled={loading}>
            {loading ? 'Đang xác thực...' : (
              <>
                Đăng nhập <ArrowRight size={18} />
              </>
            )}
          </button>

          <div className="demo-accounts">
            <strong>Tài khoản demo</strong>
            <button
              type="button"
              onClick={() => {
                setUsername('admin');
                setPassword('Admin@123');
              }}
            >
              ADMIN
            </button>
            <button
              type="button"
              onClick={() => {
                setUsername('projectmanager');
                setPassword('Manager@123');
              }}
            >
              MANAGER
            </button>
            <button
              type="button"
              onClick={() => {
                setUsername('technical');
                setPassword('Technical@123');
              }}
            >
              TECHNICAL
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
