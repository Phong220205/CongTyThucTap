import { createCrudController } from './crudController.js';
import { repositories } from '../models/repositories.js';
import { canAccessProject, projectListScope } from '../services/projectAccessService.js';

export const projectController = createCrudController(repositories.projects, {
  entityName: 'Dự án',
  listScope: projectListScope,
  canRead: (req, item) => canAccessProject(req.user, item.project_id),
  beforeWrite: async (payload) => ({
    ...payload,
    progress: Number(payload.progress ?? 0),
    featured: payload.featured === true || payload.featured === 1 || payload.featured === '1' ? 1 : 0,
  }),
});
