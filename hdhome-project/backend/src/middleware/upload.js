import fs from 'node:fs';
import path from 'node:path';
import multer from 'multer';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

const allowedMimeTypes = new Set(['application/pdf', 'image/jpeg', 'image/png']);
const allowedExtensions = new Set(['.pdf', '.jpg', '.jpeg', '.png']);

const storage = multer.diskStorage({
  destination(req, _file, callback) {
    const projectId = String(req.params.id || req.body.project_id || '').replace(/\D/g, '');
    if (!projectId) return callback(new ApiError(422, 'Mã dự án upload không hợp lệ.'));
    const destination = path.resolve(env.uploadDir, 'projects', projectId);
    fs.mkdirSync(destination, { recursive: true });
    callback(null, destination);
  },
  filename(_req, file, callback) {
    const extension = path.extname(file.originalname).toLowerCase();
    const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
    callback(null, safeName);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: env.maxFileSize, files: 10 },
  fileFilter(_req, file, callback) {
    const extension = path.extname(file.originalname).toLowerCase();
    if (!allowedMimeTypes.has(file.mimetype) || !allowedExtensions.has(extension)) {
      return callback(new ApiError(422, 'Chỉ chấp nhận PDF, JPG, JPEG hoặc PNG.'));
    }
    callback(null, true);
  },
});
