import { useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Clock, CreditCard } from 'lucide-react';
import { Button, Card } from '@/components/ui';

export function SubscriptionSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paymentReference = searchParams.get('ref');
  const hasSession = typeof window !== 'undefined' && Boolean(window.localStorage.getItem('aldiana_token'));
  const primaryHref = hasSession ? '/app/paiements' : '/connexion';
  const primaryLabel = hasSession ? 'Voir mes paiements' : 'Se connecter';
  const offersHref = hasSession ? '/app/offres' : '/offres';

  useEffect(() => {
    if (!hasSession) return;
    const timeout = window.setTimeout(() => {
      navigate('/app/paiements', { replace: true });
    }, 1800);
    return () => {
      window.clearTimeout(timeout);
    };
  }, [hasSession, navigate]);

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-br from-primary-50 via-white to-gold/5">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="max-w-2xl mx-auto border-primary/10 shadow-lg shadow-primary/5">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <CheckCircle2 size={40} className="text-primary" />
              </div>

              <p className="text-xs font-semibold tracking-[0.16em] uppercase text-primary/60 mb-2">Paiement redirigé</p>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">Retour PayTech reçu</h1>
              <p className="text-sm text-gray-600 max-w-xl mx-auto leading-relaxed">
                Votre paiement a bien renvoyé vers Aldiana Care. L'activation finale de l'abonnement dépend de la confirmation automatique PayTech envoyée au webhook.
              </p>
              {hasSession && (
                <p className="text-xs text-primary mt-2">Redirection automatique vers l'historique des paiements...</p>
              )}

              {paymentReference && (
                <div className="mt-6 p-4 rounded-2xl bg-surface-secondary border border-gray-100">
                  <p className="text-xs text-gray-400 mb-1">Référence de paiement</p>
                  <p className="text-lg font-bold text-primary break-all">{paymentReference}</p>
                </div>
              )}

              <div className="mt-6 grid sm:grid-cols-2 gap-3 text-left">
                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                  <div className="flex items-center gap-2 mb-2 text-primary">
                    <Clock size={16} />
                    <span className="text-sm font-semibold">Activation</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Si votre abonnement n'apparaît pas immédiatement, attendez quelques secondes puis actualisez la page paiements.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-gold/10 border border-gold/20">
                  <div className="flex items-center gap-2 mb-2 text-gold-dark">
                    <CreditCard size={16} />
                    <span className="text-sm font-semibold">Statut attendu</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Après confirmation du webhook, le statut passera à actif et le paiement à complété.
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <Link to={primaryHref}>
                  <Button variant="gold" size="sm">
                    {primaryLabel}
                    <ArrowRight size={16} />
                  </Button>
                </Link>
                <Link to={offersHref}>
                  <Button variant="outline" size="sm">Retour aux offres</Button>
                </Link>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}