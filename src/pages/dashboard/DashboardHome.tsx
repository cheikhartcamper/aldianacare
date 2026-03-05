import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield, CreditCard, FileText, Heart, Gift, AlertTriangle,
  ArrowRight, CheckCircle, Clock, Download, MapPin,
  Phone, Mail, ChevronRight, HelpCircle
} from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui';

const documents = [
  { name: 'Contrat Premium 2026', date: '01.01.2026', type: 'PDF' },
  { name: 'Appel de cotisation Mars', date: '01.03.2026', type: 'PDF' },
  { name: 'Attestation d\'assurance', date: '15.01.2026', type: 'PDF' },
];

const timeline = [
  { date: '01 Mars 2026', event: 'Paiement mensuel effectué', type: 'payment' as const },
  { date: '15 Fev 2026', event: 'Document validé par l\'équipe', type: 'document' as const },
  { date: '01 Fev 2026', event: 'Paiement mensuel effectué', type: 'payment' as const },
  { date: '20 Jan 2026', event: 'Commission de parrainage reçue', type: 'commission' as const },
];

const typeIcons = {
  payment: CreditCard,
  document: FileText,
  commission: Gift,
  contract: Shield,
};

export function DashboardHome() {
  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="bg-primary rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gold/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/2 w-32 h-32 bg-gold/10 rounded-full blur-2xl" />
          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src="https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=80&h=80&fit=crop&crop=face"
                alt="Amadou"
                className="w-16 h-16 rounded-2xl border-2 border-gold/50 object-cover hidden sm:block"
              />
              <div>
                <p className="text-white/60 text-sm">Bonjour,</p>
                <h1 className="text-2xl font-bold">M. Amadou DIALLO</h1>
                <div className="flex items-center gap-4 mt-2 text-sm text-white/70">
                  <span className="flex items-center gap-1"><MapPin size={12} /> 12 Rue de la Paix, 75001 Paris</span>
                </div>
                <div className="flex items-center gap-4 mt-1 text-sm text-white/70">
                  <span className="flex items-center gap-1"><Mail size={12} /> amadou@email.com</span>
                  <span className="flex items-center gap-1"><Phone size={12} /> +33 6 12 34 56 78</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Link to="/app/parametres">
                <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10 hover:text-white">
                  Actualiser mes infos
                </Button>
              </Link>
              <Link to="/app/parametres">
                <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10 hover:text-white">
                  Modifier mot de passe
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Top row: colored blocks inspired by Image 2 */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Mon compte block */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <div className="bg-primary rounded-2xl p-5 text-white h-full">
            <h3 className="text-xs uppercase tracking-wider text-white/60 font-semibold mb-4">MON COMPTE</h3>
            <div className="space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Contrat N°</span>
                <span className="font-semibold">ALC-2026-001234</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Formule</span>
                <span className="font-semibold flex items-center gap-1">
                  <Shield size={12} /> Premium
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Statut</span>
                <span className="bg-gold/20 text-gold px-2 py-0.5 rounded-full text-xs font-bold">Actif</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Validité</span>
                <span className="font-medium">01 Jan 2027</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Couverture</span>
                <span className="font-medium">Monde entier</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Dernier versement block */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="bg-gold rounded-2xl p-5 h-full">
            <h3 className="text-xs uppercase tracking-wider text-primary/60 font-semibold mb-4">DERNIER VERSEMENT</h3>
            <p className="text-xs text-primary/70 mb-1">01.03.2026</p>
            <p className="text-4xl font-bold text-primary mb-4">19,90 €</p>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle size={16} className="text-primary" />
              <span className="text-sm font-medium text-primary">Paiement confirmé</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-primary/70">Prochaine échéance</span>
              <span className="font-bold text-primary">01 Avril 2026</span>
            </div>
            <div className="mt-3">
              <Link to="/app/paiements" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                TOUS LES VERSEMENTS <ChevronRight size={12} />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Parrainage block */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="bg-primary-dark rounded-2xl p-5 text-white h-full" style={{ backgroundColor: '#0a4a34' }}>
            <h3 className="text-xs uppercase tracking-wider text-white/60 font-semibold mb-4">PARRAINAGE</h3>
            <div className="text-center py-2">
              <p className="text-4xl font-bold text-gold mb-1">3</p>
              <p className="text-sm text-white/70 mb-2">filleuls parrainés</p>
              <p className="text-2xl font-bold text-gold">45 €</p>
              <p className="text-xs text-white/50 mb-4">de commissions gagnées</p>
            </div>
            <Link to="/app/parrainage">
              <Button variant="gold" size="sm" fullWidth>Parrainer un proche</Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Bottom row: 3 blocks */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Contrats block */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="h-full border-t-4 border-t-primary">
            <h3 className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-4">CONTRATS</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-secondary">
                <Shield size={18} className="text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Premium - Monde</p>
                  <p className="text-xs text-gray-400">ALC-2026-001234</p>
                </div>
                <Badge variant="success" dot size="sm">Actif</Badge>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100">
              <Link to="/app/contrat" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                VOIR MON CONTRAT <ChevronRight size={12} />
              </Link>
            </div>
          </Card>
        </motion.div>

        {/* Documents block */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card className="h-full border-t-4 border-t-gold">
            <h3 className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-4">DOCUMENTS</h3>
            <div className="space-y-2">
              {documents.map((doc) => (
                <div key={doc.name} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-secondary transition-colors cursor-pointer group">
                  <FileText size={16} className="text-gold-dark" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate group-hover:text-primary">{doc.name}</p>
                    <p className="text-[10px] text-gray-400">{doc.date}</p>
                  </div>
                  <Download size={14} className="text-gray-300" />
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <Link to="/app/documents" className="text-xs font-semibold text-gold-dark hover:underline flex items-center gap-1">
                TOUS LES DOCUMENTS <ChevronRight size={12} />
              </Link>
            </div>
          </Card>
        </motion.div>

        {/* Demandes block */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="h-full border-t-4 border-t-info">
            <h3 className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-4">DEMANDES</h3>
            <div className="py-4 text-center">
              <HelpCircle size={32} className="mx-auto text-gray-300 mb-3" />
              <p className="text-lg font-semibold text-gray-900 mb-1">
                Une démarche, un besoin, ou toute <span className="text-primary">autre question...</span>
              </p>
              <p className="text-xs text-gray-400 mb-4">Notre équipe est disponible 24h/24</p>
            </div>
            <div className="space-y-2">
              <Link to="/app/support">
                <Button variant="primary" size="sm" fullWidth>Nouvelle demande</Button>
              </Link>
              <Link to="/app/declaration-deces">
                <Button variant="outline" size="sm" fullWidth icon={<AlertTriangle size={14} />}>Déclarer un décès</Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Quick actions + Timeline */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick actions */}
        <Card>
          <h3 className="font-semibold text-gray-900 mb-4">Actions rapides</h3>
          <div className="space-y-2">
            {[
              { label: 'Télécharger contrat', icon: FileText, path: '/app/documents', color: 'text-primary bg-primary/10' },
              { label: 'Effectuer un paiement', icon: CreditCard, path: '/app/paiements', color: 'text-info bg-info/10' },
              { label: 'Personne de confiance', icon: Heart, path: '/app/personne-confiance', color: 'text-pink-600 bg-pink-50' },
              { label: 'Mon parrainage', icon: Gift, path: '/app/parrainage', color: 'text-gold-dark bg-gold/10' },
              { label: 'Voir nos offres', icon: Shield, path: '/app/offres', color: 'text-primary bg-primary/10' },
            ].map((action) => (
              <Link
                key={action.label}
                to={action.path}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${action.color}`}>
                  <action.icon size={16} />
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 flex-1">
                  {action.label}
                </span>
                <ArrowRight size={14} className="text-gray-300 group-hover:text-gray-500" />
              </Link>
            ))}
          </div>
        </Card>

        {/* Timeline */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900">Activité récente</h3>
              <button className="text-xs text-primary font-medium hover:underline">Voir tout</button>
            </div>
            <div className="space-y-4">
              {timeline.map((item, i) => {
                const Icon = typeIcons[item.type];
                return (
                  <div key={i} className="flex items-start gap-4">
                    <div className="relative">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        item.type === 'payment' ? 'bg-success/10 text-success' :
                        item.type === 'document' ? 'bg-info/10 text-info' :
                        item.type === 'commission' ? 'bg-gold/10 text-gold-dark' :
                        'bg-primary/10 text-primary'
                      }`}>
                        <Icon size={16} />
                      </div>
                      {i < timeline.length - 1 && (
                        <div className="absolute top-9 left-1/2 -translate-x-1/2 w-px h-5 bg-gray-100" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                      <p className="text-sm text-gray-900 font-medium">{item.event}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.date}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      {/* Personne de confiance */}
      <Card className="border-l-4 border-l-gold">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Clock size={20} className="text-gold-dark" />
            <h3 className="font-semibold text-gray-900">Personne de confiance</h3>
          </div>
          <Link to="/app/personne-confiance">
            <Button variant="ghost" size="sm">Modifier</Button>
          </Link>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-12 h-12 rounded-xl bg-gold/15 flex items-center justify-center">
              <Heart size={20} className="text-gold-dark" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Fatou Diallo</p>
              <p className="text-xs text-gray-400">Soeur</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-1"><Phone size={12} /> +33 6 12 34 56 78</span>
            <span className="flex items-center gap-1"><Mail size={12} /> fatou@email.com</span>
            <Badge variant="success" dot size="sm">Vérifié</Badge>
          </div>
        </div>
      </Card>
    </div>
  );
}
