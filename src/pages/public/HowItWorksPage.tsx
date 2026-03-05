import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Heart, Phone, FileText, CreditCard, CheckCircle, ArrowRight, Clock, Users } from 'lucide-react';
import { Button, Card } from '@/components/ui';

const steps = [
  {
    num: '01',
    icon: Shield,
    title: 'Choisissez votre formule',
    desc: 'Comparez nos offres et sélectionnez la couverture adaptée à vos besoins et votre budget.',
  },
  {
    num: '02',
    icon: FileText,
    title: 'Remplissez votre dossier',
    desc: 'Complétez vos informations personnelles et téléchargez vos documents d\'identité en quelques minutes.',
  },
  {
    num: '03',
    icon: CreditCard,
    title: 'Payez en toute sécurité',
    desc: 'Réglez par Wave, Orange Money, MTN Money, carte bancaire ou PayPal.',
  },
  {
    num: '04',
    icon: CheckCircle,
    title: 'Signez votre contrat',
    desc: 'Signez électroniquement et recevez votre contrat immédiatement par email.',
  },
  {
    num: '05',
    icon: Heart,
    title: 'Votre famille est protégée',
    desc: 'Désignez une personne de confiance et gérez tout depuis votre espace personnel.',
  },
  {
    num: '06',
    icon: Phone,
    title: 'Assistance 24/7',
    desc: 'En cas de besoin, notre équipe gère le rapatriement et toutes les formalités.',
  },
];

export function HowItWorksPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-primary py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1504600770771-fb03a7cb4483?w=1600&h=600&fit=crop"
            alt="Communauté africaine"
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/80 to-primary" />
        </div>
        <div className="absolute top-10 right-20 w-40 h-40 bg-gold/20 rounded-full blur-3xl" />
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-4 py-1.5 bg-gold/20 text-gold text-sm font-medium rounded-full mb-4 border border-gold/30">
              Simple et rapide
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 font-serif">Comment ça <span className="text-gold">marche ?</span></h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Souscrire à Aldiana Care est simple et rapide. Suivez ces étapes et protégez votre famille en quelques minutes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <div className="flex items-center gap-4">
                    <span className="w-10 h-10 rounded-full bg-gold flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">{step.num}</span>
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <step.icon size={26} className="text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{step.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Image + text section */}
      <section className="py-20 bg-surface-secondary">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <span className="inline-block px-4 py-1.5 bg-gold/15 text-gold-dark text-sm font-medium rounded-full mb-4">100% Digital</span>
              <h2 className="text-3xl font-bold text-gray-900 mb-4 font-serif">Tout se fait <span className="text-gold-dark">en ligne</span></h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Pas besoin de vous déplacer. Depuis votre téléphone ou ordinateur, souscrivez, payez et gérez votre contrat. Nous avons simplifié chaque étape pour que vous puissiez protéger votre famille en quelques clics.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle size={16} className="text-gold-dark" />
                  <span className="text-gray-700">Mobile friendly</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle size={16} className="text-gold-dark" />
                  <span className="text-gray-700">Paiement mobile money</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle size={16} className="text-gold-dark" />
                  <span className="text-gray-700">Contrat instantané</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&h=450&fit=crop"
                alt="Femme africaine utilisant son téléphone"
                className="rounded-3xl shadow-lg w-full h-[350px] object-cover"
              />
              <div className="absolute -bottom-4 -left-4 bg-gold rounded-2xl p-4 shadow-lg">
                <p className="text-xl font-bold text-primary">5 min</p>
                <p className="text-xs font-medium text-primary/70">pour souscrire</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Ce qui nous différencie</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Clock, title: 'Souscription en 5 min', desc: 'Processus entièrement digital, pas de paperasse.' },
              { icon: CreditCard, title: 'Paiement flexible', desc: 'Wave, Orange Money, MTN, carte bancaire, PayPal.' },
              { icon: Users, title: 'Support multilingue', desc: 'Assistance en français et langues africaines.' },
              { icon: Shield, title: 'Couverture mondiale', desc: '25+ pays couverts en Afrique et Europe.' },
              { icon: FileText, title: 'Contrat instantané', desc: 'Signature électronique et contrat immédiat.' },
              { icon: Heart, title: 'Accompagnement humain', desc: 'Un gestionnaire dédié pour chaque dossier.' },
            ].map((item) => (
              <Card key={item.title} hover className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-gold/15 rounded-xl flex items-center justify-center">
                  <item.icon size={22} className="text-gold-dark" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&h=600&fit=crop"
            alt="Famille africaine"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/85" />
        </div>
        <div className="max-w-3xl mx-auto px-4 text-center relative">
          <h2 className="text-3xl font-bold text-white mb-6 font-serif">Prêt à protéger votre <span className="text-gold">famille ?</span></h2>
          <p className="text-white/70 mb-8">La souscription ne prend que 5 minutes. Commencez maintenant.</p>
          <Link to="/inscription">
            <Button variant="gold" size="lg" icon={<ArrowRight size={18} />}>
              Souscrire maintenant
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
