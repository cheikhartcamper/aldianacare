import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, UserCheck, MessageSquare, ShieldCheck, FileUp,
  ArrowRight, CheckCircle2, Clock, FileText, Phone
} from 'lucide-react';
import { Button, Logo } from '@/components/ui';

const fade = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

export function DeclarationLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/">
            <Logo size="sm" variant="color" />
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors hidden sm:block">
              Accueil
            </Link>
            <Link to="/connexion">
              <Button variant="outline" size="sm">Se connecter</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero — dark, compact */}
      <section className="bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold/8 rounded-full blur-[100px]" />
        </div>
        <div className="max-w-4xl mx-auto px-4 py-20 lg:py-28 relative text-center">
          <motion.div initial="hidden" animate="show" custom={0} variants={fade}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-medium tracking-wide uppercase mb-6 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              Processus sécurisé
            </div>
          </motion.div>
          <motion.h1 initial="hidden" animate="show" custom={1} variants={fade} className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5">
            Déclarer le décès d'un<br />
            <span className="text-gold">assuré Aldiana Care</span>
          </motion.h1>
          <motion.p initial="hidden" animate="show" custom={2} variants={fade} className="text-base text-gray-400 max-w-xl mx-auto mb-10 leading-relaxed">
            Vous êtes un proche désigné comme personne de confiance ? Effectuez la déclaration en ligne en toute sécurité. Aucun compte requis.
          </motion.p>
          <motion.div initial="hidden" animate="show" custom={3} variants={fade}>
            <Link to="/declaration/search">
              <Button size="lg" variant="gold" className="shadow-xl shadow-gold/20 hover:shadow-2xl hover:shadow-gold/30 transition-all">
                Commencer la déclaration
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Pré-requis — bannière simple */}
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">Avant de commencer</p>
            <div className="flex flex-wrap gap-4">
              {[
                { icon: Search, text: 'Nom, email ou téléphone du défunt' },
                { icon: Phone, text: 'Votre téléphone (WhatsApp)' },
                { icon: FileText, text: 'Certificats de décès (PDF/image)' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2 text-sm text-gray-600">
                  <item.icon size={14} className="text-primary flex-shrink-0" />
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Étapes — timeline horizontale sur desktop, verticale sur mobile */}
      <section className="py-16 lg:py-24">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} custom={0} variants={fade} className="text-center mb-14">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">Comment ça fonctionne</h2>
            <p className="text-gray-500 max-w-lg mx-auto">5 étapes simples, environ 10 minutes. Chaque étape est vérifiée pour garantir la sécurité.</p>
          </motion.div>

          <div className="grid md:grid-cols-5 gap-4 md:gap-0">
            {[
              { num: '01', icon: Search, title: 'Recherche', desc: 'Identifiez l\'assuré par nom, email ou téléphone.' },
              { num: '02', icon: UserCheck, title: 'Identification', desc: 'Confirmez votre statut de personne de confiance.' },
              { num: '03', icon: MessageSquare, title: 'Code WhatsApp', desc: 'Recevez un code de vérification à 6 chiffres.' },
              { num: '04', icon: ShieldCheck, title: 'Validation', desc: 'Saisissez le code pour confirmer votre identité.' },
              { num: '05', icon: FileUp, title: 'Déclaration', desc: 'Transmettez les détails et les certificats.' },
            ].map((step, i) => (
              <motion.div key={step.num} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i} variants={fade} className="relative">
                {/* Connector line desktop */}
                {i < 4 && <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gray-200 z-0" />}

                <div className="relative z-10 flex flex-col items-center text-center px-3">
                  <div className="w-16 h-16 rounded-2xl bg-primary/5 border-2 border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                    <step.icon size={24} className="text-primary" />
                  </div>
                  <span className="text-[10px] font-bold text-gold tracking-widest mb-1">{step.num}</span>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">{step.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sécurité + Confiance */}
      <section className="py-16 bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: ShieldCheck, title: 'Triple vérification', desc: 'Identité, téléphone et code OTP — 3 niveaux de sécurité contre les déclarations frauduleuses.', color: 'text-primary bg-primary/10' },
              { icon: Clock, title: '~10 minutes', desc: 'Procédure rapide et guidée. Les tokens temporaires garantissent un processus encadré dans le temps.', color: 'text-gold-dark bg-gold/10' },
              { icon: CheckCircle2, title: 'Sans inscription', desc: 'Aucun compte nécessaire. Seules les personnes de confiance désignées par l\'assuré peuvent déclarer.', color: 'text-primary bg-primary/10' },
            ].map((item, i) => (
              <motion.div key={item.title} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i} variants={fade}>
                <div className="bg-white rounded-2xl p-6 h-full border border-gray-100 hover:shadow-lg transition-shadow">
                  <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mb-4`}>
                    <item.icon size={22} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} custom={0} variants={fade}>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              Prêt à effectuer la déclaration ?
            </h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Munissez-vous de vos documents et commencez la procédure sécurisée.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/declaration/search">
                <Button size="lg" variant="primary" className="shadow-lg group">
                  Démarrer la déclaration
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/">
                <Button size="lg" variant="ghost" className="text-gray-500">
                  Retour à l'accueil
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer minimal */}
      <footer className="border-t border-gray-100 py-6">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Logo size="sm" variant="color" />
          <p className="text-xs text-gray-400">Aldiana Care — Assurance rapatriement de corps</p>
        </div>
      </footer>
    </div>
  );
}
