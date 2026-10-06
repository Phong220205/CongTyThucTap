import { CalendarDays, MapPin, Star, UserRound, UsersRound } from 'lucide-react';
import type { Project } from '../../types';
import { formatDate } from '../../utils/format';
import { ProgressBar } from './ProgressBar';
import { StatusBadge } from './StatusBadge';

export function ProjectOverviewTab({ project }: { project: Project }) {
  return (
    <div className="project-overview-tab">
      <div className="overview-main"><section className="project-summary-card"><div className="summary-code"><span>{project.project_code}</span>{Boolean(project.featured) && <small><Star /> Dự án tiêu biểu</small>}</div><h2>{project.project_name}</h2><p>{project.description || 'Chưa có mô tả dự án.'}</p><div className="overview-progress"><div><span>Tiến độ thực hiện</span><strong>{project.progress}%</strong></div><ProgressBar value={project.progress} /></div></section>
        <section className="panel compact-panel"><header><h2>Thông tin dự án</h2></header><dl className="detail-list"><div><dt><MapPin />Địa điểm</dt><dd>{project.location || '—'}</dd></div><div><dt><CalendarDays />Ngày bắt đầu</dt><dd>{formatDate(project.start_date)}</dd></div><div><dt><CalendarDays />Dự kiến hoàn thành</dt><dd>{formatDate(project.expected_end_date)}</dd></div><div><dt><CalendarDays />Hoàn thành thực tế</dt><dd>{formatDate(project.actual_end_date)}</dd></div></dl></section></div>
      <aside className="overview-side"><section className="panel compact-panel"><header><h2>Trạng thái</h2></header><StatusBadge status={project.status} /><p>Trạng thái hiện tại của dự án trong hệ thống.</p></section><section className="panel compact-panel"><header><h2>Các bên liên quan</h2></header><div className="party-item"><UsersRound /><div><span>Khách hàng</span><strong>{project.customer_name || 'Chưa cập nhật'}</strong></div></div><div className="party-item"><UserRound /><div><span>Chủ đầu tư</span><strong>{project.investor_name || 'Chưa cập nhật'}</strong></div></div></section></aside>
    </div>
  );
}
