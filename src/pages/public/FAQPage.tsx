import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search } from 'lucide-react';
import { Input } from '@/components/ui';

const faqCategories = [
  {
    category: 'Général',
    questions: [
      { q: 'Qu\'est-ce qu\'Aldiana Care ?', a: 'Aldiana Care est une plateforme d\'assurance rapatriement et d\'assistance funéraire 100% digitale, conçue pour la diaspora ouest-africaine vivant à l\'étranger.' },
      { q: 'Qui peut souscrire à Aldiana Care ?', a: 'Toute personne de la diaspora ouest-africaine vivant à l\'étranger peut souscrire. Nos offres sont accessibles aux personnes âgées de 18 à 75 ans.' },
      { q: 'Dans quels pays Aldiana Care est-il disponible ?', a: 'Nous couvrons plus de 25 pays en Europe et en Afrique, incluant la France, la Belgique, l\'Italie, l\'Espagne, l\'Allemagne, le Sénégal, le Mali, la Guinée, la Côte d\'Ivoire, et bien d\'autres.' },
    ],
  },
  {
    category: 'Souscription',
    questions: [
      { q: 'Comment souscrire ?', a: 'La souscription se fait entièrement en ligne en quelques minutes. Choisissez votre formule, remplissez vos informations, payez et signez électroniquement.' },
      { q: 'Quels documents sont nécessaires ?', a: 'Vous aurez besoin d\'une pièce d\'identité valide (passeport ou carte d\'identité) et d\'une photo selfie pour la vérification.' },
      { q: 'Combien de temps prend la souscription ?', a: 'La souscription complète prend environ 5 minutes. Votre contrat est généré immédiatement après la signature.' },
    ],
  },
  {
    category: 'Paiement',
    questions: [
      { q: 'Quels moyens de paiement acceptez-vous ?', a: 'Nous acceptons Wave, Orange Money, MTN Money, les cartes bancaires (Visa, Mastercard) et PayPal.' },
      { q: 'Puis-je payer annuellement ?', a: 'Oui, vous pouvez choisir un paiement mensuel ou annuel. Le paiement annuel offre une réduction de 15%.' },
      { q: 'Que se passe-t-il en cas d\'impayé ?', a: 'En cas d\'impayé, vous recevez un rappel. Après 30 jours, votre contrat est suspendu. Vous pouvez le réactiver en régularisant votre situation.' },
    ],
  },
  {
    category: 'Rapatriement',
    questions: [
      { q: 'Comment fonctionne le rapatriement ?', a: 'En cas de décès, la personne de confiance ou un membre de la famille déclare le décès via la plateforme. Notre équipe prend en charge l\'ensemble du processus de rapatriement.' },
      { q: 'Quel est le délai de rapatriement ?', a: 'Le délai moyen est de 48 à 72 heures après la déclaration et la réception de tous les documents nécessaires.' },
      { q: 'Qui peut déclarer un décès ?', a: 'Seule la personne de confiance désignée ou un membre de la famille peut déclarer un décès via la plateforme.' },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left group"
      >
        <span className="text-sm font-medium text-gray-900 group-hover:text-primary transition-colors pr-4">{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="text-sm text-gray-500 leading-relaxed pb-4">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQPage() {
  const [search, setSearch] = useState('');
  const filteredCategories = faqCategories.map((cat) => ({
    ...cat,
    questions: cat.questions.filter(
      (q) =>
        q.q.toLowerCase().includes(search.toLowerCase()) ||
        q.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((cat) => cat.questions.length > 0);

  return (
    <div>
      <section className="relative bg-primary py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1504600770771-fb03a7cb4483?w=1600&h=600&fit=crop" alt="" className="w-full h-full object-cover opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/80 to-primary" />
        </div>
        <div className="absolute top-10 left-1/2 w-40 h-40 bg-gold/20 rounded-full blur-3xl" />
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 font-serif">Questions <span className="text-gold">fréquentes</span></h1>
            <p className="text-lg text-white/70 mb-8">Trouvez rapidement les réponses à vos questions.</p>
            <div className="max-w-md mx-auto">
              <Input
                placeholder="Rechercher une question..."
                icon={<Search size={18} />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">Aucun résultat pour "{search}"</p>
            </div>
          ) : (
            <div className="space-y-10">
              {filteredCategories.map((cat) => (
                <div key={cat.category}>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">{cat.category}</h2>
                  <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    {cat.questions.map((item) => (
                      <FAQItem key={item.q} q={item.q} a={item.a} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
