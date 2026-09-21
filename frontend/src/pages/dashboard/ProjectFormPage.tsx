import { useEffect, useState, type FormEvent } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, getApiError } from '../../api/client';
import { ErrorState, LoadingState } from '../../components/common/Feedback';
import { PageHeader } from '../../components/common/PageHeader';
import { useToast } from '../../contexts/ToastContext';
import type { ApiResponse, Project } from '../../types';

type FormValue = Omit<Partial<Project>, 'featured'> & { featured: boolean };
const initial: FormValue = { project_code: '', project_name: '', customer_id: undefined, investor_id: undefined, description: '', location: '', start_date: '', expected_end_date: '', actual_end_date: '', status: 'PLANNING', progress: 0, featured: false };
interface Lookup { customer_id?: number; investor_id?: number; full_name: string; organization?: string }

export function ProjectFormPage() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [form, setForm] = useState<FormValue>(initial);
  const [customers, setCustomers] = useState<Lookup[]>([]);
  const [investors, setInvestors] = useState<Lookup[]>([]);
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    async function load() {
      try {
        const [customerResponse, investorResponse, projectResponse] = await Promise.all([
          api.get<ApiResponse<Lookup[]>>('/customers?limit=100'), api.get<ApiResponse<Lookup[]>>('/investors?limit=100'),
          editing ? api.get<ApiResponse<Project>>(`/projects/${id}`) : Promise.resolve(null),
        ]);
        setCustomers(customerResponse.data.data); setInvestors(investorResponse.data.data);
        if (projectResponse) setForm({ ...projectResponse.data.data, featured: Boolean(projectResponse.data.data.featured) });
      } catch (err) { setError(getApiError(err)); }
      finally { setLoading(false); }
    }
    void load();
  }, [editing, id]);
  function update<K extends keyof FormValue>(key: K, value: FormValue[K]) { setForm((current) => ({ ...current, [key]: value })); }
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (form.start_date && form.expected_end_date && form.start_date > form.expected_end_date) { showToast('Ngày bắt đầu không được lớn hơn ngày kết thúc.', 'error'); return; }
    setSaving(true);
    try {
      const response = editing ? await api.put<ApiResponse<Project>>(`/projects/${id}`, form) : await api.post<ApiResponse<Project>>('/projects', form);
      showToast(editing ? 'Cập nhật dự án thành công.' : 'Thêm dự án thành công.');
      navigate(`/dashboard/projects/${response.data.data.project_id}`);
    } catch (err) { showToast(getApiError(err), 'error'); }
    finally { setSaving(false); }
  }
  if (loading) return <LoadingState label="Đang tải dữ liệu dự án..." />;
  if (error) return <ErrorState message={error} />;
  return (
    <>
      <PageHeader eyebrow="DỰ ÁN" title={editing ? 'Cập nhật dự án' : 'Thêm mới dự án'} description="Thông tin có dấu * là bắt buộc." actions={<Link className="button button--ghost" to={editing ? `/dashboard/projects/${id}` : '/dashboard/projects'}><ArrowLeft /> Hủy</Link>} />
      <form className="panel admin-form" onSubmit={submit}>
        <section><div className="form-section-title"><span>01</span><div><h2>Thông tin cơ bản</h2><p>Mã, tên và mô tả nhận diện dự án.</p></div></div><div className="form-grid"><label>Mã dự án *<input required value={form.project_code || ''} onChange={(e) => update('project_code', e.target.value)} placeholder="A01" /></label><label>Tên dự án *<input required value={form.project_name || ''} onChange={(e) => update('project_name', e.target.value)} placeholder="Nhà phố hiện đại A01" /></label><label>Khách hàng<select value={form.customer_id || ''} onChange={(e) => update('customer_id', Number(e.target.value) || undefined)}><option value="">Chọn khách hàng</option>{customers.map((item) => <option key={item.customer_id} value={item.customer_id}>{item.full_name}</option>)}</select></label><label>Chủ đầu tư<select value={form.investor_id || ''} onChange={(e) => update('investor_id', Number(e.target.value) || undefined)}><option value="">Chọn chủ đầu tư</option>{investors.map((item) => <option key={item.investor_id} value={item.investor_id}>{item.organization || item.full_name}</option>)}</select></label><label className="full">Địa điểm<input value={form.location || ''} onChange={(e) => update('location', e.target.value)} placeholder="Quận, thành phố" /></label><label className="full">Mô tả<textarea rows={4} value={form.description || ''} onChange={(e) => update('description', e.target.value)} /></label></div></section>
        <section><div className="form-section-title"><span>02</span><div><h2>Kế hoạch & tiến độ</h2><p>Các mốc thời gian và trạng thái thực hiện.</p></div></div><div className="form-grid form-grid--three"><label>Ngày bắt đầu<input type="date" value={form.start_date || ''} onChange={(e) => update('start_date', e.target.value)} /></label><label>Ngày dự kiến hoàn thành<input type="date" value={form.expected_end_date || ''} onChange={(e) => update('expected_end_date', e.target.value)} /></label><label>Ngày hoàn thành thực tế<input type="date" value={form.actual_end_date || ''} onChange={(e) => update('actual_end_date', e.target.value)} /></label><label>Trạng thái<select value={form.status} onChange={(e) => update('status', e.target.value as Project['status'])}><option value="PLANNING">Lập kế hoạch</option><option value="IN_PROGRESS">Đang thi công</option><option value="PAUSED">Tạm dừng</option><option value="COMPLETED">Hoàn thành</option><option value="CANCELLED">Đã hủy</option></select></label><label>Tiến độ (%)<input type="number" min="0" max="100" value={form.progress ?? 0} onChange={(e) => update('progress', Number(e.target.value))} /></label><label className="checkbox-label"><input type="checkbox" checked={form.featured} onChange={(e) => update('featured', e.target.checked)} /><span><strong>Dự án tiêu biểu</strong><small>Cho phép hiển thị trên website công khai.</small></span></label></div></section>
        <footer className="form-actions"><Link className="button button--ghost" to="/dashboard/projects">Hủy</Link><button className="button button--accent" disabled={saving}><Save /> {saving ? 'Đang lưu...' : 'Lưu dự án'}</button></footer>
      </form>
    </>
  );
}
