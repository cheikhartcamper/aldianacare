import { motion } from 'framer-motion';
import { Gift, Info } from 'lucide-react';
import { Card } from '@/components/ui';

export function AdminCommissionsPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Commissions sponsors</h1>
        <p className="text-sm text-gray-500 mt-1">Suivi des commissions de parrainage.</p>
      </motion.div>

      <Card>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Gift size={40} className="text-gray-200 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Module de parrainage — Bientôt disponible</h3>
          <p className="text-sm text-gray-500 max-w-md">
            Le suivi des commissions de parrainage (sponsors, filleuls, versements) sera disponible
            lorsque le module de parrainage sera activé côté API.
          </p>
        </div>
      </Card>

      <Card className="border-l-4 border-l-info">
        <div className="flex items-start gap-3">
          <Info size={18} className="text-info mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-600 leading-relaxed">
            Le programme de parrainage permettra aux utilisateurs de parrainer de nouveaux adhérents
            et de percevoir des commissions. Cette page affichera l'historique des commissions, les versements
            et les statistiques des sponsors.
          </p>
        </div>
      </Card>
    </div>
  );
}
