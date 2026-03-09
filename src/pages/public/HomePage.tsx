import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import {
  Shield, Star, CheckCircle,
  Globe, ArrowRight, Zap, HeadphonesIcon,
  MapPin, Camera
} from 'lucide-react';
import { Button, Card } from '@/components/ui';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' as const },
  }),
};

const howSteps: { num: string; badge: string; desc: string; side: 'left' | 'right'; illustration: 'form' | 'doc' | 'chat' | 'check' | 'app' }[] = [
  { num: '01', badge: 'SOUSCRIPTION', desc: 'Renseignez les informations de votre bénéficiaire en ligne ou par téléphone.', side: 'left', illustration: 'form' },
  { num: '02', badge: 'VALIDATION DOCUMENTS', desc: 'Vous recevez alors par email un lien pour uploader vos documents à valider.', side: 'right', illustration: 'doc' },
  { num: '03', badge: 'PAIEMENT SÉCURISÉ', desc: 'Votre bénéficiaire est contacté pour choisir son mode de paiement sécurisé.', side: 'left', illustration: 'chat' },
  { num: '04', badge: 'SIGNATURE CONTRAT', desc: 'En cas de validation par notre équipe, votre contrat est généré et envoyé.', side: 'right', illustration: 'check' },
  { num: '05', badge: 'SUIVI CONTRAT', desc: 'Vous suivez les informations du bénéficiaire et de votre abonnement sur notre application.', side: 'left', illustration: 'app' },
];

const coverageRegions = [
  { region: 'Europe', countries: 'France, Belgique, Italie, Espagne, Allemagne, Suisse...', flag: '🇪🇺', count: '15+ pays' },
  { region: 'Amérique du Nord', countries: 'États-Unis, Canada', flag: '🌎', count: '2 pays' },
  { region: 'Maghreb', countries: 'Maroc, Tunisie, Algérie', flag: '🌍', count: '3 pays' },
  { region: 'Moyen-Orient', countries: 'Émirats Arabes Unis, Arabie Saoudite, Qatar', flag: '🌏', count: '3+ pays' },
  { region: 'Afrique de l\'Ouest', countries: 'Sénégal, Mali, Guinée, Côte d\'Ivoire, Mauritanie, Togo, Burkina Faso...', flag: '🌍', count: '10+ pays' },
];

const stats = [
  { value: '15 000+', label: 'Familles protégées' },
  { value: '25+', label: 'Pays couverts' },
  { value: '48h', label: 'Délai moyen rapatriement' },
  { value: '24/7', label: 'Assistance disponible' },
];

const plans = [
  {
    name: 'Individuelle',
    price: '15',
    priceAnnual: '140',
    period: '/mois',
    desc: 'Adulte en bonne santé',
    features: ['Rapatriement du corps', 'Assistance administrative', 'Support téléphonique', 'Couverture Europe & Afrique', 'Assistance funéraire'],
    popular: false,
  },
  {
    name: 'Pathologie',
    price: '30',
    priceAnnual: '280',
    period: '/mois',
    desc: 'Maladies chroniques',
    features: ['Tout Individuelle +', 'Couverture pathologies', 'Suivi médical', 'Assistance spécialisée'],
    popular: false,
  },
  {
    name: 'Aldiana Family',
    price: '50',
    priceAnnual: '450',
    period: '/mois',
    desc: 'Père, mère + 3 enfants max (jusqu\'à 5 pers.)',
    features: ['Tout Individuelle +', 'Jusqu\'à 5 personnes couvertes', 'Billet d\'avion famille', 'Capital décès', 'Gestionnaire dédié', 'Priority support 24/7'],
    popular: true,
  },
  {
    name: 'Option Indemnité de Risque',
    price: '+25',
    priceAnnual: '+250',
    period: '/mois',
    desc: 'Pandémie, guerre, nucléaire',
    features: ['En complément des formules', 'Couverture pandémie', 'Couverture guerre', 'Risque nucléaire'],
    popular: false,
    isOption: true,
  },
];

const testimonials = [
  {
    name: 'Fatou Diop',
    location: 'Paris, France',
    text: 'Aldiana Care nous a accompagnés dans un moment très difficile. Le rapatriement a été géré avec dignité et professionnalisme.',
    rating: 5,
    avatar: '/testimonial1.png',
  },
  {
    name: 'Moussa Konaté',
    location: 'Bruxelles, Belgique',
    text: 'La souscription était simple et rapide. Je suis rassuré de savoir que ma famille est protégée.',
    rating: 5,
    avatar: '/testimonial2.png',
  },
  {
    name: 'Assane Camara',
    location: 'Rome, Italie',
    text: 'Un service exceptionnel. L\'équipe est disponible 24h/24 et parle nos langues. Merci Aldiana Care.',
    rating: 5,
    avatar: '/testimonial3.png',
  },
];

export function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-gold/10">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gold/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 pt-20 pb-24 lg:pt-28 lg:pb-32 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Zap size={14} />
                Assurance 100% digitale
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                <span className="font-serif">Votre famille protégée,</span>
                <br />
                <span className="text-primary">où que vous soyez.</span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed mb-4 max-w-lg">
                Aldiana Care est une solution digitale d'assurance rapatriement de corps destinée en priorité aux ressortissants d'Afrique de l'Ouest vivant à l'étranger (Europe, Amérique du Nord, Maghreb, Moyen-Orient).
              </p>
              <p className="text-sm text-gray-500 leading-relaxed mb-8 max-w-lg flex items-center gap-2 flex-wrap">
                <MapPin size={14} className="text-primary" />
                <span>Europe • Amérique du Nord • Maghreb • Moyen-Orient</span>
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/inscription">
                  <Button size="lg" variant="primary" className="group shadow-lg hover:shadow-xl transition-all">
                    Souscrire maintenant
                    <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/comment-ca-marche">
                  <Button size="lg" variant="outline" className="hover:border-primary hover:text-primary transition-all">
                    Comment ça marche
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-6 mt-10">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 + i * 0.1, duration: 0.3 }}
                      className="w-8 h-8 rounded-full bg-primary/20 border-2 border-white flex items-center justify-center text-[10px] font-bold text-primary"
                    >
                      {String.fromCharCode(64 + i)}
                    </motion.div>
                  ))}
                </div>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                >
                  <div className="flex items-center gap-1 mb-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} size={12} className="text-gold fill-gold" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">Noté 4.9/5 par +2000 familles</p>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative">
                <div
                  className="w-full rounded-3xl overflow-hidden shadow-2xl"
                  style={{ border: '3px solid #F2C94C' }}
                >
                  {/* Image */}
                  <img
                    src="/care2.png"
                    alt="Famille protégée"
                    className="w-full h-[480px] object-cover object-top"
                  />
                  
                  {/* Text section - solid green below image */}
                  <div className="bg-gradient-to-br from-primary to-primary-dark py-3 px-6 text-center text-white">
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <Shield size={22} className="text-gold" />
                      <h3 className="text-xl font-bold">Protection Mondiale</h3>
                    </div>
                    <p className="text-white/70 text-sm">Diaspora d'Afrique de l'Ouest couverte dans 25+ pays</p>
                  </div>
                </div>

                {/* Floating cards */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                  className="absolute -right-4 top-8 bg-white rounded-xl shadow-lg p-4 border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                      <CheckCircle size={20} className="text-success" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-900">Contrat activé</p>
                      <p className="text-[10px] text-gray-400">Il y a 2 minutes</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                  className="absolute -left-4 bottom-12 bg-white rounded-xl shadow-lg p-4 border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center">
                      <Shield size={20} className="text-gold-dark" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-900">Famille protégée</p>
                      <p className="text-[10px] text-gray-400">4 personnes couvertes</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeUp}
                className="text-center group"
              >
                <motion.p
                  className="text-3xl lg:text-4xl font-bold mb-1"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {stat.value}
                </motion.p>
                <p className="text-sm text-white/70">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900">Comment ça marche ?</h2>
          </motion.div>

          {/* Desktop Timeline */}
          <div className="hidden md:block relative" style={{ paddingTop: 8, paddingBottom: 8 }}>
            {/* Center vertical line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-[3px] -translate-x-1/2 bg-primary" />
            {/* Top dot */}
            <div className="absolute left-1/2 -top-1 -translate-x-1/2 w-3 h-3 rounded-full bg-primary" />
            {/* Bottom dot */}
            <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-3 h-3 rounded-full bg-primary" />

            {howSteps.map((step, i) => (
              <div key={step.num} className="relative grid grid-cols-[1fr_64px_1fr] items-start" style={{ marginBottom: i < howSteps.length - 1 ? 24 : 0 }}>

                {/* LEFT */}
                <div className="flex justify-end">
                  {step.side === 'left' ? (
                    <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }} className="bg-primary-50/50 rounded-2xl p-5 max-w-lg w-full mr-6">
                      {/* Illustration */}
                      <div className="flex items-start gap-2 mb-3">
                        {step.illustration === 'form' && (
                          <>
                            <div className="bg-white rounded-md shadow-sm border border-gray-200 p-2 w-16 flex-shrink-0">
                              <div className="text-[6px] font-bold text-primary mb-1">Devis</div>
                              <div className="space-y-1">
                                <div className="h-0.5 bg-primary/30 rounded w-full" />
                                <div className="h-0.5 bg-primary/20 rounded w-4/5" />
                                <div className="h-0.5 bg-primary/15 rounded w-3/5" />
                              </div>
                              <div className="mt-1.5 h-2.5 bg-primary/10 rounded w-full" />
                            </div>
                            <div className="bg-white rounded-md shadow-sm border border-gray-200 p-1.5 w-10 flex-shrink-0 -ml-3 mt-1 rotate-2">
                              <div className="space-y-0.5">
                                <div className="h-0.5 bg-gray-200 rounded w-full" />
                                <div className="h-0.5 bg-gray-200 rounded w-3/4" />
                                <div className="h-0.5 bg-gray-200 rounded w-1/2" />
                              </div>
                            </div>
                          </>
                        )}
                        {step.illustration === 'chat' && (
                          <div className="relative">
                            <div className="bg-white rounded-md shadow-sm border border-gray-200 p-2 w-20">
                              <div className="flex items-center gap-1 mb-1">
                                <div className="w-2 h-2 rounded-full bg-primary/30" />
                                <div className="h-0.5 bg-gray-200 rounded flex-1" />
                              </div>
                              <div className="flex items-center gap-1 mb-0.5">
                                <CheckCircle size={8} className="text-primary flex-shrink-0" />
                                <div className="h-0.5 bg-primary/15 rounded flex-1" />
                              </div>
                              <div className="flex items-center gap-1">
                                <CheckCircle size={8} className="text-primary flex-shrink-0" />
                                <div className="h-0.5 bg-primary/15 rounded flex-1" />
                              </div>
                            </div>
                            <div className="absolute -top-1.5 -right-1.5 bg-gold rounded-full w-4 h-4 flex items-center justify-center shadow-sm">
                              <span className="text-[6px] text-white font-bold">...</span>
                            </div>
                          </div>
                        )}
                        {step.illustration === 'app' && (
                          <div className="bg-white rounded-md shadow-sm border border-gray-200 p-2 w-20">
                            <div className="text-[6px] font-bold text-primary mb-1">Bonjour !</div>
                            <div className="space-y-1">
                              <div className="h-2 bg-primary/10 rounded w-full" />
                              <div className="h-2 bg-gold/15 rounded w-full" />
                            </div>
                            <div className="mt-1 flex gap-0.5">
                              <div className="w-2 h-2 rounded-full bg-primary/20" />
                              <div className="w-2 h-2 rounded-full bg-gold/20" />
                              <div className="w-2 h-2 rounded-full bg-primary/20" />
                            </div>
                          </div>
                        )}
                      </div>
                      <span className="inline-block px-3 py-1 bg-primary-dark text-white text-[10px] font-bold rounded-full tracking-wide mb-2">
                        {step.badge}
                      </span>
                      <p className="text-sm text-gray-700 leading-relaxed"><span className="font-bold">{step.desc.split(' ').slice(0, 3).join(' ')}</span> {step.desc.split(' ').slice(3).join(' ')}</p>
                    </motion.div>
                  ) : <div />}
                </div>

                {/* CENTER CIRCLE */}
                <div className="flex justify-center z-10">
                  <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ type: 'spring', damping: 12, delay: 0.05 }} className="relative">
                    <div className="w-11 h-11 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shadow-lg border-[3px] border-white">
                      {step.num}
                    </div>
                    {/* Arrow */}
                    {step.side === 'left' && (
                      <svg className="absolute top-1/2 -left-3 -translate-y-1/2 text-primary" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8 1L3 6L8 11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    )}
                    {step.side === 'right' && (
                      <svg className="absolute top-1/2 -right-3 -translate-y-1/2 text-primary" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4 1L9 6L4 11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    )}
                  </motion.div>
                </div>

                {/* RIGHT */}
                <div className="flex justify-start">
                  {step.side === 'right' ? (
                    <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }} className="bg-primary-50/50 rounded-2xl p-5 max-w-lg w-full ml-6">
                      {/* Illustration */}
                      <div className="flex items-start gap-2 mb-3">
                        {step.illustration === 'doc' && (
                          <div className="bg-white rounded-md shadow-sm border border-gray-200 p-2 w-16 flex-shrink-0">
                            <div className="text-[6px] font-bold text-gray-400 mb-1">Devis</div>
                            <div className="space-y-0.5 mb-1.5">
                              <div className="h-0.5 bg-gray-200 rounded w-full" />
                              <div className="h-0.5 bg-gray-200 rounded w-3/4" />
                            </div>
                            <div className="flex justify-end">
                              <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                                <CheckCircle size={8} className="text-white" />
                              </div>
                            </div>
                          </div>
                        )}
                        {step.illustration === 'check' && (
                          <div className="bg-white rounded-md shadow-sm border border-gray-200 p-2 w-16 flex-shrink-0">
                            <div className="space-y-1 mb-1.5">
                              <div className="flex items-center gap-1">
                                <CheckCircle size={7} className="text-primary flex-shrink-0" />
                                <div className="h-0.5 bg-primary/15 rounded flex-1" />
                              </div>
                              <div className="flex items-center gap-1">
                                <CheckCircle size={7} className="text-primary flex-shrink-0" />
                                <div className="h-0.5 bg-primary/15 rounded flex-1" />
                              </div>
                              <div className="flex items-center gap-1">
                                <CheckCircle size={7} className="text-primary flex-shrink-0" />
                                <div className="h-0.5 bg-primary/15 rounded flex-1" />
                              </div>
                            </div>
                            <div className="flex justify-end">
                              <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                                <CheckCircle size={8} className="text-white" />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <span className="inline-block px-3 py-1 bg-primary-dark text-white text-[10px] font-bold rounded-full tracking-wide mb-2">
                        {step.badge}
                      </span>
                      <p className="text-sm text-gray-700 leading-relaxed"><span className="font-bold">{step.desc.split(' ').slice(0, 3).join(' ')}</span> {step.desc.split(' ').slice(3).join(' ')}</p>
                    </motion.div>
                  ) : <div />}
                </div>
              </div>
            ))}
          </div>

          {/* Mobile */}
          <div className="md:hidden relative">
            <div className="absolute left-5 top-0 bottom-0 w-[3px] bg-primary" />
            <div className="absolute left-[14px] -top-1 w-3 h-3 rounded-full bg-primary" />
            <div className="absolute left-[14px] -bottom-1 w-3 h-3 rounded-full bg-primary" />
            <div className="space-y-4">
              {howSteps.map((step, i) => (
                <motion.div key={step.num} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.06 }} className="relative flex gap-4 items-start">
                  <div className="flex-shrink-0 z-10">
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shadow-md border-[3px] border-white">
                      {step.num}
                    </div>
                  </div>
                  <div className="flex-1 bg-primary-50/50 rounded-xl p-4">
                    <span className="inline-block px-2 py-0.5 bg-primary-dark text-white text-[8px] font-bold rounded-full tracking-wider mb-1.5">
                      {step.badge}
                    </span>
                    <p className="text-xs text-gray-700 leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="py-20 bg-surface-secondary">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-14"
          >
            <span className="inline-block px-4 py-1.5 bg-primary-50 text-primary text-sm font-medium rounded-full mb-4">
              Nos formules
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Choisissez votre protection
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Des formules adaptées à chaque besoin, transparentes et sans surprise.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                custom={i + 1}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <Card
                  className={`relative h-full flex flex-col ${
                    plan.popular ? 'border-2 border-primary shadow-lg shadow-primary/10' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-gold text-gray-900 text-xs font-bold px-4 py-1 rounded-full">
                        Plus populaire
                      </span>
                    </div>
                  )}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                    <p className="text-sm text-gray-400 mt-1">{plan.desc}</p>
                  </div>
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-lg font-semibold text-gray-500">€</span>
                      <span className="text-gray-400 text-sm">{plan.period}</span>
                    </div>
                    {plan.priceAnnual && (
                      <p className="text-sm text-gray-400 mt-1">
                        {plan.priceAnnual}€ /an
                      </p>
                    )}
                  </div>
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle size={16} className="text-primary flex-shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link to="/inscription">
                    <Button
                      variant={plan.popular ? 'gold' : 'outline'}
                      fullWidth
                    >
                      Choisir {plan.name}
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Zones de couverture - World Map Style */}
      <section className="py-20 bg-gradient-to-br from-primary-dark via-primary to-primary-dark relative overflow-hidden">
        {/* Decorative globe circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full border border-white/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-white/8" />
        <div className="absolute top-10 right-10 w-2 h-2 rounded-full bg-gold/40 animate-pulse" />
        <div className="absolute bottom-20 left-16 w-1.5 h-1.5 rounded-full bg-gold/30 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/3 left-10 w-1 h-1 rounded-full bg-white/20 animate-pulse" style={{ animationDelay: '2s' }} />

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full mb-4">
              <Globe size={14} className="text-gold" />
              <span className="text-sm font-medium text-white/90">Couverture internationale</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4">
              Où que vous viviez, nous vous couvrons
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Aldiana Care protège les ressortissants d'Afrique de l'Ouest dans toutes les grandes régions de la diaspora.
            </p>
          </motion.div>

          {/* Regions grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {coverageRegions.slice(0, 3).map((r, i) => (
              <motion.div
                key={r.region}
                custom={i + 1}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="group"
              >
                <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/15 transition-all hover:border-gold/30 h-full">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-4xl">{r.flag}</span>
                    <div>
                      <h3 className="font-bold text-white text-lg">{r.region}</h3>
                      <span className="text-gold text-sm font-semibold">{r.count}</span>
                    </div>
                  </div>
                  <p className="text-white/50 text-sm leading-relaxed">{r.countries}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {coverageRegions.slice(3).map((r, i) => (
              <motion.div
                key={r.region}
                custom={i + 4}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="group"
              >
                <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/15 transition-all hover:border-gold/30 h-full">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-4xl">{r.flag}</span>
                    <div>
                      <h3 className="font-bold text-white text-lg">{r.region}</h3>
                      <span className="text-gold text-sm font-semibold">{r.count}</span>
                    </div>
                  </div>
                  <p className="text-white/50 text-sm leading-relaxed">{r.countries}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom stat */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={6} className="text-center mt-10">
            <p className="text-white/40 text-sm">Plus de <span className="text-gold font-bold text-lg">30 pays</span> couverts à travers le monde</p>
          </motion.div>
        </div>
      </section>

      {/* Pourquoi Aldiana Care */}
      <section className="py-20 bg-surface-secondary">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-14"
          >
            <span className="inline-block px-4 py-1.5 bg-primary-50 text-primary text-sm font-medium rounded-full mb-4">
              Pourquoi nous choisir
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Pourquoi Aldiana Care ?
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Globe, title: 'Couverture mondiale', desc: 'Europe, Amérique du Nord, Maghreb, Moyen-Orient vers l\'Afrique de l\'Ouest' },
              { icon: Zap, title: '100% Digital', desc: 'Souscription en ligne, signature digitale, contrat généré instantanément' },
              { icon: HeadphonesIcon, title: 'Support 24/7', desc: 'Assistance en français, wolof, bambara et langues ouest-africaines' },
              { icon: Camera, title: 'Onboarding simple', desc: 'Photo, pièce d\'identité et signature depuis votre téléphone' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                custom={i + 1}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <Card hover className="text-center h-full">
                  <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-xl flex items-center justify-center">
                    <item.icon size={22} className="text-primary" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="py-20 bg-surface-secondary">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-14"
          >
            <span className="inline-block px-4 py-1.5 bg-primary-50 text-primary text-sm font-medium rounded-full mb-4">
              Témoignages
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Ce que disent nos clients
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                custom={i + 1}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <Card className="h-full">
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} size={14} className="text-gold fill-gold" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-6">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <img 
                      src={t.avatar} 
                      alt={t.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                      <p className="text-xs text-gray-400">{t.location}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-3xl mx-auto px-4 text-center relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Protégez votre famille dès aujourd'hui
            </h2>
            <p className="text-lg text-white/70 mb-8">
              Rejoignez la communauté de la diaspora ouest-africaine qui fait confiance à Aldiana Care.
              Souscription 100% en ligne en quelques minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/inscription">
                <Button variant="gold" size="lg" icon={<ArrowRight size={18} />}>
                  Souscrire maintenant
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 hover:text-white">
                  Nous contacter
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
