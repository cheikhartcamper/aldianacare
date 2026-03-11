import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Shield, Bell, Globe, Loader2, CheckCircle } from 'lucide-react';
import { Card, Button, Input } from '@/components/ui';
import { adminService, type AdminSettings as AdminSettingsType } from '@/services/admin.service';

export function AdminSettingsPage() {
  const [settings, setSettings] = useState<AdminSettingsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [maxTrusted, setMaxTrusted] = useState(3);
  const [allowedRelations, setAllowedRelations] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await adminService.getSettings();
        if (res.success) {
          setSettings(res.data);
          setMaxTrusted(res.data.maxTrustedPersons);
          setAllowedRelations(res.data.allowedRelations.join(', '));
        }
      } catch { /* ignore */ }
      setLoading(false);
    };
    fetch();
  }, []);

  const handleSaveSettings = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await adminService.updateSettings({
        maxTrustedPersons: maxTrusted,
        allowedRelations: allowedRelations.split(',').map(s => s.trim()).filter(Boolean),
      });
      if (res.success) {
        setSettings(res.data);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch { /* ignore */ }
    setSaving(false);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-sm text-gray-500 mt-1">Configuration de la plateforme.</p>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="animate-spin text-primary" />
        </div>
      ) : (
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <Settings size={18} className="text-primary" />
            <h3 className="font-semibold text-gray-900">Paramètres de la plateforme</h3>
          </div>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSaveSettings(); }}>
            <Input label="Nombre max de personnes de confiance" type="number" value={String(maxTrusted)} onChange={(e) => setMaxTrusted(Number(e.target.value))} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Relations autorisées (séparées par virgule)</label>
              <textarea
                value={allowedRelations}
                onChange={(e) => setAllowedRelations(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
              />
            </div>
            {settings && (
              <p className="text-xs text-gray-400">Dernière modification : {new Date(settings.updatedAt).toLocaleString('fr-FR')}</p>
            )}
            <div className="flex items-center gap-3">
              <Button size="sm" disabled={saving}>
                {saving ? <><Loader2 size={14} className="animate-spin mr-1" /> Enregistrement...</> : 'Enregistrer'}
              </Button>
              {saved && <span className="text-sm text-primary flex items-center gap-1"><CheckCircle size={14} /> Enregistré</span>}
            </div>
          </form>
        </Card>
      )}

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
