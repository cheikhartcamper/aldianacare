import { motion } from 'framer-motion';
import { Shield, FileText, Calendar, CheckCircle, Globe, User, MapPin, Phone, Mail, Clock, Users } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';

const PLAN_FEATURES: Record<string, string[]> = {
  individual: [
    'Rapatriement du corps',
    'Assistance administrative complète',
    'Support téléphonique 24/7',
    'Couverture Europe & Afrique',
    'Assistance funéraire locale',
  ],
  family: [
    'Rapatriement du corps (souscripteur + famille)',
    'Assistance administrative complète',
    'Support téléphonique 24/7',
    'Couverture Europe & Afrique',
    'Billet d\'avion pour 2 membres de la famille',
    'Assistance funéraire complète',
    'Capital décès',
    'Gestionnaire de dossier dédié',
    'Priority support 24/7',
  ],
};

export function ContractPage() {
  const { user, familyMembers } = useAuth();

  const planLabel = user?.planType === 'family' ? 'Familiale' : 'Individuelle';
  const statusLabel =
    user?.registrationStatus === 'approved' ? 'Actif' :
    user?.registrationStatus === 'rejected' ? 'Rejeté' : 'En attente';
  const statusColor =
    user?.registrationStatus === 'approved' ? 'bg-gold/20 text-gold' :
    user?.registrationStatus === 'rejected' ? 'bg-red-500/20 text-red-300' :
    'bg-amber-500/20 text-amber-300';

  const features = PLAN_FEATURES[user?.planType || 'individual'];
  const inscriptionDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—';

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Mon contrat</h1>
        <p className="text-sm text-gray-500 mt-1">Détails de votre souscription Aldiana Care.</p>
      </motion.div>

      {/* Contract status banner */}
      <Card className="bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Shield size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold">Formule {planLabel}</h2>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${statusColor}`}>
                  {statusLabel}
                </span>
              </div>
              <p className="text-white/70 text-sm">
                Inscrit le {inscriptionDate}
              </p>
              {user?.planType === 'family' && (
                <p className="text-white/60 text-xs mt-0.5">
                  {(user.familyMemberCount ?? familyMembers.length)} membre(s) de famille
                </p>
              )}
            </div>
          </div>
          <div className="text-right">
            <Badge
              variant={
                user?.registrationStatus === 'approved' ? 'success' :
                user?.registrationStatus === 'rejected' ? 'danger' : 'warning'
              }
            >
              {user?.registrationStatus === 'approved' ? '✓ Approuvé' :
               user?.registrationStatus === 'rejected' ? '✗ Rejeté' : '⏳ En validation'}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Statut details */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-primary bg-primary/10">
            <Calendar size={18} />
          </div>
          <p className="text-xs text-gray-400">Date d'inscription</p>
          <p className="text-sm font-bold text-gray-900 mt-0.5">{inscriptionDate}</p>
        </Card>
        <Card>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-gold-dark bg-gold/10">
            <Shield size={18} />
          </div>
          <p className="text-xs text-gray-400">Formule</p>
          <p className="text-sm font-bold text-gray-900 mt-0.5">{planLabel}</p>
        </Card>
        <Card>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-info bg-info/10">
            <Globe size={18} />
          </div>
          <p className="text-xs text-gray-400">Zone de couverture</p>
          <p className="text-sm font-bold text-gray-900 mt-0.5">Monde entier</p>
        </Card>
        <Card>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
            user?.registrationStatus === 'approved' ? 'text-success bg-success/10' :
            user?.registrationStatus === 'rejected' ? 'text-danger bg-danger/10' :
            'text-amber-500 bg-amber-50'
          }`}>
            {user?.registrationStatus === 'approved' ? <CheckCircle size={18} /> : <Clock size={18} />}
          </div>
          <p className="text-xs text-gray-400">Statut</p>
          <p className={`text-sm font-bold mt-0.5 ${
            user?.registrationStatus === 'approved' ? 'text-success' :
            user?.registrationStatus === 'rejected' ? 'text-danger' : 'text-amber-600'
          }`}>{statusLabel}</p>
        </Card>
      </div>

      {/* Couverture incluse */}
      <Card>
        <h3 className="font-semibold text-gray-900 mb-4">Couverture incluse — Formule {planLabel}</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {features.map((item) => (
            <div key={item} className="flex items-center gap-2 p-3 rounded-xl bg-surface-secondary">
              <CheckCircle size={16} className="text-primary flex-shrink-0" />
              <span className="text-sm text-gray-700">{item}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Souscripteur */}
      <div className="grid sm:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User size={16} className="text-primary" /> Souscripteur
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Nom complet', value: user ? `${user.firstName} ${user.lastName}` : '—' },
              { label: 'Email', value: user?.email || '—', icon: Mail },
              { label: 'Téléphone', value: user?.phone || '—', icon: Phone },
              { label: 'Pays de résidence', value: user?.residenceCountry || '—', icon: MapPin },
              { label: 'Pays de rapatriement', value: user?.repatriationCountry || '—', icon: Globe },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center text-sm gap-2">
                <span className="text-gray-500 flex-shrink-0">{item.label}</span>
                <span className="font-medium text-gray-900 text-right break-all">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Membres famille si plan familial */}
        {user?.planType === 'family' && (
          <Card>
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users size={16} className="text-primary" /> Membres de la famille
            </h3>
            {familyMembers.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">Aucun membre enregistré</p>
            ) : (
              <div className="space-y-3">
                {familyMembers.map((member) => (
                  <div key={member.id} className="flex items-center gap-3 p-3 rounded-xl bg-surface-secondary">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <User size={14} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{member.firstName} {member.lastName}</p>
                      <p className="text-xs text-gray-400">
                        {member.isAdult ? 'Majeur' : 'Mineur'} •{' '}
                        {new Date(member.dateOfBirth).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <Badge variant={member.isAdult ? 'primary' : 'neutral'} size="sm">
                      {member.isAdult ? 'Adulte' : 'Enfant'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* Documents — pas d'API contrat */}
        {user?.planType !== 'family' && (
          <Card>
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText size={16} className="text-primary" /> Documents du contrat
            </h3>
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <Clock size={28} className="text-gray-200 mb-2" />
              <p className="text-sm text-gray-400">Documents en cours de préparation</p>
              <p className="text-xs text-gray-300 mt-1">
                Votre contrat sera disponible après approbation de votre dossier.
              </p>
            </div>
          </Card>
        )}
      </div>

      {/* Rejet info */}
      {user?.registrationStatus === 'rejected' && user.rejectionReason && (
        <Card className="border-red-200 bg-red-50">
          <p className="text-sm font-semibold text-red-800 mb-1">Motif du rejet</p>
          <p className="text-sm text-red-700">{user.rejectionReason}</p>
        </Card>
      )}
    </div>
  );
}
