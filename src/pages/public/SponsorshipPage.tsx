import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gift, Users, CreditCard, ArrowRight, Share2, CheckCircle } from 'lucide-react';
import { Button, Card } from '@/components/ui';

export function SponsorshipPage() {
  return (
    <div>
      <section className="relative bg-primary py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1504600770771-fb03a7cb4483?w=1600&h=600&fit=crop" alt="" className="w-full h-full object-cover opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/80 to-primary" />
        </div>
        <div className="absolute top-10 right-20 w-48 h-48 bg-gold/20 rounded-full blur-3xl" />
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-4 py-1.5 bg-gold/20 text-gold text-sm font-medium rounded-full mb-4 border border-gold/30">
              <Gift size={14} className="inline mr-1" /> Programme de parrainage
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 font-serif">
              Parrainez et gagnez des <span className="text-gold">commissions</span>
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
              Recommandez Aldiana Care à vos proches et gagnez une commission sur chaque souscription. C'est gagnant-gagnant.
            </p>
            <Link to="/inscription">
              <Button size="lg" variant="gold" icon={<ArrowRight size={18} />}>
                Devenir sponsor
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Comment fonctionne le parrainage ?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Share2, num: '1', title: 'Partagez votre lien', desc: 'Recevez un lien unique de parrainage à partager avec vos proches.' },
              { icon: Users, num: '2', title: 'Vos filleuls souscrivent', desc: 'Vos proches souscrivent via votre lien et sont protégés.' },
              { icon: CreditCard, num: '3', title: 'Recevez vos commissions', desc: 'Gagnez une commission sur chaque souscription et renouvellement.' },
            ].map((step) => (
              <Card key={step.num} hover className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-gold/10 rounded-xl flex items-center justify-center">
                  <step.icon size={22} className="text-gold-dark" />
                </div>
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gold text-primary text-sm font-bold mb-3">
                  {step.num}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500">{step.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-surface-secondary">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Avantages du programme</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              'Commission de 10€ par souscription',
              'Commission récurrente sur les renouvellements',
              'Dashboard de suivi en temps réel',
              'Paiement automatique chaque mois',
              'Lien de parrainage personnalisé',
              'Aucune limite de filleuls',
              'Support dédié pour les sponsors',
              'Bonus pour les top sponsors',
            ].map((benefit) => (
              <div key={benefit} className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-100">
                <CheckCircle size={18} className="text-gold-dark flex-shrink-0" />
                <span className="text-sm font-medium text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* CTA */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&h=600&fit=crop" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-primary/85" />
        </div>
        <div className="max-w-3xl mx-auto px-4 text-center relative">
          <h2 className="text-3xl font-bold text-white mb-4 font-serif">Rejoignez notre <span className="text-gold">communauté</span> de sponsors</h2>
          <p className="text-white/70 mb-8">Déjà des centaines de sponsors actifs. Partagez la protection avec votre entourage.</p>
          <Link to="/inscription">
            <Button variant="gold" size="lg" icon={<ArrowRight size={18} />}>Devenir sponsor</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
