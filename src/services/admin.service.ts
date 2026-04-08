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

export interface HealthDeclaration {
  id: string;
  title: string;
  contentText: string | null;
  documentPath: string | null;
  documentMimeType: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type HealthDeclarationsResponse = HealthDeclaration[];

export interface AdminAnalytics {
  users: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
    individual: number;
    family: number;
    newThisMonth: number;
  };
  registrations: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  declarations: {
    total: number;
    pending: number;
    in_review: number;
    approved: number;
    rejected: number;
  };
  payments: {
    totalRevenue: number;
    thisMonth: number;
    unpaid: number;
    totalPayments: number;
  };
  countries: {
    total: number;
    residence: number;
    repatriation: number;
  };
  monthlyEvolution: { month: string; newUsers: number; revenue: number }[];
}

export interface AdminPayment {
  id: string;
  userId: string;
  userSubscriptionId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  paymentReference: string | null;
  paymentMethod: string | null;
  paidAt: string | null;
  paymentNumber: number;
  periodStart: string | null;
  periodEnd: string | null;
  isLatePayment: boolean;
  notes: string | null;
  createdAt: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
    planType: string;
  };
}

export interface AdminPaymentsResponse {
  payments: AdminPayment[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  summary: {
    totalRevenue: number;
    thisMonth: number;
    pending: number;
    failed: number;
  };
}

export interface PaymentsDashboard {
  totalCollected: number;
  paymentsCompleted: number;
  paymentsPending: number;
  paymentsFailed: number;
  paymentsTotal: number;
}

export interface UpcomingDue {
  nextDueDate: string;
  daysUntilDue: number;
  dueAmount: number;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  subscription: {
    planType: string;
    memberCount: number;
  };
}

export interface UpcomingDuesResponse {
  dues: UpcomingDue[];
}

export interface AdminReferral {
  id: string;
  referrerId: string;
  referredId: string;
  code: string;
  discountPercent: number;
  commissionAmount: number;
  commissionPaid: boolean;
  commissionPaidAt: string | null;
  createdAt: string;
  referrer?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  referred?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface AdminReferralsResponse {
  referrals: AdminReferral[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  summary: {
    totalReferrals: number;
    totalCommissionsDue: number;
    totalCommissionsPaid: number;
    activeSponsor: number;
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

  /** DELETE /api/admin/country-managers/:id */
  async deleteCountryManager(id: string): Promise<ApiResponse<{ id: string; email: string }>> {
    const { data } = await api.delete<ApiResponse<{ id: string; email: string }>>(`/admin/country-managers/${id}`);
    return data;
  },

  /** DELETE /api/admin/users/:id */
  async deleteUser(id: string): Promise<ApiResponse<{ id: string; email: string }>> {
    const { data } = await api.delete<ApiResponse<{ id: string; email: string }>>(`/admin/users/${id}`);
    return data;
  },

  // ===== Health Declarations =====

  /** GET /api/admin/health-declarations */
  async getHealthDeclarations(): Promise<ApiResponse<HealthDeclaration[]>> {
    const { data } = await api.get<ApiResponse<HealthDeclaration[]>>('/admin/health-declarations');
    return data;
  },

  /** POST /api/admin/health-declarations */
  async createHealthDeclaration(formData: FormData): Promise<ApiResponse<HealthDeclaration>> {
    const { data } = await api.post<ApiResponse<HealthDeclaration>>('/admin/health-declarations', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  /** PUT /api/admin/health-declarations/:id */
  async updateHealthDeclaration(id: string, formData: FormData): Promise<ApiResponse<HealthDeclaration>> {
    const { data } = await api.put<ApiResponse<HealthDeclaration>>(`/admin/health-declarations/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  /** DELETE /api/admin/health-declarations/:id */
  async deleteHealthDeclaration(id: string): Promise<ApiResponse<null>> {
    const { data } = await api.delete<ApiResponse<null>>(`/admin/health-declarations/${id}`);
    return data;
  },

  /** PUT /api/admin/health-declarations/:id/activate */
  async activateHealthDeclaration(id: string): Promise<ApiResponse<HealthDeclaration>> {
    const { data } = await api.put<ApiResponse<HealthDeclaration>>(`/admin/health-declarations/${id}/activate`);
    return data;
  },

  // ===== Payments (admin supervision) =====

  /** GET /api/admin/payments/dashboard */
  async getPaymentsDashboard(params?: { from?: string; to?: string }): Promise<ApiResponse<PaymentsDashboard>> {
    const { data } = await api.get<ApiResponse<PaymentsDashboard>>('/admin/payments/dashboard', { params });
    return data;
  },

  /** GET /api/admin/payments */
  async getPayments(params?: { status?: string; page?: number; limit?: number; userId?: string }): Promise<ApiResponse<AdminPaymentsResponse>> {
    const { data } = await api.get<ApiResponse<AdminPaymentsResponse>>('/admin/payments', { params });
    return data;
  },

  /** GET /api/admin/payments/upcoming-dues */
  async getUpcomingDues(params?: { days?: number; status?: string }): Promise<ApiResponse<UpcomingDuesResponse>> {
    const { data } = await api.get<ApiResponse<UpcomingDuesResponse>>('/admin/payments/upcoming-dues', { params });
    return data;
  },

  /** GET /api/admin/users/:id/payments */
  async getUserPayments(userId: string, params?: { page?: number; limit?: number }): Promise<ApiResponse<AdminPaymentsResponse>> {
    const { data } = await api.get<ApiResponse<AdminPaymentsResponse>>(`/admin/users/${userId}/payments`, { params });
    return data;
  },

  // ===== Referrals / Commissions =====

  /** GET /api/admin/referrals */
  async getReferrals(params?: { commissionPaid?: boolean; page?: number; limit?: number }): Promise<ApiResponse<AdminReferralsResponse>> {
    const { data } = await api.get<ApiResponse<AdminReferralsResponse>>('/admin/referrals', { params });
    return data;
  },

  /** PUT /api/admin/referrals/:id/pay-commission */
  async payCommission(id: string): Promise<ApiResponse<AdminReferral>> {
    const { data } = await api.put<ApiResponse<AdminReferral>>(`/admin/referrals/${id}/pay-commission`);
    return data;
  },

  // ===== Trusted Person Relations =====

  /** GET /api/admin/trusted-person-relations */
  async getTrustedPersonRelations(): Promise<ApiResponse<{ relations: string[]; total: number }>> {
    const { data } = await api.get<ApiResponse<{ relations: string[]; total: number }>>('/admin/trusted-person-relations');
    return data;
  },

  /** POST /api/admin/trusted-person-relations */
  async addTrustedPersonRelation(relation: string): Promise<ApiResponse<{ relations: string[]; total: number }>> {
    const { data } = await api.post<ApiResponse<{ relations: string[]; total: number }>>('/admin/trusted-person-relations', { relation });
    return data;
  },

  /** PUT /api/admin/trusted-person-relations */
  async renameTrustedPersonRelation(oldRelation: string, newRelation: string): Promise<ApiResponse<{ relations: string[]; total: number }>> {
    const { data } = await api.put<ApiResponse<{ relations: string[]; total: number }>>('/admin/trusted-person-relations', { oldRelation, newRelation });
    return data;
  },

  /** DELETE /api/admin/trusted-person-relations */
  async deleteTrustedPersonRelation(relation: string): Promise<ApiResponse<{ relations: string[]; total: number }>> {
    const { data } = await api.delete<ApiResponse<{ relations: string[]; total: number }>>('/admin/trusted-person-relations', { data: { relation } });
    return data;
  },

  /** GET /api/relations/trusted-persons (public) */
  async getPublicTrustedPersonRelations(): Promise<ApiResponse<{ relations: string[]; total: number }>> {
    const { data } = await api.get<ApiResponse<{ relations: string[]; total: number }>>('/relations/trusted-persons');
    return data;
  },
};
