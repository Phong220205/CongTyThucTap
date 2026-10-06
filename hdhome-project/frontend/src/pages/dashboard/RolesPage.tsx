import { useEffect, useState, type FormEvent } from 'react';
import { Pencil, Plus, ShieldCheck, Trash2 } from 'lucide-react';
import { api, getApiError } from '../../api/client';
import { EmptyState, ErrorState, LoadingState } from '../../components/common/Feedback';
import { ConfirmModal, Modal } from '../../components/common/Modal';
import { PageHeader } from '../../components/common/PageHeader';
import { useToast } from '../../contexts/ToastContext';
import type { ApiResponse } from '../../types';

interface Role { role_id: number; role_name: string; description?: string; permissions: string[] }
const defaultRoles = ['ADMIN', 'PROJECT_MANAGER', 'TECHNICAL_STAFF'];

export function RolesPage() {
  const { showToast } = useToast(); const [items, setItems] = useState<Role[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(''); const [editing, setEditing] = useState<Role | null>(null); const [open, setOpen] = useState(false); const [form, setForm] = useState({ role_name: '', description: '' }); const [remove, setRemove] = useState<Role | null>(null); const [saving, setSaving] = useState(false);
  async function load() { setLoading(true); try { const response = await api.get<ApiResponse<Role[]>>('/roles'); setItems(response.data.data); setError(''); } catch (err) { setError(getApiError(err)); } finally { setLoading(false); } }
  useEffect(() => { void load(); }, []);
  function showForm(role?: Role) { setEditing(role || null); setForm(role ? { role_name: role.role_name, description: role.description || '' } : { role_name: '', description: '' }); setOpen(true); }
  async function submit(event: FormEvent) { event.preventDefault(); setSaving(true); try { editing ? await api.put(`/roles/${editing.role_id}`, form) : await api.post('/roles', form); showToast(editing ? 'Cập nhật vai trò thành công.' : 'Thêm vai trò thành công.'); setOpen(false); await load(); } catch (err) { showToast(getApiError(err), 'error'); } finally { setSaving(false); } }
  async function confirmDelete() { if (!remove) return; setSaving(true); try { await api.delete(`/roles/${remove.role_id}`); showToast('Xóa vai trò thành công.'); setRemove(null); await load(); } catch (err) { showToast(getApiError(err), 'error'); setRemove(null); } finally { setSaving(false); } }
  return (
    <><PageHeader eyebrow="BẢO MẬT" title="Vai trò & phân quyền" description="Quyền được kiểm tra ở cả giao diện và API backend." actions={<button className="button button--accent" onClick={() => showForm()}><Plus /> Thêm vai trò</button>} />
      {loading ? <LoadingState /> : error ? <ErrorState message={error} onRetry={load} /> : !items.length ? <EmptyState title="Chưa có vai trò" /> : <div className="roles-grid">{items.map((role) => <article className="role-card" key={role.role_id}><header><div className="role-icon"><ShieldCheck /></div><div><span>ROLE / {role.role_id.toString().padStart(2, '0')}</span><h2>{role.role_name}</h2></div></header><p>{role.description || 'Chưa có mô tả.'}</p><div className="permission-list"><strong>Quyền hệ thống</strong>{role.permissions.map((permission) => <span key={permission}>{permission === '*' ? 'Toàn quyền hệ thống' : permission}</span>)}</div><footer><button className="button button--secondary" onClick={() => showForm(role)}><Pencil /> Sửa mô tả</button><button className="icon-button icon-button--danger" disabled={defaultRoles.includes(role.role_name)} title={defaultRoles.includes(role.role_name) ? 'Không thể xóa vai trò mặc định' : 'Xóa'} onClick={() => setRemove(role)}><Trash2 /></button></footer></article>)}</div>}
      <Modal open={open} title={editing ? 'Cập nhật vai trò' : 'Thêm vai trò'} onClose={() => setOpen(false)}><form className="modal-form" onSubmit={submit}><label>Tên vai trò *<input required disabled={Boolean(editing)} value={form.role_name} onChange={(e) => setForm({ ...form, role_name: e.target.value.toUpperCase().replace(/\s+/g, '_') })} /></label><label>Mô tả<textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label><footer className="modal-actions"><button type="button" className="button button--ghost" onClick={() => setOpen(false)}>Hủy</button><button className="button button--accent" disabled={saving}>Lưu vai trò</button></footer></form></Modal>
      <ConfirmModal open={Boolean(remove)} busy={saving} message={`Bạn có chắc chắn muốn xóa vai trò “${remove?.role_name}”?`} onClose={() => setRemove(null)} onConfirm={confirmDelete} />
    </>
  );
}
