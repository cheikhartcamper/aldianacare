import { useEffect, useState, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Clock, ArrowRight, RotateCcw, CreditCard, Home } from 'lucide-react';
import { Button, Card } from '@/components/ui';
import { Logo } from '@/components/ui';
import { subscriptionService, type PaymentStatusResponse } from '@/services/subscription.service';

type PageState = 'loading' | 'completed' | 'failed' | 'pending' | 'error';

const MAX_POLLS = 10;
const POLL_INTERVAL_MS = 3000;

export function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('ref');

  const [pageState, setPageState] = useState<PageState>('loading');
  const [paymentData, setPaymentData] = useState<PaymentStatusResponse | null>(null);
  const [pollCount, setPollCount] = useState(0);
  const pollRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasSession = typeof window !== 'undefined' && Boolean(window.localStorage.getItem('aldiana_token'));

  const checkStatus = async () => {
    if (!reference) { setPageState('error'); return; }
    try {
      const res = await subscriptionService.getPaymentStatus(reference);
      if (res.success && res.data) {
        setPaymentData(res.data);
        if (res.data.status === 'completed') { setPageState('completed'); return; }
        if (res.data.status === 'failed') { setPageState('failed'); return; }
        setPageState('pending');
      } else {
        setPageState('error');
      }
    } catch {
      setPageState('error');
    }
  };

  useEffect(() => {
    if (!reference) { setPageState('error'); return; }
    void checkStatus();
  }, [reference]);

  useEffect(() => {
    if (pageState !== 'pending') return;
    if (pollCount >= MAX_POLLS) return;
    pollRef.current = setTimeout(() => {
      setPollCount(c => c + 1);
      void checkStatus();
    }, POLL_INTERVAL_MS);
    return () => { if (pollRef.current) clearTimeout(pollRef.current); };
  }, [pageState, pollCount]);

  const dashboardHref = hasSession ? '/app/paiements' : '/connexion';

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-gold/5 flex flex-col">
      <header className="px-6 py-4 flex items-center justify-between max-w-5xl mx-auto w-full">
        <Logo />
        <Link to="/">
          <Button variant="ghost" size="sm">
            <Home size={16} />
            Accueil
          </Button>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg"
        >
          <Card className="border-primary/10 shadow-xl shadow-primary/5">
            <div className="text-center">

              {/* Loading */}
              {pageState === 'loading' && (
                <>
                  <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                    >
                      <RotateCcw size={36} className="text-primary" />
                    </motion.div>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Vérification en cours…</h1>
                  <p className="text-sm text-gray-500">Nous vérifions le statut de votre paiement.</p>
                </>
              )}

              {/* Pending */}
              {pageState === 'pending' && (
                <>
                  <div className="w-20 h-20 mx-auto rounded-full bg-gold/10 flex items-center justify-center mb-6">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Clock size={40} className="text-gold-dark" />
                    </motion.div>
                  </div>
                  <p className="text-xs font-semibold tracking-[0.16em] uppercase text-gold-dark/70 mb-2">En attente</p>
                  <h1 className="text-2xl font-bold text-gray-900 mb-3">Confirmation en attente</h1>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Votre paiement a bien été reçu. Nous attendons la confirmation automatique de PayTech.
                    {pollCount < MAX_POLLS && ' Vérification automatique en cours…'}
                  </p>
                  {pollCount >= MAX_POLLS && (
                    <p className="text-xs text-gray-400 mt-2">La confirmation peut prendre quelques minutes. Consultez votre espace paiements.</p>
                  )}
                </>
              )}

              {/* Success */}
              {pageState === 'completed' && (
                <>
                  <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <CheckCircle2 size={40} className="text-primary" />
                  </div>
                  <p className="text-xs font-semibold tracking-[0.16em] uppercase text-primary/60 mb-2">Paiement confirmé</p>
                  <h1 className="text-2xl font-bold text-gray-900 mb-3">Paiement réussi !</h1>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Votre paiement a été confirmé avec succès. Votre abonnement est maintenant actif.
                  </p>
                </>
              )}

              {/* Failed */}
              {pageState === 'failed' && (
                <>
                  <div className="w-20 h-20 mx-auto rounded-full bg-red-50 flex items-center justify-center mb-6">
                    <XCircle size={40} className="text-red-500" />
                  </div>
                  <p className="text-xs font-semibold tracking-[0.16em] uppercase text-red-500/70 mb-2">Paiement échoué</p>
                  <h1 className="text-2xl font-bold text-gray-900 mb-3">Le paiement a échoué</h1>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Votre paiement n'a pas pu être traité. Veuillez réessayer ou contacter le support.
                  </p>
                </>
              )}

              {/* Error (no reference) */}
              {pageState === 'error' && (
                <>
                  <div className="w-20 h-20 mx-auto rounded-full bg-red-50 flex items-center justify-center mb-6">
                    <XCircle size={40} className="text-red-500" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-3">Référence introuvable</h1>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Impossible de vérifier ce paiement. La référence est manquante ou invalide.
                  </p>
                </>
              )}

              {/* Reference display */}
              {reference && (
                <div className="mt-6 p-4 rounded-2xl bg-surface-secondary border border-gray-100">
                  <div className="flex items-center gap-2 justify-center mb-1">
                    <CreditCard size={14} className="text-gray-400" />
                    <p className="text-xs text-gray-400">Référence de paiement</p>
                  </div>
                  <p className="text-base font-bold text-primary break-all">{reference}</p>
                  {paymentData?.amount && (
                    <p className="text-sm text-gray-500 mt-1">
                      Montant : <span className="font-semibold text-gray-700">{paymentData.amount.toLocaleString('fr-FR')} FCFA</span>
                    </p>
                  )}
                  {paymentData?.paidAt && (
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(paymentData.paidAt).toLocaleDateString('fr-FR', { dateStyle: 'long' })}
                    </p>
                  )}
                </div>
              )}

              {/* CTA buttons */}
              {(pageState === 'completed' || pageState === 'pending' || pageState === 'failed' || pageState === 'error') && (
                <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                  <Link to={dashboardHref}>
                    <Button variant="gold" size="sm">
                      {hasSession ? 'Voir mes paiements' : 'Se connecter'}
                      <ArrowRight size={16} />
                    </Button>
                  </Link>
                  <Link to="/">
                    <Button variant="outline" size="sm">Retour à l'accueil</Button>
                  </Link>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
