import { useEffect, useState } from 'react';
import { CheckCheck, Eye, Search, XCircle } from 'lucide-react';
import { api, getApiError } from '../../api/client';
import { EmptyState, ErrorState, LoadingState } from '../../components/common/Feedback';
import { Modal } from '../../components/common/Modal';
import { PageHeader } from '../../components/common/PageHeader';
import { Pagination } from '../../components/common/Pagination';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useToast } from '../../contexts/ToastContext';
import type { ApiResponse, Pagination as PaginationType } from '../../types';
import { formatDate } from '../../utils/format';

interface Contact { contact_id: number; full_name: string; phone: string; email?: string; subject: string; message: string; status: string; created_at: string }
const defaultPagination: PaginationType = { page: 1, limit: 10, total: 0, totalPages: 1 };

export function ContactsPage() {
  const { showToast } = useToast(); const [items, setItems] = useState<Contact[]>([]); const [pagination, setPagination] = useState(defaultPagination); const [search, setSearch] = useState(''); const [draft, setDraft] = useState(''); const [status, setStatus] = useState(''); const [view, setView] = useState<Contact | null>(null); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  async function load(page = 1) { setLoading(true); try { const response = await api.get<ApiResponse<Contact[]>>('/contacts', { params: { page, limit: 10, search, status } }); setItems(response.data.data); setPagination(response.data.pagination || defaultPagination); setError(''); } catch (err) { setError(getApiError(err)); } finally { setLoading(false); } }
  useEffect(() => { void load(1); }, [search, status]);
  async function updateStatus(item: Contact, nextStatus: string) { try { await api.patch(`/contacts/${item.contact_id}`, { status: nextStatus }); showToast('Cập nhật yêu cầu liên hệ thành công.'); if (view?.contact_id === item.contact_id) setView({ ...item, status: nextStatus }); await load(pagination.page); } catch (err) { showToast(getApiError(err), 'error'); } }
  return (
    <><PageHeader eyebrow="WEBSITE CÔNG KHAI" title="Yêu cầu liên hệ" description="Các yêu cầu tư vấn gửi từ trang liên hệ." />
      <section className="panel table-panel"><form className="table-toolbar" onSubmit={(e) => { e.preventDefault(); setSearch(draft); }}><label className="search-box"><Search /><input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Tìm tên, điện thoại, chủ đề..." /></label><select className="standalone-select" value={status} onChange={(e) => setStatus(e.target.value)}><option value="">Tất cả trạng thái</option><option value="NEW">Mới</option><option value="CONTACTED">Đã liên hệ</option><option value="CLOSED">Đã đóng</option></select><button className="button button--secondary">Tìm kiếm</button></form>{loading ? <LoadingState /> : error ? <ErrorState message={error} onRetry={() => load(pagination.page)} /> : !items.length ? <EmptyState title="Chưa có yêu cầu liên hệ" /> : <><div className="table-scroll"><table><thead><tr><th>Ngày</th><th>Họ tên</th><th>Điện thoại</th><th>Email</th><th>Chủ đề</th><th>Trạng thái</th><th>Thao tác</th></tr></thead><tbody>{items.map((item) => <tr key={item.contact_id}><td>{formatDate(item.created_at)}</td><td><strong>{item.full_name}</strong></td><td>{item.phone}</td><td>{item.email || '—'}</td><td>{item.subject}</td><td><StatusBadge status={item.status} /></td><td className="actions-cell"><button className="icon-button" title="Xem chi tiết" onClick={() => setView(item)}><Eye /></button>{item.status === 'NEW' && <button className="icon-button icon-button--success" title="Đánh dấu đã liên hệ" onClick={() => updateStatus(item, 'CONTACTED')}><CheckCheck /></button>}{item.status !== 'CLOSED' && <button className="icon-button" title="Đóng yêu cầu" onClick={() => updateStatus(item, 'CLOSED')}><XCircle /></button>}</td></tr>)}</tbody></table></div><Pagination pagination={pagination} onPageChange={load} /></>}</section>
      <Modal open={Boolean(view)} title="Chi tiết yêu cầu tư vấn" onClose={() => setView(null)}><div className="contact-detail">{view && <><StatusBadge status={view.status} /><h2>{view.subject}</h2><p>{view.message}</p><dl><div><dt>Họ tên</dt><dd>{view.full_name}</dd></div><div><dt>Điện thoại</dt><dd>{view.phone}</dd></div><div><dt>Email</dt><dd>{view.email || '—'}</dd></div><div><dt>Ngày gửi</dt><dd>{formatDate(view.created_at)}</dd></div></dl><footer className="modal-actions">{view.status === 'NEW' && <button className="button button--secondary" onClick={() => updateStatus(view, 'CONTACTED')}><CheckCheck /> Đã liên hệ</button>}{view.status !== 'CLOSED' && <button className="button button--dark" onClick={() => updateStatus(view, 'CLOSED')}>Đóng yêu cầu</button>}</footer></>}</div></Modal>
    </>
  );
}
