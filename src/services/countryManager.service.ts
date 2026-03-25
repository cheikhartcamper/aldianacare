import api from '@/lib/api';
import type { ApiResponse } from './auth.service';
import type { Declaration } from './admin.service';

export interface CountryManagerStats {
  totalUsers: number;
  totalDeclarations: number;
  pendingDeclarations: number;
  inReviewDeclarations?: number;
  approvedDeclarations: number;
  rejectedDeclarations: number;
  country: {
    id: string;
    name: string;
    type: string;
  };
}

export interface CountryManagerUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  planType: 'individual' | 'family';
  registrationStatus: 'pending' | 'approved' | 'rejected';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedCMUsers {
  users: CountryManagerUser[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PaginatedCMDeclarations {
  declarations: Declaration[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const countryManagerService = {
  /** GET /api/country-manager/dashboard */
  async getDashboard(): Promise<ApiResponse<CountryManagerStats>> {
    const { data } = await api.get<ApiResponse<CountryManagerStats>>('/country-manager/dashboard');
    return data;
  },

  /** GET /api/country-manager/users */
  async getUsers(params?: { page?: number; limit?: number; search?: string }): Promise<ApiResponse<PaginatedCMUsers>> {
    const { data } = await api.get<ApiResponse<PaginatedCMUsers>>('/country-manager/users', { params });
    return data;
  },

  /** GET /api/country-manager/declarations */
  async getDeclarations(params?: { status?: string; page?: number; limit?: number }): Promise<ApiResponse<PaginatedCMDeclarations>> {
    const { data } = await api.get<ApiResponse<PaginatedCMDeclarations>>('/country-manager/declarations', { params });
    return data;
  },
};
