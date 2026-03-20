import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, CheckCircle, CreditCard, Info, Loader2, Shield } from 'lucide-react';
import { Button, Card, Badge } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import {
  subscriptionService,
  type PriceDetails,
  type SubscriptionDuration,
  type SubscriptionPlan,
  type SubscriptionPlanType,
} from '@/services/subscription.service';

const PLAN_DETAILS = {
  individual: {
    features: [
      'Rapatriement du corps',
      'Assistance administrative complète',
      'Support téléphonique 24/7',
      'Couverture mondiale',
      'Assistance funéraire locale',
    ],
  },
  family: {
    features: [
      'Rapatriement du corps (souscripteur + famille)',
      'Assistance administrative complète',
      'Support téléphonique 24/7',
      'Couverture mondiale',
      'Billet d\'avion pour 2 membres de la famille',
      'Assistance funéraire complète',
      'Gestionnaire de dossier dédié',
    ],
  },
};

interface DisplayPlan extends SubscriptionPlan {
  planType: SubscriptionPlanType;
  duration: SubscriptionDuration;
}

const DURATION_LABEL: Record<SubscriptionDuration, string> = {
  monthly: 'Mensuel',
  yearly: 'Annuel',
};

function getErrorMessage(error: unknown, fallback: string): string {
  const err = error as { response?: { data?: { message?: string } } };
  return err.response?.data?.message || fallback;
}

function formatCurrency(value?: number | string): string {
  if (value === undefined || value === null) return '—';
  const amount = typeof value === 'string' ? Number.parseFloat(value) : value;
  if (Number.isNaN(amount)) return '—';
  return new Intl.NumberFormat('fr-FR').format(Math.round(amount));
}

function flattenPlans(
  plans: {
    individual?: Partial<Record<SubscriptionDuration, SubscriptionPlan>>;
    family?: Partial<Record<SubscriptionDuration, SubscriptionPlan>>;
  } | undefined,
): DisplayPlan[] {
  if (!plans) return [];

  const output: DisplayPlan[] = [];
  (['individual', 'family'] as const).forEach((planType) => {
    const byDuration = plans[planType];
    if (!byDuration) return;

    (['monthly', 'yearly'] as const).forEach((duration) => {
      const plan = byDuration[duration];
      if (!plan?.id) return;
      output.push({ ...plan, planType, duration });
    });
  });

  return output;
}

export function DashboardOffersPage() {
  const { user, familyMembers } = useAuth();
  const currentPlanType: SubscriptionPlanType = user?.planType || 'individual';

  const [plans, setPlans] = useState<DisplayPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [calculatedPrices, setCalculatedPrices] = useState<Record<string, PriceDetails>>({});
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const coveredMembers = useMemo(() => {
    if (currentPlanType !== 'family') return 1;
    const declaredRelatives = user?.familyMemberCount ?? familyMembers.length;
    return Math.max(1, declaredRelatives + 1);
  }, [currentPlanType, user?.familyMemberCount, familyMembers.length]);

  const selectedPlan = useMemo(
    () => plans.find((plan) => plan.id === selectedPlanId) || null,
    [plans, selectedPlanId],
  );

  const selectedPrice = selectedPlan
    ? calculatedPrices[selectedPlan.id] || selectedPlan.priceExample
    : null;

  const canSubscribe = !!selectedPlan
    && user?.registrationStatus === 'approved'
    && selectedPlan.planType === currentPlanType;

  useEffect(() => {
    let isMounted = true;

    const fetchPlans = async () => {
      setLoadingPlans(true);
      setError('');
      try {
        const response = await subscriptionService.getPlans();
        const flattened = flattenPlans(response.data?.plans);

        if (!isMounted) return;
        setPlans(flattened);

        const defaultPlan =
          flattened.find((plan) => plan.planType === currentPlanType && plan.duration === 'yearly')
          || flattened.find((plan) => plan.planType === currentPlanType)
          || flattened[0]
          || null;
        setSelectedPlanId(defaultPlan?.id || null);
      } catch (err: unknown) {
        if (!isMounted) return;
        setError(getErrorMessage(err, 'Impossible de charger les offres pour le moment.'));
      } finally {
        if (isMounted) setLoadingPlans(false);
      }
    };

    void fetchPlans();
    return () => {
      isMounted = false;
    };
  }, [currentPlanType]);

  useEffect(() => {
    const plan = plans.find((item) => item.id === selectedPlanId);
    if (!plan || calculatedPrices[plan.id]) return;

    let isMounted = true;
    const runCalculate = async () => {
      setIsCalculating(true);
      try {
        const memberCount = plan.planType === 'family' ? coveredMembers : 1;
        const response = await subscriptionService.calculatePrice(plan.id, memberCount);
        if (!isMounted) return;
        setCalculatedPrices((prev) => ({
          ...prev,
          [plan.id]: response.data.priceDetails,
        }));
      } catch {
        // Fallback: on conserve le priceExample du backend des plans
      } finally {
        if (isMounted) setIsCalculating(false);
      }
    };

    void runCalculate();
    return () => {
      isMounted = false;
    };
  }, [selectedPlanId, plans, coveredMembers, calculatedPrices]);

  const handleSubscribe = async () => {
    if (!selectedPlan) {
      setError('Sélectionnez une formule pour continuer.');
      return;
    }

    if (user?.registrationStatus !== 'approved') {
      setError('Votre inscription doit être approuvée avant de souscrire à un abonnement.');
      return;
    }

    if (selectedPlan.planType !== currentPlanType) {
      setError('Cette formule ne correspond pas au type de votre compte actuel.');
      return;
    }

    setError('');
    setSuccessMessage('');
    setIsSubscribing(true);

    try {
      const response = await subscriptionService.subscribe(selectedPlan.id);
      const paymentUrl = response.data.payment?.paymentUrl;

      if (paymentUrl) {
        window.location.href = paymentUrl;
        return;
      }

      setSuccessMessage(response.message || 'Paiement initié. Veuillez finaliser votre paiement.');
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Impossible d’initier le paiement. Réessayez dans un instant.'));
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Nos offres</h1>
        <p className="text-sm text-gray-500 mt-1">Choisissez une formule et lancez votre paiement sécurisé.</p>
      </motion.div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <p className="text-sm text-red-700">{error}</p>
        </Card>
      )}

      {successMessage && (
        <Card className="border-emerald-200 bg-emerald-50">
          <p className="text-sm text-emerald-700">{successMessage}</p>
        </Card>
      )}

      {loadingPlans ? (
        <Card>
          <div className="flex items-center justify-center gap-2 py-10 text-gray-500">
            <Loader2 size={18} className="animate-spin" />
            Chargement des offres...
          </div>
        </Card>
      ) : plans.length === 0 ? (
        <Card>
          <p className="text-sm text-gray-500">Aucune offre d'abonnement active n'est disponible pour le moment.</p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {plans.map((plan, i) => {
            const isSelected = selectedPlanId === plan.id;
            const isCurrentType = plan.planType === currentPlanType;
            const price = calculatedPrices[plan.id] || plan.priceExample;
            const features = PLAN_DETAILS[plan.planType].features;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Card
                  hover
                  onClick={() => {
                    setSelectedPlanId(plan.id);
                    setError('');
                    setSuccessMessage('');
                  }}
                  className={`h-full flex flex-col relative ${isSelected ? 'border-2 border-primary shadow-lg shadow-primary/10' : ''}`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2 mt-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <Shield size={18} className="text-primary flex-shrink-0" />
                      <h3 className="text-lg font-bold text-gray-900 truncate">{plan.name}</h3>
                    </div>
                    <Badge variant="neutral" size="sm">{DURATION_LABEL[plan.duration]}</Badge>
                  </div>

                  <p className="text-sm text-gray-500 mb-3">{plan.description}</p>

                  <div className="mb-4">
                    <p className="text-3xl font-bold text-gray-900">
                      {formatCurrency(price?.finalPrice ?? plan.basePrice)}
                      <span className="text-sm font-semibold text-gray-500 ml-1">FCFA</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <CalendarDays size={12} />
                      {DURATION_LABEL[plan.duration]}
                      {plan.planType === 'family' ? ` • ${price?.memberCount ?? coveredMembers} membre(s)` : ''}
                    </p>
                    {price && (
                      <p className="text-xs text-gray-400 mt-1">
                        Sous-total: {formatCurrency(price.subtotal)} • Réduction: {formatCurrency(price.discountAmount)}
                      </p>
                    )}
                  </div>

                  <ul className="space-y-2.5 flex-1">
                    {features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle size={16} className="text-primary flex-shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <Badge variant={isCurrentType ? 'primary' : 'warning'} size="sm">
                      {isCurrentType ? 'Compatible avec votre compte' : 'Type de compte différent'}
                    </Badge>
                    {isSelected && <Badge variant="success" size="sm">Sélectionnée</Badge>}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      <Card className="border-l-4 border-l-info">
        <div className="flex items-start gap-3">
          <Info size={18} className="text-info mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-gray-600 leading-relaxed">
              Le paiement se fait via PayTech. Après validation, votre abonnement est activé automatiquement.
            </p>

            {selectedPlan && (
              <div className="mt-4 p-4 bg-surface-secondary rounded-xl border border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                  <div>
                    <p className="text-xs text-gray-400">Formule sélectionnée</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {selectedPlan.name} • {DURATION_LABEL[selectedPlan.duration]}
                    </p>
                  </div>
                  <p className="text-lg font-bold text-primary">
                    {selectedPrice ? `${formatCurrency(selectedPrice.finalPrice)} FCFA` : `${formatCurrency(selectedPlan.basePrice)} FCFA`}
                  </p>
                </div>

                {isCalculating && (
                  <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                    <Loader2 size={12} className="animate-spin" /> Calcul du prix en cours...
                  </p>
                )}

                {user?.registrationStatus !== 'approved' && (
                  <p className="text-xs text-amber-700 mb-3">
                    Votre dossier doit être approuvé par un administrateur avant de pouvoir payer.
                  </p>
                )}

                {selectedPlan.planType !== currentPlanType && (
                  <p className="text-xs text-amber-700 mb-3">
                    Cette formule ne correspond pas à votre type de compte ({currentPlanType === 'family' ? 'familial' : 'individuel'}).
                  </p>
                )}

                <Button
                  variant="gold"
                  size="sm"
                  onClick={handleSubscribe}
                  disabled={!canSubscribe || isSubscribing || loadingPlans}
                  icon={<CreditCard size={14} />}
                  loading={isSubscribing}
                >
                  Payer maintenant
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
