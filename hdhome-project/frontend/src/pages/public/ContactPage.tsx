import { useEffect, useState, type FormEvent } from 'react';
import { ArrowRight, Building2, CheckCircle2, Clock, Mail, MapPin, Phone, Send } from 'lucide-react';
import { api, getApiError } from '../../api/client';
import { useToast } from '../../contexts/ToastContext';
import { companyAddress } from '../../utils/content';

function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('revealed');
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

const contactInfo = [
  { icon: MapPin, label: 'Địa chỉ', value: companyAddress },
  { icon: Phone, label: 'Điện thoại', value: 'Thông tin minh họa' },
  { icon: Mail, label: 'Email', value: 'Thông tin minh họa' },
  { icon: Clock, label: 'Giờ làm việc', value: 'Thứ 2 - Thứ 6: 8:00 - 17:30' },
];

const faqs = [
  { q: 'Thời gian thiết kế mất bao lâu?', a: 'Thông thường từ 2-4 tuần tùy theo quy mô công trình.' },
  { q: 'Chi phí thiết kế được tính như thế nào?', a: 'Chi phí phụ thuộc vào diện tích, phong cách và yêu cầu cụ thể.' },
  { q: 'Có hỗ trợ giám sát thi công không?', a: 'Có, chúng tôi cung cấp dịch vụ giám sát toàn bộ quá trình.' },
];

export function ContactPage() {
  useScrollReveal();
  const [form, setForm] = useState({ full_name: '', phone: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const { showToast } = useToast();

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSending(true);
    try {
      await api.post('/public/contacts', form);
      setSuccess(true);
      setForm({ full_name: '', phone: '', email: '', subject: '', message: '' });
      showToast('Yêu cầu của bạn đã được ghi nhận.');
    } catch (error) {
      showToast(getApiError(error), 'error');
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="hero-bg-effects">
          <div className="hero-shape hero-shape-1"></div>
          <div className="hero-shape hero-shape-2"></div>
          <div className="hero-grid-bg"></div>
        </div>
        <div className="public-container">
          <div className="hero-content-grid">
            <div className="hero-text animate-on-scroll">
              <div className="hero-badge-modern">
                <Mail size={16} />
                <span>Liên hệ với chúng tôi</span>
              </div>
              <h1>
                <span className="gradient-text">Hãy kể về</span>
                <br />
                <span className="text-white">không gian</span>
                <br />
                <em className="text-accent">của bạn.</em>
              </h1>
              <p className="hero-desc">
                Gửi yêu cầu để thông tin được ghi nhận trong hệ thống quản lý của HDHOME.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="contact-content-section">
        <div className="public-container">
          <div className="contact-grid">
            {/* Contact Info */}
            <div className="contact-info animate-on-scroll">
              <div className="info-card">
                <div className="info-header">
                  <Building2 size={32} />
                  <div>
                    <h3>CÔNG TY TNHH</h3>
                    <p>Thiết kế và Xây dựng HDHOME</p>
                  </div>
                </div>
                <div className="info-list">
                  {contactInfo.map((item, index) => (
                    <div key={index} className="info-item">
                      <div className="info-icon">
                        <item.icon size={20} />
                      </div>
                      <div className="info-content">
                        <span className="info-label">{item.label}</span>
                        <span className="info-value">{item.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQs */}
              <div className="faq-card">
                <h3>Câu hỏi thường gặp</h3>
                {faqs.map((faq, index) => (
                  <div key={index} className="faq-item">
                    <h4>{faq.q}</h4>
                    <p>{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-container animate-on-scroll" style={{ animationDelay: '0.2s' }}>
              <div className="form-card">
                <div className="form-header">
                  <div className="section-tag">/ Gửi yêu cầu</div>
                  <h2>Thông tin dự án</h2>
                  <p>Các trường có dấu * là bắt buộc</p>
                </div>

                {success && (
                  <div className="success-banner-modern">
                    <div className="success-icon">
                      <CheckCircle2 size={24} />
                    </div>
                    <div className="success-content">
                      <h4>Yêu cầu của bạn đã được ghi nhận!</h4>
                      <p>Thông tin đã được lưu vào hệ thống để xử lý.</p>
                    </div>
                  </div>
                )}

                <form onSubmit={submit} className="modern-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Họ và tên *</label>
                      <input
                        required
                        value={form.full_name}
                        onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                        placeholder="Nguyễn Văn A"
                      />
                    </div>
                    <div className="form-group">
                      <label>Số điện thoại *</label>
                      <input
                        required
                        pattern="[0-9+().\s-]{8,20}"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="0912 345 678"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="email@example.com"
                      />
                    </div>
                    <div className="form-group">
                      <label>Chủ đề *</label>
                      <input
                        required
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        placeholder="Tư vấn thiết kế nhà phố"
                      />
                    </div>
                  </div>

                  <div className="form-group form-group-full">
                    <label>Nội dung *</label>
                    <textarea
                      required
                      rows={6}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Mô tả nhu cầu, loại công trình và mong muốn của bạn..."
                    />
                  </div>

                  <button type="submit" className="btn btn-primary btn-lg btn-submit" disabled={sending}>
                    {sending ? (
                      <>
                        <span className="spinner"></span>
                        Đang gửi...
                      </>
                    ) : (
                      <>
                        Gửi yêu cầu
                        <Send size={18} />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="contact-cta-section">
        <div className="public-container">
          <div className="cta-modern animate-on-scroll">
            <div className="cta-content">
              <h2>Bạn cần tư vấn ngay?</h2>
              <p>Đội ngũ HDHOME luôn sẵn sàng hỗ trợ bạn.</p>
            </div>
            <div className="cta-actions">
              <a href="tel:+84123456789" className="btn btn-primary">
                <Phone size={18} />
                Gọi ngay
              </a>
              <a href="mailto:info@hdhome.vn" className="btn btn-secondary">
                <Mail size={18} />
                Email
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
