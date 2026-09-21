import { Router } from 'express';
import { createUser, deleteUser, getUser, listUsers, resetPassword, updateUser } from '../controllers/userController.js';
import { authorizeRoles } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import { validateUser } from '../validators/resourceValidators.js';
import { ROLES } from '../utils/permissions.js';

const router = Router();
router.use(authorizeRoles(ROLES.ADMIN));
router.get('/', listUsers);
router.get('/:id', getUser);
router.post('/', validate(validateUser), createUser);
router.put('/:id', validate(validateUser), updateUser);
router.patch('/:id/reset-password', resetPassword);
router.delete('/:id', deleteUser);
export default router;
