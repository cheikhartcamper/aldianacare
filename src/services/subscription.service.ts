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
    status: string;
    paymentStatus: string;
    paymentReference: string;
    pricePaid: string;
    memberCount: number;
    startDate: string;
    endDate: string;
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
};
