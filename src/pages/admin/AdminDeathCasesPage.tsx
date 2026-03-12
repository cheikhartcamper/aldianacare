import { motion } from 'framer-motion';
import { AlertTriangle, Info } from 'lucide-react';
import { Card } from '@/components/ui';

export function AdminDeathCasesPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Dossiers décès</h1>
        <p className="text-sm text-gray-500 mt-1">Suivi des dossiers de rapatriement.</p>
      </motion.div>

      <Card>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertTriangle size={40} className="text-gray-200 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Dossiers de rapatriement</h3>
          <p className="text-sm text-gray-500 max-w-md">
            Les dossiers de rapatriement apparaîtront ici lorsqu'une déclaration de décès
            sera soumise et validée via le module de déclaration.
          </p>
        </div>
      </Card>

      <Card className="border-l-4 border-l-info">
        <div className="flex items-start gap-3">
          <Info size={18} className="text-info mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-600 leading-relaxed">
            Le workflow complet (déclaration → validation → ouverture dossier → rapatriement → clôture)
            sera connecté à l'API admin de gestion des déclarations dans une prochaine version.
          </p>
        </div>
      </Card>
    </div>
  );
}
