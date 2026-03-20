import api from '@/lib/api';
import type { ApiResponse } from './auth.service';

// ===== Types =====

export interface ReferralCodeResponse {
  referralCode: string;
}

export interface MyCodeResponse {
  referralCode: string | null;
  referralCount: number;
  discountPercent: number;
}

export interface Referral {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  planType: 'individual' | 'family';
  registrationStatus: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface MyReferralsResponse {
  count: number;
  referrals: Referral[];
}

export interface SendReferralResponse {
  referralCode: string;
  method: 'email' | 'whatsapp';
  recipient: string;
}

export interface ValidateCodeResponse {
  referrerName: string;
  discountPercent: number;
}

// ===== Referral API calls =====

export const referralService = {
  /** POST /api/referral/generate — Générer (ou régénérer) un code de parrainage */
  async generate(): Promise<ApiResponse<ReferralCodeResponse>> {
    const { data } = await api.post<ApiResponse<ReferralCodeResponse>>('/referral/generate');
    return data;
  },

  /** GET /api/referral/my-code — Récupérer son code, nombre de filleuls et % réduction */
  async getMyCode(): Promise<ApiResponse<MyCodeResponse>> {
    const { data } = await api.get<ApiResponse<MyCodeResponse>>('/referral/my-code');
    return data;
  },

  /** GET /api/referral/my-referrals — Lister ses filleuls */
  async getMyReferrals(): Promise<ApiResponse<MyReferralsResponse>> {
    const { data } = await api.get<ApiResponse<MyReferralsResponse>>('/referral/my-referrals');
    return data;
  },

  /** POST /api/referral/send — Envoyer son code par email ou WhatsApp */
  async send(method: 'email' | 'whatsapp', recipient: string): Promise<ApiResponse<SendReferralResponse>> {
    const { data } = await api.post<ApiResponse<SendReferralResponse>>('/referral/send', { method, recipient });
    return data;
  },

  /** GET /api/referral/validate/:code — Valider un code (public) */
  async validate(code: string): Promise<ApiResponse<ValidateCodeResponse>> {
    const { data } = await api.get<ApiResponse<ValidateCodeResponse>>(`/referral/validate/${code}`);
    return data;
  },
};
