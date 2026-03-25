import api from '@/lib/api';
import type { ApiResponse, User, TrustedPerson, FamilyMember } from './auth.service';

// ===== Types =====

export interface AdminSettings {
  id: number;
  maxTrustedPersons: number;
  allowedRelations: string[];
  minFamilyMembers: number;
  familyDiscountPercent: number;
  eligibilityMonths: number;
  referralDiscountPercent: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserWithTrusted extends User {
  trustedPersons: TrustedPerson[];
  familyMembers?: FamilyMember[];
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

export interface Country {
  id: string;
  name: string;
  type: 'residence' | 'repatriation';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CountriesResponse {
  countries: Country[];
  summary: { total: number; residence: number; repatriation: number };
  grouped: { residence: Country[]; repatriation: Country[] };
}

export interface PublicCountriesResponse {
  residence: { id: string; name: string }[];
  repatriation: { id: string; name: string }[];
}

export interface CountryManager {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'country_manager';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  assignedCountry: {
    id: string;
    name: string;
    type: string;
    isActive?: boolean;
  };
}

export interface CountryManagersResponse {
  countryManagers: CountryManager[];
  total: number;
}

// ===== Admin API calls =====

export const adminService = {
  /** GET /api/admin/settings */
  async getSettings(): Promise<ApiResponse<AdminSettings>> {
    const { data } = await api.get<ApiResponse<AdminSettings>>('/admin/settings');
    return data;
  },

  /** PUT /api/admin/settings */
  async updateSettings(payload: {
    maxTrustedPersons?: number;
    allowedRelations?: string[];
    minFamilyMembers?: number;
    familyDiscountPercent?: number;
    eligibilityMonths?: number;
    referralDiscountPercent?: number;
  }): Promise<ApiResponse<AdminSettings>> {
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
  async getRegistrations(params?: { status?: string; page?: number; limit?: number; planType?: string }): Promise<ApiResponse<PaginatedRegistrations>> {
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

  // ===== Countries =====

  /** GET /api/admin/countries */
  async getCountries(params?: { type?: string; active?: string }): Promise<ApiResponse<CountriesResponse>> {
    const { data } = await api.get<ApiResponse<CountriesResponse>>('/admin/countries', { params });
    return data;
  },

  /** POST /api/admin/countries */
  async createCountry(payload: { name: string; type: 'residence' | 'repatriation'; isActive?: boolean }): Promise<ApiResponse<Country>> {
    const { data } = await api.post<ApiResponse<Country>>('/admin/countries', payload);
    return data;
  },

  /** PUT /api/admin/countries/:id */
  async updateCountry(id: string, payload: { name?: string; type?: string; isActive?: boolean }): Promise<ApiResponse<Country>> {
    const { data } = await api.put<ApiResponse<Country>>(`/admin/countries/${id}`, payload);
    return data;
  },

  /** DELETE /api/admin/countries/:id */
  async deleteCountry(id: string): Promise<ApiResponse<null>> {
    const { data } = await api.delete<ApiResponse<null>>(`/admin/countries/${id}`);
    return data;
  },

  /** GET /api/countries (public) */
  async getPublicCountries(type?: string): Promise<ApiResponse<PublicCountriesResponse>> {
    const { data } = await api.get<ApiResponse<PublicCountriesResponse>>('/countries', { params: type ? { type } : undefined });
    return data;
  },

  // ===== Country Managers =====

  /** POST /api/admin/country-managers */
  async createCountryManager(payload: { firstName: string; lastName: string; email: string; phone: string; countryId: string }): Promise<ApiResponse<CountryManager>> {
    const { data } = await api.post<ApiResponse<CountryManager>>('/admin/country-managers', payload);
    return data;
  },

  /** GET /api/admin/country-managers */
  async getCountryManagers(params?: { countryId?: string; active?: string }): Promise<ApiResponse<CountryManagersResponse>> {
    const { data } = await api.get<ApiResponse<CountryManagersResponse>>('/admin/country-managers', { params });
    return data;
  },
};
