import { CircleAlert, Inbox, LoaderCircle } from 'lucide-react';

export function LoadingState({ label = 'Đang tải dữ liệu...' }: { label?: string }) {
  return <div className="feedback-state"><LoaderCircle className="spin" /><p>{label}</p></div>;
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="feedback-state feedback-state--error">
      <CircleAlert /><p>{message}</p>
      {onRetry && <button className="button button--secondary" onClick={onRetry}>Thử lại</button>}
    </div>
  );
}

export function EmptyState({ title = 'Chưa có dữ liệu', description = 'Dữ liệu mới sẽ xuất hiện tại đây.' }: { title?: string; description?: string }) {
  return <div className="feedback-state"><Inbox /><strong>{title}</strong><p>{description}</p></div>;
}
