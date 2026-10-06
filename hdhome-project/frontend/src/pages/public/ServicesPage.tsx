import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { services } from '../../utils/content';

export function ServicesPage() {
  return (
    <>
      <section className="page-hero page-hero--services"><div className="public-container"><span className="eyebrow eyebrow--light">DỊCH VỤ HDHOME</span><h1>Một hệ giải pháp.<br /><em>Nhiều nhu cầu không gian.</em></h1><p>Từ thiết kế ban đầu đến thi công, giám sát và hoàn thiện công trình.</p></div></section>
      <section className="services-page"><div className="public-container">
        <div className="services-list">{services.map((service, index) => <article key={service.title}><div className="service-number">{String(index + 1).padStart(2, '0')}</div><service.icon /><div><h2>{service.title}</h2><p>{service.description}</p><ul><li><CheckCircle2 /> Tiếp nhận yêu cầu và khảo sát</li><li><CheckCircle2 /> Đề xuất phương án phù hợp</li><li><CheckCircle2 /> Theo dõi công việc trên hệ thống</li></ul></div></article>)}</div>
      </div></section>
      <section className="service-cta"><div className="public-container"><div><span className="eyebrow">YÊU CẦU TƯ VẤN</span><h2>Chưa biết dịch vụ nào phù hợp?</h2><p>Hãy mô tả nhu cầu của bạn, HDHOME sẽ ghi nhận để trao đổi.</p></div><Link className="button button--dark" to="/contact">Gửi yêu cầu <ArrowRight /></Link></div></section>
    </>
  );
}
