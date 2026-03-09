import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield, Heart, FileText, CreditCard, CheckCircle,
  ArrowRight, Clock, Users, Camera, PenTool, UserCheck, Plane
} from 'lucide-react';
import { Button, Card } from '@/components/ui';

const timelineSteps = [
  {
    num: '01',
    icon: Shield,
    badge: 'CHOIX FORMULE',
    title: 'Choisissez votre formule',
    desc: 'Comparez nos offres Individuelle et Familiale et sélectionnez la couverture adaptée à vos besoins. Tarifs en FCFA, transparents et sans frais cachés.',
    side: 'left' as const,
    highlights: ['Individuel : 4 900 FCFA/mois', 'Familial : 9 900 FCFA/mois'],
  },
  {
    num: '02',
    icon: FileText,
    badge: 'DOSSIER EN LIGNE',
    title: 'Remplissez vos informations',
    desc: 'Complétez vos informations personnelles directement en ligne ou depuis votre téléphone. Rapide et sécurisé.',
    side: 'right' as const,
    highlights: ['Identité & coordonnées', 'Personne de confiance'],
  },
  {
    num: '03',
    icon: Camera,
    badge: 'DOCUMENTS & PHOTO',
    title: 'Photo et pièce d\'identité',
    desc: 'Prenez une photo instantanée et téléchargez votre pièce d\'identité (passeport, CNI ou titre de séjour) depuis votre appareil.',
    side: 'left' as const,
    highlights: ['Photo souscripteur', 'Pièce d\'identité valide'],
  },
  {
    num: '04',
    icon: CreditCard,
    badge: 'PAIEMENT SÉCURISÉ',
    title: 'Payez en toute sécurité',
    desc: 'Réglez votre cotisation par le moyen de paiement de votre choix. Mobile Money, carte bancaire ou virement.',
    side: 'right' as const,
    highlights: ['Wave, Orange Money, MTN', 'Carte bancaire, Western Union'],
  },
  {
    num: '05',
    icon: PenTool,
    badge: 'SIGNATURE DIGITALE',
    title: 'Signez votre contrat',
    desc: 'Signez électroniquement en dessinant ou en uploadant votre signature. Votre contrat est généré instantanément.',
    side: 'left' as const,
    highlights: ['Signature en ligne', 'Contrat PDF immédiat'],
  },
  {
    num: '06',
    icon: UserCheck,
    badge: 'ACTIVATION',
    title: 'Contrat activé',
    desc: 'Votre contrat est validé et activé. Vous recevez votre attestation par email et accédez à votre espace personnel.',
    side: 'right' as const,
    highlights: ['Attestation par email', 'Espace personnel actif'],
  },
  {
    num: '07',
    icon: Plane,
    badge: 'ASSISTANCE 24/7',
    title: 'Protection & rapatriement',
    desc: 'En cas de besoin, notre équipe prend en charge le rapatriement du corps et toutes les formalités funéraires avec dignité.',
    side: 'left' as const,
    highlights: ['Rapatriement garanti', 'Assistance funéraire complète'],
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

      {/* Timeline Steps */}
      <section className="py-20 bg-gradient-to-b from-white to-primary-50/30">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
              Étapes de souscription
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 font-serif">
              Un parcours <span className="text-primary">simple</span> et <span className="text-gold-dark">rapide</span>
            </h2>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/60 to-gold hidden md:block" style={{ transform: 'translateX(-50%)' }} />

            {/* Mobile vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/60 to-gold md:hidden" />

            <div className="space-y-8 md:space-y-12">
              {timelineSteps.map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="relative"
                >
                  {/* Desktop layout */}
                  <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] gap-8 items-center">
                    {/* Left content */}
                    <div className={step.side === 'left' ? '' : 'order-1'}>
                      {step.side === 'left' && (
                        <motion.div
                          initial={{ opacity: 0, x: -40 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        >
                          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow relative">
                            {/* Arrow pointing right */}
                            <div className="absolute top-1/2 -right-2 w-4 h-4 bg-white border-r border-b border-gray-100 transform rotate(-45) -translate-y-1/2" />
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center">
                                <step.icon size={22} className="text-primary" />
                              </div>
                              <span className="px-3 py-1 bg-primary text-white text-[10px] font-bold rounded-full tracking-wider">
                                {step.badge}
                              </span>
                            </div>
                            <h3 className="text-base font-bold text-gray-900 mb-2">{step.title}</h3>
                            <p className="text-sm text-gray-500 leading-relaxed mb-3">{step.desc}</p>
                            <div className="flex flex-wrap gap-2">
                              {step.highlights.map((h) => (
                                <span key={h} className="inline-flex items-center gap-1 text-[11px] text-primary font-medium">
                                  <CheckCircle size={12} className="text-gold-dark" /> {h}
                                </span>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* Center circle */}
                    <div className="flex flex-col items-center z-10 order-0 md:order-none">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark border-4 border-white shadow-lg flex items-center justify-center">
                        <span className="text-sm font-bold text-white">{step.num}</span>
                      </div>
                    </div>

                    {/* Right content */}
                    <div className={step.side === 'right' ? '' : 'order-2'}>
                      {step.side === 'right' && (
                        <motion.div
                          initial={{ opacity: 0, x: 40 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        >
                          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow relative">
                            {/* Arrow pointing left */}
                            <div className="absolute top-1/2 -left-2 w-4 h-4 bg-white border-l border-t border-gray-100 transform rotate(-45) -translate-y-1/2" />
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-11 h-11 bg-gold/15 rounded-xl flex items-center justify-center">
                                <step.icon size={22} className="text-gold-dark" />
                              </div>
                              <span className="px-3 py-1 bg-gold text-primary text-[10px] font-bold rounded-full tracking-wider">
                                {step.badge}
                              </span>
                            </div>
                            <h3 className="text-base font-bold text-gray-900 mb-2">{step.title}</h3>
                            <p className="text-sm text-gray-500 leading-relaxed mb-3">{step.desc}</p>
                            <div className="flex flex-wrap gap-2">
                              {step.highlights.map((h) => (
                                <span key={h} className="inline-flex items-center gap-1 text-[11px] text-gold-dark font-medium">
                                  <CheckCircle size={12} className="text-primary" /> {h}
                                </span>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Mobile layout */}
                  <div className="md:hidden flex gap-5">
                    {/* Circle */}
                    <div className="flex flex-col items-center z-10 flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark border-4 border-white shadow-lg flex items-center justify-center">
                        <span className="text-sm font-bold text-white">{step.num}</span>
                      </div>
                    </div>
                    {/* Card */}
                    <div className="flex-1 pb-4">
                      <div className={`bg-white rounded-2xl p-5 shadow-md border border-gray-100 ${i % 2 === 0 ? '' : ''}`}>
                        <div className="flex items-center gap-2.5 mb-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${step.side === 'left' ? 'bg-primary/10' : 'bg-gold/15'}`}>
                            <step.icon size={20} className={step.side === 'left' ? 'text-primary' : 'text-gold-dark'} />
                          </div>
                          <span className={`px-2.5 py-0.5 text-[9px] font-bold rounded-full tracking-wider ${step.side === 'left' ? 'bg-primary text-white' : 'bg-gold text-primary'}`}>
                            {step.badge}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-gray-900 mb-1.5">{step.title}</h3>
                        <p className="text-xs text-gray-500 leading-relaxed mb-2">{step.desc}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {step.highlights.map((h) => (
                            <span key={h} className="inline-flex items-center gap-1 text-[10px] text-primary font-medium">
                              <CheckCircle size={10} className="text-gold-dark" /> {h}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Bottom circle */}
            <div className="hidden md:flex justify-center mt-8">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', damping: 15, delay: 0.3 }}
                className="w-14 h-14 rounded-full bg-gradient-to-br from-gold to-gold-dark border-4 border-white shadow-lg flex items-center justify-center"
              >
                <CheckCircle size={24} className="text-primary" />
              </motion.div>
            </div>
          </div>

          {/* CTA under timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/inscription">
              <Button variant="primary" size="lg" icon={<ArrowRight size={18} />} className="shadow-lg">
                Souscrire maintenant
              </Button>
            </Link>
          </motion.div>
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
