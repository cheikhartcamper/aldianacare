import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import {
  Shield, Heart, Phone, Star, CheckCircle, Users,
  Globe, ArrowRight, Zap, Award, HeadphonesIcon
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

const steps = [
  { icon: Shield, title: 'Souscrire', desc: 'Choisissez votre formule et souscrivez en quelques minutes, 100% en ligne.' },
  { icon: Heart, title: 'Protéger sa famille', desc: 'Votre famille est protégée partout dans le monde avec une couverture complète.' },
  { icon: Phone, title: 'Assistance en cas de besoin', desc: 'En cas de décès, nous gérons le rapatriement et les formalités funéraires.' },
];

const stats = [
  { value: '15 000+', label: 'Familles protégées' },
  { value: '25+', label: 'Pays couverts' },
  { value: '48h', label: 'Délai moyen rapatriement' },
  { value: '24/7', label: 'Assistance disponible' },
];

const plans = [
  {
    name: 'Basic',
    price: '9,90',
    period: '/mois',
    desc: 'Protection essentielle',
    features: ['Rapatriement du corps', 'Assistance administrative', 'Support téléphonique', 'Couverture Europe'],
    popular: false,
  },
  {
    name: 'Premium',
    price: '19,90',
    period: '/mois',
    desc: 'La plus populaire',
    features: ['Tout Basic +', 'Billet d\'avion famille', 'Assistance funéraire complète', 'Couverture Monde entier', 'Gestionnaire dédié'],
    popular: true,
  },
  {
    name: 'Family',
    price: '29,90',
    period: '/mois',
    desc: 'Toute la famille protégée',
    features: ['Tout Premium +', 'Jusqu\'à 6 personnes', 'Assurance pathologie', 'Capital décès', 'Priority support'],
    popular: false,
  },
];

const testimonials = [
  {
    name: 'Fatou Diop',
    location: 'Paris, France',
    text: 'Aldiana Care nous a accompagnés dans un moment très difficile. Le rapatriement a été géré avec dignité et professionnalisme.',
    rating: 5,
  },
  {
    name: 'Moussa Konaté',
    location: 'Bruxelles, Belgique',
    text: 'La souscription était simple et rapide. Je suis rassuré de savoir que ma famille est protégée.',
    rating: 5,
  },
  {
    name: 'Aminata Camara',
    location: 'Rome, Italie',
    text: 'Un service exceptionnel. L\'équipe est disponible 24h/24 et parle nos langues. Merci Aldiana Care.',
    rating: 5,
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
                <span className="font-serif">La sérénité au bout du monde.</span>
                <br />
                <span className="text-primary">Aldiana Care</span>, votre assurance rapatriement
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-lg">
                Protégez votre famille avec la première assurance rapatriement et assistance funéraire 100% digitale pour la diaspora ouest-africaine.
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
                    <p className="text-white/70 text-sm">25+ pays couverts en Afrique et en Europe</p>
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
      <section className="py-20 bg-white">
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
              Simple et rapide
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Comment ça marche ?</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Souscrire à Aldiana Care est simple. En 3 étapes, votre famille est protégée.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                custom={i + 1}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <Card hover className="text-center h-full">
                  <div className="w-16 h-16 mx-auto mb-5 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <step.icon size={28} className="text-primary" />
                  </div>
                  <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gold text-gray-900 text-sm font-bold mb-4">
                    {i + 1}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                </Card>
              </motion.div>
            ))}
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

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
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
                    <span className="text-4xl font-bold text-gray-900">{plan.price}€</span>
                    <span className="text-gray-400 text-sm">{plan.period}</span>
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

      {/* Pourquoi Aldiana Care */}
      <section className="py-20 bg-white">
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
              { icon: Globe, title: 'Couverture mondiale', desc: 'Plus de 25 pays couverts en Afrique et Europe' },
              { icon: Zap, title: '100% Digital', desc: 'Souscription, paiement et gestion entièrement en ligne' },
              { icon: HeadphonesIcon, title: 'Support 24/7', desc: 'Assistance en français et langues africaines' },
              { icon: Award, title: 'Confiance', desc: 'Plus de 15 000 familles nous font confiance' },
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
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users size={16} className="text-primary" />
                    </div>
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
              Rejoignez plus de 15 000 familles qui font confiance à Aldiana Care.
              La souscription ne prend que 5 minutes.
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
