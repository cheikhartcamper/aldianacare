import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, X, ArrowRight } from 'lucide-react';
import { Button, Card } from '@/components/ui';

const plans = [
  {
    name: 'Individuel',
    price: '4 900',
    period: '/mois',
    desc: 'Protection essentielle pour une personne',
    color: 'border-gray-200',
    features: [
      { name: 'Rapatriement du corps', included: true },
      { name: 'Assistance administrative', included: true },
      { name: 'Support téléphonique', included: true },
      { name: 'Couverture Europe & Afrique', included: true },
      { name: 'Assistance funéraire', included: true },
      { name: 'Jusqu\'à 6 personnes couvertes', included: false },
      { name: 'Billet d\'avion famille', included: false },
      { name: 'Capital décès', included: false },
      { name: 'Gestionnaire dédié', included: false },
      { name: 'Priority support 24/7', included: false },
    ],
    popular: false,
  },
  {
    name: 'Familial',
    price: '9 900',
    period: '/mois',
    desc: 'Toute la famille protégée',
    color: 'border-primary',
    features: [
      { name: 'Rapatriement du corps', included: true },
      { name: 'Assistance administrative', included: true },
      { name: 'Support téléphonique', included: true },
      { name: 'Couverture Europe & Afrique', included: true },
      { name: 'Assistance funéraire', included: true },
      { name: 'Jusqu\'à 6 personnes couvertes', included: true },
      { name: 'Billet d\'avion famille', included: true },
      { name: 'Capital décès', included: true },
      { name: 'Gestionnaire dédié', included: true },
      { name: 'Priority support 24/7', included: true },
    ],
    popular: true,
  },
];

export function OffersPage() {
  return (
    <div>
      <section className="relative bg-primary py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&h=600&fit=crop" alt="" className="w-full h-full object-cover opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/80 to-primary" />
        </div>
        <div className="absolute top-10 left-20 w-40 h-40 bg-gold/20 rounded-full blur-3xl" />
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-4 py-1.5 bg-gold/20 text-gold text-sm font-medium rounded-full mb-4 border border-gold/30">
              Nos formules
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 font-serif">
              Des offres claires et <span className="text-gold">transparentes</span>
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Choisissez la couverture adaptée à vos besoins. Pas de frais cachés, pas de surprise.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Card className={`relative h-full flex flex-col border-2 ${plan.popular ? 'border-gold shadow-lg shadow-gold/20' : plan.color}`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-gold text-primary text-xs font-bold px-4 py-1 rounded-full">
                        Plus populaire
                      </span>
                    </div>
                  )}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                    <p className="text-sm text-gray-400 mt-1">{plan.desc}</p>
                  </div>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-primary">{plan.price}</span>
                    <span className="text-lg font-semibold text-gray-500 ml-1">FCFA</span>
                    <span className="text-gray-400 text-sm">{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((f) => (
                      <li key={f.name} className="flex items-start gap-2 text-sm">
                        {f.included ? (
                          <CheckCircle size={16} className="text-gold-dark flex-shrink-0 mt-0.5" />
                        ) : (
                          <X size={16} className="text-gray-300 flex-shrink-0 mt-0.5" />
                        )}
                        <span className={f.included ? 'text-gray-700' : 'text-gray-400'}>{f.name}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/inscription">
                    <Button variant={plan.popular ? 'gold' : 'outline'} fullWidth icon={<ArrowRight size={16} />}>
                      Choisir {plan.name}
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 bg-surface-secondary">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Comparaison détaillée</h2>
          <Card padding="none" className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left p-4 font-medium text-gray-500">Fonctionnalité</th>
                  {plans.map((p) => (
                    <th key={p.name} className="p-4 font-semibold text-gray-900 text-center">{p.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {plans[0].features.map((feature) => (
                  <tr key={feature.name} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="p-4 text-gray-700">{feature.name}</td>
                    {plans.map((plan) => {
                      const f = plan.features.find((pf) => pf.name === feature.name);
                      return (
                        <td key={plan.name} className="p-4 text-center">
                          {f?.included ? (
                            <CheckCircle size={18} className="text-primary mx-auto" />
                          ) : (
                            <X size={18} className="text-gray-300 mx-auto" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                <tr className="border-b border-gray-50">
                  <td className="p-4 font-semibold text-gray-900">Prix mensuel</td>
                  {plans.map((p) => (
                    <td key={p.name} className="p-4 text-center font-bold text-primary">{p.price} FCFA</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </Card>
        </div>
      </section>
      {/* CTA */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1543269865-cbf427effbad?w=1600&h=600&fit=crop" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-primary/85" />
        </div>
        <div className="max-w-3xl mx-auto px-4 text-center relative">
          <h2 className="text-3xl font-bold text-white mb-4 font-serif">Besoin d'aide pour <span className="text-gold">choisir ?</span></h2>
          <p className="text-white/70 mb-8">Notre équipe est disponible pour vous conseiller la formule la mieux adaptée à votre situation.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/inscription">
              <Button variant="gold" size="lg" icon={<ArrowRight size={18} />}>Souscrire maintenant</Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 hover:text-white">Nous contacter</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
