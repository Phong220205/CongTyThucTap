export function getPagination(query) {
  const page = Math.max(Number.parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(query.limit, 10) || 10, 1), 100);
  return { page, limit, offset: (page - 1) * limit };
}

export function paginationMeta(page, limit, total) {
  return { page, limit, total, totalPages: Math.max(Math.ceil(total / limit), 1) };
}
