import { useEffect, useState } from 'react';
import { FileCheck2 } from 'lucide-react';
import { api, getApiError } from '../../api/client';
import type { ApiResponse } from '../../types';
import { formatCurrency, formatDate } from '../../utils/format';
import { EmptyState, ErrorState, LoadingState } from './Feedback';
import { StatusBadge } from './StatusBadge';

interface Contract { contract_id: number; contract_number: string; project_name: string; customer_name: string; investor_name: string; signed_date: string; start_date: string; end_date: string; contract_value: number; status: string }

export function ProjectContractsTab({ projectName }: { projectName: string }) {
  const [items, setItems] = useState<Contract[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  async function load() { setLoading(true); try { const response = await api.get<ApiResponse<Contract[]>>('/contracts', { params: { search: projectName, limit: 100 } }); setItems(response.data.data); setError(''); } catch (err) { setError(getApiError(err)); } finally { setLoading(false); } }
  useEffect(() => { void load(); }, [projectName]);
  return <section className="panel table-panel"><header className="panel-table-header"><div><span className="panel-kicker">HỢP ĐỒNG DỰ ÁN</span><h2>Thông tin hợp đồng</h2></div><FileCheck2 /></header>{loading ? <LoadingState /> : error ? <ErrorState message={error} onRetry={load} /> : !items.length ? <EmptyState title="Dự án chưa có hợp đồng" /> : <div className="table-scroll"><table><thead><tr><th>Số hợp đồng</th><th>Khách hàng</th><th>Ngày ký</th><th>Thời hạn</th><th>Giá trị</th><th>Trạng thái</th></tr></thead><tbody>{items.map((item) => <tr key={item.contract_id}><td><strong>{item.contract_number}</strong></td><td>{item.customer_name || '—'}</td><td>{formatDate(item.signed_date)}</td><td>{formatDate(item.start_date)} — {formatDate(item.end_date)}</td><td><strong>{formatCurrency(item.contract_value)}</strong></td><td><StatusBadge status={item.status} /></td></tr>)}</tbody></table></div>}</section>;
}
