import { ArrowRight, Building2, ClipboardCheck, DraftingCompass, HardHat, MapPin, Route, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';
import { companyAddress } from '../../utils/content';

export function AboutPage() {
  const fields = ['Thiết kế kiến trúc', 'Thiết kế nội thất', 'Thi công xây dựng', 'Giám sát công trình', 'Quản lý dự án', 'Hoàn thiện công trình', 'Quản lý vật tư', 'Thi công hệ thống điện nước'];
  return (
    <>
      <section className="page-hero"><div className="public-container"><span className="eyebrow eyebrow--light">GIỚI THIỆU CÔNG TY</span><h1>Thiết kế bằng tư duy.<br /><em>Xây dựng bằng trách nhiệm.</em></h1><p>HDHOME kết nối công việc thiết kế, thi công và quản lý dự án trong một quy trình rõ ràng, dễ theo dõi.</p></div></section>
      <section className="about-statement"><div className="public-container about-statement-grid"><span className="section-index">/ 01</span><div><h2>CÔNG TY TNHH THIẾT KẾ VÀ XÂY DỰNG HDHOME</h2><p>HDHOME hoạt động trong lĩnh vực kiến trúc – xây dựng, cung cấp các giải pháp phù hợp với nhu cầu và điều kiện thực tế của khách hàng. Website này giới thiệu năng lực và mô phỏng hệ thống quản lý dự án nội bộ phục vụ báo cáo thực tập.</p><p className="address-line"><MapPin /> {companyAddress}</p></div><div className="about-monogram"><Building2 /><strong>HD</strong><span>HOME</span></div></div></section>
      <section className="values-section section-warm"><div className="public-container"><div className="section-heading"><div><span className="eyebrow">/ 02 · GIÁ TRỊ ĐỊNH HƯỚNG</span><h2>Chất lượng được tạo nên<br />từ cách làm việc.</h2></div></div><div className="value-grid">{[
        [DraftingCompass, 'Phù hợp', 'Giải pháp được xây dựng theo nhu cầu, công năng và đặc điểm của từng dự án.'],
        [Scale, 'Minh bạch', 'Thông tin dự án, tiến độ và hồ sơ được cập nhật rõ ràng trong quá trình triển khai.'],
        [ClipboardCheck, 'Kiểm soát', 'Theo dõi các mốc công việc, nguồn lực và dữ liệu dự án trong một hệ thống tập trung.'],
        [HardHat, 'Trách nhiệm', 'Mỗi vai trò tham gia được phân công cụ thể để phối hợp công việc hiệu quả.'],
      ].map(([Icon, title, text]) => <article key={String(title)}><Icon /><h3>{String(title)}</h3><p>{String(text)}</p></article>)}</div></div></section>
      <section className="activity-section"><div className="public-container activity-grid"><div><span className="eyebrow">/ 03 · LĨNH VỰC HOẠT ĐỘNG</span><h2>Năng lực xuyên suốt vòng đời công trình.</h2><p>Không công bố các dữ liệu pháp lý, doanh thu hoặc quy mô nhân sự chưa được cung cấp. Mọi dữ liệu vận hành trong website là thông tin minh họa.</p></div><ol>{fields.map((field, index) => <li key={field}><span>{String(index + 1).padStart(2, '0')}</span><strong>{field}</strong><ArrowRight /></li>)}</ol></div></section>
      <section className="workflow-section section-dark"><div className="public-container"><div className="section-heading section-heading--light"><div><span className="eyebrow eyebrow--light">/ 04 · CÁCH LÀM VIỆC</span><h2>Từ yêu cầu đến<br />kết quả có thể kiểm chứng.</h2></div><Route size={70} /></div><div className="workflow-line">{['Khảo sát', 'Thiết kế', 'Kế hoạch', 'Thi công', 'Nghiệm thu'].map((item, index) => <div key={item}><span>{index + 1}</span><strong>{item}</strong><i /></div>)}</div><Link className="button button--accent" to="/contact">Trao đổi dự án <ArrowRight /></Link></div></section>
    </>
  );
}
