import { motion } from 'framer-motion';
import { CheckCircle, Shield, Info } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';

const PLAN_DETAILS = {
  individual: {
    name: 'Individuel',
    description: 'Protection pour une personne',
    features: [
      'Rapatriement du corps',
      'Assistance administrative complète',
      'Support téléphonique 24/7',
      'Couverture mondiale',
      'Assistance funéraire locale',
    ],
  },
  family: {
    name: 'Familial',
    description: 'Protection pour toute la famille',
    features: [
      'Rapatriement du corps (souscripteur + famille)',
      'Assistance administrative complète',
      'Support téléphonique 24/7',
      'Couverture mondiale',
      'Billet d\'avion pour 2 membres de la famille',
      'Assistance funéraire complète',
      'Gestionnaire de dossier dédié',
    ],
  },
};

export function DashboardOffersPage() {
  const { user } = useAuth();
  const currentPlan = user?.planType || 'individual';

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Nos offres</h1>
        <p className="text-sm text-gray-500 mt-1">Découvrez les formules Aldiana Care.</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {(Object.entries(PLAN_DETAILS) as [keyof typeof PLAN_DETAILS, typeof PLAN_DETAILS[keyof typeof PLAN_DETAILS]][]).map(([key, plan], i) => {
          const isCurrent = key === currentPlan;
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className={`h-full flex flex-col relative ${isCurrent ? 'border-2 border-primary shadow-lg shadow-primary/10' : ''}`}>
                {isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="primary">Votre formule</Badge>
                  </div>
                )}
                <div className="flex items-center gap-2 mb-1 mt-2">
                  <Shield size={18} className="text-primary" />
                  <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                </div>
                <p className="text-sm text-gray-500 mb-5">{plan.description}</p>
                <ul className="space-y-2.5 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle size={16} className="text-primary flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                {isCurrent && (
                  <div className="mt-5 p-3 bg-primary/5 rounded-xl text-center">
                    <p className="text-sm font-medium text-primary">Vous êtes sur cette formule</p>
                  </div>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Card className="border-l-4 border-l-info">
        <div className="flex items-start gap-3">
          <Info size={18} className="text-info mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-600 leading-relaxed">
            Pour changer de formule, contactez notre équipe support. Le changement de plan sera
            effectué après vérification de votre dossier.
          </p>
        </div>
      </Card>
    </div>
  );
}
