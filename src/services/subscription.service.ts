import api from '@/lib/api';
import type { ApiResponse } from './auth.service';

export type SubscriptionPlanType = 'individual' | 'family';
export type SubscriptionDuration = 'monthly' | 'yearly';

export interface PriceDetails {
  basePrice: number;
  memberCount: number;
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  finalPrice: number;
  currency: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  yearlyDiscountPercent: number;
  planType?: SubscriptionPlanType;
  duration?: SubscriptionDuration;
  priceExample: PriceDetails;
}

export interface SubscriptionPlansResponse {
  plans: {
    individual?: Partial<Record<SubscriptionDuration, SubscriptionPlan>>;
    family?: Partial<Record<SubscriptionDuration, SubscriptionPlan>>;
  };
}

export interface CalculatePriceResponse {
  subscription: {
    id: string;
    name: string;
    planType: SubscriptionPlanType;
    duration: SubscriptionDuration;
  };
  priceDetails: PriceDetails;
}

export interface SubscribeResponse {
  paymentPending: {
    id: string;
    status: string;
    paymentStatus: string;
    paymentReference: string;
  };
  subscription: {
    id: string;
    name: string;
    planType: SubscriptionPlanType;
    duration: SubscriptionDuration;
  };
  priceDetails: PriceDetails;
  payment: {
    reference: string;
    paymentUrl: string;
  };
}

export interface MySubscriptionResponse {
  userSubscription: {
    id: string;
    subscriptionNumber: string | null;
    status: string;
    paymentStatus: string;
    paymentReference: string;
    pricePaid: string;
    memberCount: number;
    startDate: string;
    endDate: string;
    effectDate: string | null;
    expiryDate: string | null;
    paymentMethod: string;
    paymentDate: string;
    daysRemaining: number;
    isExpired: boolean;
  };
  subscription: {
    id: string;
    name: string;
    planType: SubscriptionPlanType;
    duration: SubscriptionDuration;
  };
}

export interface Payment {
  id: string;
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
}

export interface PaymentHistoryResponse {
  payments: Payment[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  summary: {
    totalPaid: number;
    totalPending: number;
    totalFailed: number;
    totalAmountPaid: number;
  };
}

export interface PayInstallmentResponse {
  payment: {
    id: string;
    reference: string;
    amount: number;
    paymentNumber: number;
  };
  paymentUrl: string;
}

export interface PaymentStatusResponse {
  reference: string;
  status: 'pending' | 'completed' | 'failed';
  amount?: number;
  paidAt?: string | null;
  subscriptionStatus?: string;
  planType?: string;
}

export const subscriptionService = {
  /** GET /api/subscription/plans */
  async getPlans(): Promise<ApiResponse<SubscriptionPlansResponse>> {
    const { data } = await api.get<ApiResponse<SubscriptionPlansResponse>>('/subscription/plans');
    return data;
  },

  /** POST /api/subscription/calculate-price */
  async calculatePrice(subscriptionId: string, memberCount?: number): Promise<ApiResponse<CalculatePriceResponse>> {
    const payload = memberCount && memberCount > 0
      ? { subscriptionId, memberCount }
      : { subscriptionId };
    const { data } = await api.post<ApiResponse<CalculatePriceResponse>>('/subscription/calculate-price', payload);
    return data;
  },

  /** POST /api/subscription/subscribe */
  async subscribe(subscriptionId: string): Promise<ApiResponse<SubscribeResponse>> {
    const { data } = await api.post<ApiResponse<SubscribeResponse>>('/subscription/subscribe', { subscriptionId });
    return data;
  },

  /** GET /api/subscription/my-subscription */
  async getMySubscription(): Promise<ApiResponse<MySubscriptionResponse>> {
    const { data } = await api.get<ApiResponse<MySubscriptionResponse>>('/subscription/my-subscription');
    return data;
  },

  /** POST /api/subscription/pay-installment */
  async payInstallment(): Promise<ApiResponse<PayInstallmentResponse>> {
    const { data } = await api.post<ApiResponse<PayInstallmentResponse>>('/subscription/pay-installment');
    return data;
  },

  /** GET /api/subscription/payment-history */
  async getPaymentHistory(page = 1, limit = 10): Promise<ApiResponse<PaymentHistoryResponse>> {
    const { data } = await api.get<ApiResponse<PaymentHistoryResponse>>('/subscription/payment-history', {
      params: { page, limit },
    });
    return data;
  },

  /** GET /api/subscription/attestation — télécharger l'attestation PDF */
  async downloadAttestation(): Promise<Blob> {
    const { data } = await api.get('/subscription/attestation', { responseType: 'blob' });
    return data;
  },

  /** GET /api/subscription/payments/:id/receipt — télécharger un reçu PDF */
  async downloadReceipt(paymentId: string): Promise<Blob> {
    const { data } = await api.get(`/subscription/payments/${paymentId}/receipt`, { responseType: 'blob' });
    return data;
  },

  /** GET /api/subscription/contribution-calls — liste des appels de cotisation */
  async getContributionCalls(): Promise<ApiResponse<{ calls: { id: string; amount: number; dueDate: string; periodLabel: string; documentUrl: string | null }[] }>> {
    const { data } = await api.get('/subscription/contribution-calls');
    return data;
  },

  /** GET /api/subscription/contribution-calls/:id/download — télécharger un appel de cotisation PDF */
  async downloadContributionCall(callId: string): Promise<Blob> {
    const { data } = await api.get(`/subscription/contribution-calls/${callId}/download`, { responseType: 'blob' });
    return data;
  },

  /** GET /api/subscription/payment-status/:reference — vérifier le statut d'un paiement PayTech */
  async getPaymentStatus(reference: string): Promise<ApiResponse<PaymentStatusResponse>> {
    const { data } = await api.get<ApiResponse<PaymentStatusResponse>>(`/subscription/payment-status/${reference}`);
    return data;
  },
};
