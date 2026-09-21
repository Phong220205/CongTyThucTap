import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { RoleName } from '../types';

export function ProtectedRoute({ children, roles }: { children: ReactNode; roles?: RoleName[] }) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (roles && user && !roles.includes(user.role_name)) return <Navigate to="/dashboard" replace />;
  return children;
}
