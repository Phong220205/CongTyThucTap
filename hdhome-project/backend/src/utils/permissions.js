export const ROLES = Object.freeze({
  ADMIN: 'ADMIN',
  PROJECT_MANAGER: 'PROJECT_MANAGER',
  TECHNICAL_STAFF: 'TECHNICAL_STAFF',
});

export const permissions = Object.freeze({
  ADMIN: ['*'],
  PROJECT_MANAGER: [
    'dashboard:read', 'projects:*', 'customers:*', 'investors:*', 'contracts:*',
    'employees:*', 'materials:*', 'assignments:*', 'files:*', 'images:*', 'progress:*',
  ],
  TECHNICAL_STAFF: [
    'projects:assigned', 'projects:read', 'files:read', 'files:create',
    'images:read', 'images:create', 'progress:read', 'progress:create',
  ],
});

export function hasPermission(role, permission) {
  const granted = permissions[role] || [];
  if (granted.includes('*') || granted.includes(permission)) return true;
  const [resource] = permission.split(':');
  return granted.includes(`${resource}:*`);
}
