import api from '@/lib/api';
import type { ApiResponse } from './auth.service';

export interface Notification {
  id: string;
  userId: string;
  type: 'registration_approved' | 'registration_rejected' | 'payment_confirmed' | 'declaration_status' | 'message_reply' | 'subscription_expiring' | 'general';
  title: string;
  message: string;
  isRead: boolean;
  actionUrl: string | null;
  createdAt: string;
  readAt: string | null;
}

export interface NotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const notificationService = {
  /** GET /api/notifications */
  async getNotifications(params?: { page?: number; limit?: number; unreadOnly?: boolean }): Promise<ApiResponse<NotificationsResponse>> {
    const { data } = await api.get<ApiResponse<NotificationsResponse>>('/notifications', { params });
    return data;
  },

  /** PUT /api/notifications/:id/read */
  async markAsRead(id: string): Promise<ApiResponse<Notification>> {
    const { data } = await api.put<ApiResponse<Notification>>(`/notifications/${id}/read`);
    return data;
  },

  /** PUT /api/notifications/read-all */
  async markAllAsRead(): Promise<ApiResponse<{ updated: number }>> {
    const { data } = await api.put<ApiResponse<{ updated: number }>>('/notifications/read-all');
    return data;
  },

  /** DELETE /api/notifications/:id */
  async deleteNotification(id: string): Promise<ApiResponse<null>> {
    const { data } = await api.delete<ApiResponse<null>>(`/notifications/${id}`);
    return data;
  },
};
