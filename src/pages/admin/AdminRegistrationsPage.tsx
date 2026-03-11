import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, CheckCircle, XCircle, Eye, User, Mail, Phone, MapPin, Calendar, AlertCircle } from 'lucide-react';
import { Card, Badge, Button, Input, DocImage, PageLoader, BrandSpinner } from '@/components/ui';
import { adminService, type UserWithTrusted } from '@/services/admin.service';

type StatusFilter = 'pending' | 'approved' | 'rejected' | 'all';

export function AdminRegistrationsPage() {
  const [registrations, setRegistrations] = useState<UserWithTrusted[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedUser, setSelectedUser] = useState<UserWithTrusted | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [rejectActionLoading, setRejectActionLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [userToReject, setUserToReject] = useState<UserWithTrusted | null>(null);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const res = await adminService.getRegistrations({ status: statusFilter, page, limit: 10 });
      if (res.success) {
        setRegistrations(res.data.registrations);
        setTotal(res.data.pagination.total);
        setTotalPages(res.data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching registrations:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRegistrations();
  }, [statusFilter, page]);

  const handleApprove = async (userId: string) => {
    setActionLoadingId(userId);
    try {
      const res = await adminService.approveRegistration(userId);
      if (res.success) {
        await fetchRegistrations();
        setShowModal(false);
        setSelectedUser(null);
      }
    } catch { /* ignore */ }
    setActionLoadingId(null);
  };

  const handleReject = async () => {
    if (!userToReject || !rejectReason.trim() || rejectReason.length < 10) return;
    setRejectActionLoading(true);
    try {
      const res = await adminService.rejectRegistration(userToReject.id, rejectReason);
      if (res.success) {
        await fetchRegistrations();
        setShowRejectModal(false);
        setUserToReject(null);
        setRejectReason('');
        setShowModal(false);
        setSelectedUser(null);
      }
    } catch { /* ignore */ }
    setRejectActionLoading(false);
  };

  const filteredRegistrations = registrations.filter((reg) => {
    const query = searchQuery.toLowerCase();
    return (
      reg.firstName.toLowerCase().includes(query) ||
      reg.lastName.toLowerCase().includes(query) ||
      reg.email.toLowerCase().includes(query) ||
      reg.phone.includes(query)
    );
  });

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Gestion des inscriptions</h1>
        <p className="text-sm text-gray-500 mt-1">Validez ou rejetez les nouvelles inscriptions.</p>
      </motion.div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Rechercher par nom, email, téléphone..."
              icon={<Search size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {(['pending', 'approved', 'rejected', 'all'] as StatusFilter[]).map((status) => (
              <button
                key={status}
                onClick={() => {
                  setStatusFilter(status);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === status
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status === 'pending' && 'En attente'}
                {status === 'approved' && 'Approuvées'}
                {status === 'rejected' && 'Rejetées'}
                {status === 'all' && 'Toutes'}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <AlertCircle size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400">En attente</p>
              <p className="text-2xl font-bold text-gray-900">{statusFilter === 'pending' ? total : '—'}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
              <CheckCircle size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Approuvées</p>
              <p className="text-2xl font-bold text-gray-900">{statusFilter === 'approved' ? total : '—'}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <XCircle size={20} className="text-red-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Rejetées</p>
              <p className="text-2xl font-bold text-gray-900">{statusFilter === 'rejected' ? total : '—'}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Table */}
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
              {loading ? (
                <tr>
                  <td colSpan={6}>
                    <PageLoader variant="inline" size="sm" label="Chargement des inscriptions..." />
                  </td>
                </tr>
              ) : filteredRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-400">
                    Aucune inscription trouvée
                  </td>
                </tr>
              ) : (
                filteredRegistrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                          {reg.firstName.charAt(0)}{reg.lastName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{reg.firstName} {reg.lastName}</p>
                          <p className="text-xs text-gray-400">{reg.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={reg.planType === 'family' ? 'warning' : 'primary'} size="sm">
                        {reg.planType === 'family' ? 'Familial' : 'Individuel'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{reg.residenceCountry}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{new Date(reg.createdAt).toLocaleDateString('fr-FR')}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          reg.registrationStatus === 'approved' ? 'success' :
                          reg.registrationStatus === 'rejected' ? 'danger' :
                          'warning'
                        }
                        size="sm"
                      >
                        {reg.registrationStatus === 'approved' ? 'Approuvée' :
                         reg.registrationStatus === 'rejected' ? 'Rejetée' :
                         'En attente'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Eye size={14} />}
                        onClick={() => {
                          setSelectedUser(reg);
                          setShowModal(true);
                        }}
                      >
                        Détails
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Page {page} sur {totalPages} ({total} inscription{total > 1 ? 's' : ''})
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Précédent
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Suivant
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Detail Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-100 sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Détails de l'inscription</h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedUser(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* User Info */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Informations personnelles</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <User size={16} className="text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-400">Nom complet</p>
                      <p className="text-sm font-medium text-gray-900">{selectedUser.firstName} {selectedUser.lastName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail size={16} className="text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-400">Email</p>
                      <p className="text-sm font-medium text-gray-900">{selectedUser.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone size={16} className="text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-400">Téléphone</p>
                      <p className="text-sm font-medium text-gray-900">{selectedUser.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-400">Pays de résidence</p>
                      <p className="text-sm font-medium text-gray-900">{selectedUser.residenceCountry}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-400">Pays de rapatriement</p>
                      <p className="text-sm font-medium text-gray-900">{selectedUser.repatriationCountry}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar size={16} className="text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-400">Date d'inscription</p>
                      <p className="text-sm font-medium text-gray-900">{new Date(selectedUser.createdAt).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Documents d'identité</h3>
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
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Personnes de confiance ({selectedUser.trustedPersons.length})</h3>
                  <div className="space-y-3">
                    {selectedUser.trustedPersons.map((tp) => (
                      <div key={tp.id} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-900">{tp.firstName} {tp.lastName}</p>
                        <p className="text-xs text-gray-500 capitalize">{tp.relation}{tp.relationDetails ? ` — ${tp.relationDetails}` : ''}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>{tp.phone}</span>
                          {tp.email && <span>{tp.email}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rejection Reason */}
              {selectedUser.registrationStatus === 'rejected' && selectedUser.rejectionReason && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm font-semibold text-red-900 mb-1">Motif de rejet</p>
                  <p className="text-sm text-red-700">{selectedUser.rejectionReason}</p>
                </div>
              )}

              {/* Actions */}
              {selectedUser.registrationStatus === 'pending' && (
                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <Button
                    variant="primary"
                    fullWidth
                    icon={actionLoadingId === selectedUser.id ? <BrandSpinner size={16} /> : <CheckCircle size={16} />}
                    onClick={() => handleApprove(selectedUser.id)}
                    disabled={actionLoadingId === selectedUser.id}
                  >
                    {actionLoadingId === selectedUser.id ? 'Traitement...' : 'Approuver'}
                  </Button>
                  <Button
                    variant="danger"
                    fullWidth
                    icon={<XCircle size={16} />}
                    onClick={() => {
                      setUserToReject(selectedUser);
                      setShowRejectModal(true);
                    }}
                    disabled={!!actionLoadingId}
                  >
                    Rejeter
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && userToReject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-md w-full p-6"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">Rejeter l'inscription</h3>
            <p className="text-sm text-gray-600 mb-4">
              Veuillez indiquer le motif du rejet (minimum 10 caractères). Un email sera envoyé à l'utilisateur.
            </p>
            <textarea
              className="w-full p-3 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              rows={4}
              placeholder="Ex: Les documents CNI fournis sont illisibles..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <p className="text-xs text-gray-400 mt-2">{rejectReason.length} / 10 caractères minimum</p>
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                fullWidth
                onClick={() => {
                  setShowRejectModal(false);
                  setUserToReject(null);
                  setRejectReason('');
                }}
                disabled={rejectActionLoading}
              >
                Annuler
              </Button>
              <Button
                variant="danger"
                fullWidth
                onClick={handleReject}
                disabled={rejectActionLoading || rejectReason.length < 10}
              >
                {rejectActionLoading ? 'Traitement...' : 'Confirmer le rejet'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
