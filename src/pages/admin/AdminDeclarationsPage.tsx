import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Search, Eye, CheckCircle, XCircle, Clock, Shield,
  MapPin, Calendar, Phone, User, ChevronLeft, ChevronRight, Filter,
  Download, Loader2, RefreshCw, AlertTriangle
} from 'lucide-react';
import { Card, Badge, Button, Input, Modal, PageLoader } from '@/components/ui';
import { adminService, type Declaration } from '@/services/admin.service';
import { getImageUrl } from '@/lib/imageUrl';

const STATUS_CONFIG = {
  pending: { label: 'En attente', variant: 'warning' as const, icon: Clock },
  in_review: { label: 'En examen', variant: 'primary' as const, icon: Eye },
  approved: { label: 'Approuvée', variant: 'success' as const, icon: CheckCircle },
  rejected: { label: 'Rejetée', variant: 'danger' as const, icon: XCircle },
};

const STATUS_TABS = [
  { value: 'all', label: 'Toutes' },
  { value: 'pending', label: 'En attente' },
  { value: 'in_review', label: 'En examen' },
  { value: 'approved', label: 'Approuvées' },
  { value: 'rejected', label: 'Rejetées' },
];

export function AdminDeclarationsPage() {
  const [declarations, setDeclarations] = useState<Declaration[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0 });
  const [selectedDeclaration, setSelectedDeclaration] = useState<Declaration | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [fetchError, setFetchError] = useState('');

  const fetchDeclarations = useCallback(async (showLoader = true) => {
    if (showLoader) setLoading(true);
    else setRefreshing(true);
    setFetchError('');
    try {
      const params: Record<string, string | number> = { page, limit: 15 };
      if (statusFilter !== 'all') params.status = statusFilter;
      const res = await adminService.getDeclarations(params);
      if (res.success) {
        setDeclarations(res.data.declarations);
        setPagination({ total: res.data.pagination.total, totalPages: res.data.pagination.totalPages });
      } else {
        setFetchError(res.message || 'Impossible de charger les déclarations.');
        setDeclarations([]);
      }
    } catch (err: unknown) {
      const e = err as { response?: { status?: number; data?: { message?: string } } };
      const status = e.response?.status;
      const msg = e.response?.data?.message || '';
      if (status === 404 || msg.toLowerCase().includes('route non trouv')) {
        setFetchError('Endpoint non disponible côté backend. Implémentez GET /api/admin/declarations (voir BACKEND_TODO_DECLARATIONS.md).');
      } else {
        setFetchError(msg || 'Erreur de connexion. Vérifiez que le backend est actif.');
      }
      setDeclarations([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [page, statusFilter]);

  useEffect(() => { fetchDeclarations(); }, [fetchDeclarations]);

  const handleApprove = async () => {
    if (!selectedDeclaration) return;
    setActionLoading(true);
    try {
      const res = await adminService.approveDeclaration(selectedDeclaration.id);
      if (res.success) {
        setShowApproveModal(false);
        setShowDetail(false);
        fetchDeclarations(false);
      }
    } catch { /* ignore */ }
    setActionLoading(false);
  };

  const handleReject = async () => {
    if (!selectedDeclaration || rejectReason.length < 10) return;
    setActionLoading(true);
    try {
      const res = await adminService.rejectDeclaration(selectedDeclaration.id, rejectReason);
      if (res.success) {
        setShowRejectModal(false);
        setShowDetail(false);
        setRejectReason('');
        fetchDeclarations(false);
      }
    } catch { /* ignore */ }
    setActionLoading(false);
  };

  const filteredDeclarations = declarations.filter((d) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      d.declarationNumber?.toLowerCase().includes(q) ||
      d.declarantFirstName?.toLowerCase().includes(q) ||
      d.declarantLastName?.toLowerCase().includes(q) ||
      d.deceased?.firstName?.toLowerCase().includes(q) ||
      d.deceased?.lastName?.toLowerCase().includes(q) ||
      d.deathPlace?.toLowerCase().includes(q)
    );
  });

  const pendingCount = declarations.filter(d => d.status === 'pending').length;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'easeOut' as const }}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Déclarations de décès</h1>
            <p className="text-sm text-gray-500 mt-1">
              {pagination.total} déclaration{pagination.total !== 1 ? 's' : ''} au total
              {pendingCount > 0 && <span className="text-amber-600 font-semibold"> · {pendingCount} en attente</span>}
            </p>
          </div>
          <Button
            size="sm"
            variant="ghost"
            icon={<RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />}
            onClick={() => fetchDeclarations(false)}
            disabled={refreshing}
          >
            Actualiser
          </Button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' as const }}>
        <Card>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <Filter size={14} className="text-gray-400" />
              {STATUS_TABS.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => { setStatusFilter(tab.value); setPage(1); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    statusFilter === tab.value
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="w-full sm:w-64">
              <Input
                placeholder="Rechercher (nº, nom, lieu...)"
                icon={<Search size={14} />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Table */}
      {loading ? (
        <PageLoader variant="inline" size="sm" label="Chargement des déclarations..." />
      ) : fetchError ? (
        <Card>
          <div className="text-center py-14">
            <AlertTriangle size={40} className="mx-auto text-amber-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Impossible de charger les déclarations</h3>
            <p className="text-sm text-red-500 max-w-sm mx-auto mb-4">{fetchError}</p>
            <Button size="sm" variant="ghost" icon={<RefreshCw size={14} />} onClick={() => fetchDeclarations()}>Réessayer</Button>
          </div>
        </Card>
      ) : filteredDeclarations.length === 0 ? (
        <Card>
          <div className="text-center py-14">
            <FileText size={40} className="mx-auto text-gray-200 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune déclaration</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              {statusFilter !== 'all'
                ? `Aucune déclaration avec le statut "${STATUS_TABS.find(t => t.value === statusFilter)?.label}".`
                : 'Les déclarations soumises par le public apparaîtront ici.'}
            </p>
          </div>
        </Card>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' as const }}>
          <Card padding="none">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3.5">Nº Déclaration</th>
                    <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3.5">Défunt</th>
                    <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3.5">Déclarant</th>
                    <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3.5">Date décès</th>
                    <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3.5">Lieu</th>
                    <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3.5">Statut</th>
                    <th className="text-right text-xs font-semibold text-gray-500 px-5 py-3.5">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDeclarations.map((decl, i) => {
                    const config = STATUS_CONFIG[decl.status];
                    return (
                      <motion.tr
                        key={decl.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors cursor-pointer"
                        onClick={() => { setSelectedDeclaration(decl); setShowDetail(true); }}
                      >
                        <td className="px-5 py-3.5">
                          <span className="text-sm font-mono font-semibold text-primary">{decl.declarationNumber}</span>
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            {new Date(decl.createdAt).toLocaleDateString('fr-FR')}
                          </p>
                        </td>
                        <td className="px-5 py-3.5">
                          <p className="text-sm font-medium text-gray-900">
                            {decl.deceased?.firstName} {decl.deceased?.lastName}
                          </p>
                          <p className="text-[10px] text-gray-400">{decl.deceased?.email}</p>
                        </td>
                        <td className="px-5 py-3.5">
                          <p className="text-sm text-gray-700">{decl.declarantFirstName} {decl.declarantLastName}</p>
                          <p className="text-[10px] text-gray-400">{decl.declarantPhone}</p>
                        </td>
                        <td className="px-5 py-3.5 text-sm text-gray-600">
                          {new Date(decl.deathDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-5 py-3.5 text-sm text-gray-600 max-w-[150px] truncate">
                          {decl.deathPlace}
                        </td>
                        <td className="px-5 py-3.5">
                          <Badge variant={config.variant} dot size="sm">{config.label}</Badge>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedDeclaration(decl); setShowDetail(true); }}
                            className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                          >
                            <Eye size={16} />
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
                <p className="text-xs text-gray-400">
                  Page {page} / {pagination.totalPages} — {pagination.total} résultat{pagination.total !== 1 ? 's' : ''}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                    disabled={page === pagination.totalPages}
                    className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </Card>
        </motion.div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetail && selectedDeclaration && (
          <Modal isOpen={showDetail} onClose={() => setShowDetail(false)} size="lg">
            <div className="space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Déclaration {selectedDeclaration.declarationNumber}
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Soumise le {new Date(selectedDeclaration.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
                <Badge variant={STATUS_CONFIG[selectedDeclaration.status].variant} dot>
                  {STATUS_CONFIG[selectedDeclaration.status].label}
                </Badge>
              </div>

              {/* Deceased info */}
              <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                <h3 className="text-xs font-semibold text-primary uppercase mb-3 flex items-center gap-2">
                  <User size={14} /> Informations du défunt
                </h3>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-gray-400">Nom complet</p>
                    <p className="font-semibold text-gray-900">
                      {selectedDeclaration.deceased?.firstName} {selectedDeclaration.deceased?.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Email</p>
                    <p className="text-gray-700">{selectedDeclaration.deceased?.email || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Téléphone</p>
                    <p className="text-gray-700">{selectedDeclaration.deceased?.phone || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Pays de rapatriement</p>
                    <p className="font-medium text-gray-900 capitalize">{selectedDeclaration.deceased?.repatriationCountry || '—'}</p>
                  </div>
                </div>
              </div>

              {/* Death info */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="text-xs font-semibold text-gray-600 uppercase mb-3 flex items-center gap-2">
                  <Calendar size={14} /> Informations du décès
                </h3>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-gray-400">Date du décès</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(selectedDeclaration.deathDate).toLocaleDateString('fr-FR', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Lieu du décès</p>
                    <p className="flex items-center gap-1 text-gray-700">
                      <MapPin size={12} className="text-gray-400" /> {selectedDeclaration.deathPlace}
                    </p>
                  </div>
                </div>
                {selectedDeclaration.additionalInfo && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-400 mb-1">Informations supplémentaires</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{selectedDeclaration.additionalInfo}</p>
                  </div>
                )}
              </div>

              {/* Declarant info */}
              <div className="p-4 bg-gold/5 rounded-xl border border-gold/10">
                <h3 className="text-xs font-semibold text-gold-dark uppercase mb-3 flex items-center gap-2">
                  <Shield size={14} /> Déclarant (personne de confiance)
                </h3>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-gray-400">Nom complet</p>
                    <p className="font-semibold text-gray-900">
                      {selectedDeclaration.declarantFirstName} {selectedDeclaration.declarantLastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Téléphone</p>
                    <p className="flex items-center gap-1 text-gray-700">
                      <Phone size={12} className="text-gray-400" /> {selectedDeclaration.declarantPhone}
                    </p>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="text-xs font-semibold text-gray-600 uppercase mb-3 flex items-center gap-2">
                  <FileText size={14} /> Documents joints
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {selectedDeclaration.deathCertificatePath && (
                    <a
                      href={getImageUrl(selectedDeclaration.deathCertificatePath) ?? ''}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-primary/30 hover:bg-primary/5 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Download size={16} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 group-hover:text-primary">Certificat de décès</p>
                        <p className="text-[10px] text-gray-400">Cliquer pour ouvrir</p>
                      </div>
                    </a>
                  )}
                  {selectedDeclaration.deathTypeCertificatePath && (
                    <a
                      href={getImageUrl(selectedDeclaration.deathTypeCertificatePath) ?? ''}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-primary/30 hover:bg-primary/5 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                        <Download size={16} className="text-gold-dark" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 group-hover:text-primary">Certificat genre de décès</p>
                        <p className="text-[10px] text-gray-400">Cliquer pour ouvrir</p>
                      </div>
                    </a>
                  )}
                </div>
              </div>

              {/* Rejection reason if rejected */}
              {selectedDeclaration.status === 'rejected' && selectedDeclaration.rejectionReason && (
                <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                  <h3 className="text-xs font-semibold text-red-800 uppercase mb-2 flex items-center gap-2">
                    <XCircle size={14} /> Motif du rejet
                  </h3>
                  <p className="text-sm text-red-700">{selectedDeclaration.rejectionReason}</p>
                </div>
              )}

              {/* Actions */}
              {(selectedDeclaration.status === 'pending' || selectedDeclaration.status === 'in_review') && (
                <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                  <Button
                    variant="primary"
                    size="sm"
                    icon={<CheckCircle size={14} />}
                    onClick={() => setShowApproveModal(true)}
                  >
                    Approuver
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    icon={<XCircle size={14} />}
                    onClick={() => setShowRejectModal(true)}
                  >
                    Rejeter
                  </Button>
                </div>
              )}
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Approve confirmation modal */}
      <AnimatePresence>
        {showApproveModal && selectedDeclaration && (
          <Modal isOpen={showApproveModal} onClose={() => setShowApproveModal(false)}>
            <div className="text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
                <CheckCircle size={28} className="text-primary" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Approuver la déclaration ?</h3>
              <p className="text-sm text-gray-500">
                La déclaration <span className="font-semibold">{selectedDeclaration.declarationNumber}</span> sera approuvée.
                Le processus de rapatriement sera lancé.
              </p>
              <div className="flex items-center gap-3 justify-center pt-2">
                <Button variant="ghost" size="sm" onClick={() => setShowApproveModal(false)}>Annuler</Button>
                <Button size="sm" icon={actionLoading ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />} onClick={handleApprove} disabled={actionLoading}>
                  {actionLoading ? 'Approbation...' : 'Confirmer l\'approbation'}
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Reject modal */}
      <AnimatePresence>
        {showRejectModal && selectedDeclaration && (
          <Modal isOpen={showRejectModal} onClose={() => { setShowRejectModal(false); setRejectReason(''); }}>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                  <XCircle size={20} className="text-red-500" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Rejeter la déclaration</h3>
                  <p className="text-xs text-gray-400">{selectedDeclaration.declarationNumber}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Motif du rejet <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Décrivez la raison du rejet (min. 10 caractères)..."
                  rows={4}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300"
                />
                <p className="text-[10px] text-gray-400 mt-1">{rejectReason.length}/10 caractères minimum</p>
              </div>
              <div className="flex items-center gap-3 justify-end pt-2">
                <Button variant="ghost" size="sm" onClick={() => { setShowRejectModal(false); setRejectReason(''); }}>Annuler</Button>
                <Button
                  variant="danger"
                  size="sm"
                  icon={actionLoading ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
                  onClick={handleReject}
                  disabled={actionLoading || rejectReason.length < 10}
                >
                  {actionLoading ? 'Rejet...' : 'Confirmer le rejet'}
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}
