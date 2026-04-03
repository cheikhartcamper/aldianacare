import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Check, CheckCircle2, CreditCard, Lock, Loader2, Shield, Sparkles, Users, Zap, Globe } from 'lucide-react';
import { Button, Card } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import {
  subscriptionService,
  type PriceDetails,
  type SubscriptionDuration,
  type SubscriptionPlan,
  type SubscriptionPlanType,
} from '@/services/subscription.service';

const PLAN_FEATURES: Record<SubscriptionPlanType, string[]> = {
  individual: [
    'Rapatriement du corps',
    'Assistance administrative complète',
    'Support téléphonique 24/7',
    'Couverture mondiale',
    'Assistance funéraire locale',
  ],
  family: [
    'Rapatriement (souscripteur + famille)',
    'Assistance administrative complète',
    'Support téléphonique 24/7',
    'Couverture mondiale',
    'Billets d\'avion pour 2 membres',
    'Assistance funéraire complète',
    'Gestionnaire de dossier dédié',
  ],
};

interface DisplayPlan extends SubscriptionPlan {
  planType: SubscriptionPlanType;
  duration: SubscriptionDuration;
}

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
  const [selectedDuration, setSelectedDuration] = useState<SubscriptionDuration>('yearly');
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [calculatedPrices, setCalculatedPrices] = useState<Record<string, PriceDetails>>({});
  const [error, setError] = useState('');

  const coveredMembers = useMemo(() => {
    if (currentPlanType !== 'family') return 1;
    const declaredRelatives = user?.familyMemberCount ?? familyMembers.length;
    return Math.max(1, declaredRelatives + 1);
  }, [currentPlanType, user?.familyMemberCount, familyMembers.length]);

  const visiblePlans = useMemo(
    () => plans.filter((p) => p.duration === selectedDuration),
    [plans, selectedDuration],
  );

  const selectedPlan = useMemo(
    () => plans.find((p) => p.id === selectedPlanId) ?? null,
    [plans, selectedPlanId],
  );

  const selectedPrice = selectedPlan
    ? (calculatedPrices[selectedPlan.id] ?? selectedPlan.priceExample)
    : null;

  const canSubscribe =
    !!selectedPlan &&
    user?.registrationStatus === 'approved' &&
    selectedPlan.planType === currentPlanType;

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
          flattened.find((p) => p.planType === currentPlanType && p.duration === 'yearly') ||
          flattened.find((p) => p.planType === currentPlanType) ||
          flattened[0] ||
          null;
        setSelectedPlanId(defaultPlan?.id ?? null);
      } catch (err: unknown) {
        if (!isMounted) return;
        setError(getErrorMessage(err, 'Impossible de charger les offres pour le moment.'));
      } finally {
        if (isMounted) setLoadingPlans(false);
      }
    };
    void fetchPlans();
    return () => { isMounted = false; };
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
        setCalculatedPrices((prev) => ({ ...prev, [plan.id]: response.data.priceDetails }));
      } catch { /* Fallback to priceExample */ } finally {
        if (isMounted) setIsCalculating(false);
      }
    };
    void runCalculate();
    return () => { isMounted = false; };
  }, [selectedPlanId, plans, coveredMembers, calculatedPrices]);

  const handleSubscribe = async () => {
    if (!selectedPlan || !canSubscribe) return;
    setError('');
    setIsSubscribing(true);
    try {
      const response = await subscriptionService.subscribe(selectedPlan.id);
      const paymentUrl = response.data.payment?.paymentUrl;
      if (paymentUrl) { window.location.href = paymentUrl; return; }
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Impossible d\'initier le paiement. Réessayez dans un instant.'));
    } finally {
      setIsSubscribing(false);
    }
  };

  const accountTypeLabel = currentPlanType === 'family' ? 'Familial' : 'Individuel';

  return (
    <div className="space-y-4 pb-28">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold text-gray-900">Nos offres</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Compte <span className="font-medium text-primary">{accountTypeLabel}</span> — choisissez votre formule.
        </p>
      </motion.div>

      {/* Error */}
      {error && (
        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-red-200 bg-red-50 flex items-center gap-3">
            <AlertTriangle size={16} className="text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </Card>
        </motion.div>
      )}

      {/* Duration toggle */}
      {!loadingPlans && plans.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <div className="inline-flex items-center bg-gray-100 rounded-2xl p-1 gap-1">
            {(['monthly', 'yearly'] as SubscriptionDuration[]).map((dur) => (
              <button
                key={dur}
                onClick={() => {
                  setSelectedDuration(dur);
                  const match = plans.find((p) => p.planType === currentPlanType && p.duration === dur);
                  if (match) setSelectedPlanId(match.id);
                }}
                className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  selectedDuration === dur
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {dur === 'monthly' ? 'Mensuel' : 'Annuel'}
                {dur === 'yearly' && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gold/15 text-gold-dark text-xs font-bold">
                    <Sparkles size={10} />
                    −15%
                  </span>
                )}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Plan cards */}
      {loadingPlans ? (
        <div className="grid md:grid-cols-2 gap-4">
          {[0, 1].map((i) => (
            <div key={i} className="h-56 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : plans.length === 0 ? (
        <Card>
          <p className="text-sm text-gray-500 text-center py-4">Aucune offre disponible pour le moment.</p>
        </Card>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedDuration}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="grid md:grid-cols-2 gap-4"
          >
            {visiblePlans.map((plan) => {
              const isSelected = selectedPlanId === plan.id;
              const isCompatible = plan.planType === currentPlanType;
              const price = calculatedPrices[plan.id] ?? plan.priceExample;
              const hasDiscount = plan.duration === 'yearly' && (price?.discountAmount ?? 0) > 0;
              const features = PLAN_FEATURES[plan.planType];
              const PlanIcon = plan.planType === 'family' ? Users : Shield;

              return (
                <motion.div
                  key={plan.id}
                  whileHover={isCompatible ? { y: -2 } : {}}
                  transition={{ duration: 0.15 }}
                >
                  <div
                    onClick={() => { if (isCompatible) { setSelectedPlanId(plan.id); setError(''); } }}
                    className={`relative rounded-2xl border-2 p-4 flex flex-col h-full transition-all duration-200 ${
                      !isCompatible
                        ? 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-200'
                        : isSelected
                        ? 'border-primary bg-white shadow-lg shadow-primary/8 cursor-pointer'
                        : 'border-gray-200 bg-white hover:border-primary/40 cursor-pointer hover:shadow-md'
                    }`}
                  >
                    {/* Lock / checkmark */}
                    {!isCompatible ? (
                      <div className="absolute top-3 right-3">
                        <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center">
                          <Lock size={12} className="text-gray-400" />
                        </div>
                      </div>
                    ) : isSelected ? (
                      <div className="absolute top-3 right-3">
                        <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shadow-sm">
                          <Check size={13} className="text-white" strokeWidth={3} />
                        </div>
                      </div>
                    ) : null}

                    {/* Plan header */}
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isCompatible ? 'bg-primary/10' : 'bg-gray-200'
                      }`}>
                        <PlanIcon size={16} className={isCompatible ? 'text-primary' : 'text-gray-400'} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                          {plan.planType === 'family' ? 'Formule Familiale' : 'Formule Individuelle'}
                        </p>
                        <p className={`text-xs font-semibold ${isCompatible ? 'text-gray-700' : 'text-gray-400'}`}>
                          {isCompatible ? 'Votre type de compte' : 'Type différent'}
                        </p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mb-3">
                      <div className="flex items-end gap-1.5">
                        <span className={`text-2xl font-extrabold tracking-tight ${isCompatible ? 'text-gray-900' : 'text-gray-400'}`}>
                          {formatCurrency(price?.finalPrice ?? plan.basePrice)}
                        </span>
                        <span className={`text-xs font-semibold mb-0.5 ${isCompatible ? 'text-gray-500' : 'text-gray-400'}`}>
                          FCFA
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {selectedDuration === 'monthly' ? 'par mois' : 'par an'}
                        {plan.planType === 'family' && ` · ${price?.memberCount ?? coveredMembers} membre(s)`}
                      </p>
                      {hasDiscount && (
                        <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gold/10 border border-gold/20">
                          <Sparkles size={9} className="text-gold-dark" />
                          <span className="text-[10px] font-bold text-gold-dark">
                            −{formatCurrency(price?.discountAmount)} FCFA
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Features */}
                    <ul className="space-y-1 flex-1">
                      {features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <CheckCircle2
                            size={12}
                            className={`flex-shrink-0 ${isCompatible ? 'text-primary' : 'text-gray-300'}`}
                          />
                          <span className={`text-xs leading-tight ${isCompatible ? 'text-gray-600' : 'text-gray-400'}`}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {!isCompatible && (
                      <p className="mt-2 text-[10px] text-gray-400 text-center">
                        Non disponible ({accountTypeLabel.toLowerCase()})
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Payment CTA */}
      <AnimatePresence>
        {selectedPlan && (
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.25 }}
          >
            {/* ── Mobile sticky bar ── */}
            <div className="fixed bottom-0 left-0 right-0 z-30 md:hidden">
              <div className="bg-white/90 backdrop-blur-md border-t border-gray-200 px-4 py-3 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">Formule sélectionnée</p>
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {selectedPlan.planType === 'family' ? 'Familiale' : 'Individuelle'} · {selectedDuration === 'monthly' ? 'Mensuel' : 'Annuel'}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {isCalculating ? (
                    <Loader2 size={14} className="animate-spin text-primary" />
                  ) : (
                    <p className="text-base font-extrabold text-primary">
                      {selectedPrice ? formatCurrency(selectedPrice.finalPrice) : formatCurrency(selectedPlan.basePrice)}
                      <span className="text-xs font-semibold ml-1 text-gray-500">FCFA</span>
                    </p>
                  )}
                  <Button
                    variant="gold"
                    size="sm"
                    onClick={handleSubscribe}
                    disabled={!canSubscribe || isSubscribing || isCalculating}
                    loading={isSubscribing}
                  >
                    Payer
                  </Button>
                </div>
              </div>
            </div>

            {/* ── Desktop premium CTA card ── */}
            <div className="hidden md:block rounded-2xl overflow-hidden shadow-xl shadow-primary/10 border border-primary/15">

              {/* Header strip — dark brand green */}
              <div className="bg-gradient-to-r from-[#0a4f37] via-[#0d6b49] to-[#0f7a54] px-6 py-5">
                <div className="flex items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center flex-shrink-0">
                      <CreditCard size={22} className="text-white" />
                    </div>
                    <div>
                      <p className="text-white/55 text-[11px] font-semibold uppercase tracking-widest mb-0.5">Votre sélection</p>
                      <p className="text-white font-bold text-lg leading-tight">
                        {selectedPlan.planType === 'family' ? 'Familiale' : 'Individuelle'}
                        <span className="mx-2 text-white/40">·</span>
                        {selectedDuration === 'monthly' ? 'Mensuel' : 'Annuel'}
                      </p>
                      {selectedPrice && (selectedPrice.discountAmount ?? 0) > 0 && (
                        <p className="text-gold text-xs font-semibold mt-1 flex items-center gap-1">
                          <Sparkles size={10} />
                          Vous économisez {formatCurrency(selectedPrice.discountAmount)} FCFA avec ce plan
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="text-white/55 text-[11px] font-semibold uppercase tracking-widest mb-0.5">Total à payer</p>
                    {isCalculating ? (
                      <p className="text-white/60 text-sm flex items-center gap-1.5 justify-end">
                        <Loader2 size={14} className="animate-spin" /> Calcul en cours…
                      </p>
                    ) : (
                      <p className="text-white font-extrabold text-4xl leading-none">
                        {selectedPrice ? formatCurrency(selectedPrice.finalPrice) : formatCurrency(selectedPlan.basePrice)}
                        <span className="text-lg font-semibold ml-1.5 text-white/60">FCFA</span>
                      </p>
                    )}
                    <p className="text-white/40 text-xs mt-1">{selectedDuration === 'monthly' ? 'par mois' : 'par an'}</p>
                  </div>
                </div>
              </div>

              {/* Footer strip — white with trust badges + pay button */}
              <div className="bg-white px-6 py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center flex-shrink-0">
                      <Lock size={11} className="text-emerald-600" />
                    </div>
                    <span className="text-xs text-gray-500 font-medium">PayTech sécurisé</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center flex-shrink-0">
                      <Zap size={11} className="text-blue-500" />
                    </div>
                    <span className="text-xs text-gray-500 font-medium">Activation immédiate</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-primary/8 border border-primary/20 flex items-center justify-center flex-shrink-0">
                      <Globe size={11} className="text-primary" />
                    </div>
                    <span className="text-xs text-gray-500 font-medium">Couverture mondiale</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  {user?.registrationStatus !== 'approved' && (
                    <p className="text-[11px] text-amber-600 font-medium">
                      ⚠️ Dossier en attente d’approbation
                    </p>
                  )}
                  <Button
                    variant="gold"
                    onClick={handleSubscribe}
                    disabled={!canSubscribe || isSubscribing || loadingPlans || isCalculating}
                    loading={isSubscribing}
                    icon={<CreditCard size={15} />}
                  >
                    Payer maintenant
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
