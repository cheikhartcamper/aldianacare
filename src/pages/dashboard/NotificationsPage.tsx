import { motion } from 'framer-motion';
import { Bell, Info } from 'lucide-react';
import { Card } from '@/components/ui';

export function NotificationsPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <p className="text-sm text-gray-500 mt-1">Centre de notifications Aldiana Care.</p>
      </motion.div>

      <Card>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Bell size={36} className="text-gray-200 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune notification</h3>
          <p className="text-sm text-gray-500 max-w-sm">
            Les notifications concernant votre compte, vos paiements et vos demandes apparaîtront ici.
          </p>
        </div>
      </Card>

      <Card className="border-l-4 border-l-info">
        <div className="flex items-start gap-3">
          <Info size={18} className="text-info mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-600 leading-relaxed">
            Le système de notifications en temps réel sera disponible dans une prochaine mise à jour.
            En attendant, les informations importantes vous sont envoyées par email.
          </p>
        </div>
      </Card>
    </div>
  );
}
