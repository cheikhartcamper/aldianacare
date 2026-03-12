import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, CheckCircle, Info } from 'lucide-react';
import { Card, Button, Input, PageLoader, BrandSpinner } from '@/components/ui';
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
        <PageLoader variant="inline" size="sm" label="Chargement des paramètres..." />
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
                {saving ? <><BrandSpinner size={14} /> <span className="ml-1.5">Enregistrement...</span></> : 'Enregistrer'}
              </Button>
              {saved && <span className="text-sm text-primary flex items-center gap-1"><CheckCircle size={14} /> Enregistré</span>}
            </div>
          </form>
        </Card>
      )}

      <Card className="border-l-4 border-l-info">
        <div className="flex items-start gap-3">
          <Info size={18} className="text-info mt-0.5 flex-shrink-0" />
          <div className="text-sm text-gray-600 leading-relaxed space-y-1">
            <p className="font-medium text-gray-900">Paramètres supplémentaires à venir</p>
            <p>
              Les sections de configuration des commissions, notifications et pays couverts
              seront ajoutées lorsque les modules correspondants seront disponibles côté API.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
