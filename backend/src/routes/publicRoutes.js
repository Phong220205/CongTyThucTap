import { Router } from 'express';
import { createContactRequest, getFeaturedProject, listFeaturedProjects } from '../controllers/publicController.js';
import { validate } from '../middleware/validate.js';
import { validateContact } from '../validators/resourceValidators.js';

const router = Router();
router.get('/projects', listFeaturedProjects);
router.get('/projects/:id', getFeaturedProject);
router.post('/contacts', validate(validateContact), createContactRequest);

export default router;
