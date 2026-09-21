import { useEffect, useState } from 'react';
import { Eye, Filter, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api, getApiError } from '../../api/client';
import { ConfirmModal } from '../../components/common/Modal';
import { EmptyState, ErrorState, LoadingState } from '../../components/common/Feedback';
import { PageHeader } from '../../components/common/PageHeader';
import { Pagination } from '../../components/common/Pagination';
import { ProgressBar } from '../../components/common/ProgressBar';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import type { ApiResponse, Pagination as PaginationType, Project } from '../../types';
import { formatDate } from '../../utils/format';

const defaultPagination: PaginationType = { page: 1, limit: 10, total: 0, totalPages: 1 };

export function ProjectsAdminPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [items, setItems] = useState<Project[]>([]);
  const [pagination, setPagination] = useState(defaultPagination);
  const [search, setSearch] = useState('');
  const [draftSearch, setDraftSearch] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteItem, setDeleteItem] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);
  const canManage = user?.role_name !== 'TECHNICAL_STAFF';

  async function load(page = 1) {
    setLoading(true); setError('');
    try {
      const response = await api.get<ApiResponse<Project[]>>('/projects', { params: { page, limit: 10, search, status, sort: '-p.created_at' } });
      setItems(response.data.data); setPagination(response.data.pagination || defaultPagination);
    } catch (err) { setError(getApiError(err)); }
    finally { setLoading(false); }
  }
  useEffect(() => { void load(1); }, [search, status]);
  async function confirmDelete() {
    if (!deleteItem) return; setDeleting(true);
    try { await api.delete(`/projects/${deleteItem.project_id}`); showToast('Xóa dự án thành công.'); setDeleteItem(null); await load(pagination.page); }
    catch (err) { showToast(getApiError(err), 'error'); }
    finally { setDeleting(false); }
  }
  return (
    <>
      <PageHeader eyebrow="DỰ ÁN" title="Danh sách dự án" description={canManage ? 'Theo dõi, tìm kiếm và quản lý toàn bộ dự án.' : 'Các dự án bạn đang được phân công.'} actions={canManage && <Link className="button button--accent" to="/dashboard/projects/create"><Plus /> Thêm dự án</Link>} />
      <section className="panel table-panel">
        <form className="table-toolbar" onSubmit={(event) => { event.preventDefault(); setSearch(draftSearch); }}><label className="search-box"><Search /><input value={draftSearch} onChange={(event) => setDraftSearch(event.target.value)} placeholder="Tìm theo mã, tên, địa điểm..." /></label><label className="filter-select"><Filter /><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="">Tất cả trạng thái</option><option value="PLANNING">Lập kế hoạch</option><option value="IN_PROGRESS">Đang thi công</option><option value="PAUSED">Tạm dừng</option><option value="COMPLETED">Hoàn thành</option><option value="CANCELLED">Đã hủy</option></select></label><button className="button button--secondary">Tìm kiếm</button></form>
        {loading ? <LoadingState /> : error ? <ErrorState message={error} onRetry={() => load(pagination.page)} /> : !items.length ? <EmptyState title="Không có dự án phù hợp" /> : <><div className="table-scroll"><table><thead><tr><th>Mã</th><th>Tên dự án</th><th>Khách hàng</th><th>Địa điểm</th><th>Ngày bắt đầu</th><th>Tiến độ</th><th>Trạng thái</th><th className="actions-cell">Thao tác</th></tr></thead><tbody>{items.map((project) => <tr key={project.project_id}><td><strong className="code-cell">{project.project_code}</strong></td><td><div className="table-primary"><strong>{project.project_name}</strong><small>{project.investor_name || 'Chưa có chủ đầu tư'}</small></div></td><td>{project.customer_name || '—'}</td><td>{project.location || '—'}</td><td>{formatDate(project.start_date)}</td><td className="progress-cell"><ProgressBar value={project.progress} compact /></td><td><StatusBadge status={project.status} /></td><td className="actions-cell"><Link className="icon-button" title="Xem chi tiết" to={`/dashboard/projects/${project.project_id}`}><Eye /></Link>{canManage && <><Link className="icon-button" title="Chỉnh sửa" to={`/dashboard/projects/${project.project_id}/edit`}><Pencil /></Link><button className="icon-button icon-button--danger" title="Xóa" onClick={() => setDeleteItem(project)}><Trash2 /></button></>}</td></tr>)}</tbody></table></div><Pagination pagination={pagination} onPageChange={load} /></>}
      </section>
      <ConfirmModal open={Boolean(deleteItem)} busy={deleting} message={`Bạn có chắc chắn muốn xóa dự án “${deleteItem?.project_name}”? Dữ liệu liên quan cũng sẽ bị xóa.`} onClose={() => setDeleteItem(null)} onConfirm={confirmDelete} />
    </>
  );
}
