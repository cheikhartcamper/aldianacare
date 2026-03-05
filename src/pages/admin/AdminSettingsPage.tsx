import { motion } from 'framer-motion';
import { Settings, Shield, Bell, Globe } from 'lucide-react';
import { Card, Button, Input } from '@/components/ui';

export function AdminSettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-sm text-gray-500 mt-1">Configuration de la plateforme.</p>
      </motion.div>

      <Card>
        <div className="flex items-center gap-3 mb-6">
          <Settings size={18} className="text-primary" />
          <h3 className="font-semibold text-gray-900">Paramètres généraux</h3>
        </div>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <Input label="Nom de la plateforme" defaultValue="Aldiana Care" />
          <Input label="Email de contact" type="email" defaultValue="contact@aldianacare.com" />
          <Input label="Téléphone support" defaultValue="+33 1 00 00 00 00" />
          <Input label="Adresse siège" defaultValue="Paris, France" />
          <Button size="sm">Enregistrer</Button>
        </form>
      </Card>

      <Card>
        <div className="flex items-center gap-3 mb-6">
          <Shield size={18} className="text-primary" />
          <h3 className="font-semibold text-gray-900">Commissions</h3>
        </div>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <Input label="Commission souscription (€)" type="number" defaultValue="15" />
          <Input label="Commission renouvellement (€)" type="number" defaultValue="10" />
          <Input label="Délai de paiement (jours)" type="number" defaultValue="30" />
          <Button size="sm">Enregistrer</Button>
        </form>
      </Card>

      <Card>
        <div className="flex items-center gap-3 mb-6">
          <Bell size={18} className="text-primary" />
          <h3 className="font-semibold text-gray-900">Notifications</h3>
        </div>
        <div className="space-y-3">
          {[
            { label: 'Nouvelle souscription', desc: 'Recevoir une notification pour chaque nouvelle souscription' },
            { label: 'Paiement échoué', desc: 'Alerte en cas de paiement échoué' },
            { label: 'Déclaration de décès', desc: 'Notification urgente pour les déclarations' },
            { label: 'Rapport hebdomadaire', desc: 'Résumé des KPIs par email chaque lundi' },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-surface-secondary">
              <div>
                <p className="text-sm font-medium text-gray-900">{item.label}</p>
                <p className="text-xs text-gray-400">{item.desc}</p>
              </div>
              <button className="w-11 h-6 rounded-full bg-primary transition-colors relative">
                <span className="absolute top-0.5 left-[22px] w-5 h-5 rounded-full bg-white shadow" />
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-3 mb-6">
          <Globe size={18} className="text-primary" />
          <h3 className="font-semibold text-gray-900">Pays couverts</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {['France', 'Belgique', 'Italie', 'Espagne', 'Allemagne', 'Suisse', 'UK', 'Portugal', 'Sénégal', 'Mali', 'Guinée', 'Côte d\'Ivoire', 'Cameroun', 'Congo', 'Togo', 'Bénin', 'Burkina Faso', 'Niger', 'Mauritanie', 'Gambie'].map((country) => (
            <span key={country} className="px-3 py-1.5 bg-primary-50 text-primary text-xs font-medium rounded-full">{country}</span>
          ))}
        </div>
      </Card>
    </div>
  );
}
