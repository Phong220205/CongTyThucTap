export function ProgressBar({ value, compact = false }: { value: number; compact?: boolean }) {
  const safe = Math.min(Math.max(Number(value) || 0, 0), 100);
  return (
    <div className={`progress-wrap ${compact ? 'progress-wrap--compact' : ''}`}>
      <div className="progress-track" aria-label={`Tiến độ ${safe}%`} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={safe}>
        <span style={{ width: `${safe}%` }} />
      </div>
      <strong>{safe}%</strong>
    </div>
  );
}
