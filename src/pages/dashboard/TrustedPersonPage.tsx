import { motion } from 'framer-motion';
import { Heart, Phone, Mail, Edit, Plus, CheckCircle, Shield } from 'lucide-react';
import { Card, Badge, Button, Input } from '@/components/ui';
import { useState } from 'react';

export function TrustedPersonPage() {
  const [editing, setEditing] = useState(false);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Personne de confiance</h1>
        <p className="text-sm text-gray-500 mt-1">Cette personne pourra déclarer un décès et gérer votre dossier.</p>
      </motion.div>

      <Card className="border-l-4 border-l-primary">
        <div className="flex items-start gap-3 mb-4">
          <Shield size={18} className="text-primary mt-0.5" />
          <p className="text-sm text-gray-600 leading-relaxed">
            La personne de confiance est la seule personne habilitée à déclarer un décès et à initier le processus de rapatriement. Choisissez une personne de confiance proche et fiable.
          </p>
        </div>
      </Card>

      {!editing ? (
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-900">Personne désignée</h3>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" icon={<Edit size={14} />} onClick={() => setEditing(true)}>
                Modifier
              </Button>
              <Button variant="ghost" size="sm" icon={<Plus size={14} />}>
                Ajouter
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface-secondary mb-6">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
              <Heart size={24} className="text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="text-lg font-semibold text-gray-900">Fatou Diallo</h4>
                <Badge variant="success" dot size="sm">Vérifié</Badge>
              </div>
              <p className="text-sm text-gray-500">Soeur</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100">
              <Phone size={16} className="text-primary" />
              <div>
                <p className="text-xs text-gray-400">Téléphone</p>
                <p className="text-sm font-medium text-gray-900">+33 6 12 34 56 78</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100">
              <Mail size={16} className="text-primary" />
              <div>
                <p className="text-xs text-gray-400">Email</p>
                <p className="text-sm font-medium text-gray-900">fatou@email.com</p>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <h4 className="text-sm font-semibold text-gray-900">Droits accordés</h4>
            {[
              'Déclarer un décès',
              'Télécharger les documents du dossier',
              'Contacter le gestionnaire de dossier',
              'Suivre le processus de rapatriement',
            ].map((right) => (
              <div key={right} className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle size={14} className="text-primary" />
                {right}
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <Card>
          <h3 className="font-semibold text-gray-900 mb-6">Modifier la personne de confiance</h3>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setEditing(false); }}>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Prénom" placeholder="Fatou" defaultValue="Fatou" />
              <Input label="Nom" placeholder="Diallo" defaultValue="Diallo" />
            </div>
            <Input label="Téléphone" type="tel" placeholder="+33 6 12 34 56 78" defaultValue="+33 6 12 34 56 78" />
            <Input label="Email" type="email" placeholder="fatou@email.com" defaultValue="fatou@email.com" />
            <Input label="Lien de parenté" placeholder="Soeur" defaultValue="Soeur" />
            <div className="flex gap-3">
              <Button type="submit">Enregistrer</Button>
              <Button variant="ghost" onClick={() => setEditing(false)}>Annuler</Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}
