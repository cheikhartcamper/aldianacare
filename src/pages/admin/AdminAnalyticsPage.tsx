import { motion } from 'framer-motion';
import { BarChart3, Info } from 'lucide-react';
import { Card } from '@/components/ui';

export function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Statistiques détaillées de la plateforme.</p>
      </motion.div>

      <Card>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <BarChart3 size={40} className="text-gray-200 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics — Bientôt disponible</h3>
          <p className="text-sm text-gray-500 max-w-md">
            Les statistiques détaillées (croissance, revenus, rétention, répartition par plan)
            seront disponibles lorsque les modules de paiement et de reporting seront activés côté API.
          </p>
        </div>
      </Card>

      <Card className="border-l-4 border-l-info">
        <div className="flex items-start gap-3">
          <Info size={18} className="text-info mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-600 leading-relaxed">
            Cette page affichera les KPIs clés, les graphiques d'évolution des inscriptions,
            la répartition géographique, les revenus par formule et le taux de rétention.
            Les données seront alimentées par des endpoints dédiés.
          </p>
        </div>
      </Card>
    </div>
  );
}
