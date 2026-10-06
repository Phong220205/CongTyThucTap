import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Pagination as PaginationType } from '../../types';

export function Pagination({ pagination, onPageChange }: { pagination: PaginationType; onPageChange: (page: number) => void }) {
  if (pagination.totalPages <= 1) return null;
  const pages = Array.from({ length: pagination.totalPages }, (_, index) => index + 1)
    .filter((page) => page === 1 || page === pagination.totalPages || Math.abs(page - pagination.page) <= 1);
  return (
    <div className="pagination">
      <span>Trang {pagination.page}/{pagination.totalPages} · {pagination.total} mục</span>
      <div>
        <button aria-label="Trang trước" disabled={pagination.page <= 1} onClick={() => onPageChange(pagination.page - 1)}><ChevronLeft size={17} /></button>
        {pages.map((page, index) => (
          <span key={page}>
            {index > 0 && page - pages[index - 1] > 1 && <i>…</i>}
            <button className={page === pagination.page ? 'active' : ''} onClick={() => onPageChange(page)}>{page}</button>
          </span>
        ))}
        <button aria-label="Trang sau" disabled={pagination.page >= pagination.totalPages} onClick={() => onPageChange(pagination.page + 1)}><ChevronRight size={17} /></button>
      </div>
    </div>
  );
}
