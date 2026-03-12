import api from '@/lib/api';
import type { ApiResponse, User, TrustedPerson } from './auth.service';

// ===== Types =====

export interface AdminSettings {
  id: number;
  maxTrustedPersons: number;
  allowedRelations: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UserWithTrusted extends User {
  trustedPersons: TrustedPerson[];
}

export interface PaginatedUsers {
  users: UserWithTrusted[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PaginatedRegistrations {
  registrations: UserWithTrusted[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  filter: {
    status: string;
  };
}

export interface Declaration {
  id: string;
  declarationNumber: string;
  userId: string;
  trustedPersonId: string;
  declarantFirstName: string;
  declarantLastName: string;
  declarantPhone: string;
  deathDate: string;
  deathPlace: string;
  deathCertificatePath: string;
  deathTypeCertificatePath: string;
  additionalInfo: string | null;
  status: 'pending' | 'in_review' | 'approved' | 'rejected';
  rejectionReason: string | null;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
  deceased?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    repatriationCountry: string;
  };
}

export interface PaginatedDeclarations {
  declarations: Declaration[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  filter: {
    status: string;
  };
}

// ===== Admin API calls =====

export const adminService = {
  /** GET /api/admin/settings */
  async getSettings(): Promise<ApiResponse<AdminSettings>> {
    const { data } = await api.get<ApiResponse<AdminSettings>>('/admin/settings');
    return data;
  },

  /** PUT /api/admin/settings */
  async updateSettings(payload: { maxTrustedPersons?: number; allowedRelations?: string[] }): Promise<ApiResponse<AdminSettings>> {
    const { data } = await api.put<ApiResponse<AdminSettings>>('/admin/settings', payload);
    return data;
  },

  /** GET /api/admin/users */
  async getUsers(params?: { page?: number; limit?: number; planType?: string }): Promise<ApiResponse<PaginatedUsers>> {
    const { data } = await api.get<ApiResponse<PaginatedUsers>>('/admin/users', { params });
    return data;
  },

  /** GET /api/admin/users/:id */
  async getUserById(id: string): Promise<ApiResponse<UserWithTrusted>> {
    const { data } = await api.get<ApiResponse<UserWithTrusted>>(`/admin/users/${id}`);
    return data;
  },

  /** GET /api/admin/registrations */
  async getRegistrations(params?: { status?: string; page?: number; limit?: number }): Promise<ApiResponse<PaginatedRegistrations>> {
    const { data } = await api.get<ApiResponse<PaginatedRegistrations>>('/admin/registrations', { params });
    return data;
  },

  /** PUT /api/admin/registrations/:id/approve */
  async approveRegistration(id: string): Promise<ApiResponse<User>> {
    const { data } = await api.put<ApiResponse<User>>(`/admin/registrations/${id}/approve`);
    return data;
  },

  /** PUT /api/admin/registrations/:id/reject */
  async rejectRegistration(id: string, reason: string): Promise<ApiResponse<User>> {
    const { data } = await api.put<ApiResponse<User>>(`/admin/registrations/${id}/reject`, { reason });
    return data;
  },

  /** GET /api/admin/declarations */
  async getDeclarations(params?: { status?: string; page?: number; limit?: number }): Promise<ApiResponse<PaginatedDeclarations>> {
    const { data } = await api.get<ApiResponse<PaginatedDeclarations>>('/admin/declarations', { params });
    return data;
  },

  /** PUT /api/admin/declarations/:id/approve */
  async approveDeclaration(id: string): Promise<ApiResponse<Declaration>> {
    const { data } = await api.put<ApiResponse<Declaration>>(`/admin/declarations/${id}/approve`);
    return data;
  },

  /** PUT /api/admin/declarations/:id/reject */
  async rejectDeclaration(id: string, reason: string): Promise<ApiResponse<Declaration>> {
    const { data } = await api.put<ApiResponse<Declaration>>(`/admin/declarations/${id}/reject`, { reason });
    return data;
  },
};
