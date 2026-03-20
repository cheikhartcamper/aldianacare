import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CreditCard, XCircle } from 'lucide-react';
import { Button, Card } from '@/components/ui';

export function SubscriptionCancelPage() {
  const [searchParams] = useSearchParams();
  const paymentReference = searchParams.get('ref');
  const hasSession = typeof window !== 'undefined' && Boolean(window.localStorage.getItem('aldiana_token'));
  const offersHref = hasSession ? '/app/offres' : '/offres';

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-br from-red-50 via-white to-gold/5">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="max-w-2xl mx-auto border-red-100 shadow-lg shadow-red-100/40">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-red-50 flex items-center justify-center mb-6">
                <XCircle size={40} className="text-red-500" />
              </div>

              <p className="text-xs font-semibold tracking-[0.16em] uppercase text-red-400 mb-2">Paiement annulé</p>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">Le paiement n'a pas été finalisé</h1>
              <p className="text-sm text-gray-600 max-w-xl mx-auto leading-relaxed">
                Aucun abonnement n'a été activé. Vous pouvez reprendre la souscription à tout moment depuis la page des offres.
              </p>

              {paymentReference && (
                <div className="mt-6 p-4 rounded-2xl bg-surface-secondary border border-gray-100">
                  <p className="text-xs text-gray-400 mb-1">Référence de tentative</p>
                  <p className="text-lg font-bold text-gray-900 break-all">{paymentReference}</p>
                </div>
              )}

              <div className="mt-6 p-4 rounded-2xl bg-gold/10 border border-gold/20 text-left">
                <div className="flex items-center gap-2 mb-2 text-gold-dark">
                  <CreditCard size={16} />
                  <span className="text-sm font-semibold">Prochaine étape</span>
                </div>
                <p className="text-sm text-gray-600">
                  Retournez sur les offres, sélectionnez à nouveau le plan souhaité, puis relancez le paiement.
                </p>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <Link to={offersHref}>
                  <Button variant="gold" size="sm">
                    Revenir aux offres
                    <ArrowRight size={16} />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" size="sm">Contacter le support</Button>
                </Link>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}