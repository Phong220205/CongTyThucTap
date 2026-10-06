import { useEffect, useMemo, useState, type ComponentType } from 'react';
import { ArrowLeft, Boxes, FileImage, FileText, History, Images, Pencil, ScrollText, UsersRound } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { api, getApiError } from '../../api/client';
import { ErrorState, LoadingState } from '../../components/common/Feedback';
import { ProjectContractsTab } from '../../components/common/ProjectContractsTab';
import { ProjectFilesTab } from '../../components/common/ProjectFilesTab';
import { ProjectMaterialsTab } from '../../components/common/ProjectMaterialsTab';
import { ProjectOverviewTab } from '../../components/common/ProjectOverviewTab';
import { ProjectProgressTab } from '../../components/common/ProjectProgressTab';
import { ProjectTeamTab } from '../../components/common/ProjectTeamTab';
import { useAuth } from '../../contexts/AuthContext';
import type { ApiResponse, Project } from '../../types';

type TabId = 'overview' | 'progress' | 'team' | 'materials' | 'contracts' | 'files' | 'images';
interface Tab { id: TabId; label: string; icon: ComponentType<{ size?: number }> }

export function ProjectDetailAdminPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const canManage = user?.role_name !== 'TECHNICAL_STAFF';
  const canDeleteFiles = user?.role_name !== 'TECHNICAL_STAFF';
  const tabs = useMemo<Tab[]>(() => [
    { id: 'overview', label: 'Tổng quan', icon: ScrollText }, { id: 'progress', label: 'Tiến độ', icon: History },
    { id: 'team', label: 'Nhân sự', icon: UsersRound }, { id: 'materials', label: 'Vật tư', icon: Boxes },
    ...(canManage ? [{ id: 'contracts' as TabId, label: 'Hợp đồng', icon: FileText }] : []),
    { id: 'files', label: 'Bản vẽ', icon: FileImage }, { id: 'images', label: 'Hình ảnh', icon: Images },
  ], [canManage]);
  async function load(silent = false) {
    if (!silent) setLoading(true); setError('');
    try { const response = await api.get<ApiResponse<Project>>(`/projects/${id}`); setProject(response.data.data); }
    catch (err) { setError(getApiError(err)); }
    finally { setLoading(false); }
  }
  useEffect(() => { void load(); }, [id]);
  if (loading) return <LoadingState label="Đang tải hồ sơ dự án..." />;
  if (error || !project) return <ErrorState message={error || 'Dự án không tồn tại.'} onRetry={() => load()} />;
  return (
    <div className="project-detail-admin">
      <div className="detail-admin-heading"><div><Link className="back-link back-link--dark" to="/dashboard/projects"><ArrowLeft /> Danh sách dự án</Link><span className="eyebrow">{project.project_code} · HỒ SƠ DỰ ÁN</span><h1>{project.project_name}</h1><p>{project.location || 'Chưa cập nhật địa điểm'}</p></div>{canManage && <Link className="button button--secondary" to={`/dashboard/projects/${project.project_id}/edit`}><Pencil /> Chỉnh sửa</Link>}</div>
      <nav className="detail-tabs" aria-label="Chi tiết dự án">{tabs.map((tab) => <button key={tab.id} className={activeTab === tab.id ? 'active' : ''} onClick={() => setActiveTab(tab.id)}><tab.icon size={18} />{tab.label}</button>)}</nav>
      <div className="tab-content">
        {activeTab === 'overview' && <ProjectOverviewTab project={project} />}
        {activeTab === 'progress' && <ProjectProgressTab projectId={project.project_id} progress={project.progress} onUpdated={() => load(true)} />}
        {activeTab === 'team' && <ProjectTeamTab projectId={project.project_id} canManage={canManage} />}
        {activeTab === 'materials' && <ProjectMaterialsTab projectId={project.project_id} canManage={canManage} />}
        {activeTab === 'contracts' && canManage && <ProjectContractsTab projectName={project.project_name} />}
        {activeTab === 'files' && <ProjectFilesTab projectId={project.project_id} mode="files" canDelete={canDeleteFiles} />}
        {activeTab === 'images' && <ProjectFilesTab projectId={project.project_id} mode="images" canDelete={canDeleteFiles} />}
      </div>
    </div>
  );
}
