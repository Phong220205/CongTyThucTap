export type RoleName = 'ADMIN' | 'PROJECT_MANAGER' | 'TECHNICAL_STAFF';

export interface User {
  user_id: number;
  username: string;
  full_name: string;
  email?: string;
  phone?: string;
  employee_id?: number;
  role_id: number;
  role_name: RoleName;
  status: string;
  permissions: string[];
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: Pagination;
  errors?: string[];
}

export type ProjectStatus = 'PLANNING' | 'IN_PROGRESS' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';

export interface Project {
  project_id: number;
  project_code: string;
  project_name: string;
  customer_id?: number;
  investor_id?: number;
  customer_name?: string;
  investor_name?: string;
  description?: string;
  location?: string;
  start_date?: string;
  expected_end_date?: string;
  actual_end_date?: string;
  status: ProjectStatus;
  progress: number;
  featured: boolean | number;
  cover_image?: string;
  images?: Array<{ image_id: number; title: string; description?: string; image_path: string }>;
  updated_at?: string;
}

export interface Option {
  value: string | number;
  label: string;
}
