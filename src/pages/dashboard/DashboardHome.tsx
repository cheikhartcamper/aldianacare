import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield, FileText, Heart,
  ArrowRight, MapPin,
  Phone, Mail, ChevronRight, HelpCircle, Settings, FolderOpen, Users
} from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { getImageUrls } from '@/lib/imageUrl';
import { useState, useCallback, useRef } from 'react';

export function DashboardHome() {
  const { user, trustedPersons, familyMembers } = useAuth();
  const avatarUrls = getImageUrls(user?.identityPhotoPath);
  const [avatarError, setAvatarError] = useState(false);
  const triedFallback = useRef(false);
  const onAvatarError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    if (avatarUrls && !triedFallback.current) {
      triedFallback.current = true;
      (e.target as HTMLImageElement).src = avatarUrls[1];
    } else {
      setAvatarError(true);
    }
  }, [avatarUrls]);
  const showAvatar = !!avatarUrls && !avatarError;
  const displayName = user ? `${user.firstName} ${user.lastName}` : 'Utilisateur';
  const planLabel = user?.planType === 'family' ? 'Familial' : 'Individuel';

  const docCount = [user?.cniRectoPath, user?.cniVersoPath, user?.identityPhotoPath].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="bg-primary rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gold/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/2 w-32 h-32 bg-gold/10 rounded-full blur-2xl" />
          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              {showAvatar ? (
                <img
                  src={avatarUrls![0]}
                  alt={displayName}
                  className="w-16 h-16 rounded-2xl border-2 border-gold/50 object-cover hidden sm:block"
                  onError={onAvatarError}
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
                  <Settings size={14} className="mr-1.5" /> Modifier mon profil
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Info cards row */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Mon compte block */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <div className="bg-primary rounded-2xl p-5 text-white h-full ring-2 ring-gold/30 ring-offset-0">
            <h3 className="text-xs uppercase tracking-wider text-white/60 font-semibold mb-4">MON COMPTE</h3>
            <div className="space-y-2.5">
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
                <span className="text-white/70">Inscrit le</span>
                <span className="font-medium">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
                    : '—'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Couverture</span>
                <span className="font-medium">Monde entier</span>
              </div>
              {user?.planType === 'family' && (
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Famille</span>
                  <span className="font-medium">{user.familyMemberCount ?? familyMembers.length} membre(s)</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Contrats block */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="h-full bg-gold rounded-2xl p-6 shadow-lg">
            <h3 className="text-xs uppercase tracking-wider text-gray-700 font-semibold mb-4">CONTRAT</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/40">
                <Shield size={18} className="text-gray-800" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Formule {planLabel}</p>
                  <p className="text-xs text-gray-700">Inscrit le {user ? new Date(user.createdAt).toLocaleDateString('fr-FR') : '—'}</p>
                </div>
                <Badge variant={user?.registrationStatus === 'approved' ? 'success' : 'warning'} dot size="sm">
                  {user?.registrationStatus === 'approved' ? 'Actif' : 'En attente'}
                </Badge>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-700/10">
              <Link to="/app/contrat" className="text-xs font-semibold text-gray-900 hover:underline flex items-center gap-1">
                VOIR MON CONTRAT <ChevronRight size={12} />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Documents block */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="h-full bg-primary rounded-2xl p-6 shadow-lg">
            <h3 className="text-xs uppercase tracking-wider text-white/60 font-semibold mb-4">DOCUMENTS</h3>
            {docCount > 0 ? (
              <div className="py-2">
                <p className="text-3xl font-bold text-white">{docCount}/3</p>
                <p className="text-xs text-white/60 mt-1">documents transmis</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-4 text-center">
                <FileText size={28} className="text-white/30 mb-2" />
                <p className="text-sm text-white/60">Aucun document</p>
              </div>
            )}
            <div className="mt-3 pt-3 border-t border-white/20">
              <Link to="/app/documents" className="text-xs font-semibold text-white hover:underline flex items-center gap-1">
                TOUS LES DOCUMENTS <ChevronRight size={12} />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Second row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Quick actions */}
        <Card className="border-t-4 border-t-gold">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-gold inline-block" />Actions rapides</h3>
          <div className="space-y-2">
            {[
              { label: 'Mon contrat', icon: FileText, path: '/app/contrat', color: 'text-primary bg-primary/10' },
              { label: 'Mes documents', icon: FolderOpen, path: '/app/documents', color: 'text-gold-dark bg-gold/10' },
              { label: 'Personne de confiance', icon: Heart, path: '/app/personne-confiance', color: 'text-pink-600 bg-pink-50' },
              { label: user?.planType === 'family' ? 'Ma famille' : 'Passer au familial', icon: Users, path: '/app/famille', color: 'text-primary bg-primary/10' },
              { label: 'Nos offres', icon: Shield, path: '/app/offres', color: 'text-info bg-info/10' },
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

        {/* Besoin d'aide */}
        <Card className="border-t-4 border-t-gold">
          <h3 className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-4">BESOIN D'AIDE ?</h3>
          <div className="py-4 text-center">
            <HelpCircle size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="text-lg font-semibold text-gray-900 mb-1">
              Une démarche, un besoin, ou toute <span className="text-primary">autre question...</span>
            </p>
            <p className="text-xs text-gray-400 mb-4">Notre équipe est disponible 24h/24</p>
          </div>
          <Link to="/app/support">
            <Button variant="primary" size="sm" fullWidth>Contacter le support</Button>
          </Link>
        </Card>

        {/* Rejet info */}
        {user?.registrationStatus === 'rejected' && user.rejectionReason ? (
          <Card className="border-red-200 bg-red-50">
            <p className="text-sm font-semibold text-red-800 mb-1">Motif du rejet de votre dossier</p>
            <p className="text-sm text-red-700">{user.rejectionReason}</p>
            <p className="text-xs text-red-500 mt-3">Contactez le support pour régulariser votre situation.</p>
          </Card>
        ) : (
          <Card className="border-l-4 border-l-gold bg-gold/5">
            <h3 className="font-semibold text-gray-900 mb-2">En cas de décès</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-2">
              Vos <strong>personnes de confiance</strong> sont habilitées à signaler votre décès auprès d'Aldiana Care. Elles seront identifiées par téléphone et code WhatsApp — aucun compte n'est requis de leur part.
            </p>
            {trustedPersons.length > 0 ? (
              <p className="text-xs text-gray-500">
                {trustedPersons.length} personne{trustedPersons.length > 1 ? 's' : ''} de confiance enregistrée{trustedPersons.length > 1 ? 's' : ''} : {trustedPersons.map(tp => `${tp.firstName} ${tp.lastName}`).join(', ')}
              </p>
            ) : (
              <p className="text-xs text-amber-600 font-medium">
                Aucune personne de confiance enregistrée — veuillez en ajouter au moins une.
              </p>
            )}
            <Link to="/app/personne-confiance" className="text-sm text-primary font-medium hover:underline mt-3 inline-block">
              Gérer mes personnes de confiance →
            </Link>
          </Card>
        )}
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
            <Link to="/app/personne-confiance" className="text-sm text-primary font-medium mt-2 hover:underline">
              Ajouter une personne →
            </Link>
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
