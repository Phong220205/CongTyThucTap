import { Router } from 'express';
import { createCrudController } from '../controllers/crudController.js';
import { repositories } from '../models/repositories.js';
import { authorizeRoles } from '../middleware/authorize.js';
import { ROLES } from '../utils/permissions.js';

const router = Router();
const controller = createCrudController(repositories.contacts, { entityName: 'Yêu cầu liên hệ' });
router.use(authorizeRoles(ROLES.ADMIN));
router.get('/', controller.list);
router.get('/:id', controller.get);
router.patch('/:id', controller.update);
router.delete('/:id', controller.remove);
export default router;
