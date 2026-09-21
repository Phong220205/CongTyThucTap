import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { api } from '../api/client';
import type { ApiResponse, User } from '../types';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function storedUser(): User | null {
  try {
    const value = localStorage.getItem('hdhome_user');
    return value ? JSON.parse(value) : null;
  } catch { return null; }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(storedUser);

  async function login(username: string, password: string) {
    const response = await api.post<ApiResponse<{ token: string; user: User }>>('/auth/login', { username, password });
    localStorage.setItem('hdhome_token', response.data.data.token);
    localStorage.setItem('hdhome_user', JSON.stringify(response.data.data.user));
    setUser(response.data.data.user);
    return response.data.data.user;
  }

  async function logout() {
    try { await api.post('/auth/logout'); } catch { /* Token phía máy khách vẫn được xóa. */ }
    localStorage.removeItem('hdhome_token');
    localStorage.removeItem('hdhome_user');
    setUser(null);
  }

  const value = useMemo(() => ({ user, isAuthenticated: Boolean(user), login, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth phải nằm trong AuthProvider');
  return context;
}
