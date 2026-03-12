import { motion } from 'framer-motion';
import { Gift, Info } from 'lucide-react';
import { Card } from '@/components/ui';

export function SponsorshipDashboard() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Parrainage</h1>
        <p className="text-sm text-gray-500 mt-1">Programme de parrainage Aldiana Care.</p>
      </motion.div>

      <Card>
        <div className="flex gap-4 items-start">
          <div className="w-14 h-14 bg-gold/10 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Gift size={28} className="text-gold-dark" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Module de parrainage — Bientôt disponible</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Le programme de parrainage vous permettra de parrainer vos proches et de gagner
              des commissions. Lien de parrainage, suivi des filleuls et historique des commissions
              seront disponibles dans une prochaine mise à jour.
            </p>
          </div>
        </div>
      </Card>

      <Card className="border-l-4 border-l-info">
        <div className="flex items-start gap-3">
          <Info size={18} className="text-info mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-600 leading-relaxed">
            Pour toute question sur le programme de parrainage, contactez notre équipe support.
          </p>
        </div>
      </Card>
    </div>
  );
}
