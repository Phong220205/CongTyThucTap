import { ArrowLeft, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return <main className="not-found"><Building2 /><span>404</span><h1>Không tìm thấy trang</h1><p>Đường dẫn bạn truy cập không tồn tại trong hệ thống HDHOME.</p><Link className="button button--dark" to="/"><ArrowLeft /> Về trang chủ</Link></main>;
}
