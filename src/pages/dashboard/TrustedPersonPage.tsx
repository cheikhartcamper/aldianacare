import { motion } from 'framer-motion';
import { Phone, Mail, CheckCircle, Shield, User, AlertTriangle, Info, Copy, Plus, Trash2, Edit3, Save, X, Loader2 } from 'lucide-react';
import { Card, Badge, Button, Input, PhoneInput } from '@/components/ui';
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

function getApiError(err: unknown): string {
  const e = err as { response?: { data?: { message?: string; errors?: string[] } } };
  return e.response?.data?.errors?.join(', ') || e.response?.data?.message || 'Une erreur est survenue.';
}

export function TrustedPersonPage() {
  const { trustedPersons, refreshUser } = useAuth();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  // Inline edit state: which person ID is being edited
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<PersonDraft>(emptyDraft());
  // Add new person state
  const [showAddForm, setShowAddForm] = useState(false);
  const [addDraft, setAddDraft] = useState<PersonDraft>(emptyDraft());
  // Loading & messages
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [globalError, setGlobalError] = useState('');
  const [globalSuccess, setGlobalSuccess] = useState('');

  const declarationUrl = `${window.location.origin}/declaration/search`;

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(declarationUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearMessages = () => { setGlobalError(''); setGlobalSuccess(''); };

  // ===== EDIT an existing person =====
  const startEdit = (person: TrustedPerson) => {
    clearMessages();
    setEditingId(person.id);
    setEditDraft(toDraft(person));
    setShowAddForm(false);
  };

  const cancelEdit = () => { setEditingId(null); setEditDraft(emptyDraft()); };

  const handleSaveEdit = async (personId: string) => {
    if (!editDraft.firstName || !editDraft.lastName || !editDraft.phone || !editDraft.relation) {
      setGlobalError('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    if (editDraft.relation === 'autre' && !editDraft.relationDetails) {
      setGlobalError('Veuillez préciser la relation pour "Autre".');
      return;
    }
    clearMessages();
    setActionLoading(personId);
    try {
      const payload: Record<string, string> = {
        firstName: editDraft.firstName,
        lastName: editDraft.lastName,
        phone: editDraft.phone,
        relation: editDraft.relation,
      };
      if (editDraft.email) payload.email = editDraft.email;
      if (editDraft.relation === 'autre') payload.relationDetails = editDraft.relationDetails;
      const res = await authService.updateTrustedPerson(personId, payload);
      if (res.success) {
        setGlobalSuccess(`${editDraft.firstName} ${editDraft.lastName} modifié(e) avec succès.`);
        await refreshUser();
        setEditingId(null);
      } else {
        setGlobalError(res.message);
      }
    } catch (err: unknown) {
      setGlobalError(getApiError(err));
    } finally {
      setActionLoading(null);
    }
  };

  // ===== DELETE a person =====
  const handleDelete = async (person: TrustedPerson) => {
    if (!confirm(`Supprimer ${person.firstName} ${person.lastName} de vos personnes de confiance ?`)) return;
    clearMessages();
    setActionLoading(person.id);
    try {
      const res = await authService.deleteTrustedPerson(person.id);
      if (res.success) {
        setGlobalSuccess(`${person.firstName} ${person.lastName} supprimé(e) avec succès.`);
        await refreshUser();
      } else {
        setGlobalError(res.message);
      }
    } catch (err: unknown) {
      setGlobalError(getApiError(err));
    } finally {
      setActionLoading(null);
    }
  };

  // ===== ADD a new person =====
  const openAddForm = () => {
    clearMessages();
    setShowAddForm(true);
    setAddDraft(emptyDraft());
    setEditingId(null);
  };

  const cancelAdd = () => { setShowAddForm(false); setAddDraft(emptyDraft()); };

  const handleAdd = async () => {
    if (!addDraft.firstName || !addDraft.lastName || !addDraft.phone || !addDraft.relation) {
      setGlobalError('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    if (addDraft.relation === 'autre' && !addDraft.relationDetails) {
      setGlobalError('Veuillez préciser la relation pour "Autre".');
      return;
    }
    clearMessages();
    setActionLoading('add');
    try {
      const payload: {
        firstName: string; lastName: string; phone: string; relation: string;
        email?: string; relationDetails?: string;
      } = {
        firstName: addDraft.firstName,
        lastName: addDraft.lastName,
        phone: addDraft.phone,
        relation: addDraft.relation,
      };
      if (addDraft.email) payload.email = addDraft.email;
      if (addDraft.relation === 'autre') payload.relationDetails = addDraft.relationDetails;
      const res = await authService.addTrustedPerson(payload);
      if (res.success) {
        setGlobalSuccess(`${addDraft.firstName} ${addDraft.lastName} ajouté(e) avec succès.`);
        await refreshUser();
        setShowAddForm(false);
        setAddDraft(emptyDraft());
      } else {
        setGlobalError(res.message);
      }
    } catch (err: unknown) {
      setGlobalError(getApiError(err));
    } finally {
      setActionLoading(null);
    }
  };

  // ===== FORM RENDERER =====
  const renderForm = (
    draft: PersonDraft,
    setField: (field: keyof PersonDraft, value: string) => void,
    onSave: () => void,
    onCancel: () => void,
    loading: boolean,
    title: string,
  ) => (
    <Card className="border-2 border-primary/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
        <button onClick={onCancel} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100">
          <X size={16} />
        </button>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <Input label="Prénom *" value={draft.firstName} onChange={(e) => setField('firstName', e.target.value)} placeholder="Prénom" />
        <Input label="Nom *" value={draft.lastName} onChange={(e) => setField('lastName', e.target.value)} placeholder="Nom" />
        <PhoneInput label="Téléphone *" value={draft.phone} onChange={(v) => setField('phone', v)} />
        <Input label="Email" type="email" value={draft.email} onChange={(e) => setField('email', e.target.value)} placeholder="optionnel" />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Relation *</label>
          <select
            value={draft.relation}
            onChange={(e) => setField('relation', e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Sélectionner...</option>
            {RELATION_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        {draft.relation === 'autre' && (
          <Input label="Préciser la relation *" value={draft.relationDetails} onChange={(e) => setField('relationDetails', e.target.value)} placeholder="Ex: Oncle maternel" />
        )}
      </div>
      <div className="flex gap-3 mt-4">
        <Button onClick={onSave} icon={loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} disabled={loading}>
          {loading ? 'Enregistrement...' : 'Enregistrer'}
        </Button>
        <Button variant="ghost" onClick={onCancel} disabled={loading}>Annuler</Button>
      </div>
    </Card>
  );

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
          {!showAddForm && !editingId && (
            <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={openAddForm}>
              Ajouter
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

      {/* Messages */}
      {globalSuccess && (
        <div className="flex items-center gap-2 p-3 bg-success/10 rounded-xl text-success text-sm">
          <CheckCircle size={15} /> {globalSuccess}
        </div>
      )}
      {globalError && (
        <div className="flex items-center gap-2 p-3 bg-danger/10 rounded-xl text-danger text-sm">
          <AlertTriangle size={14} /> {globalError}
        </div>
      )}

      {/* === ADD FORM === */}
      {showAddForm && renderForm(
        addDraft,
        (field, value) => setAddDraft(d => ({ ...d, [field]: value })),
        handleAdd,
        cancelAdd,
        actionLoading === 'add',
        'Ajouter une personne de confiance',
      )}

      {/* === PERSON LIST === */}
      {trustedPersons.length === 0 && !showAddForm ? (
        <Card>
          <div className="text-center py-10">
            <div className="w-16 h-16 mx-auto mb-4 bg-orange-50 rounded-2xl flex items-center justify-center">
              <AlertTriangle size={28} className="text-orange-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune personne de confiance</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
              Vous n'avez pas encore désigné de personne de confiance.
            </p>
            <Button variant="primary" icon={<Plus size={15} />} onClick={openAddForm}>
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
              {/* Inline edit form for this person */}
              {editingId === person.id ? (
                renderForm(
                  editDraft,
                  (field, value) => setEditDraft(d => ({ ...d, [field]: value })),
                  () => handleSaveEdit(person.id),
                  cancelEdit,
                  actionLoading === person.id,
                  `Modifier — ${person.firstName} ${person.lastName}`,
                )
              ) : (
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

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 mt-3">
                        <button
                          onClick={() => startEdit(person)}
                          disabled={!!actionLoading}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors disabled:opacity-50"
                        >
                          <Edit3 size={12} /> Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(person)}
                          disabled={!!actionLoading || trustedPersons.length <= 1}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-danger bg-danger/10 rounded-lg hover:bg-danger/20 transition-colors disabled:opacity-50"
                          title={trustedPersons.length <= 1 ? 'Vous devez conserver au moins 1 personne de confiance' : ''}
                        >
                          {actionLoading === person.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                          Supprimer
                        </button>
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
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
