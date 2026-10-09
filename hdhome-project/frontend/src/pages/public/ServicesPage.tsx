import { useEffect } from 'react';
import { ArrowRight, CheckCircle2, Lightbulb, PenTool, Home, Construction, Eye, ClipboardList, ShieldCheck, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const services = [
  {
    icon: PenTool,
    title: 'Thiết kế kiến trúc',
    description: 'Tạo dựng không gian sống và làm việc với bản vẽ chi tiết, phương án tối ưu về công năng và thẩm mỹ.',
    features: ['Khảo sát thực địa', 'Phương án kiến trúc', 'Bản vẽ kỹ thuật', 'Xin phép xây dựng'],
    color: '#f5b82e',
  },
  {
    icon: Home,
    title: 'Thiết kế nội thất',
    description: 'Biến không gian thô thành môi trường sống hoàn hảo với phong cách riêng biệt.',
    features: ['Concept 3D trực quan', 'Lựa chọn vật liệu', 'Bố trí nội thất', 'Giám sát thi công'],
    color: '#268669',
  },
  {
    icon: Construction,
    title: 'Thi công xây dựng',
    description: 'Thực hiện thi công chuyên nghiệp với đội ngũ lành nghề, đảm bảo tiến độ và chất lượng.',
    features: ['Thi công phần thô', 'Hoàn thiện kiến trúc', 'Lắp đặt hệ thống', 'Kiểm tra chất lượng'],
    color: '#5d82c1',
  },
  {
    icon: Eye,
    title: 'Giám sát công trình',
    description: 'Theo dõi và kiểm soát mọi công đoạn để đảm bảo công trình đạt chuẩn thiết kế.',
    features: ['Giám sát daily', 'Báo cáo tiến độ', 'Kiểm tra vật tư', 'Nghiệm thu từng hạng mục'],
    color: '#c94a40',
  },
  {
    icon: ClipboardList,
    title: 'Quản lý dự án',
    description: 'Điều phối nhân sự, vật tư và tiến độ để dự án hoàn thành đúng kế hoạch.',
    features: ['Lập kế hoạch chi tiết', 'Quản lý ngân sách', 'Điều phối nhân sự', 'Báo cáo đ berkala'],
    color: '#7b5890',
  },
  {
    icon: ShieldCheck,
    title: 'Hoàn thiện công trình',
    description: 'Sơn sửa, lắp đặt thiết bị và bàn giao công trình hoàn chỉnh.',
    features: ['Sơn nước & sơn dầu', 'Lắp đặt thiết bị', 'Vệ sinh công nghiệp', 'Bàn giao & bảo hành'],
    color: '#9a5149',
  },
];

export function ServicesPage() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="services-page">
      {/* Hero */}
      <section className="services-hero">
        <div className="hero-bg-effects">
          <div className="hero-shape hero-shape-1"></div>
          <div className="hero-shape hero-shape-2"></div>
          <div className="hero-grid-bg"></div>
        </div>
        <div className="public-container">
          <div className="hero-content-grid">
            <div className="hero-text animate-on-scroll">
              <div className="hero-badge-modern">
                <Lightbulb size={16} />
                <span>Dịch vụ của chúng tôi</span>
              </div>
              <h1>
                <span className="gradient-text">Một hệ giải pháp.</span>
                <br />
                <span className="text-white">Nhiều nhu cầu</span>
                <br />
                <em className="text-accent">không gian.</em>
              </h1>
              <p className="hero-desc">
                Từ thiết kế ban đầu đến thi công, giám sát và hoàn thiện công trình.
              </p>
              <div className="hero-actions">
                <Link to="/contact" className="btn btn-primary">
                  Liên hệ tư vấn
                  <ArrowRight size={18} />
                </Link>
                <Link to="/projects" className="btn btn-secondary">
                  Xem dự án
                </Link>
              </div>
            </div>
            <div className="hero-stats-box animate-on-scroll" style={{ animationDelay: '0.2s' }}>
              <div className="stats-mini">
                <div className="stat-mini-item">
                  <span className="stat-mini-value">06</span>
                  <span className="stat-mini-label">Dịch vụ chính</span>
                </div>
                <div className="stat-mini-item">
                  <span className="stat-mini-value">100%</span>
                  <span className="stat-mini-label">Cam kết chất lượng</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="services-main-section">
        <div className="public-container">
          <div className="services-header animate-on-scroll">
            <div className="section-tag">/ Dịch vụ</div>
            <h2>Giải pháp toàn diện<br /><span className="text-accent">cho mọi công trình.</span></h2>
          </div>
          
          <div className="services-cards-grid">
            {services.map((service, index) => (
              <div 
                key={service.title} 
                className="service-card-modern animate-on-scroll" 
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="service-card-glow" style={{ background: service.color }}></div>
                <div className="service-card-header">
                  <div className="service-icon-box" style={{ background: `${service.color}15`, color: service.color }}>
                    <service.icon size={32} />
                  </div>
                  <span className="service-number">{String(index + 1).padStart(2, '0')}</span>
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <div className="service-features">
                  {service.features.map((feature, fIndex) => (
                    <div key={fIndex} className="feature-item">
                      <CheckCircle2 size={16} style={{ color: service.color }} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                <Link to="/contact" className="service-link">
                  Tư vấn ngay
                  <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="services-cta-section">
        <div className="cta-bg-pattern"></div>
        <div className="public-container">
          <div className="cta-content animate-on-scroll">
            <div className="cta-icon">
              <Phone size={40} />
            </div>
            <h2>Chưa biết dịch vụ nào phù hợp?</h2>
            <p>Hãy mô tả nhu cầu của bạn, HDHOME sẽ ghi nhận để trao đổi.</p>
            <div className="cta-actions">
              <Link to="/contact" className="btn btn-primary btn-lg">
                Gửi yêu cầu tư vấn
                <ArrowRight size={20} />
              </Link>
              <Link to="/projects" className="btn btn-outline-light">
                Xem dự án đã thực hiện
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
