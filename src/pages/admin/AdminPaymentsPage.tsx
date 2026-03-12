import { motion } from 'framer-motion';
import { CreditCard, Info } from 'lucide-react';
import { Card } from '@/components/ui';

export function AdminPaymentsPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Suivi des paiements</h1>
        <p className="text-sm text-gray-500 mt-1">Historique et suivi des paiements de la plateforme.</p>
      </motion.div>

      <Card>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <CreditCard size={40} className="text-gray-200 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Module de paiement — Bientôt disponible</h3>
          <p className="text-sm text-gray-500 max-w-md">
            Le suivi des paiements, cotisations et impayés sera disponible lorsque le module
            de paiement en ligne sera activé côté API.
          </p>
        </div>
      </Card>

      <Card className="border-l-4 border-l-info">
        <div className="flex items-start gap-3">
          <Info size={18} className="text-info mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-600 leading-relaxed">
            L'intégration des moyens de paiement (Wave, Orange Money, carte bancaire) est en cours de développement.
            Cette page affichera les transactions, les reçus et les statistiques de revenus.
          </p>
        </div>
      </Card>
    </div>
  );
}
