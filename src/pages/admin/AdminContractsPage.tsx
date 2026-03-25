import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Search, Eye, Users, Calendar, MapPin, Phone,
  ChevronLeft, ChevronRight, Shield, RefreshCw
} from 'lucide-react';
import { Card, Badge, Button, Input, Modal, PageLoader } from '@/components/ui';
import { adminService, type UserWithTrusted } from '@/services/admin.service';

export function AdminContractsPage() {
  const [users, setUsers] = useState<UserWithTrusted[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0 });
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState<'all' | 'individual' | 'family'>('all');
  const [selected, setSelected] = useState<UserWithTrusted | null>(null);
  const [, setLoadingUser] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchContracts = useCallback(async (showLoader = true) => {
    if (showLoader) setLoading(true);
    else setRefreshing(true);
    try {
      const res = await adminService.getRegistrations({
        status: 'approved',
        page,
        limit: 15,
        ...(planFilter !== 'all' ? { planType: planFilter } : {}),
      });
      if (res.success) {
        setUsers(res.data.registrations);
        setPagination({ total: res.data.pagination.total, totalPages: res.data.pagination.totalPages });
      }
    } catch { setUsers([]); }
    setLoading(false);
    setRefreshing(false);
  }, [page, planFilter]);

  useEffect(() => { fetchContracts(); }, [fetchContracts]);

  const handleViewUser = async (userId: string) => {
    setLoadingUser(true);
    try {
      const res = await adminService.getUserById(userId);
      if (res.success) setSelected(res.data as UserWithTrusted);
    } catch { /* ignore */ }
    setLoadingUser(false);
  };

  const filteredUsers = users.filter((u) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.phone.includes(q) ||
      u.residenceCountry?.toLowerCase().includes(q)
    );
  });

  const individual = users.filter(u => u.planType === 'individual').length;
  const family = users.filter(u => u.planType === 'family').length;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'easeOut' as const }}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des contrats</h1>
            <p className="text-sm text-gray-500 mt-1">
              {pagination.total} contrat{pagination.total !== 1 ? 's' : ''} actif{pagination.total !== 1 ? 's' : ''} (inscriptions approuvées)
            </p>
          </div>
          <Button size="sm" variant="ghost" icon={<RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />} onClick={() => fetchContracts(false)} disabled={refreshing}>
            Actualiser
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><FileText size={18} className="text-primary" /></div>
            <div>
              <p className="text-xs text-gray-400">Total contrats</p>
              <p className="text-2xl font-bold text-gray-900">{loading ? '—' : pagination.total}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Shield size={18} className="text-primary" /></div>
            <div>
              <p className="text-xs text-gray-400">Individuels</p>
              <p className="text-2xl font-bold text-gray-900">{loading ? '—' : individual}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center"><Users size={18} className="text-gold-dark" /></div>
            <div>
              <p className="text-xs text-gray-400">Familiaux</p>
              <p className="text-2xl font-bold text-gray-900">{loading ? '—' : family}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex gap-2">
            {(['all', 'individual', 'family'] as const).map((p) => (
              <button key={p} onClick={() => { setPlanFilter(p); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${planFilter === p ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                {p === 'all' ? 'Tous' : p === 'individual' ? 'Individuel' : 'Familial'}
              </button>
            ))}
          </div>
          <div className="w-full sm:w-64">
            <Input placeholder="Rechercher (nom, email, pays...)" icon={<Search size={14} />} value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
      </Card>

      {/* Table */}
      {loading ? (
        <PageLoader variant="inline" size="sm" label="Chargement des contrats..." />
      ) : filteredUsers.length === 0 ? (
        <Card>
          <div className="text-center py-14">
            <FileText size={40} className="mx-auto text-gray-200 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun contrat</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">Les contrats sont créés automatiquement lors de l'approbation d'une inscription.</p>
          </div>
        </Card>
      ) : (
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3.5">Adhérent</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3.5">Plan</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3.5">Pays résidence</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3.5">Rapatriement</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3.5">Date adhésion</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3.5">Statut</th>
                  <th className="text-right text-xs font-semibold text-gray-500 px-5 py-3.5">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u, i) => (
                  <motion.tr key={u.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                    className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                          {u.firstName?.charAt(0)}{u.lastName?.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{u.firstName} {u.lastName}</p>
                          <p className="text-[10px] text-gray-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant={u.planType === 'family' ? 'warning' : 'primary'} size="sm">
                        {u.planType === 'family' ? 'Familial' : 'Individuel'}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-600 capitalize">{u.residenceCountry || '—'}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-600 capitalize">{u.repatriationCountry || '—'}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-500">{new Date(u.createdAt).toLocaleDateString('fr-FR')}</td>
                    <td className="px-5 py-3.5">
                      <Badge variant="success" dot size="sm">Actif</Badge>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button onClick={() => handleViewUser(u.id)} className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors">
                        <Eye size={16} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
              <p className="text-xs text-gray-400">Page {page}/{pagination.totalPages} — {pagination.total} résultats</p>
              <div className="flex gap-1">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30"><ChevronLeft size={16} /></button>
                <button onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages} className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30"><ChevronRight size={16} /></button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Detail Modal */}
      {selected && (
        <Modal isOpen={!!selected} onClose={() => setSelected(null)} size="lg">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-base font-bold text-primary">
                {selected.firstName?.charAt(0)}{selected.lastName?.charAt(0)}
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">{selected.firstName} {selected.lastName}</h2>
                <p className="text-xs text-gray-400">{selected.email}</p>
              </div>
              <Badge variant="success" className="ml-auto" dot>Contrat actif</Badge>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                <h3 className="text-xs font-semibold text-primary uppercase mb-2">Plan d'assurance</h3>
                <p className="text-lg font-bold text-gray-900">{selected.planType === 'family' ? 'Familial' : 'Individuel'}</p>
                {selected.familyMemberCount && <p className="text-xs text-gray-500 mt-1">{selected.familyMemberCount} membres</p>}
              </div>
              <div className="p-4 bg-gold/5 rounded-xl border border-gold/10">
                <h3 className="text-xs font-semibold text-gold-dark uppercase mb-2">Couverture</h3>
                <p className="text-sm text-gray-700 flex items-center gap-1 capitalize"><MapPin size={12} /> Résidence: {selected.residenceCountry || '—'}</p>
                <p className="text-sm text-gray-700 flex items-center gap-1 mt-1 capitalize"><MapPin size={12} /> Rapatriement: {selected.repatriationCountry || '—'}</p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl">
              <h3 className="text-xs font-semibold text-gray-600 uppercase mb-3">Informations</h3>
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div><p className="text-xs text-gray-400">Téléphone</p><p className="text-gray-700 flex items-center gap-1"><Phone size={12} /> {selected.phone}</p></div>
                <div><p className="text-xs text-gray-400">Situation</p><p className="text-gray-700 capitalize">{selected.maritalStatus?.replace('_', ' ') || '—'}</p></div>
                <div><p className="text-xs text-gray-400">Date d'adhésion</p><p className="text-gray-700 flex items-center gap-1"><Calendar size={12} /> {new Date(selected.createdAt).toLocaleDateString('fr-FR')}</p></div>
                <div><p className="text-xs text-gray-400">Adresse</p><p className="text-gray-700">{selected.residenceAddress || '—'}</p></div>
              </div>
            </div>

            {selected.trustedPersons && selected.trustedPersons.length > 0 && (
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="text-xs font-semibold text-gray-600 uppercase mb-3 flex items-center gap-2">
                  <Users size={14} /> Personnes de confiance ({selected.trustedPersons.length})
                </h3>
                <div className="space-y-2">
                  {selected.trustedPersons.map((tp) => (
                    <div key={tp.id} className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-gray-100">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{tp.firstName} {tp.lastName}</p>
                        <p className="text-xs text-primary capitalize">{tp.relation}</p>
                      </div>
                      <p className="text-xs text-gray-500">{tp.phone}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
