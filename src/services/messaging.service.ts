import api from '@/lib/api';
import type { ApiResponse } from './auth.service';

export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketType = 'question' | 'contestation' | 'modification' | 'technical' | 'other';

export interface TicketMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderRole: 'user' | 'admin';
  content: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  userId: string;
  type: TicketType;
  subject: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  messages?: TicketMessage[];
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface TicketsResponse {
  tickets: Ticket[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const messagingService = {
  /** GET /api/tickets — liste des tickets de l'utilisateur connecté */
  async getMyTickets(params?: { status?: TicketStatus; page?: number; limit?: number }): Promise<ApiResponse<TicketsResponse>> {
    const { data } = await api.get<ApiResponse<TicketsResponse>>('/tickets', { params });
    return data;
  },

  /** POST /api/tickets — créer un nouveau ticket */
  async createTicket(payload: { type: TicketType; subject: string; message: string }): Promise<ApiResponse<Ticket>> {
    const { data } = await api.post<ApiResponse<Ticket>>('/tickets', payload);
    return data;
  },

  /** GET /api/tickets/:id — détail d'un ticket avec ses messages */
  async getTicket(id: string): Promise<ApiResponse<Ticket>> {
    const { data } = await api.get<ApiResponse<Ticket>>(`/tickets/${id}`);
    return data;
  },

  /** POST /api/tickets/:id/messages — ajouter un message à un ticket */
  async addMessage(ticketId: string, content: string): Promise<ApiResponse<TicketMessage>> {
    const { data } = await api.post<ApiResponse<TicketMessage>>(`/tickets/${ticketId}/messages`, { content });
    return data;
  },

  /** PUT /api/tickets/:id/close — clôturer un ticket (utilisateur) */
  async closeTicket(id: string): Promise<ApiResponse<Ticket>> {
    const { data } = await api.put<ApiResponse<Ticket>>(`/tickets/${id}/close`);
    return data;
  },

  // ===== Admin =====

  /** GET /api/admin/tickets */
  async adminGetTickets(params?: { status?: TicketStatus; page?: number; limit?: number }): Promise<ApiResponse<TicketsResponse>> {
    const { data } = await api.get<ApiResponse<TicketsResponse>>('/admin/tickets', { params });
    return data;
  },

  /** PUT /api/admin/tickets/:id/reply */
  async adminReply(ticketId: string, content: string): Promise<ApiResponse<TicketMessage>> {
    const { data } = await api.post<ApiResponse<TicketMessage>>(`/admin/tickets/${ticketId}/messages`, { content });
    return data;
  },

  /** PUT /api/admin/tickets/:id/status */
  async adminUpdateStatus(ticketId: string, status: TicketStatus): Promise<ApiResponse<Ticket>> {
    const { data } = await api.put<ApiResponse<Ticket>>(`/admin/tickets/${ticketId}/status`, { status });
    return data;
  },
};
