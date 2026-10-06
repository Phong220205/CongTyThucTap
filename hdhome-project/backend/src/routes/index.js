import { Router } from 'express';
import { pool } from '../config/database.js';
import { getSummary } from '../controllers/dashboardController.js';
import { deleteFile, deleteImage } from '../controllers/projectRelationController.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorizeRoles } from '../middleware/authorize.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ROLES } from '../utils/permissions.js';
import { sendSuccess } from '../utils/response.js';
import authRoutes from './authRoutes.js';
import contactRoutes from './contactRoutes.js';
import projectRoutes from './projectRoutes.js';
import publicRoutes from './publicRoutes.js';
import roleRoutes from './roleRoutes.js';
import { createResourceRouter } from './resourceRoutes.js';
import userRoutes from './userRoutes.js';

const router = Router();
router.get('/health', asyncHandler(async (_req, res) => {
  await pool.query('SELECT 1');
  sendSuccess(res, { database: 'connected' }, 'HDHOME API đang hoạt động.');
}));
router.use('/auth', authRoutes);
router.use('/public', publicRoutes);
router.use(authenticate);
router.get('/dashboard/summary', getSummary);
router.use('/projects', projectRoutes);
router.use('/customers', createResourceRouter('customers', 'Khách hàng'));
router.use('/investors', createResourceRouter('investors', 'Chủ đầu tư'));
router.use('/employees', createResourceRouter('employees', 'Nhân sự'));
router.use('/materials', createResourceRouter('materials', 'Vật tư'));
router.use('/contracts', createResourceRouter('contracts', 'Hợp đồng'));
router.use('/users', userRoutes);
router.use('/roles', roleRoutes);
router.use('/contacts', contactRoutes);
router.delete('/files/:id', authorizeRoles(ROLES.ADMIN, ROLES.PROJECT_MANAGER), deleteFile);
router.delete('/images/:id', authorizeRoles(ROLES.ADMIN, ROLES.PROJECT_MANAGER), deleteImage);

export default router;
