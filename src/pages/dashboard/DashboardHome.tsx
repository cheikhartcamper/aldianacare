import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield, CreditCard, FileText, Heart, Gift, AlertTriangle,
  ArrowRight, Clock, MapPin,
  Phone, Mail, ChevronRight, HelpCircle
} from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';


export function DashboardHome() {
  const { user, trustedPersons } = useAuth();
  const displayName = user ? `${user.firstName} ${user.lastName}` : 'Utilisateur';
  const planLabel = user?.planType === 'family' ? 'Familial' : 'Individuel';
  const apiUrl = import.meta.env.VITE_API_URL || 'https://aldiianacare.online/api';
  const baseUrl = apiUrl.replace('/api', '');

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="bg-primary rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gold/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/2 w-32 h-32 bg-gold/10 rounded-full blur-2xl" />
          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              {user?.identityPhotoPath ? (
                <img
                  src={`${baseUrl}${user.identityPhotoPath}`}
                  alt={displayName}
                  className="w-16 h-16 rounded-2xl border-2 border-gold/50 object-cover hidden sm:block"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl border-2 border-gold/50 bg-white/15 flex items-center justify-center hidden sm:block">
                  <span className="text-xl font-bold text-white">{user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}</span>
                </div>
              )}
              <div>
                <p className="text-white/60 text-sm">Bonjour,</p>
                <h1 className="text-2xl font-bold">{displayName}</h1>
                <div className="flex items-center gap-4 mt-2 text-sm text-white/70">
                  <span className="flex items-center gap-1"><MapPin size={12} /> {user?.residenceAddress || 'Adresse non renseignée'}</span>
                </div>
                <div className="flex items-center gap-4 mt-1 text-sm text-white/70">
                  <span className="flex items-center gap-1"><Mail size={12} /> {user?.email}</span>
                  <span className="flex items-center gap-1"><Phone size={12} /> {user?.phone}</span>
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
                  <Shield size={12} /> {planLabel}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Statut</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  user?.registrationStatus === 'approved' ? 'bg-gold/20 text-gold' :
                  user?.registrationStatus === 'pending' ? 'bg-amber-500/20 text-amber-300' :
                  'bg-red-500/20 text-red-300'
                }`}>{user?.registrationStatus === 'approved' ? 'Actif' : user?.registrationStatus === 'pending' ? 'En attente' : 'Rejeté'}</span>
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
            <div className="flex flex-col items-center justify-center py-4 text-center">
              <Clock size={24} className="text-primary/30 mb-2" />
              <p className="text-sm text-primary/50">Aucun versement enregistré</p>
            </div>
            <div className="mt-3">
              <Link to="/app/paiements" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                VOIR LES PAIEMENTS <ChevronRight size={12} />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Parrainage block */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="bg-primary-dark rounded-2xl p-5 text-white h-full" style={{ backgroundColor: '#0a4a34' }}>
            <h3 className="text-xs uppercase tracking-wider text-white/60 font-semibold mb-4">PARRAINAGE</h3>
            <div className="text-center py-2">
              <p className="text-4xl font-bold text-gold mb-1">—</p>
              <p className="text-sm text-white/70 mb-2">filleuls parrainés</p>
              <p className="text-2xl font-bold text-gold">—</p>
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
                  <p className="text-sm font-medium text-gray-900">{planLabel}</p>
                  <p className="text-xs text-gray-400">Inscrit le {user ? new Date(user.createdAt).toLocaleDateString('fr-FR') : '—'}</p>
                </div>
                <Badge variant={user?.registrationStatus === 'approved' ? 'success' : 'warning'} dot size="sm">
                  {user?.registrationStatus === 'approved' ? 'Actif' : 'En attente'}
                </Badge>
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
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <FileText size={28} className="text-gray-200 mb-2" />
              <p className="text-sm text-gray-400">Aucun document disponible</p>
              <p className="text-xs text-gray-300 mt-1">Vos documents apparaîtront ici</p>
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

        {/* Activité récente */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900">Activité récente</h3>
            </div>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Clock size={32} className="text-gray-200 mb-3" />
              <p className="text-sm text-gray-400">Aucune activité récente</p>
              <p className="text-xs text-gray-300 mt-1">Vos paiements et actions apparaîtront ici</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Personne(s) de confiance */}
      <Card className="border-l-4 border-l-gold">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Heart size={20} className="text-gold-dark" />
            <h3 className="font-semibold text-gray-900">Personne(s) de confiance</h3>
          </div>
          <Link to="/app/personne-confiance">
            <Button variant="ghost" size="sm">Modifier</Button>
          </Link>
        </div>
        {trustedPersons.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <p className="text-sm text-gray-400">Aucune personne de confiance enregistrée</p>
          </div>
        ) : (
          <div className="space-y-3">
            {trustedPersons.map((tp) => (
              <div key={tp.id} className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center">
                    <Heart size={16} className="text-gold-dark" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{tp.firstName} {tp.lastName}</p>
                    <p className="text-xs text-gray-400 capitalize">{tp.relation}{tp.relationDetails ? ` — ${tp.relationDetails}` : ''}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><Phone size={12} /> {tp.phone}</span>
                  {tp.email && <span className="flex items-center gap-1"><Mail size={12} /> {tp.email}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
