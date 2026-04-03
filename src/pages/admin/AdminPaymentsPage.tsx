import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Users, TrendingUp, AlertCircle, Search, Download, ChevronLeft, ChevronRight, CheckCircle, Clock, XCircle, Calendar } from 'lucide-react';
import { Card, Badge, SkeletonCard, SkeletonTable } from '@/components/ui';
import { adminService, type AdminPayment, type PaymentsDashboard, type UpcomingDue } from '@/services/admin.service';
import { documentService } from '@/services/document.service';

const STATUS_MAP: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' }> = {
  completed: { label: 'Complété', variant: 'success' },
  pending:   { label: 'En attente', variant: 'warning' },
  failed:    { label: 'Échoué', variant: 'danger' },
};

type Tab = 'history' | 'upcoming';

export function AdminPaymentsPage() {
  const [tab, setTab] = useState<Tab>('history');
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [dashboard, setDashboard] = useState<PaymentsDashboard | null>(null);
  const [upcomingDues, setUpcomingDues] = useState<UpcomingDue[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingDues, setLoadingDues] = useState(false);
  const [exporting, setExporting] = useState(false);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const [paymentsRes, dashRes] = await Promise.all([
        adminService.getPayments({ page, limit: 20, status: statusFilter || undefined }),
        adminService.getPaymentsDashboard(),
      ]);
      if (paymentsRes.success) {
        setPayments(paymentsRes.data.payments ?? []);
        setTotal(paymentsRes.data.pagination?.total ?? 0);
        setTotalPages(paymentsRes.data.pagination?.totalPages ?? 1);
      }
      if (dashRes.success) setDashboard(dashRes.data);
    } catch { /* ignore */ }
    setLoading(false);
  }, [page, statusFilter]);

  const fetchUpcomingDues = useCallback(async () => {
    setLoadingDues(true);
    try {
      const res = await adminService.getUpcomingDues({ days: 7 });
      if (res.success) setUpcomingDues(res.data.dues ?? []);
    } catch { /* ignore */ }
    setLoadingDues(false);
  }, []);

  useEffect(() => {
    fetchPayments();
    adminService.getRegistrations({ status: 'approved', limit: 1 })
      .then(r => { if (r.success) setTotalUsers(r.data.pagination.total); })
      .catch(() => {});
  }, [fetchPayments]);

  useEffect(() => {
    if (tab === 'upcoming') fetchUpcomingDues();
  }, [tab, fetchUpcomingDues]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const blob = await documentService.exportPayments();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `paiements-aldiana-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch { /* ignore */ } finally {
      setExporting(false);
    }
  };

  const fmt = (n: number) => n.toLocaleString('fr-FR') + ' XOF';
  const totalRevenue = dashboard?.totalCollected ?? 0;
  const pendingCount = dashboard?.paymentsPending ?? 0;
  const failedCount  = dashboard?.paymentsFailed  ?? 0;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Suivi des paiements</h1>
          <p className="text-sm text-gray-500 mt-1">Historique des cotisations de la plateforme.</p>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark disabled:opacity-50 transition-colors"
        >
          <Download size={15} />
          {exporting ? 'Export…' : 'Exporter CSV'}
        </button>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[0,1,2,3].map(i => <SkeletonCard key={i} />)}</div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Adhérents actifs',  value: totalUsers,                   icon: Users,       color: 'text-primary',   bg: 'bg-primary/10' },
            { label: 'Total encaissé',    value: fmt(totalRevenue),            icon: TrendingUp,  color: 'text-gold-dark', bg: 'bg-gold/10' },
            { label: 'En attente',        value: pendingCount,                 icon: Clock,       color: 'text-amber-500', bg: 'bg-amber-50' },
            { label: 'Impayés / Échoués',value: failedCount,                  icon: AlertCircle, color: 'text-danger',    bg: 'bg-danger/10' },
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

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit">
        {([['history', 'Historique', CreditCard], ['upcoming', 'Échéances (7j)', Calendar]] as const).map(([key, label, Icon]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon size={14} />{label}
          </button>
        ))}
      </div>

      {tab === 'upcoming' ? (
        <Card>
          <h2 className="font-semibold text-gray-900 mb-4">Abonnements à relancer dans les 7 prochains jours</h2>
          {loadingDues ? (
            <div className="space-y-2">{[0,1,2].map(i => <SkeletonCard key={i} />)}</div>
          ) : upcomingDues.length === 0 ? (
            <div className="py-12 text-center">
              <Calendar size={32} className="mx-auto text-gray-200 mb-3" />
              <p className="text-sm text-gray-400">Aucune échéance imminente</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    {['Adhérent', 'Plan', 'Membres', 'Montant dû', 'Échéance', 'Dans'].map(h => (
                      <th key={h} className="text-left pb-3 pr-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {upcomingDues.map((due, i) => (
                    <tr key={i} className="hover:bg-gray-50/50">
                      <td className="py-3 pr-4">
                        <p className="font-medium text-gray-900">{due.user.firstName} {due.user.lastName}</p>
                        <p className="text-xs text-gray-400">{due.user.email}</p>
                      </td>
                      <td className="py-3 pr-4">
                        <Badge variant={due.subscription.planType === 'family' ? 'primary' : 'neutral'} size="sm">
                          {due.subscription.planType === 'family' ? 'Family' : 'Individuel'}
                        </Badge>
                      </td>
                      <td className="py-3 pr-4 text-gray-500">{due.subscription.memberCount}</td>
                      <td className="py-3 pr-4 font-semibold text-gray-900">{due.dueAmount.toLocaleString('fr-FR')} XOF</td>
                      <td className="py-3 pr-4 text-gray-500">{new Date(due.nextDueDate).toLocaleDateString('fr-FR')}</td>
                      <td className="py-3">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          due.daysUntilDue <= 2 ? 'bg-danger/10 text-danger' :
                          due.daysUntilDue <= 5 ? 'bg-amber-100 text-amber-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          J-{due.daysUntilDue}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      ) : (
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="relative w-full sm:w-56">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
              className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">Tous les statuts</option>
              <option value="completed">Complétés</option>
              <option value="pending">En attente</option>
              <option value="failed">Échoués</option>
            </select>
          </div>
          <p className="text-xs text-gray-400">{total} paiement(s) trouvé(s)</p>
        </div>

        {loading ? (
          <div className="overflow-x-auto"><table className="w-full"><SkeletonTable rows={6} cols={6} /></table></div>
        ) : payments.length === 0 ? (
          <div className="py-12 text-center">
            <CreditCard size={32} className="mx-auto text-gray-200 mb-3" />
            <p className="text-sm text-gray-400">Aucun paiement trouvé</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Adhérent', 'Montant', 'N° cotisation', 'Méthode', 'Statut', 'Date'].map(h => (
                    <th key={h} className="text-left pb-3 pr-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {payments.map(p => {
                  const s = STATUS_MAP[p.status] ?? { label: p.status, variant: 'neutral' as const };
                  const StatusIcon = p.status === 'completed' ? CheckCircle : p.status === 'failed' ? XCircle : Clock;
                  return (
                    <tr key={p.id} className="hover:bg-gray-50/50">
                      <td className="py-3 pr-4">
                        {p.user ? (
                          <div>
                            <p className="font-medium text-gray-900">{p.user.firstName} {p.user.lastName}</p>
                            <p className="text-xs text-gray-400">{p.user.email}</p>
                          </div>
                        ) : <span className="text-gray-400">—</span>}
                      </td>
                      <td className="py-3 pr-4 font-semibold text-gray-900">{p.amount.toLocaleString('fr-FR')} XOF</td>
                      <td className="py-3 pr-4 text-gray-500">#{p.paymentNumber}</td>
                      <td className="py-3 pr-4 text-gray-500">{p.paymentMethod ?? '—'}</td>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-1.5">
                          <StatusIcon size={13} className={p.status === 'completed' ? 'text-success' : p.status === 'failed' ? 'text-danger' : 'text-amber-500'} />
                          <Badge variant={s.variant} size="sm">{s.label}</Badge>
                        </div>
                      </td>
                      <td className="py-3 text-gray-400 text-xs">
                        {p.paidAt ? new Date(p.paidAt).toLocaleDateString('fr-FR') : new Date(p.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                    </tr>
                  );
                })}
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
      )}
    </div>
  );
}
