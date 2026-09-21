import { formatStatus } from '../../utils/format';

export function StatusBadge({ status }: { status?: string }) {
  return <span className={`status-badge status-badge--${(status || '').toLowerCase()}`}>{formatStatus(status)}</span>;
}
