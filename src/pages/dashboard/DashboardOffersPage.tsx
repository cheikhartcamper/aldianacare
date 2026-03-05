import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Shield } from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui';

const plans = [
  {
    name: 'Basic', price: '9,90', desc: 'Protection essentielle', current: false,
    features: ['Rapatriement du corps', 'Assistance administrative', 'Support téléphonique', 'Couverture Europe'],
  },
  {
    name: 'Premium', price: '19,90', desc: 'La plus populaire', current: true,
    features: ['Tout Basic +', 'Billet d\'avion famille', 'Assistance funéraire complète', 'Couverture Monde entier', 'Gestionnaire dédié'],
  },
  {
    name: 'Family', price: '29,90', desc: 'Toute la famille', current: false,
    features: ['Tout Premium +', 'Jusqu\'à 6 personnes', 'Assurance pathologie', 'Capital décès', 'Priority support'],
  },
  {
    name: 'Pathologie', price: '39,90', desc: 'Avec pathologie existante', current: false,
    features: ['Tout Family +', 'Couverture pathologie', 'Bilan médical inclus', 'Accompagnement spécialisé', 'Sans délai de carence'],
  },
];

export function DashboardOffersPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Nos offres</h1>
        <p className="text-sm text-gray-500 mt-1">Comparez les formules et changez de plan si nécessaire.</p>
      </motion.div>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className={`h-full flex flex-col relative ${plan.current ? 'border-2 border-primary shadow-lg shadow-primary/10' : ''}`}>
              {plan.current && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="primary">Votre formule</Badge>
                </div>
              )}
              <div className="flex items-center gap-2 mb-1">
                <Shield size={16} className="text-primary" />
                <h3 className="font-bold text-gray-900">{plan.name}</h3>
              </div>
              <p className="text-xs text-gray-400 mb-4">{plan.desc}</p>
              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900">{plan.price}€</span>
                <span className="text-gray-400 text-sm">/mois</span>
              </div>
              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-gray-600">
                    <CheckCircle size={14} className="text-primary flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              {plan.current ? (
                <Button variant="secondary" fullWidth disabled>Formule actuelle</Button>
              ) : (
                <Button variant="outline" fullWidth size="sm" icon={<ArrowRight size={14} />}>
                  Changer pour {plan.name}
                </Button>
              )}
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
