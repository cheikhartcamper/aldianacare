import api from '@/lib/api';
import type { ApiResponse } from './auth.service';

export interface PublicCoverageResult {
  covered: boolean;
  subscriptionNumber: string;
  holderName: string;
  planType: 'individual' | 'family';
  coverageStatus: 'active' | 'expired' | 'suspended';
  expiryDate: string;
  repatriationCountry: string;
}

export interface DeclarationTrackingResult {
  declarationNumber: string;
  status: 'pending' | 'in_review' | 'approved' | 'rejected';
  statusLabel: string;
  deceasedName: string;
  submittedAt: string;
  lastUpdate: string;
  steps: {
    label: string;
    completed: boolean;
    date: string | null;
  }[];
}

export interface AuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  targetType: string;
  targetId: string;
  description: string;
  createdAt: string;
}

export interface AuditLogsResponse {
  logs: AuditLog[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const documentService = {
  /** GET /api/verify/coverage?subscriptionNumber=...&cni=... — vérification publique (sans auth) */
  async verifyCoverage(params: { subscriptionNumber?: string; cni?: string }): Promise<ApiResponse<PublicCoverageResult>> {
    const { data } = await api.get<ApiResponse<PublicCoverageResult>>('/verify/coverage', { params });
    return data;
  },

  /** GET /api/verify/attestation/:token — vérification par QR code (sans auth) */
  async verifyAttestation(token: string): Promise<ApiResponse<PublicCoverageResult>> {
    const { data } = await api.get<ApiResponse<PublicCoverageResult>>(`/verify/attestation/${token}`);
    return data;
  },

  /** GET /api/declaration/track/:declarationNumber — suivi public d'un dossier (sans auth) */
  async trackDeclaration(declarationNumber: string): Promise<ApiResponse<DeclarationTrackingResult>> {
    const { data } = await api.get<ApiResponse<DeclarationTrackingResult>>(`/declaration/track/${declarationNumber}`);
    return data;
  },

  /** GET /api/admin/audit-logs — logs des actions admin */
  async getAuditLogs(params?: { page?: number; limit?: number; adminId?: string; targetType?: string }): Promise<ApiResponse<AuditLogsResponse>> {
    const { data } = await api.get<ApiResponse<AuditLogsResponse>>('/admin/audit-logs', { params });
    return data;
  },

  /** GET /api/admin/export/users — export CSV des utilisateurs */
  async exportUsers(): Promise<Blob> {
    const { data } = await api.get('/admin/export/users', { responseType: 'blob' });
    return data;
  },

  /** GET /api/admin/export/payments — export CSV des paiements */
  async exportPayments(params?: { from?: string; to?: string }): Promise<Blob> {
    const { data } = await api.get('/admin/export/payments', { responseType: 'blob', params });
    return data;
  },
};
