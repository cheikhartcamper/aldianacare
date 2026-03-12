import { motion } from 'framer-motion';
import { CreditCard, Clock, Shield, Info } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';

export function PaymentsPage() {
  const { user } = useAuth();

  const planLabel = user?.planType === 'family' ? 'Familiale' : 'Individuelle';
  const inscriptionDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—';

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Paiements</h1>
        <p className="text-sm text-gray-500 mt-1">Historique et gestion de vos cotisations.</p>
      </motion.div>

      {/* Résumé plan */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Shield size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Formule souscrite</p>
              <p className="text-base font-bold text-gray-900">{planLabel}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              user?.registrationStatus === 'approved' ? 'bg-success/10' : 'bg-amber-50'
            }`}>
              <CreditCard size={20} className={
                user?.registrationStatus === 'approved' ? 'text-success' : 'text-amber-500'
              } />
            </div>
            <div>
              <p className="text-xs text-gray-400">Statut cotisation</p>
              <Badge
                variant={user?.registrationStatus === 'approved' ? 'success' : 'warning'}
                size="sm"
              >
                {user?.registrationStatus === 'approved' ? 'Actif' : 'En attente'}
              </Badge>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-info/10 rounded-xl flex items-center justify-center">
              <Clock size={20} className="text-info" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Inscrit le</p>
              <p className="text-sm font-bold text-gray-900">{inscriptionDate}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Info : module en développement */}
      <Card>
        <div className="flex gap-4 items-start">
          <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Info size={22} className="text-gold-dark" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Module de paiement — Bientôt disponible</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              La gestion des cotisations en ligne (Wave, Orange Money, Carte bancaire) et l'historique
              des paiements seront disponibles dans une prochaine mise à jour.
            </p>
            <p className="text-xs text-gray-400 mt-3">
              Pour toute question concernant votre cotisation, contactez notre équipe support.
            </p>
          </div>
        </div>
      </Card>

      {/* Historique vide */}
      <Card padding="none">
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Historique des paiements</h3>
        </div>
        <div className="flex flex-col items-center justify-center py-14 text-center">
          <CreditCard size={36} className="text-gray-200 mb-3" />
          <p className="text-sm font-medium text-gray-500">Aucun paiement enregistré</p>
          <p className="text-xs text-gray-400 mt-1 max-w-xs">
            L'historique de vos cotisations apparaîtra ici dès que le module de paiement sera activé.
          </p>
        </div>
      </Card>
    </div>
  );
}
