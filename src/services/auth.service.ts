import api from '@/lib/api';

// ===== Types =====
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  maritalStatus: string;
  residenceCountry: string;
  residenceAddress: string;
  repatriationCountry: string;
  cniRectoPath: string | null;
  cniVersoPath: string | null;
  cniExtractedData: Record<string, unknown> | null;
  identityPhotoPath: string | null;
  planType: 'individual' | 'family';
  role: 'user' | 'admin';
  registrationStatus: 'pending' | 'approved' | 'rejected';
  rejectionReason: string | null;
  isEmailVerified: boolean;
  isActive: boolean;
  familyMemberCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface TrustedPerson {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string | null;
  relation: string;
  relationDetails: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FamilyMember {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string | null;
  phone: string;
  isAdult: boolean;
  residenceCountry: string | null;
  residenceAddress: string | null;
  repatriationCountry: string | null;
  cniRectoPath: string | null;
  cniVersoPath: string | null;
  identityPhotoPath: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface MeResponse {
  user: User;
  trustedPersons: TrustedPerson[];
  familyMembers: FamilyMember[];
}

export interface OtpSendResponse {
  expiresIn: number;
}

export interface OtpVerifyResponse {
  phoneVerificationToken: string;
}

export interface RegisterResponse {
  user: User;
  trustedPersons: TrustedPerson[];
  familyMembers?: FamilyMember[];
  registrationStatus: string;
}

export interface UpdateProfileResponse {
  user: User;
  trustedPersons: TrustedPerson[];
  familyMembers: FamilyMember[];
  updatedFields: string[];
}

export interface ScanCniResponse {
  extracted: {
    lastName: string;
    firstName: string;
    dateOfBirth: string;
    placeOfBirth: string;
    gender: string;
    nationality: string;
    cniNumber: string;
    expirationDate: string;
    address: string;
    issueDate: string;
    issuingAuthority: string;
    confidence: string;
    rectoOcrConfidence: number;
    versoOcrConfidence: number;
    extractedAt: string;
  };
  files: {
    cniRectoPath: string;
    cniVersoPath: string;
  };
}

export interface ForgotPasswordResponse {
  method: string;
  expiresIn: string;
}

export interface VerifyResetOtpResponse {
  resetToken: string;
  expiresIn: string;
}

// ===== Auth API calls =====

export const authService = {
  /** POST /api/auth/login */
  async login(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
    const { data } = await api.post<ApiResponse<LoginResponse>>('/auth/login', { email, password });
    return data;
  },

  /** POST /api/auth/send-otp */
  async sendOtp(phone: string): Promise<ApiResponse<OtpSendResponse>> {
    const { data } = await api.post<ApiResponse<OtpSendResponse>>('/auth/send-otp', { phone });
    return data;
  },

  /** POST /api/auth/forgot-password */
  async forgotPassword(email: string, method: 'email' | 'whatsapp'): Promise<ApiResponse<ForgotPasswordResponse>> {
    const { data } = await api.post<ApiResponse<ForgotPasswordResponse>>('/auth/forgot-password', { email, method });
    return data;
  },

  /** POST /api/auth/verify-reset-otp */
  async verifyResetOtp(email: string, code: string): Promise<ApiResponse<VerifyResetOtpResponse>> {
    const { data } = await api.post<ApiResponse<VerifyResetOtpResponse>>('/auth/verify-reset-otp', { email, code });
    return data;
  },

  /** POST /api/auth/reset-password */
  async resetPassword(resetToken: string, newPassword: string, confirmPassword: string): Promise<ApiResponse<null>> {
    const { data } = await api.post<ApiResponse<null>>('/auth/reset-password', { resetToken, newPassword, confirmPassword });
    return data;
  },

  /** POST /api/auth/verify-otp */
  async verifyOtp(phone: string, code: string): Promise<ApiResponse<OtpVerifyResponse>> {
    const { data } = await api.post<ApiResponse<OtpVerifyResponse>>('/auth/verify-otp', { phone, code });
    return data;
  },

  /** POST /api/auth/register/individual — multipart/form-data */
  async registerIndividual(formData: FormData): Promise<ApiResponse<RegisterResponse>> {
    const { data } = await api.post<ApiResponse<RegisterResponse>>('/auth/register/individual', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  /** POST /api/auth/register/family — multipart/form-data */
  async registerFamily(formData: FormData): Promise<ApiResponse<RegisterResponse>> {
    const { data } = await api.post<ApiResponse<RegisterResponse>>('/auth/register/family', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  /** POST /api/auth/scan-cni — multipart/form-data */
  async scanCni(formData: FormData): Promise<ApiResponse<ScanCniResponse>> {
    const { data } = await api.post<ApiResponse<ScanCniResponse>>('/auth/scan-cni', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  /** GET /api/auth/me */
  async getMe(): Promise<ApiResponse<MeResponse>> {
    const { data } = await api.get<ApiResponse<MeResponse>>('/auth/me');
    return data;
  },

  /** PUT /api/auth/profile — multipart/form-data */
  async updateProfile(formData: FormData): Promise<ApiResponse<UpdateProfileResponse>> {
    const { data } = await api.put<ApiResponse<UpdateProfileResponse>>('/auth/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
};
