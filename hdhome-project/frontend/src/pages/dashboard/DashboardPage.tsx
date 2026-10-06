import { useEffect, useState } from 'react';
import { Activity, Building2, CheckCircle2, ClipboardList, FolderKanban, HardHat, TrendingUp, UsersRound } from 'lucide-react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { api, getApiError } from '../../api/client';
import { ErrorState, LoadingState } from '../../components/common/Feedback';
import { ProgressBar } from '../../components/common/ProgressBar';
import { StatusBadge } from '../../components/common/StatusBadge';
import type { ApiResponse, Project } from '../../types';
import { formatNumber, formatStatus } from '../../utils/format';

interface Summary {
  totalProjects: number; inProgressProjects: number; completedProjects: number; totalCustomers: number;
  totalEmployees: number; totalContracts: number; averageProgress: number;
  projectsByStatus: Array<{ status: string; total: number }>;
  recentProjects: Project[];
}
const colors = ['#f6b737', '#5d82c1', '#39a27b', '#9a7bd1', '#e56c61'];

export function DashboardPage() {
  const [data, setData] = useState<Summary | null>(null);
  const [error, setError] = useState('');
  async function load() {
    setError('');
    try { const response = await api.get<ApiResponse<Summary>>('/dashboard/summary'); setData(response.data.data); }
    catch (err) { setError(getApiError(err)); }
  }
  useEffect(() => { void load(); }, []);
  if (!data && !error) return <LoadingState label="Đang tổng hợp dữ liệu dashboard..." />;
  if (error || !data) return <ErrorState message={error} onRetry={load} />;
  const stats = [
    [FolderKanban, 'Tổng dự án', data.totalProjects, 'Tất cả dự án'], [Activity, 'Đang thi công', data.inProgressProjects, 'Đang triển khai'],
    [CheckCircle2, 'Đã hoàn thành', data.completedProjects, 'Đã nghiệm thu'], [UsersRound, 'Khách hàng', data.totalCustomers, 'Hồ sơ khách hàng'],
    [HardHat, 'Nhân sự', data.totalEmployees, 'Đang hoạt động'], [ClipboardList, 'Hợp đồng', data.totalContracts, 'Tổng hợp đồng'],
  ] as const;
  return (
    <div className="dashboard-page">
      <div className="dashboard-welcome"><div><span className="eyebrow">BÁO CÁO TỔNG QUAN</span><h1>Hoạt động dự án HDHOME</h1><p>Dữ liệu cập nhật trực tiếp từ hệ thống quản lý.</p></div><div className="average-card"><TrendingUp /><div><span>Tiến độ trung bình</span><strong>{data.averageProgress}%</strong></div></div></div>
      <div className="stats-grid">{stats.map(([Icon, label, value, note], index) => <article key={label}><div className={`stat-icon stat-icon--${index}`}><Icon /></div><div><span>{label}</span><strong>{formatNumber(value)}</strong><small>{note}</small></div></article>)}</div>
      <div className="dashboard-grid"><section className="panel chart-panel"><header><div><span className="panel-kicker">PHÂN BỐ</span><h2>Dự án theo trạng thái</h2></div><Building2 /></header><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data.projectsByStatus} dataKey="total" nameKey="status" innerRadius={64} outerRadius={96} paddingAngle={4}>{data.projectsByStatus.map((item, index) => <Cell key={item.status} fill={colors[index % colors.length]} />)}</Pie><Tooltip formatter={(value, name) => [value, formatStatus(String(name))]} /><Legend formatter={(value) => formatStatus(value)} /></PieChart></ResponsiveContainer><div className="chart-total"><strong>{data.totalProjects}</strong><span>Dự án</span></div></div></section>
        <section className="panel recent-panel"><header><div><span className="panel-kicker">CẬP NHẬT GẦN ĐÂY</span><h2>Tiến độ dự án</h2></div></header><div className="recent-projects">{data.recentProjects.map((project) => <article key={project.project_id}><div className="project-initial">{project.project_code}</div><div><strong>{project.project_name}</strong><StatusBadge status={project.status} /></div><ProgressBar value={project.progress} compact /></article>)}</div></section></div>
    </div>
  );
}
