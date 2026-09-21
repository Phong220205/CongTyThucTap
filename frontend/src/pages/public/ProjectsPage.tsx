import { useEffect, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { api, getApiError } from '../../api/client';
import { EmptyState, ErrorState, LoadingState } from '../../components/common/Feedback';
import { Pagination } from '../../components/common/Pagination';
import { ProjectCard } from '../../components/common/ProjectCard';
import type { ApiResponse, Pagination as PaginationType, Project } from '../../types';

const defaultPagination: PaginationType = { page: 1, limit: 6, total: 0, totalPages: 1 };

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [pagination, setPagination] = useState(defaultPagination);
  const [search, setSearch] = useState('');
  const [draftSearch, setDraftSearch] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  async function load(page = 1) {
    setLoading(true); setError('');
    try {
      const response = await api.get<ApiResponse<Project[]>>('/public/projects', { params: { page, limit: 6, search, status } });
      setProjects(response.data.data); setPagination(response.data.pagination || defaultPagination);
    } catch (err) { setError(getApiError(err)); }
    finally { setLoading(false); }
  }
  useEffect(() => { void load(1); }, [search, status]);
  return (
    <>
      <section className="page-hero page-hero--projects"><div className="public-container"><span className="eyebrow eyebrow--light">DỰ ÁN TIÊU BIỂU</span><h1>Không gian thật.<br /><em>Tiến độ rõ ràng.</em></h1><p>Các dự án được đánh dấu công khai trong hệ thống HDHOME.</p></div></section>
      <section className="projects-page"><div className="public-container">
        <form className="public-filter" onSubmit={(event) => { event.preventDefault(); setSearch(draftSearch); }}>
          <label><Search /><input value={draftSearch} onChange={(event) => setDraftSearch(event.target.value)} placeholder="Tìm tên hoặc địa điểm dự án..." /></label>
          <label><SlidersHorizontal /><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="">Tất cả trạng thái</option><option value="PLANNING">Lập kế hoạch</option><option value="IN_PROGRESS">Đang thi công</option><option value="PAUSED">Tạm dừng</option><option value="COMPLETED">Hoàn thành</option></select></label>
          <button className="button button--dark" type="submit">Tìm kiếm</button>
        </form>
        <div className="results-caption"><span>{pagination.total} DỰ ÁN CÔNG KHAI</span><i /></div>
        {loading ? <LoadingState /> : error ? <ErrorState message={error} onRetry={() => load(pagination.page)} /> : projects.length ? <><div className="project-grid">{projects.map((project, index) => <ProjectCard key={project.project_id} project={project} index={index} />)}</div><Pagination pagination={pagination} onPageChange={load} /></> : <EmptyState title="Không tìm thấy dự án" description="Thử từ khóa hoặc trạng thái khác." />}
      </div></section>
    </>
  );
}
