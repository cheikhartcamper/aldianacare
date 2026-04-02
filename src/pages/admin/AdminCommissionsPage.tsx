import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Gift, Users, TrendingUp, Share2, ChevronLeft, ChevronRight, CheckCircle, Clock } from 'lucide-react';
import { Card, Badge, SkeletonCard, SkeletonTable } from '@/components/ui';
import { adminService, type AdminReferral } from '@/services/admin.service';

export function AdminCommissionsPage() {
  const [referrals, setReferrals] = useState<AdminReferral[]>([]);
  const [summary, setSummary] = useState({ totalReferrals: 0, totalCommissionsDue: 0, totalCommissionsPaid: 0, activeSponsor: 0 });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState<'all' | 'paid' | 'unpaid'>('all');
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState<string | null>(null);

  const fetchReferrals = useCallback(async () => {
    setLoading(true);
    try {
      const params: { page: number; limit: number; commissionPaid?: boolean } = { page, limit: 20 };
      if (filter === 'paid') params.commissionPaid = true;
      if (filter === 'unpaid') params.commissionPaid = false;
      const res = await adminService.getReferrals(params);
      if (res.success) {
        setReferrals(res.data.referrals ?? []);
        setSummary(res.data.summary ?? { totalReferrals: 0, totalCommissionsDue: 0, totalCommissionsPaid: 0, activeSponsor: 0 });
        setTotal(res.data.pagination?.total ?? 0);
        setTotalPages(res.data.pagination?.totalPages ?? 1);
      }
    } catch { /* ignore */ }
    setLoading(false);
  }, [page, filter]);

  useEffect(() => { fetchReferrals(); }, [fetchReferrals]);

  const handlePayCommission = async (id: string) => {
    setPaying(id);
    try {
      const res = await adminService.payCommission(id);
      if (res.success) {
        setReferrals(prev => prev.map(r => r.id === id ? { ...r, commissionPaid: true, commissionPaidAt: new Date().toISOString() } : r));
      }
    } catch { /* ignore */ } finally {
      setPaying(null);
    }
  };

  const fmt = (n: number) => n.toLocaleString('fr-FR') + ' XOF';

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Commissions & Parrainage</h1>
        <p className="text-sm text-gray-500 mt-1">Suivi des commissions de parrainage et versements aux parrains.</p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[0,1,2,3].map(i => <SkeletonCard key={i} />)}</div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Sponsors actifs', value: summary?.activeSponsor ?? 0, icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
            { label: 'Total filleuls', value: summary?.totalReferrals ?? 0, icon: Share2, color: 'text-gold-dark', bg: 'bg-gold/10' },
            { label: 'Commissions à payer', value: fmt(summary?.totalCommissionsDue ?? 0), icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
            { label: 'Commissions versées', value: fmt(summary?.totalCommissionsPaid ?? 0), icon: TrendingUp, color: 'text-success', bg: 'bg-success/10' },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg}`}>
                    <stat.icon size={18} className={stat.color} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">{stat.label}</p>
                    <p className="text-lg font-bold text-gray-900 leading-tight">{stat.value}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            {(['all', 'unpaid', 'paid'] as const).map(f => (
              <button
                key={f}
                onClick={() => { setFilter(f); setPage(1); }}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  filter === f ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f === 'all' ? 'Tous' : f === 'unpaid' ? 'À payer' : 'Versés'}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400">{total} parrainage(s)</p>
        </div>

        {loading ? (
          <div className="overflow-x-auto"><table className="w-full"><SkeletonTable rows={5} cols={7} /></table></div>
        ) : referrals.length === 0 ? (
          <div className="py-12 text-center">
            <Gift size={32} className="mx-auto text-gray-200 mb-3" />
            <p className="text-sm text-gray-400">Aucun parrainage trouvé</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Parrain', 'Filleul', 'Code', 'Réduction', 'Commission', 'Statut', 'Action'].map(h => (
                    <th key={h} className="text-left pb-3 pr-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {referrals.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50/50">
                    <td className="py-3 pr-4">
                      {r.referrer ? (
                        <div>
                          <p className="font-medium text-gray-900">{r.referrer.firstName} {r.referrer.lastName}</p>
                          <p className="text-xs text-gray-400">{r.referrer.email}</p>
                        </div>
                      ) : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="py-3 pr-4">
                      {r.referred ? (
                        <div>
                          <p className="font-medium text-gray-900">{r.referred.firstName} {r.referred.lastName}</p>
                          <p className="text-xs text-gray-400">{r.referred.email}</p>
                        </div>
                      ) : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="py-3 pr-4">
                      <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{r.code}</span>
                    </td>
                    <td className="py-3 pr-4 text-gray-700">{r.discountPercent}%</td>
                    <td className="py-3 pr-4 font-semibold text-gray-900">{r.commissionAmount.toLocaleString('fr-FR')} XOF</td>
                    <td className="py-3 pr-4">
                      {r.commissionPaid ? (
                        <div className="flex items-center gap-1.5">
                          <CheckCircle size={13} className="text-success" />
                          <Badge variant="success" size="sm">Versée</Badge>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <Clock size={13} className="text-amber-500" />
                          <Badge variant="warning" size="sm">À payer</Badge>
                        </div>
                      )}
                    </td>
                    <td className="py-3">
                      {!r.commissionPaid && (
                        <button
                          onClick={() => handlePayCommission(r.id)}
                          disabled={paying === r.id}
                          className="text-xs font-medium text-primary hover:text-primary-dark disabled:opacity-50 transition-colors"
                        >
                          {paying === r.id ? 'En cours…' : 'Marquer versée'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 disabled:opacity-40">
              <ChevronLeft size={16} /> Préc.
            </button>
            <span className="text-xs text-gray-400">{page} / {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 disabled:opacity-40">
              Suiv. <ChevronRight size={16} />
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}
