import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Search, CheckCircle, XCircle, Eye, User, Phone,
  MapPin, Calendar, Users, FileText, AlertCircle,
  ChevronLeft, ChevronRight, RefreshCw, UserCheck, UserX, Trash2, CreditCard, Clock
} from 'lucide-react';
import { Card, Badge, Button, Input, DocImage, PageLoader, BrandSpinner } from '@/components/ui';
import { adminService, type UserWithTrusted, type AdminPayment } from '@/services/admin.service';

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected';
type PlanFilter = 'all' | 'individual' | 'family';

const statusVariants: Record<string, 'success' | 'warning' | 'danger'> = {
  approved: 'success',
  pending: 'warning',
  rejected: 'danger',
};

const statusLabels: Record<string, string> = {
  approved: 'Approuvé',
  pending: 'En attente',
  rejected: 'Rejeté',
};

export function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [planFilter, setPlanFilter] = useState<PlanFilter>('all');
  const [users, setUsers] = useState<UserWithTrusted[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState<UserWithTrusted | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [pendingUserToReject, setPendingUserToReject] = useState<UserWithTrusted | null>(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<UserWithTrusted | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [statsTotal, setStatsTotal] = useState(0);
  const [statsPending, setStatsPending] = useState(0);
  const [statsApproved, setStatsApproved] = useState(0);
  const [statsRejected, setStatsRejected] = useState(0);
  const [userPayments, setUserPayments] = useState<AdminPayment[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(false);

  const fetchUsers = useCallback(async (showLoader = true) => {
    if (showLoader) setLoading(true);
    else setRefreshing(true);
    try {
      if (statusFilter === 'all' && planFilter === 'all') {
        const res = await adminService.getUsers({ page, limit: 15 });
        if (res.success) {
          setUsers(res.data.users);
          setTotalUsers(res.data.pagination.total);
          setTotalPages(res.data.pagination.totalPages);
        }
      } else {
        const params: { status?: string; page: number; limit: number } = { page, limit: 15 };
        if (statusFilter !== 'all') params.status = statusFilter;
        else params.status = 'all';
        const res = await adminService.getRegistrations(params);
        if (res.success) {
          let list = res.data.registrations;
          if (planFilter !== 'all') list = list.filter((u) => u.planType === planFilter);
          setUsers(list);
          setTotalUsers(res.data.pagination.total);
          setTotalPages(res.data.pagination.totalPages);
        }
      }
    } catch { /* ignore */ }
    if (showLoader) setLoading(false);
    else setRefreshing(false);
  }, [statusFilter, planFilter, page]);

  const fetchStats = useCallback(async () => {
    try {
      const [all, pending, approved, rejected] = await Promise.all([
        adminService.getUsers({ page: 1, limit: 1 }),
        adminService.getRegistrations({ status: 'pending', page: 1, limit: 1 }),
        adminService.getRegistrations({ status: 'approved', page: 1, limit: 1 }),
        adminService.getRegistrations({ status: 'rejected', page: 1, limit: 1 }),
      ]);
      if (all.success) setStatsTotal(all.data.pagination.total);
      if (pending.success) setStatsPending(pending.data.pagination.total);
      if (approved.success) setStatsApproved(approved.data.pagination.total);
      if (rejected.success) setStatsRejected(rejected.data.pagination.total);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);
  useEffect(() => { fetchStats(); }, [fetchStats]);

  const handleViewUser = async (userId: string) => {
    setLoadingUserId(userId);
    setUserPayments([]);
    try {
      const res = await adminService.getUserById(userId);
      if (res.success) {
        setSelectedUser(res.data as UserWithTrusted);
        setShowModal(true);
        setLoadingPayments(true);
        adminService.getUserPayments(userId, { limit: 10 })
          .then(r => { if (r.success) setUserPayments(r.data.payments ?? []); })
          .catch(() => {})
          .finally(() => setLoadingPayments(false));
      }
    } catch { /* ignore */ }
    setLoadingUserId(null);
  };

  const handleApprove = async (userId: string) => {
    setActionLoadingId(userId);
    try {
      const res = await adminService.approveRegistration(userId);
      if (res.success) {
        setSuccessMsg('Inscription approuvée ! Email envoyé à l\'utilisateur.');
        setTimeout(() => setSuccessMsg(''), 4000);
        fetchUsers(false);
        fetchStats();
        setShowModal(false);
        setSelectedUser(null);
      }
    } catch { /* ignore */ }
    setActionLoadingId(null);
  };

  const handleDeleteUser = async () => {
    if (!deleteConfirmUser) return;
    setDeleteLoading(true);
    setErrorMsg('');
    try {
      const res = await adminService.deleteUser(deleteConfirmUser.id);
      if (res.success) {
        setSuccessMsg(`Utilisateur ${deleteConfirmUser.firstName} ${deleteConfirmUser.lastName} supprimé définitivement.`);
        setTimeout(() => setSuccessMsg(''), 4000);
        setDeleteConfirmUser(null);
        fetchUsers(false);
        fetchStats();
      } else {
        setErrorMsg(res.message || 'Erreur lors de la suppression.');
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setErrorMsg(e.response?.data?.message || 'Erreur lors de la suppression.');
    }
    setDeleteLoading(false);
  };

  const handleReject = async () => {
    const target = pendingUserToReject || selectedUser;
    if (!target || rejectReason.length < 10) return;
    setActionLoadingId(target.id);
    try {
      const res = await adminService.rejectRegistration(target.id, rejectReason);
      if (res.success) {
        setSuccessMsg('Inscription rejetée. Email envoyé à l\'utilisateur.');
        setTimeout(() => setSuccessMsg(''), 4000);
        fetchUsers(false);
        fetchStats();
        setShowModal(false);
        setSelectedUser(null);
        setShowRejectModal(false);
        setPendingUserToReject(null);
        setRejectReason('');
      }
    } catch { /* ignore */ }
    setActionLoadingId(null);
  };

  const filtered = users.filter((u) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.phone.includes(q)
    );
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleFilterChange = (newStatus: StatusFilter, newPlan: PlanFilter) => {
    setStatusFilter(newStatus);
    setPlanFilter(newPlan);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des utilisateurs</h1>
          <p className="text-sm text-gray-500 mt-1">{statsTotal} utilisateur{statsTotal > 1 ? 's' : ''} au total</p>
        </div>
        <Button
          size="sm"
          variant="ghost"
          icon={<RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />}
          onClick={() => fetchUsers(false)}
          disabled={refreshing}
        >
          Actualiser
        </Button>
      </motion.div>

      {/* Toast success */}
      {successMsg && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 text-sm">
          <CheckCircle size={16} className="text-green-600 shrink-0" />
          {successMsg}
        </motion.div>
      )}
      {errorMsg && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm">
          <XCircle size={16} className="text-red-500 shrink-0" />
          {errorMsg}
        </motion.div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card hover onClick={() => handleFilterChange('all', 'all')} className={`cursor-pointer ${statusFilter === 'all' && planFilter === 'all' ? 'ring-2 ring-primary/40' : ''}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Total</p>
              <p className="text-2xl font-bold text-gray-900">{statsTotal || '—'}</p>
            </div>
          </div>
        </Card>
        <Card hover onClick={() => handleFilterChange('pending', 'all')} className={`cursor-pointer ${statusFilter === 'pending' ? 'ring-2 ring-amber-300' : ''}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <AlertCircle size={18} className="text-amber-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400">En attente</p>
              <p className="text-2xl font-bold text-amber-600">{statsPending || '—'}</p>
            </div>
          </div>
        </Card>
        <Card hover onClick={() => handleFilterChange('approved', 'all')} className={`cursor-pointer ${statusFilter === 'approved' ? 'ring-2 ring-green-300' : ''}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
              <UserCheck size={18} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Approuvés</p>
              <p className="text-2xl font-bold text-green-700">{statsApproved || '—'}</p>
            </div>
          </div>
        </Card>
        <Card hover onClick={() => handleFilterChange('rejected', 'all')} className={`cursor-pointer ${statusFilter === 'rejected' ? 'ring-2 ring-red-300' : ''}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <UserX size={18} className="text-red-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Rejetés</p>
              <p className="text-2xl font-bold text-red-600">{statsRejected || '—'}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Rechercher par nom, email, téléphone..."
              icon={<Search size={16} />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
              {(['all', 'pending', 'approved', 'rejected'] as StatusFilter[]).map((s) => (
                <button
                  key={s}
                  onClick={() => handleFilterChange(s, planFilter)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    statusFilter === s ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {s === 'all' ? 'Tous' : s === 'pending' ? 'En attente' : s === 'approved' ? 'Approuvés' : 'Rejetés'}
                </button>
              ))}
            </div>
            <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
              {(['all', 'individual', 'family'] as PlanFilter[]).map((p) => (
                <button
                  key={p}
                  onClick={() => handleFilterChange(statusFilter, p)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    planFilter === p ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {p === 'all' ? 'Tous plans' : p === 'individual' ? 'Individuel' : 'Familial'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Table */}
      {loading ? (
        <PageLoader variant="inline" size="sm" label="Chargement des utilisateurs..." />
      ) : (
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Utilisateur</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Plan</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Résidence</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                          {u.firstName?.charAt(0)}{u.lastName?.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{u.firstName} {u.lastName}</p>
                          <p className="text-xs text-gray-400 truncate">{u.email}</p>
                          <p className="text-xs text-gray-400">{u.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <Badge variant={u.planType === 'family' ? 'warning' : 'primary'} size="sm">
                          {u.planType === 'family' ? 'Familial' : 'Individuel'}
                        </Badge>
                        {u.planType === 'family' && u.familyMemberCount && (
                          <p className="text-[10px] text-gray-400">{u.familyMemberCount} membre{u.familyMemberCount > 1 ? 's' : ''}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 capitalize">
                      <div>
                        <p>{u.residenceCountry || '—'}</p>
                        <p className="text-xs text-gray-400">→ {u.repatriationCountry || '—'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(u.createdAt).toLocaleDateString('fr-FR')}</td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <Badge variant={statusVariants[u.registrationStatus] || 'warning'} dot size="sm">
                          {statusLabels[u.registrationStatus] || u.registrationStatus}
                        </Badge>
                        {!u.isActive && (
                          <Badge variant="danger" size="sm">Compte inactif</Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {u.registrationStatus === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(u.id)}
                              disabled={actionLoadingId === u.id}
                              title="Approuver"
                              className="p-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-600 transition-colors disabled:opacity-50"
                            >
                              {actionLoadingId === u.id
                                ? <BrandSpinner size={15} />
                                : <CheckCircle size={15} />}
                            </button>
                            <button
                              onClick={() => { setPendingUserToReject(u); setShowRejectModal(true); }}
                              disabled={actionLoadingId === u.id}
                              title="Rejeter"
                              className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors disabled:opacity-50"
                            >
                              <XCircle size={15} />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleViewUser(u.id)}
                          disabled={loadingUserId === u.id}
                          title="Voir les détails"
                          className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors disabled:opacity-50"
                        >
                          {loadingUserId === u.id ? <BrandSpinner size={15} /> : <Eye size={15} />}
                        </button>
                        <button
                          onClick={() => { setErrorMsg(''); setDeleteConfirmUser(u); }}
                          title="Supprimer définitivement"
                          className="p-2 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-400">
                      Aucun utilisateur trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Page {page} / {totalPages} — {totalUsers} utilisateur{totalUsers > 1 ? 's' : ''}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handlePageChange(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                  return p <= totalPages ? (
                    <button
                      key={p}
                      onClick={() => handlePageChange(p)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                        p === page ? 'bg-primary text-white' : 'hover:bg-gray-100 text-gray-600'
                      }`}
                    >
                      {p}
                    </button>
                  ) : null;
                })}
                <button
                  onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Detail Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-base font-bold text-primary">
                  {selectedUser.firstName.charAt(0)}{selectedUser.lastName.charAt(0)}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{selectedUser.firstName} {selectedUser.lastName}</h2>
                  <p className="text-xs text-gray-400">{selectedUser.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={statusVariants[selectedUser.registrationStatus] || 'warning'} dot>
                  {statusLabels[selectedUser.registrationStatus]}
                </Badge>
                {!selectedUser.isActive && <Badge variant="danger" size="sm">Inactif</Badge>}
                <button
                  onClick={() => { setShowModal(false); setSelectedUser(null); }}
                  className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-600 ml-2"
                >
                  <XCircle size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Personal Info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <User size={13} className="text-primary" /> Informations personnelles
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { label: 'Téléphone', value: selectedUser.phone, icon: <Phone size={13} /> },
                    { label: 'Situation matrimoniale', value: selectedUser.maritalStatus?.replace(/_/g, ' '), icon: <User size={13} /> },
                    { label: 'Pays de résidence', value: selectedUser.residenceCountry, icon: <MapPin size={13} /> },
                    { label: 'Pays de rapatriement', value: selectedUser.repatriationCountry, icon: <MapPin size={13} /> },
                    { label: 'Adresse', value: selectedUser.residenceAddress, icon: <MapPin size={13} /> },
                    { label: 'Date d\'inscription', value: new Date(selectedUser.createdAt).toLocaleDateString('fr-FR'), icon: <Calendar size={13} /> },
                  ].map(({ label, value, icon }) => (
                    <div key={label} className="flex items-start gap-2">
                      <span className="text-gray-400 mt-0.5">{icon}</span>
                      <div>
                        <p className="text-xs text-gray-400">{label}</p>
                        <p className="text-sm font-medium text-gray-800 capitalize mt-0.5">{value || '—'}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200 flex items-center gap-3 flex-wrap">
                  <Badge variant={selectedUser.planType === 'family' ? 'warning' : 'primary'}>
                    Plan {selectedUser.planType === 'family' ? 'Familial' : 'Individuel'}
                  </Badge>
                  {selectedUser.planType === 'family' && selectedUser.familyMemberCount != null && (
                    <span className="text-xs text-gray-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      {selectedUser.familyMemberCount} membre{selectedUser.familyMemberCount > 1 ? 's' : ''} de famille
                    </span>
                  )}
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${selectedUser.isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                    {selectedUser.isActive ? 'Compte actif' : 'Compte inactif'}
                  </span>
                </div>
              </div>

              {/* Documents */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FileText size={13} className="text-primary" /> Documents d'identité
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-2 font-medium">Photo d'identité</p>
                    <DocImage src={selectedUser.identityPhotoPath} alt="Photo d'identité" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-2 font-medium">CNI Recto</p>
                    <DocImage src={selectedUser.cniRectoPath} alt="CNI Recto" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-2 font-medium">CNI Verso</p>
                    <DocImage src={selectedUser.cniVersoPath} alt="CNI Verso" />
                  </div>
                </div>
              </div>

              {/* Family Members (if family plan & API returns them) */}
              {selectedUser.planType === 'family' && selectedUser.familyMembers && selectedUser.familyMembers.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Users size={13} className="text-amber-500" /> Membres de la famille ({selectedUser.familyMembers.length})
                  </h3>
                  <div className="space-y-2">
                    {selectedUser.familyMembers.map((fm) => (
                      <div key={fm.id} className="p-3 bg-amber-50 rounded-xl border border-amber-100 flex items-start justify-between">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{fm.firstName} {fm.lastName}</p>
                          <p className="text-xs text-amber-700 mt-0.5">
                            {fm.dateOfBirth ? new Date(fm.dateOfBirth).toLocaleDateString('fr-FR') : '—'}
                            {fm.isAdult ? ' · Majeur' : ' · Mineur'}
                          </p>
                          {fm.residenceCountry && (
                            <p className="text-xs text-gray-500 mt-0.5">{fm.residenceCountry} → {fm.repatriationCountry}</p>
                          )}
                        </div>
                        <div className="text-right text-xs text-gray-500">
                          <p>{fm.phone}</p>
                          {fm.email && <p className="mt-0.5">{fm.email}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Trusted Persons */}
              {selectedUser.trustedPersons && selectedUser.trustedPersons.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Users size={13} className="text-primary" /> Personnes de confiance ({selectedUser.trustedPersons.length})
                  </h3>
                  <div className="space-y-2">
                    {selectedUser.trustedPersons.map((tp) => (
                      <div key={tp.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-start justify-between">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{tp.firstName} {tp.lastName}</p>
                          <p className="text-xs text-primary capitalize mt-0.5">{tp.relation}{tp.relationDetails ? ` — ${tp.relationDetails}` : ''}</p>
                        </div>
                        <div className="text-right text-xs text-gray-500">
                          <p>{tp.phone}</p>
                          {tp.email && <p className="mt-0.5">{tp.email}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment History */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <CreditCard size={13} className="text-primary" /> Historique des paiements
                </h3>
                {loadingPayments ? (
                  <div className="flex items-center gap-2 text-xs text-gray-400 py-3">
                    <Clock size={13} className="animate-spin" /> Chargement...
                  </div>
                ) : userPayments.length === 0 ? (
                  <p className="text-xs text-gray-400 py-2">Aucun paiement enregistré.</p>
                ) : (
                  <div className="space-y-2">
                    {userPayments.map((p) => (
                      <div key={p.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{p.amount.toLocaleString('fr-FR')} XOF</p>
                          <p className="text-xs text-gray-400">Cotisation #{p.paymentNumber} · {p.paidAt ? new Date(p.paidAt).toLocaleDateString('fr-FR') : new Date(p.createdAt).toLocaleDateString('fr-FR')}</p>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          p.status === 'completed' ? 'bg-green-100 text-green-700' :
                          p.status === 'failed' ? 'bg-red-100 text-red-600' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {p.status === 'completed' ? 'Payé' : p.status === 'failed' ? 'Échoué' : 'En attente'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Rejection reason */}
              {selectedUser.registrationStatus === 'rejected' && selectedUser.rejectionReason && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm font-semibold text-red-900 mb-1">Motif de rejet</p>
                  <p className="text-sm text-red-700">{selectedUser.rejectionReason}</p>
                </div>
              )}

              {/* Actions */}
              {selectedUser.registrationStatus === 'pending' && (
                <div className="flex gap-3 pt-2 border-t border-gray-100">
                  <Button
                    variant="primary"
                    fullWidth
                    icon={<CheckCircle size={16} />}
                    onClick={() => handleApprove(selectedUser.id)}
                    disabled={actionLoadingId === selectedUser.id}
                  >
                    {actionLoadingId === selectedUser.id ? 'Traitement...' : "Approuver l'inscription"}
                  </Button>
                  <Button
                    variant="danger"
                    fullWidth
                    icon={<XCircle size={16} />}
                    onClick={() => { setPendingUserToReject(selectedUser); setShowRejectModal(true); }}
                    disabled={actionLoadingId === selectedUser.id}
                  >
                    Rejeter
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirmUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                <Trash2 size={20} className="text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Supprimer l'utilisateur</h3>
                <p className="text-xs text-gray-400">Action irréversible</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Vous êtes sur le point de supprimer définitivement :
            </p>
            <div className="p-3 bg-red-50 rounded-xl border border-red-100 mb-4">
              <p className="text-sm font-semibold text-gray-900">{deleteConfirmUser.firstName} {deleteConfirmUser.lastName}</p>
              <p className="text-xs text-gray-500">{deleteConfirmUser.email}</p>
            </div>
            <p className="text-xs text-red-600 mb-4">
              ⚠️ Toutes les données associées (paiements, abonnements, personnes de confiance, membres de famille) seront supprimées.
            </p>
            {errorMsg && (
              <p className="text-xs text-red-600 mb-3 p-2 bg-red-50 rounded-lg">{errorMsg}</p>
            )}
            <div className="flex gap-3">
              <Button
                variant="outline"
                fullWidth
                onClick={() => { setDeleteConfirmUser(null); setErrorMsg(''); }}
                disabled={deleteLoading}
              >
                Annuler
              </Button>
              <Button
                variant="danger"
                fullWidth
                icon={deleteLoading ? <BrandSpinner size={14} /> : <Trash2 size={14} />}
                onClick={handleDeleteUser}
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Suppression...' : 'Supprimer définitivement'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-2">Rejeter l'inscription</h3>
            <p className="text-sm text-gray-500 mb-4">
              Motif obligatoire (min. 10 caractères). Un email sera envoyé automatiquement.
            </p>
            <textarea
              className="w-full p-3 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400"
              rows={4}
              placeholder="Ex: Documents CNI illisibles, veuillez soumettre des images plus nettes..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <p className="text-xs text-gray-400 mt-1">{rejectReason.length} / 10 min.</p>
            <div className="flex gap-3 mt-4">
              <Button
                variant="outline"
                fullWidth
                onClick={() => { setShowRejectModal(false); setRejectReason(''); setPendingUserToReject(null); }}
                disabled={!!actionLoadingId}
              >
                Annuler
              </Button>
              <Button
                variant="danger"
                fullWidth
                onClick={handleReject}
                disabled={!!actionLoadingId || rejectReason.length < 10}
              >
                {actionLoadingId ? 'Traitement...' : 'Confirmer le rejet'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
