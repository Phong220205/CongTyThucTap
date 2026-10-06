import { useEffect, useState, type FormEvent } from 'react';
import { CalendarDays, Plus, Trash2, UserRoundPlus } from 'lucide-react';
import { api, getApiError } from '../../api/client';
import { useToast } from '../../contexts/ToastContext';
import type { ApiResponse } from '../../types';
import { formatDate } from '../../utils/format';
import { EmptyState, ErrorState, LoadingState } from './Feedback';
import { ConfirmModal, Modal } from './Modal';

interface Assignment { project_employee_id: number; employee_id: number; employee_code: string; full_name: string; position: string; department: string; role_in_project: string; assigned_date: string; note?: string }
interface Employee { employee_id: number; employee_code: string; full_name: string; position: string }

export function ProjectTeamTab({ projectId, canManage }: { projectId: number; canManage: boolean }) {
  const { showToast } = useToast(); const [items, setItems] = useState<Assignment[]>([]); const [employees, setEmployees] = useState<Employee[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(''); const [open, setOpen] = useState(false); const [remove, setRemove] = useState<Assignment | null>(null); const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ employee_id: '', role_in_project: '', assigned_date: new Date().toISOString().slice(0, 10), note: '' });
  async function load() { setLoading(true); try { const response = await api.get<ApiResponse<Assignment[]>>(`/projects/${projectId}/employees`); setItems(response.data.data); if (canManage) { const employeeResponse = await api.get<ApiResponse<Employee[]>>('/employees?limit=100&status=ACTIVE'); setEmployees(employeeResponse.data.data); } setError(''); } catch (err) { setError(getApiError(err)); } finally { setLoading(false); } }
  useEffect(() => { void load(); }, [projectId, canManage]);
  async function submit(event: FormEvent) { event.preventDefault(); setSaving(true); try { await api.post(`/projects/${projectId}/employees`, { ...form, employee_id: Number(form.employee_id) }); showToast('Phân công nhân sự thành công.'); setOpen(false); setForm({ ...form, employee_id: '', role_in_project: '', note: '' }); await load(); } catch (err) { showToast(getApiError(err), 'error'); } finally { setSaving(false); } }
  async function confirmRemove() { if (!remove) return; setSaving(true); try { await api.delete(`/projects/${projectId}/employees/${remove.employee_id}`); showToast('Hủy phân công thành công.'); setRemove(null); await load(); } catch (err) { showToast(getApiError(err), 'error'); } finally { setSaving(false); } }
  return (
    <section className="panel table-panel"><header className="panel-table-header"><div><span className="panel-kicker">NHÂN SỰ DỰ ÁN</span><h2>Danh sách phân công</h2></div>{canManage && <button className="button button--accent" onClick={() => setOpen(true)}><UserRoundPlus /> Phân công nhân sự</button>}</header>{loading ? <LoadingState /> : error ? <ErrorState message={error} onRetry={load} /> : !items.length ? <EmptyState title="Chưa phân công nhân sự" /> : <div className="team-grid">{items.map((item) => <article className="team-card" key={item.project_employee_id}><div className="team-avatar">{item.full_name.split(' ').slice(-1)[0][0]}</div><div><span>{item.employee_code} · {item.department}</span><h3>{item.full_name}</h3><p>{item.position}</p><strong>{item.role_in_project}</strong><small><CalendarDays /> {formatDate(item.assigned_date)}</small></div>{canManage && <button className="icon-button icon-button--danger" title="Hủy phân công" onClick={() => setRemove(item)}><Trash2 /></button>}</article>)}</div>}
      <Modal open={open} title="Phân công nhân sự" onClose={() => setOpen(false)}><form className="modal-form" onSubmit={submit}><label>Chọn nhân viên *<select required value={form.employee_id} onChange={(e) => setForm({ ...form, employee_id: e.target.value })}><option value="">Chọn nhân viên</option>{employees.map((item) => <option key={item.employee_id} value={item.employee_id}>{item.employee_code} — {item.full_name} ({item.position})</option>)}</select></label><label>Vai trò trong dự án *<input required value={form.role_in_project} onChange={(e) => setForm({ ...form, role_in_project: e.target.value })} placeholder="Kỹ sư xây dựng" /></label><label>Ngày phân công *<input required type="date" value={form.assigned_date} onChange={(e) => setForm({ ...form, assigned_date: e.target.value })} /></label><label>Ghi chú<textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} /></label><footer className="modal-actions"><button type="button" className="button button--ghost" onClick={() => setOpen(false)}>Hủy</button><button className="button button--accent" disabled={saving}>Lưu phân công</button></footer></form></Modal>
      <ConfirmModal open={Boolean(remove)} title="Hủy phân công" message={`Bạn có chắc chắn muốn hủy phân công của “${remove?.full_name}”?`} busy={saving} onClose={() => setRemove(null)} onConfirm={confirmRemove} />
    </section>
  );
}
