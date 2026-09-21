import { useState, type FormEvent } from 'react';
import { ArrowRight, Building2, CheckCircle2, MapPin, Send } from 'lucide-react';
import { api, getApiError } from '../../api/client';
import { useToast } from '../../contexts/ToastContext';
import { companyAddress } from '../../utils/content';

const initialForm = { full_name: '', phone: '', email: '', subject: '', message: '' };

export function ContactPage() {
  const [form, setForm] = useState(initialForm);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const { showToast } = useToast();
  async function submit(event: FormEvent) {
    event.preventDefault(); setSending(true);
    try {
      await api.post('/public/contacts', form);
      setSuccess(true); setForm(initialForm); showToast('Yêu cầu của bạn đã được ghi nhận.');
    } catch (error) { showToast(getApiError(error), 'error'); }
    finally { setSending(false); }
  }
  return (
    <section className="contact-page"><div className="contact-side"><div><span className="eyebrow eyebrow--light">LIÊN HỆ HDHOME</span><h1>Hãy kể về<br /><em>không gian của bạn.</em></h1><p>Gửi yêu cầu để thông tin được ghi nhận trong hệ thống quản lý của HDHOME.</p></div><div className="contact-address"><Building2 /><div><strong>CÔNG TY TNHH THIẾT KẾ VÀ XÂY DỰNG HDHOME</strong><span><MapPin /> {companyAddress}</span></div></div><small>Số điện thoại và email doanh nghiệp: Thông tin minh họa.</small></div>
      <div className="contact-form-wrap"><div className="form-number">/ 05</div>{success && <div className="success-banner"><CheckCircle2 /><div><strong>Yêu cầu của bạn đã được ghi nhận.</strong><span>Thông tin đã được lưu vào hệ thống để xử lý.</span></div></div>}<form className="contact-form" onSubmit={submit}><div className="form-heading"><span>GỬI YÊU CẦU TƯ VẤN</span><h2>Thông tin dự án</h2></div><div className="form-grid"><label>Họ và tên *<input required value={form.full_name} onChange={(event) => setForm({ ...form, full_name: event.target.value })} placeholder="Nguyễn Văn A" /></label><label>Số điện thoại *<input required pattern="[0-9+().\s-]{8,20}" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="Thông tin liên hệ" /></label><label>Email<input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="email@example.com" /></label><label>Chủ đề *<input required value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} placeholder="Tư vấn thiết kế nhà phố" /></label><label className="full">Nội dung *<textarea required rows={5} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} placeholder="Mô tả nhu cầu, loại công trình và mong muốn của bạn..." /></label></div><button className="button button--dark button--wide" disabled={sending}>{sending ? 'Đang gửi...' : <>Gửi yêu cầu <Send size={17} /></>}</button><p className="form-note"><ArrowRight /> Các trường có dấu * là bắt buộc.</p></form></div>
    </section>
  );
}
