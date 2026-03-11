import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search, CheckCircle, XCircle, Eye, User, Phone,
  MapPin, Calendar, Users, FileText, AlertCircle
} from 'lucide-react';
import { Card, Badge, Button, Input, DocImage, PageLoader, BrandSpinner } from '@/components/ui';
import { adminService, type UserWithTrusted } from '@/services/admin.service';

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
  const [planFilter, setPlanFilter] = useState<'all' | 'individual' | 'family'>('all');
  const [users, setUsers] = useState<UserWithTrusted[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [selectedUser, setSelectedUser] = useState<UserWithTrusted | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params: { limit: number; planType?: string } = { limit: 100 };
      if (planFilter !== 'all') params.planType = planFilter;
      const res = await adminService.getUsers(params);
      if (res.success) {
        setUsers(res.data.users);
        setTotalUsers(res.data.pagination.total);
      }
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, [planFilter]);

  const handleViewUser = async (userId: string) => {
    setLoadingUserId(userId);
    try {
      const res = await adminService.getUserById(userId);
      if (res.success) {
        setSelectedUser(res.data as UserWithTrusted);
        setShowModal(true);
      }
    } catch { /* ignore */ }
    setLoadingUserId(null);
  };

  const handleApprove = async (userId: string) => {
    setActionLoadingId(userId);
    try {
      const res = await adminService.approveRegistration(userId);
      if (res.success) {
        setSuccessMsg('Inscription approuvée ! Un email a été envoyé.');
        setTimeout(() => setSuccessMsg(''), 4000);
        await fetchUsers();
        setShowModal(false);
        setSelectedUser(null);
      }
    } catch { /* ignore */ }
    setActionLoadingId(null);
  };

  const handleReject = async () => {
    if (!selectedUser || rejectReason.length < 10) return;
    setActionLoadingId(selectedUser.id);
    try {
      const res = await adminService.rejectRegistration(selectedUser.id, rejectReason);
      if (res.success) {
        setSuccessMsg('Inscription rejetée. Un email a été envoyé.');
        setTimeout(() => setSuccessMsg(''), 4000);
        await fetchUsers();
        setShowModal(false);
        setSelectedUser(null);
        setShowRejectModal(false);
        setRejectReason('');
      }
    } catch { /* ignore */ }
    setActionLoadingId(null);
  };

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.phone.includes(q)
    );
  });

  const pendingCount = users.filter((u) => u.registrationStatus === 'pending').length;
  const approvedCount = users.filter((u) => u.registrationStatus === 'approved').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des utilisateurs</h1>
          <p className="text-sm text-gray-500 mt-1">{totalUsers} utilisateur{totalUsers > 1 ? 's' : ''} inscrits</p>
        </div>
      </motion.div>

      {/* Toast success */}
      {successMsg && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 text-sm">
          <CheckCircle size={16} className="text-green-600 shrink-0" />
          {successMsg}
        </motion.div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Total</p>
              <p className="text-2xl font-bold text-gray-900">{loading ? '—' : totalUsers}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <AlertCircle size={18} className="text-amber-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400">En attente</p>
              <p className="text-2xl font-bold text-gray-900">{loading ? '—' : pendingCount}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
              <CheckCircle size={18} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Approuvés</p>
              <p className="text-2xl font-bold text-gray-900">{loading ? '—' : approvedCount}</p>
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
          <div className="flex gap-2">
            {(['all', 'individual', 'family'] as const).map((plan) => (
              <button
                key={plan}
                onClick={() => setPlanFilter(plan)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  planFilter === plan
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {plan === 'all' ? 'Tous' : plan === 'individual' ? 'Individuel' : 'Familial'}
              </button>
            ))}
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
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Pays</th>
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
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={u.planType === 'family' ? 'warning' : 'primary'} size="sm">
                        {u.planType === 'family' ? 'Familial' : 'Individuel'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 capitalize">{u.residenceCountry || '—'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(u.createdAt).toLocaleDateString('fr-FR')}</td>
                    <td className="px-6 py-4">
                      <Badge variant={statusVariants[u.registrationStatus] || 'warning'} dot size="sm">
                        {statusLabels[u.registrationStatus] || u.registrationStatus}
                      </Badge>
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
                              onClick={() => { setSelectedUser(u); setShowRejectModal(true); }}
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
              <div className="flex items-center gap-3">
                <Badge variant={statusVariants[selectedUser.registrationStatus] || 'warning'}>
                  {statusLabels[selectedUser.registrationStatus]}
                </Badge>
                <button
                  onClick={() => { setShowModal(false); setSelectedUser(null); }}
                  className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-600"
                >
                  <XCircle size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <User size={13} className="text-primary" /> Informations personnelles
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { label: 'Téléphone', value: selectedUser.phone, icon: <Phone size={13} /> },
                    { label: 'Situation', value: selectedUser.maritalStatus?.replace('_', ' '), icon: <User size={13} /> },
                    { label: 'Pays de résidence', value: selectedUser.residenceCountry, icon: <MapPin size={13} /> },
                    { label: 'Pays de rapatriement', value: selectedUser.repatriationCountry, icon: <MapPin size={13} /> },
                    { label: 'Adresse', value: selectedUser.residenceAddress, icon: <MapPin size={13} /> },
                    { label: 'Inscription', value: new Date(selectedUser.createdAt).toLocaleDateString('fr-FR'), icon: <Calendar size={13} /> },
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
                <div className="mt-3 pt-3 border-t border-gray-200 flex items-center gap-3">
                  <Badge variant={selectedUser.planType === 'family' ? 'warning' : 'primary'}>
                    Plan {selectedUser.planType === 'family' ? 'Familial' : 'Individuel'}
                  </Badge>
                  {selectedUser.familyMemberCount && (
                    <span className="text-xs text-gray-500">{selectedUser.familyMemberCount} membres</span>
                  )}
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
                    onClick={() => setShowRejectModal(true)}
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

      {/* Quick Reject Modal (from table row) */}
      {showRejectModal && (selectedUser || selectedUser) && (
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
                onClick={() => { setShowRejectModal(false); setRejectReason(''); setSelectedUser(null); }}
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
