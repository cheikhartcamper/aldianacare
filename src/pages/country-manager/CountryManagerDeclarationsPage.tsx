import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, AlertTriangle, Eye, Clock, CheckCircle, XCircle, ChevronLeft, ChevronRight, Calendar, MapPin, RefreshCw } from 'lucide-react';
import { Card, Badge, Input, PageLoader, Button } from '@/components/ui';
import { countryManagerService } from '@/services/countryManager.service';
import type { Declaration } from '@/services/admin.service';

const STATUS_CONFIG: Record<string, { label: string; variant: 'warning' | 'success' | 'danger' | 'info'; icon: React.ElementType }> = {
  pending:   { label: 'En attente',  variant: 'warning', icon: Clock },
  in_review: { label: 'En révision', variant: 'info',    icon: Eye },
  approved:  { label: 'Approuvée',   variant: 'success', icon: CheckCircle },
  rejected:  { label: 'Rejetée',     variant: 'danger',  icon: XCircle },
};

type StatusFilter = 'all' | 'pending' | 'in_review' | 'approved' | 'rejected';

export function CountryManagerDeclarationsPage() {
  const [declarations, setDeclarations] = useState<Declaration[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<Declaration | null>(null);
  const [fetchError, setFetchError] = useState('');

  const fetchDeclarations = useCallback(async () => {
    setLoading(true);
    setFetchError('');
    try {
      const res = await countryManagerService.getDeclarations({
        status: statusFilter === 'all' ? undefined : statusFilter,
        page,
        limit: 15,
      });
      if (res.success) {
        setDeclarations(res.data.declarations);
        setTotal(res.data.pagination.total);
        setTotalPages(res.data.pagination.totalPages);
      } else {
        setFetchError(res.message || 'Impossible de charger les déclarations.');
        setDeclarations([]);
      }
    } catch (err: unknown) {
      const e = err as { response?: { status?: number; data?: { message?: string } } };
      const status = e.response?.status;
      const msg = e.response?.data?.message || '';
      if (status === 404 || msg.toLowerCase().includes('route non trouv')) {
        setFetchError('Endpoint non disponible côté backend. Implémentez GET /api/country-manager/declarations (voir BACKEND_TODO_DECLARATIONS.md).');
      } else if (status === 500) {
        setFetchError('Le backend renvoie une erreur 500 sur GET /api/country-manager/declarations. Vérifiez les logs du serveur (voir BACKEND_TODO_DECLARATIONS.md).');
      } else {
        setFetchError(msg || 'Erreur de connexion. Vérifiez que le backend est actif.');
      }
      setDeclarations([]);
    }
    setLoading(false);
  }, [statusFilter, page]);

  useEffect(() => { fetchDeclarations(); }, [fetchDeclarations]);

  const filtered = search
    ? declarations.filter((d) =>
        `${d.declarantFirstName} ${d.declarantLastName} ${d.declarationNumber} ${d.deathPlace}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    : declarations;


  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Déclarations de décès</h1>
        <p className="text-sm text-gray-500 mt-1">Déclarations de votre pays assigné</p>
      </motion.div>

      <Card padding="none">
        {/* Filters */}
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1">
            <Input
              placeholder="Rechercher par numéro, déclarant, lieu…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              icon={<Search size={15} />}
            />
          </div>
          <div className="flex gap-1 p-1 bg-gray-100 rounded-lg flex-wrap">
            {(['all', 'pending', 'in_review', 'approved', 'rejected'] as StatusFilter[]).map((s) => (
              <button
                key={s}
                onClick={() => { setStatusFilter(s); setPage(1); }}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
                  statusFilter === s ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {s === 'all' ? 'Toutes' : STATUS_CONFIG[s]?.label ?? s}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">N° déclaration</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Déclarant</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Décès</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={5}>
                    <PageLoader variant="inline" size="sm" label="Chargement des déclarations..." />
                  </td>
                </tr>
              ) : fetchError ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <AlertTriangle size={36} className="text-amber-300 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-gray-700 mb-1">Impossible de charger les déclarations</p>
                    <p className="text-xs text-red-500 mb-4">{fetchError}</p>
                    <Button size="sm" variant="ghost" icon={<RefreshCw size={13} />} onClick={fetchDeclarations}>Réessayer</Button>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <AlertTriangle size={32} className="text-gray-200 mx-auto mb-3" />
                    <p className="text-sm text-gray-400">Aucune déclaration</p>
                  </td>
                </tr>
              ) : filtered.map((d) => {
                const cfg = STATUS_CONFIG[d.status];
                return (
                  <tr key={d.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-mono font-semibold text-gray-900">{d.declarationNumber}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{new Date(d.createdAt).toLocaleDateString('fr-FR')}</p>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <p className="text-sm font-medium text-gray-900">{d.declarantFirstName} {d.declarantLastName}</p>
                      <p className="text-xs text-gray-400">{d.declarantPhone}</p>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar size={11} />
                        <span>{d.deathDate ? new Date(d.deathDate).toLocaleDateString('fr-FR') : '—'}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                        <MapPin size={11} />
                        <span className="truncate max-w-[140px]">{d.deathPlace}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={cfg?.variant ?? 'neutral'} size="sm">
                        {cfg?.label ?? d.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelected(d)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-primary bg-primary/5 hover:bg-primary/10 transition-colors"
                      >
                        <Eye size={13} /> Détails
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">Page {page} / {totalPages} — {total} déclaration{total > 1 ? 's' : ''}</p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors">
                <ChevronLeft size={16} />
              </button>
              <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-400 font-mono">{selected.declarationNumber}</p>
                <h2 className="text-lg font-bold text-gray-900 mt-0.5">Détail de la déclaration</h2>
              </div>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
                <XCircle size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Déclarant</p>
                <p className="text-sm font-semibold text-gray-900">{selected.declarantFirstName} {selected.declarantLastName}</p>
                <p className="text-sm text-gray-500">{selected.declarantPhone}</p>
              </div>
              {selected.deceased && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Défunt</p>
                  <p className="text-sm font-semibold text-gray-900">{selected.deceased.firstName} {selected.deceased.lastName}</p>
                  <p className="text-sm text-gray-500">{selected.deceased.email} · {selected.deceased.phone}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Rapatriement : {selected.deceased.repatriationCountry}</p>
                </div>
              )}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Décès</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-400">Date</p>
                    <p className="text-sm font-medium text-gray-900">{selected.deathDate ? new Date(selected.deathDate).toLocaleDateString('fr-FR') : '—'}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-400">Lieu</p>
                    <p className="text-sm font-medium text-gray-900">{selected.deathPlace}</p>
                  </div>
                </div>
              </div>
              {selected.additionalInfo && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Informations supplémentaires</p>
                  <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3">{selected.additionalInfo}</p>
                </div>
              )}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Statut</p>
                {(() => { const cfg = STATUS_CONFIG[selected.status]; return (
                  <Badge variant={cfg?.variant ?? 'neutral'}>{cfg?.label ?? selected.status}</Badge>
                ); })()}
                {selected.rejectionReason && (
                  <p className="text-sm text-red-600 bg-red-50 rounded-xl p-3 mt-2">Motif : {selected.rejectionReason}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
