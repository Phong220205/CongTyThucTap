import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getPagination } from '../utils/pagination.js';
import { sendSuccess } from '../utils/response.js';

export function createCrudController(repository, options = {}) {
  const entityName = options.entityName || 'Dữ liệu';
  return {
    list: asyncHandler(async (req, res) => {
      const pagination = getPagination(req.query);
      const result = await repository.list({
        ...pagination,
        search: req.query.search,
        status: req.query.status,
        sort: req.query.sort,
        ...(options.listScope ? options.listScope(req) : {}),
      });
      sendSuccess(res, result.data, 'Lấy danh sách thành công.', 200, { pagination: result.pagination });
    }),
    get: asyncHandler(async (req, res) => {
      const item = await repository.findById(req.params.id);
      if (!item) throw new ApiError(404, `${entityName} không tồn tại.`);
      if (options.canRead && !(await options.canRead(req, item))) throw new ApiError(403, 'Bạn không được xem dữ liệu này.');
      sendSuccess(res, item);
    }),
    create: asyncHandler(async (req, res) => {
      const payload = options.beforeWrite ? await options.beforeWrite(req.body, req) : req.body;
      const id = await repository.create(payload);
      sendSuccess(res, await repository.findById(id), `Thêm ${entityName.toLowerCase()} thành công.`, 201);
    }),
    update: asyncHandler(async (req, res) => {
      const existing = await repository.findById(req.params.id);
      if (!existing) throw new ApiError(404, `${entityName} không tồn tại.`);
      const payload = options.beforeWrite ? await options.beforeWrite(req.body, req, existing) : req.body;
      await repository.update(req.params.id, payload);
      sendSuccess(res, await repository.findById(req.params.id), `Cập nhật ${entityName.toLowerCase()} thành công.`);
    }),
    remove: asyncHandler(async (req, res) => {
      const removed = await repository.remove(req.params.id);
      if (!removed) throw new ApiError(404, `${entityName} không tồn tại.`);
      sendSuccess(res, null, `Xóa ${entityName.toLowerCase()} thành công.`);
    }),
  };
}
