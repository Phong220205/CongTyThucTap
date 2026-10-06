import { useEffect, useState } from 'react';
import { ArrowDownRight, ArrowRight, Check, MapPin, MoveUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import { EmptyState, ErrorState, LoadingState } from '../../components/common/Feedback';
import { ProjectCard } from '../../components/common/ProjectCard';
import type { ApiResponse, Project } from '../../types';
import { companyAddress, services } from '../../utils/content';

export function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  async function loadProjects() {
    setLoading(true); setError('');
    try {
      const response = await api.get<ApiResponse<Project[]>>('/public/projects?limit=3');
      setProjects(response.data.data);
    } catch { setError('Chưa thể tải dự án từ hệ thống. Vui lòng kiểm tra backend và MySQL.'); }
    finally { setLoading(false); }
  }
  useEffect(() => { void loadProjects(); }, []);

  return (
    <>
      <section className="hero-section">
        <div className="hero-grid-overlay" />
        <div className="public-container hero-content">
          <div className="hero-copy">
            <span className="eyebrow eyebrow--light">THIẾT KẾ · THI CÔNG · QUẢN LÝ DỰ ÁN</span>
            <h1>Kiến tạo <em>không gian,</em><br />xây dựng giá trị.</h1>
            <p>Công ty TNHH Thiết kế và Xây dựng HDHOME cung cấp các giải pháp thiết kế, thi công và quản lý công trình phù hợp với nhu cầu của khách hàng.</p>
            <div className="hero-actions"><Link className="button button--accent" to="/projects">Xem dự án <ArrowRight size={18} /></Link><Link className="button button--outline-light" to="/contact">Liên hệ tư vấn</Link></div>
          </div>
          <div className="hero-architecture" aria-hidden="true">
            <div className="building building-a"><span /><span /><span /><span /></div>
            <div className="building building-b"><span /><span /><span /></div>
            <div className="hero-spec"><b>01</b><span>ĐÀ NẴNG<br />VIỆT NAM</span></div>
          </div>
          <div className="hero-meta"><span>16°03' N</span><span>108°12' E</span><span>SCROLL <ArrowDownRight size={16} /></span></div>
        </div>
      </section>

      <section className="intro-strip">
        <div className="public-container intro-strip-grid">
          <span className="section-index">/ 01</span>
          <div><span className="eyebrow">VỀ HDHOME</span><h2>Một đầu mối xuyên suốt từ ý tưởng đến công trình.</h2></div>
          <div><p><strong>CÔNG TY TNHH THIẾT KẾ VÀ XÂY DỰNG HDHOME</strong> tập trung vào thiết kế kiến trúc, nội thất, thi công, giám sát và quản lý dự án.</p><p className="address-line"><MapPin /> {companyAddress}</p><Link className="text-link" to="/about">Tìm hiểu công ty <MoveUpRight size={16} /></Link></div>
        </div>
      </section>

      <section className="services-preview section-dark">
        <div className="public-container">
          <div className="section-heading section-heading--light"><div><span className="eyebrow eyebrow--light">/ 02 · NĂNG LỰC</span><h2>Giải pháp đồng bộ<br />cho từng giai đoạn.</h2></div><Link className="text-link text-link--light" to="/services">Xem tất cả dịch vụ <ArrowRight size={16} /></Link></div>
          <div className="service-grid">
            {services.slice(0, 6).map((service) => <article className="service-card" key={service.title}><span>{service.index}</span><service.icon /><h3>{service.title}</h3><p>{service.description}</p><Link to="/services" aria-label={`Xem ${service.title}`}><ArrowRight /></Link></article>)}
          </div>
        </div>
      </section>

      <section className="project-preview">
        <div className="public-container">
          <div className="section-heading"><div><span className="eyebrow">/ 03 · DỰ ÁN TIÊU BIỂU</span><h2>Những không gian<br />được xây dựng có chủ đích.</h2></div><Link className="button button--dark" to="/projects">Tất cả dự án <ArrowRight size={17} /></Link></div>
          {loading ? <LoadingState /> : error ? <ErrorState message={error} onRetry={loadProjects} /> : projects.length ? <div className="project-grid">{projects.map((project, index) => <ProjectCard key={project.project_id} project={project} index={index} />)}</div> : <EmptyState title="Chưa có dự án tiêu biểu" />}
        </div>
      </section>

      <section className="process-section">
        <div className="public-container process-grid">
          <div><span className="eyebrow">/ 04 · QUY TRÌNH</span><h2>Rõ ràng trong từng bước triển khai.</h2><p>Mỗi giai đoạn được theo dõi trên hệ thống quản lý dự án, giúp thông tin tiến độ, nhân sự, vật tư và hồ sơ được tập trung.</p></div>
          <ol>{['Tiếp nhận nhu cầu & khảo sát', 'Đề xuất giải pháp & thiết kế', 'Lập kế hoạch & triển khai', 'Giám sát & cập nhật tiến độ', 'Nghiệm thu & hoàn thành'].map((step, index) => <li key={step}><span>0{index + 1}</span><strong>{step}</strong><Check /></li>)}</ol>
        </div>
      </section>

      <section className="cta-section"><div className="public-container"><span className="eyebrow eyebrow--light">BẮT ĐẦU MỘT DỰ ÁN</span><h2>Bạn đang có một không gian<br />cần được kiến tạo?</h2><Link className="button button--accent" to="/contact">Gửi yêu cầu tư vấn <ArrowRight /></Link></div></section>
    </>
  );
}
