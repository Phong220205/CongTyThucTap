import { useEffect, type ReactNode } from 'react';
import { TriangleAlert, X } from 'lucide-react';

export function Modal({ open, title, children, onClose, size = 'medium' }: { open: boolean; title: string; children: ReactNode; onClose: () => void; size?: 'small' | 'medium' | 'large' }) {
  useEffect(() => {
    if (!open) return;
    const handler = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className={`modal modal--${size}`} role="dialog" aria-modal="true" aria-label={title}>
        <header><h2>{title}</h2><button aria-label="Đóng" onClick={onClose}><X /></button></header>
        {children}
      </section>
    </div>
  );
}

export function ConfirmModal({ open, title = 'Xác nhận xóa', message = 'Bạn có chắc chắn muốn xóa?', busy, onConfirm, onClose }: { open: boolean; title?: string; message?: string; busy?: boolean; onConfirm: () => void; onClose: () => void }) {
  return (
    <Modal open={open} title={title} onClose={onClose} size="small">
      <div className="confirm-content"><TriangleAlert /><p>{message}</p></div>
      <footer className="modal-actions"><button className="button button--ghost" onClick={onClose}>Hủy</button><button className="button button--danger" disabled={busy} onClick={onConfirm}>{busy ? 'Đang xử lý...' : 'Xác nhận xóa'}</button></footer>
    </Modal>
  );
}
