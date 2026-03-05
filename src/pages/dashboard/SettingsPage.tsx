import { motion } from 'framer-motion';
import { User, Lock, Bell, Globe, Moon, Shield } from 'lucide-react';
import { Card, Button, Input } from '@/components/ui';
import { useStore } from '@/store/useStore';

export function SettingsPage() {
  const { isDarkMode, toggleDarkMode } = useStore();

  return (
    <div className="space-y-6 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-sm text-gray-500 mt-1">Gérez votre compte et vos préférences.</p>
      </motion.div>

      {/* Profile */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <User size={18} className="text-primary" />
          <h3 className="font-semibold text-gray-900">Informations personnelles</h3>
        </div>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Prénom" defaultValue="Amadou" />
            <Input label="Nom" defaultValue="Diallo" />
          </div>
          <Input label="Email" type="email" defaultValue="amadou@email.com" />
          <Input label="Téléphone" type="tel" defaultValue="+33 6 12 34 56 78" />
          <Input label="Adresse" defaultValue="12 Rue de la Paix, 75001 Paris" />
          <Button size="sm">Enregistrer</Button>
        </form>
      </Card>

      {/* Security */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <Lock size={18} className="text-primary" />
          <h3 className="font-semibold text-gray-900">Sécurité</h3>
        </div>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <Input label="Mot de passe actuel" type="password" placeholder="••••••••" />
          <Input label="Nouveau mot de passe" type="password" placeholder="Min. 8 caractères" />
          <Input label="Confirmer" type="password" placeholder="Confirmer le mot de passe" />
          <Button size="sm">Changer le mot de passe</Button>
        </form>
      </Card>

      {/* Preferences */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <Shield size={18} className="text-primary" />
          <h3 className="font-semibold text-gray-900">Préférences</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-surface-secondary">
            <div className="flex items-center gap-3">
              <Moon size={18} className="text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">Mode sombre</p>
                <p className="text-xs text-gray-400">Activer le thème sombre</p>
              </div>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`w-11 h-6 rounded-full transition-colors relative ${isDarkMode ? 'bg-primary' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${isDarkMode ? 'left-[22px]' : 'left-0.5'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-surface-secondary">
            <div className="flex items-center gap-3">
              <Bell size={18} className="text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">Notifications email</p>
                <p className="text-xs text-gray-400">Recevoir les rappels par email</p>
              </div>
            </div>
            <button className="w-11 h-6 rounded-full bg-primary transition-colors relative">
              <span className="absolute top-0.5 left-[22px] w-5 h-5 rounded-full bg-white shadow" />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-surface-secondary">
            <div className="flex items-center gap-3">
              <Globe size={18} className="text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">Langue</p>
                <p className="text-xs text-gray-400">Choisir la langue de l'interface</p>
              </div>
            </div>
            <select className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option>Français</option>
              <option>English</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Danger zone */}
      <Card className="border-danger/20">
        <h3 className="font-semibold text-danger mb-2">Zone dangereuse</h3>
        <p className="text-sm text-gray-500 mb-4">Ces actions sont irréversibles.</p>
        <Button variant="danger" size="sm">Supprimer mon compte</Button>
      </Card>
    </div>
  );
}
