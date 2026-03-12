import { motion } from 'framer-motion';
import { Phone, Mail, CheckCircle, Shield, User, AlertTriangle, Info, Copy, Plus, Trash2, Edit3, Save, X } from 'lucide-react';
import { Card, Badge, Button, Input } from '@/components/ui';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { authService, type TrustedPerson } from '@/services/auth.service';

const RELATION_OPTIONS = [
  { value: 'pere', label: 'Père' },
  { value: 'mere', label: 'Mère' },
  { value: 'frere', label: 'Frère' },
  { value: 'soeur', label: 'Sœur' },
  { value: 'ami', label: 'Ami(e)' },
  { value: 'cousin', label: 'Cousin(e)' },
  { value: 'autre', label: 'Autre' },
];

const RELATION_LABELS: Record<string, string> = Object.fromEntries(RELATION_OPTIONS.map(o => [o.value, o.label]));

const RIGHTS = [
  'Déclarer votre décès via le formulaire public',
  'Initier le processus de rapatriement',
  'Suivre le dossier de rapatriement',
  'Contacter le gestionnaire de dossier',
];

type PersonDraft = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  relation: string;
  relationDetails: string;
};

const emptyDraft = (): PersonDraft => ({
  firstName: '', lastName: '', phone: '', email: '', relation: '', relationDetails: '',
});

const toDraft = (p: TrustedPerson): PersonDraft => ({
  firstName: p.firstName,
  lastName: p.lastName,
  phone: p.phone,
  email: p.email || '',
  relation: p.relation,
  relationDetails: p.relationDetails || '',
});

export function TrustedPersonPage() {
  const { trustedPersons, refreshUser } = useAuth();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [drafts, setDrafts] = useState<PersonDraft[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');

  const declarationUrl = `${window.location.origin}/declaration/search`;

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(declarationUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const startEditing = () => {
    setDrafts(trustedPersons.map(toDraft));
    setSaveError('');
    setSaveSuccess('');
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    setDrafts([]);
    setSaveError('');
  };

  const addPerson = () => setDrafts(d => [...d, emptyDraft()]);

  const removePerson = (i: number) => setDrafts(d => d.filter((_, idx) => idx !== i));

  const updateDraft = (i: number, field: keyof PersonDraft, value: string) =>
    setDrafts(d => d.map((p, idx) => idx === i ? { ...p, [field]: value } : p));

  const handleSave = async () => {
    if (drafts.length === 0) {
      setSaveError('Au moins une personne de confiance est requise.');
      return;
    }
    for (const p of drafts) {
      if (!p.firstName || !p.lastName || !p.phone || !p.relation) {
        setSaveError('Veuillez remplir tous les champs obligatoires (prénom, nom, téléphone, relation).');
        return;
      }
      if (p.relation === 'autre' && !p.relationDetails) {
        setSaveError('Veuillez préciser la relation pour "Autre".');
        return;
      }
    }
    setSaving(true);
    setSaveError('');
    setSaveSuccess('');
    try {
      const fd = new FormData();
      const payload = drafts.map(p => ({
        firstName: p.firstName,
        lastName: p.lastName,
        phone: p.phone,
        email: p.email || undefined,
        relation: p.relation,
        relationDetails: p.relation === 'autre' ? p.relationDetails : undefined,
      }));
      fd.append('trustedPersons', JSON.stringify(payload));
      const res = await authService.updateProfile(fd);
      if (res.success) {
        setSaveSuccess('Personnes de confiance mises à jour avec succès.');
        await refreshUser();
        setEditing(false);
      } else {
        setSaveError(res.message);
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string; errors?: string[] } } };
      setSaveError(e.response?.data?.errors?.join(', ') || e.response?.data?.message || 'Erreur lors de la mise à jour.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Personnes de confiance</h1>
            <p className="text-sm text-gray-500 mt-1">
              {trustedPersons.length} personne{trustedPersons.length !== 1 ? 's' : ''} habilitée{trustedPersons.length !== 1 ? 's' : ''} à déclarer votre décès.
            </p>
          </div>
          {!editing && (
            <Button variant="secondary" size="sm" icon={<Edit3 size={14} />} onClick={startEditing}>
              Modifier
            </Button>
          )}
        </div>
      </motion.div>

      {/* Info banner */}
      <Card className="border-l-4 border-l-primary bg-primary/5">
        <div className="flex items-start gap-3">
          <Shield size={18} className="text-primary mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-700 leading-relaxed">
            Vos personnes de confiance peuvent déclarer votre décès via le{' '}
            <Link to="/declaration/search" target="_blank" className="text-primary font-medium underline">
              formulaire de déclaration public
            </Link>
            . Elles <strong>n'ont pas besoin de compte</strong> — elles s'identifient via leur téléphone et un code WhatsApp.
          </p>
        </div>
      </Card>

      {/* Succès global */}
      {saveSuccess && !editing && (
        <div className="flex items-center gap-2 p-3 bg-success/10 rounded-xl text-success text-sm">
          <CheckCircle size={15} /> {saveSuccess}
        </div>
      )}

      {/* === MODE ÉDITION === */}
      {editing ? (
        <Card>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-gray-900">Modifier les personnes de confiance</h3>
            <button onClick={cancelEditing} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100">
              <X size={16} />
            </button>
          </div>

          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700 flex gap-2">
            <AlertTriangle size={13} className="flex-shrink-0 mt-0.5" />
            La liste entière sera remplacée. Toutes les personnes existantes seront supprimées et remplacées par celles ci-dessous.
          </div>

          {saveError && (
            <div className="flex items-center gap-2 mb-4 p-3 bg-danger/10 rounded-xl text-danger text-sm">
              <AlertTriangle size={14} /> {saveError}
            </div>
          )}

          <div className="space-y-4">
            {drafts.map((p, i) => (
              <div key={i} className="p-4 border border-gray-200 rounded-xl bg-gray-50/50 relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Personne {i + 1}
                  </span>
                  {drafts.length > 1 && (
                    <button
                      onClick={() => removePerson(i)}
                      className="p-1 rounded-lg text-gray-400 hover:text-danger hover:bg-danger/10 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Input
                    label="Prénom *"
                    value={p.firstName}
                    onChange={(e) => updateDraft(i, 'firstName', e.target.value)}
                    placeholder="Prénom"
                  />
                  <Input
                    label="Nom *"
                    value={p.lastName}
                    onChange={(e) => updateDraft(i, 'lastName', e.target.value)}
                    placeholder="Nom"
                  />
                  <Input
                    label="Téléphone *"
                    type="tel"
                    value={p.phone}
                    onChange={(e) => updateDraft(i, 'phone', e.target.value)}
                    placeholder="+221..."
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={p.email}
                    onChange={(e) => updateDraft(i, 'email', e.target.value)}
                    placeholder="optionnel"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Relation *</label>
                    <select
                      value={p.relation}
                      onChange={(e) => updateDraft(i, 'relation', e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">Sélectionner...</option>
                      {RELATION_OPTIONS.map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>
                  {p.relation === 'autre' && (
                    <Input
                      label="Préciser la relation *"
                      value={p.relationDetails}
                      onChange={(e) => updateDraft(i, 'relationDetails', e.target.value)}
                      placeholder="Ex: Oncle maternel"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={addPerson}
              className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 font-medium"
            >
              <Plus size={15} /> Ajouter une personne
            </button>
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              onClick={handleSave}
              icon={<Save size={14} />}
              disabled={saving}
            >
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
            <Button variant="ghost" onClick={cancelEditing} disabled={saving}>
              Annuler
            </Button>
          </div>
        </Card>
      ) : (
        /* === MODE LECTURE === */
        <>
          {trustedPersons.length === 0 ? (
            <Card>
              <div className="text-center py-10">
                <div className="w-16 h-16 mx-auto mb-4 bg-orange-50 rounded-2xl flex items-center justify-center">
                  <AlertTriangle size={28} className="text-orange-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune personne de confiance</h3>
                <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
                  Vous n'avez pas encore désigné de personne de confiance.
                </p>
                <Button variant="primary" icon={<Plus size={15} />} onClick={startEditing}>
                  Ajouter une personne
                </Button>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {trustedPersons.map((person, index) => (
                <motion.div
                  key={person.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <User size={22} className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="text-base font-semibold text-gray-900">
                            {person.firstName} {person.lastName}
                          </h3>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                            {RELATION_LABELS[person.relation] || person.relation}
                            {person.relation === 'autre' && person.relationDetails
                              ? ` — ${person.relationDetails}` : ''}
                          </span>
                          <Badge variant="success" dot size="sm">Enregistrée</Badge>
                        </div>
                        <div className="flex flex-wrap gap-4 mt-2">
                          <span className="flex items-center gap-1.5 text-sm text-gray-600">
                            <Phone size={14} className="text-primary" />
                            {person.phone}
                          </span>
                          {person.email && (
                            <span className="flex items-center gap-1.5 text-sm text-gray-600">
                              <Mail size={14} className="text-primary" />
                              {person.email}
                            </span>
                          )}
                        </div>
                        <div className="mt-4 p-3 bg-gray-50 rounded-xl">
                          <p className="text-xs font-semibold text-gray-700 mb-2">Droits accordés :</p>
                          <div className="grid sm:grid-cols-2 gap-1.5">
                            {RIGHTS.map((right) => (
                              <div key={right} className="flex items-center gap-1.5 text-xs text-gray-600">
                                <CheckCircle size={12} className="text-primary flex-shrink-0" />
                                {right}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <code className="flex-1 text-xs text-primary bg-white px-3 py-2 rounded-lg border border-gray-200 truncate">
                            {declarationUrl}
                          </code>
                          <button
                            onClick={() => handleCopy(person.id)}
                            className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white text-xs font-medium rounded-lg hover:bg-primary/90 transition-colors flex-shrink-0"
                          >
                            {copiedId === person.id ? <CheckCircle size={13} /> : <Copy size={13} />}
                            {copiedId === person.id ? 'Copié' : 'Partager'}
                          </button>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                          <Info size={10} />
                          Partagez ce lien avec cette personne pour qu'elle puisse déclarer votre décès.
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
