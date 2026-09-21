import { Router } from 'express';
import { createRole, deleteRole, listRoles, updateRole } from '../controllers/roleController.js';
import { authorizeRoles } from '../middleware/authorize.js';
import { ROLES } from '../utils/permissions.js';

const router = Router();
router.use(authorizeRoles(ROLES.ADMIN));
router.get('/', listRoles);
router.post('/', createRole);
router.put('/:id', updateRole);
router.delete('/:id', deleteRole);
export default router;
