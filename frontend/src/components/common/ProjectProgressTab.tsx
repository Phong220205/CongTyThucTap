import { useEffect, useState, type FormEvent } from 'react';
import { CalendarClock, Plus, TrendingUp, UserRound } from 'lucide-react';
import { api, getApiError } from '../../api/client';
import { useToast } from '../../contexts/ToastContext';
import type { ApiResponse } from '../../types';
import { formatDate } from '../../utils/format';
import { EmptyState, ErrorState, LoadingState } from './Feedback';
import { Modal } from './Modal';
import { ProgressBar } from './ProgressBar';

interface Update { update_id: number; progress_percent: number; title: string; note?: string; updated_by_name: string; updated_at: string }

export function ProjectProgressTab({ projectId, progress, onUpdated }: { projectId: number; progress: number; onUpdated: () => void }) {
  const { showToast } = useToast();
  const [items, setItems] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ progress_percent: progress, title: '', note: '' });
  async function load() { setLoading(true); try { const response = await api.get<ApiResponse<Update[]>>(`/projects/${projectId}/progress`); setItems(response.data.data); setError(''); } catch (err) { setError(getApiError(err)); } finally { setLoading(false); } }
  useEffect(() => { void load(); }, [projectId]);
  async function submit(event: FormEvent) { event.preventDefault(); setSaving(true); try { await api.post(`/projects/${projectId}/progress`, form); showToast('Cập nhật tiến độ thành công.'); setOpen(false); setForm({ progress_percent: form.progress_percent, title: '', note: '' }); await load(); onUpdated(); } catch (err) { showToast(getApiError(err), 'error'); } finally { setSaving(false); } }
  return (
    <div className="progress-tab">
      <section className="progress-spotlight"><div><span>TIẾN ĐỘ HIỆN TẠI</span><strong>{progress}<small>%</small></strong></div><ProgressBar value={progress} /><button className="button button--accent" onClick={() => setOpen(true)}><Plus /> Cập nhật tiến độ</button></section>
      <section className="panel timeline-panel"><header><div><span className="panel-kicker">LỊCH SỬ KHÔNG GHI ĐÈ</span><h2>Dòng thời gian tiến độ</h2></div><CalendarClock /></header>{loading ? <LoadingState /> : error ? <ErrorState message={error} onRetry={load} /> : !items.length ? <EmptyState title="Chưa có cập nhật tiến độ" /> : <div className="timeline">{items.map((item) => <article key={item.update_id}><div className="timeline-dot"><TrendingUp /></div><div className="timeline-card"><header><div><strong>{item.title}</strong><span>{formatDate(item.updated_at)}</span></div><b>{item.progress_percent}%</b></header><p>{item.note || 'Không có ghi chú.'}</p><small><UserRound /> {item.updated_by_name}</small></div></article>)}</div>}</section>
      <Modal open={open} title="Cập nhật tiến độ thi công" onClose={() => setOpen(false)}><form className="modal-form" onSubmit={submit}><label>Phần trăm tiến độ *<div className="range-field"><input type="range" min="0" max="100" value={form.progress_percent} onChange={(e) => setForm({ ...form, progress_percent: Number(e.target.value) })} /><input type="number" min="0" max="100" value={form.progress_percent} onChange={(e) => setForm({ ...form, progress_percent: Number(e.target.value) })} /></div></label><label>Tiêu đề *<input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Ví dụ: Hoàn thành phần móng" /></label><label>Ghi chú<textarea rows={4} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="Mô tả công việc đã hoàn thành..." /></label><footer className="modal-actions"><button type="button" className="button button--ghost" onClick={() => setOpen(false)}>Hủy</button><button className="button button--accent" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu cập nhật'}</button></footer></form></Modal>
    </div>
  );
}
