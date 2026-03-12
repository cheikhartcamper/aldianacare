import api from '@/lib/api';
import type { ApiResponse } from './auth.service';

// ===== Types pour la déclaration de décès =====

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
}

export interface DeceasedUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  planType: 'individual' | 'family';
  residenceCountry: string;
  repatriationCountry: string;
}

export interface Declarant {
  firstName: string;
  lastName: string;
  phone: string;
  relation: string;
}

// ===== Réponses API =====

export interface SearchDeceasedResponse {
  users: DeceasedUser[];
}

export interface VerifyDeclarantResponse {
  deceased: {
    id: string;
    firstName: string;
    lastName: string;
  };
  declarant: Declarant;
  verificationSessionToken: string;
}

export interface SendOtpDeclarationResponse {
  expiresIn: number;
}

export interface VerifyOtpDeclarationResponse {
  declarationToken: string;
}

export interface CreateDeclarationResponse {
  declaration: {
    id: string;
    declarationNumber: string;
    status: string;
    deathDate: string;
    deathPlace: string;
    additionalInfo: string | null;
    createdAt: string;
  };
  deceased: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    repatriationCountry: string;
  };
  declarant: {
    firstName: string;
    lastName: string;
    phone: string;
  };
}

// ===== Inputs =====

export interface SearchDeceasedInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

export interface VerifyDeclarantInput {
  deceasedId: string;
  declarantFirstName: string;
  declarantLastName: string;
  declarantPhone: string;
}

export interface SendOtpDeclarationInput {
  verificationSessionToken: string;
}

export interface VerifyOtpDeclarationInput {
  verificationSessionToken: string;
  code: string;
}

// ===== Service de déclaration de décès =====

export const declarationService = {
  /**
   * ÉTAPE 1 — Rechercher le décédé
   * POST /api/declaration/search-deceased
   */
  async searchDeceased(input: SearchDeceasedInput): Promise<ApiResponse<SearchDeceasedResponse>> {
    const { data } = await api.post<ApiResponse<SearchDeceasedResponse>>('/declaration/search-deceased', input);
    return data;
  },

  /**
   * ÉTAPE 2 — Vérifier le déclarant (personne de confiance)
   * POST /api/declaration/verify-declarant
   */
  async verifyDeclarant(input: VerifyDeclarantInput): Promise<ApiResponse<VerifyDeclarantResponse>> {
    const { data } = await api.post<ApiResponse<VerifyDeclarantResponse>>('/declaration/verify-declarant', input);
    return data;
  },

  /**
   * ÉTAPE 3 — Envoyer OTP au déclarant
   * POST /api/declaration/send-otp
   */
  async sendOtp(input: SendOtpDeclarationInput): Promise<ApiResponse<SendOtpDeclarationResponse>> {
    const { data } = await api.post<ApiResponse<SendOtpDeclarationResponse>>('/declaration/send-otp', input);
    return data;
  },

  /**
   * ÉTAPE 4 — Vérifier OTP du déclarant
   * POST /api/declaration/verify-otp
   */
  async verifyOtp(input: VerifyOtpDeclarationInput): Promise<ApiResponse<VerifyOtpDeclarationResponse>> {
    const { data } = await api.post<ApiResponse<VerifyOtpDeclarationResponse>>('/declaration/verify-otp', input);
    return data;
  },

  /**
   * ÉTAPE 5 — Créer la déclaration de décès
   * POST /api/declaration/create — multipart/form-data
   */
  async createDeclaration(formData: FormData): Promise<ApiResponse<CreateDeclarationResponse>> {
    const { data } = await api.post<ApiResponse<CreateDeclarationResponse>>('/declaration/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
};
