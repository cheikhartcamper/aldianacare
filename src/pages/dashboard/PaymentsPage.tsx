import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, Clock, CreditCard, History, Info, Loader2, Shield, XCircle } from 'lucide-react';
import { Button, Card, Badge, SkeletonCard, SkeletonList } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { subscriptionService, type MySubscriptionResponse, type Payment, type PaymentHistoryResponse } from '@/services/subscription.service';

function formatDate(value?: string): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatAmount(value?: string | number): string {
  if (value === undefined || value === null) return '—';
  const amount = typeof value === 'string' ? Number.parseFloat(value) : value;
  if (Number.isNaN(amount)) return '—';
  return `${new Intl.NumberFormat('fr-FR').format(Math.round(amount))} FCFA`;
}

function getPaymentStatusConfig(status: Payment['status']): { label: string; variant: 'success' | 'warning' | 'danger' } {
  if (status === 'completed') return { label: 'Payé', variant: 'success' };
  if (status === 'pending') return { label: 'En attente', variant: 'warning' };
  return { label: 'Échoué', variant: 'danger' };
}

function getErrorMessage(error: unknown, fallback: string): string {
  const err = error as { response?: { data?: { message?: string } } };
  return err.response?.data?.message || fallback;
}

function getStatusBadgeVariant(status?: string): 'success' | 'warning' | 'danger' | 'neutral' {
  if (!status) return 'neutral';
  if (status === 'active') return 'success';
  if (status === 'pending') return 'warning';
  if (status === 'cancelled' || status === 'expired') return 'danger';
  return 'neutral';
}

function getPaymentBadgeVariant(status?: string): 'success' | 'warning' | 'danger' | 'neutral' {
  if (!status) return 'neutral';
  if (status === 'completed') return 'success';
  if (status === 'pending') return 'warning';
  if (status === 'failed' || status === 'cancelled') return 'danger';
  return 'neutral';
}

export function PaymentsPage() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [noActiveSubscription, setNoActiveSubscription] = useState(false);
  const [error, setError] = useState('');
  const [subscriptionData, setSubscriptionData] = useState<MySubscriptionResponse | null>(null);

  const [historyData, setHistoryData] = useState<PaymentHistoryResponse | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyPage, setHistoryPage] = useState(1);

  const [installmentLoading, setInstallmentLoading] = useState(false);
  const [installmentError, setInstallmentError] = useState('');

  const fetchSubscription = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError('');

    try {
      const response = await subscriptionService.getMySubscription();
      setSubscriptionData(response.data);
      setNoActiveSubscription(false);
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } }).response?.status;
      if (status === 404 || status === 500) {
        setNoActiveSubscription(true);
        setSubscriptionData(null);
      } else {
        setError(getErrorMessage(err, 'Impossible de récupérer vos informations de paiement.'));
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchHistory = async (page: number) => {
    setHistoryLoading(true);
    try {
      const res = await subscriptionService.getPaymentHistory(page, 10);
      if (res.success) setHistoryData(res.data);
    } catch {
      // silent
    } finally {
      setHistoryLoading(false);
    }
  };

  const handlePayInstallment = async () => {
    setInstallmentLoading(true);
    setInstallmentError('');
    try {
      const res = await subscriptionService.payInstallment();
      if (res.success && res.data.paymentUrl) {
        window.location.href = res.data.paymentUrl;
      }
    } catch (err: unknown) {
      setInstallmentError(getErrorMessage(err, 'Impossible d\'initier le paiement. Réessayez.'));
    } finally {
      setInstallmentLoading(false);
    }
  };

  useEffect(() => {
    void fetchSubscription(false);
    void fetchHistory(1);
  }, []);

  const userSubscription = subscriptionData?.userSubscription;
  const subscription = subscriptionData?.subscription;

  const accountTypeLabel = user?.planType === 'family' ? 'Familiale' : 'Individuelle';

  const planLabel = useMemo(() => {
    if (!subscription) return accountTypeLabel;
    const typeLabel = subscription.planType === 'family' ? 'Familiale' : 'Individuelle';
    const durationLabel = subscription.duration === 'yearly' ? 'Annuelle' : 'Mensuelle';
    return `${typeLabel} • ${durationLabel}`;
  }, [subscription, accountTypeLabel]);

  const subscriptionBadgeText = userSubscription
    ? (userSubscription.status === 'active' ? 'Actif' : userSubscription.status === 'pending' ? 'En attente' : userSubscription.status)
    : 'Aucun abonnement actif';

  const paymentBadgeText = userSubscription
    ? (userSubscription.paymentStatus === 'completed' ? 'Payé' : userSubscription.paymentStatus === 'pending' ? 'En attente' : userSubscription.paymentStatus)
    : '—';

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Paiements</h1>
          <p className="text-sm text-gray-500 mt-1">Suivi de votre abonnement et de vos cotisations.</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => void fetchSubscription(true)}
          loading={refreshing}
          disabled={loading}
        >
          Actualiser
        </Button>
      </motion.div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">{[0,1,2,3].map(i => <SkeletonCard key={i} />)}</div>
      ) : null}
      <div className={`grid sm:grid-cols-2 lg:grid-cols-4 gap-4 ${loading ? 'hidden' : ''}`}>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Shield size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Type de formule</p>
              <p className="text-sm font-bold text-gray-900">{planLabel}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-info/10">
              <CreditCard size={20} className="text-info" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Statut abonnement</p>
              <Badge variant={getStatusBadgeVariant(userSubscription?.status)} size="sm">
                {subscriptionBadgeText}
              </Badge>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
              <CalendarDays size={20} className="text-gold-dark" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Fin de couverture</p>
              <p className="text-sm font-bold text-gray-900">{formatDate(userSubscription?.endDate)}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center">
              <Clock size={20} className="text-info" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Paiement</p>
              <div className="flex items-center gap-2">
                <Badge variant={getPaymentBadgeVariant(userSubscription?.paymentStatus)} size="sm">
                  {paymentBadgeText}
                </Badge>
                <span className="text-xs font-semibold text-gray-700">{formatAmount(userSubscription?.pricePaid)}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {loading ? (
        <Card>
          <div className="flex items-center justify-center gap-2 py-10 text-gray-500">
            <Loader2 size={18} className="animate-spin" />
            Chargement de votre abonnement...
          </div>
        </Card>
      ) : error ? (
        <Card className="border-red-200 bg-red-50">
          <div className="flex items-start gap-3">
            <AlertTriangle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-700">Erreur de récupération</p>
              <p className="text-sm text-red-600 mt-1">{error}</p>
              <div className="mt-3">
                <Button variant="outline" size="sm" onClick={() => void fetchSubscription(true)}>
                  Réessayer
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ) : noActiveSubscription ? (
        <Card>
          <div className="flex gap-4 items-start">
            <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Info size={22} className="text-gold-dark" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Aucun abonnement actif</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Vous n'avez pas encore de couverture active. Sélectionnez une formule pour initier votre paiement.
              </p>
              <div className="mt-4">
                <Link to="/app/offres">
                  <Button variant="gold" size="sm">Voir les offres</Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <>
          <Card>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Abonnement actif</h3>
                <p className="text-sm text-gray-500">{subscription?.name || 'Abonnement Aldiana Care'}</p>
              </div>
              {userSubscription && (
                <Badge variant={getStatusBadgeVariant(userSubscription.status)}>
                  {subscriptionBadgeText}
                </Badge>
              )}
            </div>

            {userSubscription && (
              <div className="mt-5 grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-surface-secondary border border-gray-100">
                  <p className="text-xs text-gray-400 mb-1">Référence paiement</p>
                  <p className="text-sm font-semibold text-gray-900 break-all">{userSubscription.paymentReference}</p>
                </div>
                <div className="p-4 rounded-xl bg-surface-secondary border border-gray-100">
                  <p className="text-xs text-gray-400 mb-1">Montant payé</p>
                  <p className="text-sm font-semibold text-gray-900">{formatAmount(userSubscription.pricePaid)}</p>
                </div>
                <div className="p-4 rounded-xl bg-surface-secondary border border-gray-100">
                  <p className="text-xs text-gray-400 mb-1">Date de début</p>
                  <p className="text-sm font-semibold text-gray-900">{formatDate(userSubscription.startDate)}</p>
                </div>
                <div className="p-4 rounded-xl bg-surface-secondary border border-gray-100">
                  <p className="text-xs text-gray-400 mb-1">Date de fin</p>
                  <p className="text-sm font-semibold text-gray-900">{formatDate(userSubscription.endDate)}</p>
                </div>
              </div>
            )}
          </Card>

          <Card padding="none">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Détails de couverture</h3>
              {userSubscription?.daysRemaining !== undefined && (
                <span className="text-xs text-gray-500">{userSubscription.daysRemaining} jour(s) restant(s)</span>
              )}
            </div>
            <div className="p-5 grid sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-500">Type de plan</span>
                <span className="font-medium text-gray-900">{planLabel}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-500">Membres couverts</span>
                <span className="font-medium text-gray-900">{userSubscription?.memberCount ?? '—'}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-500">Moyen de paiement</span>
                <span className="font-medium text-gray-900">{userSubscription?.paymentMethod || '—'}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-500">Date de paiement</span>
                <span className="font-medium text-gray-900">{formatDate(userSubscription?.paymentDate)}</span>
              </div>
            </div>
          </Card>

          {/* Pay installment */}
          {(userSubscription?.isExpired || userSubscription?.status === 'suspended') && (
            <Card className="border-amber-200 bg-amber-50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-amber-800">
                      {userSubscription?.status === 'suspended' ? 'Abonnement suspendu' : 'Couverture expirée'}
                    </p>
                    <p className="text-xs text-amber-700 mt-0.5">
                      Payez votre cotisation pour réactiver votre couverture.
                    </p>
                    {installmentError && <p className="text-xs text-red-600 mt-1">{installmentError}</p>}
                  </div>
                </div>
                <Button
                  variant="gold"
                  size="sm"
                  icon={installmentLoading ? <Loader2 size={14} className="animate-spin" /> : <CreditCard size={14} />}
                  onClick={() => void handlePayInstallment()}
                  disabled={installmentLoading}
                >
                  Payer la cotisation
                </Button>
              </div>
            </Card>
          )}
        </>
      )}

      {/* Payment history */}
      <Card padding="none">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History size={16} className="text-gray-400" />
            <h3 className="font-semibold text-gray-900">Historique des paiements</h3>
          </div>
          {historyData?.summary && (
            <span className="text-xs text-gray-400">
              Total versé : <span className="font-semibold text-gray-700">{formatAmount(historyData.summary.totalAmountPaid)}</span>
            </span>
          )}
        </div>

        {historyLoading ? (
          <SkeletonList rows={5} />
        ) : !historyData || historyData.payments.length === 0 ? (
          <div className="flex items-center gap-3 p-6 text-gray-500">
            <Info size={16} className="flex-shrink-0" />
            <p className="text-sm">Aucun paiement enregistré pour le moment.</p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-50">
              {historyData.payments.map((payment) => {
                const cfg = getPaymentStatusConfig(payment.status);
                return (
                  <div key={payment.id} className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        payment.status === 'completed' ? 'bg-success/10' : payment.status === 'pending' ? 'bg-warning/10' : 'bg-danger/10'
                      }`}>
                        {payment.status === 'completed'
                          ? <CheckCircle2 size={15} className="text-success" />
                          : payment.status === 'pending'
                          ? <Clock size={15} className="text-warning" />
                          : <XCircle size={15} className="text-danger" />
                        }
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          Cotisation n°{payment.paymentNumber}
                          {payment.isLatePayment && <span className="ml-2 text-xs text-amber-600">(retard)</span>}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {payment.paidAt ? formatDate(payment.paidAt) : formatDate(payment.createdAt)}
                          {payment.periodStart && payment.periodEnd && (
                            <> · {formatDate(payment.periodStart)} → {formatDate(payment.periodEnd)}</>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-sm font-semibold text-gray-900">{formatAmount(payment.amount)}</span>
                      <Badge variant={cfg.variant} size="sm">{cfg.label}</Badge>
                    </div>
                  </div>
                );
              })}
            </div>

            {historyData.pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
                <span className="text-xs text-gray-400">
                  Page {historyData.pagination.page} / {historyData.pagination.totalPages}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { const p = historyPage - 1; setHistoryPage(p); void fetchHistory(p); }}
                    disabled={historyPage <= 1 || historyLoading}
                    className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40 transition-colors"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    onClick={() => { const p = historyPage + 1; setHistoryPage(p); void fetchHistory(p); }}
                    disabled={historyPage >= historyData.pagination.totalPages || historyLoading}
                    className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40 transition-colors"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
