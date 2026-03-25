import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, Users, User, Mail, Phone, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, Badge, Input, PageLoader } from '@/components/ui';
import { countryManagerService, type CountryManagerUser } from '@/services/countryManager.service';

const STATUS_VARIANTS: Record<string, 'success' | 'warning' | 'danger'> = {
  approved: 'success',
  pending: 'warning',
  rejected: 'danger',
};
const STATUS_LABELS: Record<string, string> = {
  approved: 'Approuvé',
  pending: 'En attente',
  rejected: 'Rejeté',
};

export function CountryManagerUsersPage() {
  const [users, setUsers] = useState<CountryManagerUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchUsers = useCallback(async (showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      const res = await countryManagerService.getUsers({ page, limit: 15, search: search || undefined });
      if (res.success) {
        setUsers(res.data.users);
        setTotal(res.data.pagination.total);
        setTotalPages(res.data.pagination.totalPages);
      }
    } catch { /* ignore */ }
    setLoading(false);
  }, [page, search]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  let searchTimeout: ReturnType<typeof setTimeout>;
  const handleSearch = (v: string) => {
    setSearch(v);
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => { setPage(1); }, 400);
  };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Assurés</h1>
        <p className="text-sm text-gray-500 mt-1">Assurés de votre pays assigné</p>
      </motion.div>

      <Card padding="none">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1">
            <Input
              placeholder="Rechercher par nom, email, téléphone…"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              icon={<Search size={15} />}
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Users size={15} />
            <span>{total} assuré{total > 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Assuré</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Plan</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Inscrit le</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <Users size={32} className="text-gray-200 mx-auto mb-3" />
                    <p className="text-sm text-gray-400">Aucun assuré trouvé</p>
                  </td>
                </tr>
              ) : users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <User size={14} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{u.firstName} {u.lastName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Mail size={11} /><span>{u.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Phone size={11} /><span>{u.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <Badge variant={u.planType === 'family' ? 'info' : 'neutral'} size="sm">
                      {u.planType === 'family' ? 'Familial' : 'Individuel'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={STATUS_VARIANTS[u.registrationStatus] ?? 'default'} size="sm">
                      {STATUS_LABELS[u.registrationStatus] ?? u.registrationStatus}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <MapPin size={11} />
                      <span>{new Date(u.createdAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">Page {page} / {totalPages} — {total} assuré{total > 1 ? 's' : ''}</p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
