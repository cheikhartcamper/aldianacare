import { motion } from 'framer-motion';
import { FileText, Info } from 'lucide-react';
import { Card } from '@/components/ui';

export function AdminContractsPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Gestion des contrats</h1>
        <p className="text-sm text-gray-500 mt-1">Suivi et gestion des contrats d'assurance.</p>
      </motion.div>

      <Card>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FileText size={40} className="text-gray-200 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Module de gestion des contrats</h3>
          <p className="text-sm text-gray-500 max-w-md">
            La gestion des contrats sera disponible lorsque le module de paiement et de génération
            de contrats sera activé côté API.
          </p>
        </div>
      </Card>

      <Card className="border-l-4 border-l-info">
        <div className="flex items-start gap-3">
          <Info size={18} className="text-info mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-600 leading-relaxed">
            Les contrats sont actuellement générés implicitement lors de l'approbation d'une inscription.
            Un module dédié avec numérotation, export PDF et suivi sera ajouté dans une prochaine version.
          </p>
        </div>
      </Card>
    </div>
  );
}
