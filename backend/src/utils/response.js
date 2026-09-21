export function sendSuccess(res, data = null, message = 'Thành công', statusCode = 200, extra = {}) {
  return res.status(statusCode).json({ success: true, message, data, ...extra });
}
