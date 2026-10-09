import { useEffect, useRef } from 'react';
import { ArrowRight, Award, Building2, CheckCircle2, ClipboardCheck, Compass, DraftingCompass, Handshake, HardHat, Heart, MapPin, Route, Scale, ShieldCheck, Sparkles, Target, Users, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { companyAddress } from '../../utils/content';

export function AboutPage() {
  const countersRef = useRef<HTMLDivElement>(null);
  
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

  const stats = [
    { icon: Building2, value: '06', label: 'Dự án hoàn thành', suffix: '+' },
    { icon: Users, value: '15', label: 'Nhân sự chuyên nghiệp', suffix: '+' },
    { icon: Award, value: '05', label: 'Năm kinh nghiệm', suffix: '' },
    { icon: Heart, value: '100', label: 'Khách hàng tin tưởng', suffix: '%' },
  ];

  const values = [
    { icon: Compass, title: 'Phù hợp', desc: 'Giải pháp được xây dựng theo nhu cầu, công năng và đặc điểm của từng dự án.', color: '#f5b82e' },
    { icon: Scale, title: 'Minh bạch', desc: 'Thông tin dự án, tiến độ và hồ sơ được cập nhật rõ ràng trong quá trình triển khai.', color: '#268669' },
    { icon: ShieldCheck, title: 'Kiểm soát', desc: 'Theo dõi các mốc công việc, nguồn lực và dữ liệu dự án trong một hệ thống tập trung.', color: '#5d82c1' },
    { icon: Handshake, title: 'Trách nhiệm', desc: 'Mỗi vai trò tham gia được phân công cụ thể để phối hợp công việc hiệu quả.', color: '#c94a40' },
  ];

  const services = [
    'Thiết kế kiến trúc',
    'Thiết kế nội thất', 
    'Thi công xây dựng',
    'Giám sát công trình',
    'Quản lý dự án',
    'Hoàn thiện công trình',
    'Quản lý vật tư',
    'Thi công hệ thống điện nước',
  ];

  const process = ['Khảo sát', 'Thiết kế', 'Kế hoạch', 'Thi công', 'Nghiệm thu'];

  return (
    <main className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-bg-effects">
          <div className="hero-shape hero-shape-1"></div>
          <div className="hero-shape hero-shape-2"></div>
          <div className="hero-shape hero-shape-3"></div>
        </div>
        <div className="public-container">
          <div className="hero-content-grid">
            <div className="hero-text animate-on-scroll">
              <div className="hero-badge-modern">
                <Sparkles size={16} />
                <span>Về chúng tôi</span>
              </div>
              <h1>
                <span className="gradient-text">Thiết kế bằng tư duy.</span>
                <br />
                <span className="text-white">Xây dựng bằng</span>
                <br />
                <em className="text-accent">trách nhiệm.</em>
              </h1>
              <p className="hero-desc">
                HDHOME kết nối công việc thiết kế, thi công và quản lý dự án trong một quy trình rõ ràng, dễ theo dõi.
              </p>
              <div className="hero-actions">
                <Link to="/contact" className="btn btn-primary">
                  Trao đổi dự án
                  <ArrowRight size={18} />
                </Link>
                <Link to="/projects" className="btn btn-secondary">
                  Xem dự án
                </Link>
              </div>
            </div>
            <div className="hero-visual animate-on-scroll" style={{ animationDelay: '0.2s' }}>
              <div className="hero-card-float">
                <div className="hero-card">
                  <div className="hero-card-icon">
                    <Building2 size={40} />
                  </div>
                  <div className="hero-card-content">
                    <h3>HDHOME</h3>
                    <p>Architecture & Construction</p>
                  </div>
                </div>
                <div className="floating-badge badge-1">
                  <CheckCircle2 size={20} />
                  <span>Chất lượng</span>
                </div>
                <div className="floating-badge badge-2">
                  <ShieldCheck size={20} />
                  <span>An toàn</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="scroll-indicator-hero">
          <div className="scroll-line"></div>
          <span>Scroll</span>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="public-container">
          <div className="stats-grid" ref={countersRef}>
            {stats.map((stat, index) => (
              <div key={index} className="stat-card animate-on-scroll" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="stat-icon-wrapper">
                  <stat.icon size={24} />
                </div>
                <div className="stat-content">
                  <span className="stat-value">{stat.value}<small>{stat.suffix}</small></span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className="about-content-section">
        <div className="public-container">
          <div className="content-grid">
            <div className="content-left animate-on-scroll">
              <div className="section-tag">/ 01 Giới thiệu</div>
              <h2>CÔNG TY TNHH<br />THIẾT KẾ VÀ XÂY DỰNG HDHOME</h2>
              <p>
                HDHOME hoạt động trong lĩnh vực kiến trúc – xây dựng, cung cấp các giải pháp phù hợp với nhu cầu và điều kiện thực tế của khách hàng.
              </p>
              <p>
                Website này giới thiệu năng lực và mô phỏng hệ thống quản lý dự án nội bộ phục vụ báo cáo thực tập.
              </p>
              <div className="address-info">
                <MapPin size={20} />
                <span>{companyAddress}</span>
              </div>
            </div>
            <div className="content-right animate-on-scroll" style={{ animationDelay: '0.2s' }}>
              <div className="image-showcase">
                <div className="showcase-bg"></div>
                <div className="showcase-content">
                  <span className="showcase-brand">HD</span>
                </div>
                <div className="experience-badge">
                  <span className="exp-number">05</span>
                  <span className="exp-text">Năm kinh nghiệm</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="public-container">
          <div className="section-header animate-on-scroll">
            <div className="section-tag">/ 02 Giá trị cốt lõi</div>
            <h2>Chất lượng được tạo nên<br /><span className="text-accent">từ cách làm việc.</span></h2>
          </div>
          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card animate-on-scroll" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="value-icon" style={{ background: `${value.color}20`, color: value.color }}>
                  <value.icon size={32} />
                </div>
                <h3>{value.title}</h3>
                <p>{value.desc}</p>
                <div className="value-number">0{index + 1}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services/Linh Vuc */}
      <section className="services-preview-section">
        <div className="public-container">
          <div className="services-grid-layout">
            <div className="services-intro animate-on-scroll">
              <div className="section-tag">/ 03 Lĩnh vực hoạt động</div>
              <h2>Năng lực xuyên suốt<br /><span className="text-accent">vòng đời công trình.</span></h2>
              <p>
                Không công bố các dữ liệu pháp lý, doanh thu hoặc quy mô nhân sự chưa được cung cấp. Mọi dữ liệu vận hành trong website là thông tin minh họa.
              </p>
            </div>
            <div className="services-list-modern">
              {services.map((service, index) => (
                <div key={index} className="service-item animate-on-scroll" style={{ animationDelay: `${index * 0.05}s` }}>
                  <span className="service-index">{String(index + 1).padStart(2, '0')}</span>
                  <span className="service-name">{service}</span>
                  <ArrowRight size={18} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="process-section">
        <div className="public-container">
          <div className="section-header animate-on-scroll">
            <div className="section-tag section-tag-light">/ 04 Quy trình làm việc</div>
            <h2>Từ yêu cầu đến<br /><span className="text-accent">kết quả có thể kiểm chứng.</span></h2>
          </div>
          <div className="process-timeline-modern">
            {process.map((step, index) => (
              <div key={index} className="process-step animate-on-scroll" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="process-icon">
                  <span>{index + 1}</span>
                </div>
                <div className="process-content">
                  <h4>{step}</h4>
                </div>
                {index < process.length - 1 && <div className="process-connector"></div>}
              </div>
            ))}
          </div>
          <div className="process-cta animate-on-scroll">
            <Link to="/contact" className="btn btn-primary btn-lg">
              Bắt đầu dự án của bạn
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
