import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, CalendarDays, MapPin, Ruler } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { api, getApiError, SERVER_BASE_URL } from '../../api/client';
import { ErrorState, LoadingState } from '../../components/common/Feedback';
import { ProgressBar } from '../../components/common/ProgressBar';
import { StatusBadge } from '../../components/common/StatusBadge';
import type { ApiResponse, Project } from '../../types';
import { formatDate } from '../../utils/format';

export function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  async function load() {
    setLoading(true); setError('');
    try { const response = await api.get<ApiResponse<Project>>(`/public/projects/${id}`); setProject(response.data.data); }
    catch (err) { setError(getApiError(err)); }
    finally { setLoading(false); }
  }
  useEffect(() => { void load(); }, [id]);
  if (loading) return <div className="public-container standalone-feedback"><LoadingState /></div>;
  if (error || !project) return <div className="public-container standalone-feedback"><ErrorState message={error || 'Dự án không tồn tại.'} onRetry={load} /></div>;
  return (
    <>
      <section className="project-detail-hero"><div className="project-detail-grid" /><div className="public-container"><Link className="back-link" to="/projects"><ArrowLeft /> Quay lại dự án</Link><div className="project-detail-title"><div><span className="eyebrow eyebrow--light">{project.project_code} / HDHOME PROJECT</span><h1>{project.project_name}</h1><p><MapPin /> {project.location || 'Đà Nẵng'}</p></div><StatusBadge status={project.status} /></div><div className="detail-building" aria-hidden="true"><i /><i /><i /><i /><i /></div></div></section>
      <section className="project-detail-content"><div className="public-container detail-layout"><article><span className="eyebrow">THÔNG TIN DỰ ÁN</span><h2>Một công trình được theo dõi theo từng mốc triển khai.</h2><p className="lead">{project.description}</p><div className="detail-facts"><div><CalendarDays /><span>Khởi công</span><strong>{formatDate(project.start_date)}</strong></div><div><CalendarDays /><span>Dự kiến hoàn thành</span><strong>{formatDate(project.expected_end_date)}</strong></div><div><Ruler /><span>Trạng thái</span><strong>{project.status}</strong></div></div></article><aside><span>TIẾN ĐỘ HIỆN TẠI</span><strong className="big-progress">{project.progress}<small>%</small></strong><ProgressBar value={project.progress} /><p>Tiến độ được đồng bộ từ hệ thống quản lý nội bộ HDHOME.</p></aside></div></section>
      <section className="project-gallery"><div className="public-container"><div className="section-heading"><div><span className="eyebrow">HÌNH ẢNH CÔNG TRÌNH</span><h2>Hồ sơ hình ảnh công khai.</h2></div></div>{project.images?.length ? <div className="gallery-grid">{project.images.map((image) => <figure key={image.image_id}><img src={`${SERVER_BASE_URL}/${image.image_path}`} alt={image.title || project.project_name} /><figcaption><strong>{image.title}</strong><span>{image.description}</span></figcaption></figure>)}</div> : <div className="gallery-placeholder"><div className="architecture-lines"><i /><i /><i /><i /></div><span>Hình ảnh sẽ được cập nhật từ hồ sơ dự án.</span></div>}</div></section>
      <section className="project-next"><div className="public-container"><div><span>BẠN CÓ NHU CẦU TƯƠNG TỰ?</span><h2>Trao đổi cùng HDHOME.</h2></div><Link className="button button--accent" to="/contact">Liên hệ tư vấn <ArrowRight /></Link></div></section>
    </>
  );
}
