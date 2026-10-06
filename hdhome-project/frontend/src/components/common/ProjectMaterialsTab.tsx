import { useEffect, useState, type FormEvent } from 'react';
import { Boxes, PackagePlus, Trash2 } from 'lucide-react';
import { api, getApiError } from '../../api/client';
import { useToast } from '../../contexts/ToastContext';
import type { ApiResponse } from '../../types';
import { formatNumber } from '../../utils/format';
import { EmptyState, ErrorState, LoadingState } from './Feedback';
import { ConfirmModal, Modal } from './Modal';

interface ProjectMaterial { project_material_id: number; material_id: number; material_code: string; material_name: string; unit: string; quantity: number; note?: string }
interface Material { material_id: number; material_code: string; material_name: string; unit: string }

export function ProjectMaterialsTab({ projectId, canManage }: { projectId: number; canManage: boolean }) {
  const { showToast } = useToast(); const [items, setItems] = useState<ProjectMaterial[]>([]); const [materials, setMaterials] = useState<Material[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(''); const [open, setOpen] = useState(false); const [remove, setRemove] = useState<ProjectMaterial | null>(null); const [saving, setSaving] = useState(false); const [form, setForm] = useState({ material_id: '', quantity: 1, note: '' });
  async function load() { setLoading(true); try { const response = await api.get<ApiResponse<ProjectMaterial[]>>(`/projects/${projectId}/materials`); setItems(response.data.data); if (canManage) { const allResponse = await api.get<ApiResponse<Material[]>>('/materials?limit=100'); setMaterials(allResponse.data.data); } setError(''); } catch (err) { setError(getApiError(err)); } finally { setLoading(false); } }
  useEffect(() => { void load(); }, [projectId, canManage]);
  async function submit(event: FormEvent) { event.preventDefault(); setSaving(true); try { await api.post(`/projects/${projectId}/materials`, { ...form, material_id: Number(form.material_id) }); showToast('Thêm vật tư vào dự án thành công.'); setOpen(false); setForm({ material_id: '', quantity: 1, note: '' }); await load(); } catch (err) { showToast(getApiError(err), 'error'); } finally { setSaving(false); } }
  async function confirmRemove() { if (!remove) return; setSaving(true); try { await api.delete(`/projects/${projectId}/materials/${remove.project_material_id}`); showToast('Xóa vật tư dự án thành công.'); setRemove(null); await load(); } catch (err) { showToast(getApiError(err), 'error'); } finally { setSaving(false); } }
  return (
    <section className="panel table-panel"><header className="panel-table-header"><div><span className="panel-kicker">VẬT TƯ THEO DỰ ÁN</span><h2>Khối lượng vật tư</h2></div>{canManage && <button className="button button--accent" onClick={() => setOpen(true)}><PackagePlus /> Thêm vật tư</button>}</header>{loading ? <LoadingState /> : error ? <ErrorState message={error} onRetry={load} /> : !items.length ? <EmptyState title="Chưa có vật tư trong dự án" /> : <div className="table-scroll"><table><thead><tr><th>Mã</th><th>Tên vật tư</th><th>Đơn vị</th><th>Số lượng</th><th>Ghi chú</th>{canManage && <th>Thao tác</th>}</tr></thead><tbody>{items.map((item) => <tr key={item.project_material_id}><td><strong className="code-cell">{item.material_code}</strong></td><td><div className="material-name"><Boxes />{item.material_name}</div></td><td>{item.unit}</td><td><strong>{formatNumber(item.quantity)}</strong></td><td>{item.note || '—'}</td>{canManage && <td><button className="icon-button icon-button--danger" onClick={() => setRemove(item)}><Trash2 /></button></td>}</tr>)}</tbody></table></div>}
      <Modal open={open} title="Thêm vật tư vào dự án" onClose={() => setOpen(false)}><form className="modal-form" onSubmit={submit}><label>Vật tư *<select required value={form.material_id} onChange={(e) => setForm({ ...form, material_id: e.target.value })}><option value="">Chọn vật tư</option>{materials.map((item) => <option key={item.material_id} value={item.material_id}>{item.material_code} — {item.material_name} ({item.unit})</option>)}</select></label><label>Số lượng *<input required min="0.01" step="0.01" type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} /></label><label>Ghi chú<textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} /></label><footer className="modal-actions"><button type="button" className="button button--ghost" onClick={() => setOpen(false)}>Hủy</button><button className="button button--accent" disabled={saving}>Thêm vật tư</button></footer></form></Modal>
      <ConfirmModal open={Boolean(remove)} message={`Bạn có chắc chắn muốn xóa “${remove?.material_name}” khỏi dự án?`} busy={saving} onClose={() => setRemove(null)} onConfirm={confirmRemove} />
    </section>
  );
}
