import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Plus, Trash2, Edit3, CheckCircle, Clock, Upload, X } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { adminService, type HealthDeclaration } from '@/services/admin.service';

export function AdminHealthDeclarationsPage() {
  const [declarations, setDeclarations] = useState<HealthDeclaration[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<HealthDeclaration | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [activating, setActivating] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', contentText: '' });
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchDeclarations = async () => {
    setLoading(true);
    try {
      const res = await adminService.getHealthDeclarations();
      if (res.success) {
        const list = Array.isArray(res.data) ? res.data : [];
        setDeclarations(list);
      }
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { fetchDeclarations(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ title: '', contentText: '' });
    setFile(null);
    setError('');
    setShowForm(true);
  };

  const openEdit = (d: HealthDeclaration) => {
    setEditing(d);
    setForm({ title: d.title, contentText: d.contentText ?? '' });
    setFile(null);
    setError('');
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { setError('Le titre est requis.'); return; }
    setSubmitting(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      if (form.contentText) fd.append('contentText', form.contentText);
      if (file) fd.append('document', file);

      if (editing) {
        const res = await adminService.updateHealthDeclaration(editing.id, fd);
        if (res.success) {
          setDeclarations(prev => prev.map(d => d.id === editing!.id ? res.data : d));
        }
      } else {
        const res = await adminService.createHealthDeclaration(fd);
        if (res.success) {
          setDeclarations(prev => [...prev, res.data]);
        }
      }
      setShowForm(false);
    } catch { setError('Erreur lors de la sauvegarde. Réessayez.'); }
    setSubmitting(false);
  };

  const handleActivate = async (id: string) => {
    setActivating(id);
    try {
      const res = await adminService.activateHealthDeclaration(id);
      if (res.success) {
        setDeclarations(prev => prev.map(d => ({ ...d, isActive: d.id === id })));
      }
    } catch { /* ignore */ }
    setActivating(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette déclaration ?')) return;
    setDeleting(id);
    try {
      await adminService.deleteHealthDeclaration(id);
      setDeclarations(prev => prev.filter(d => d.id !== id));
    } catch { /* ignore */ }
    setDeleting(null);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Déclarations sur l'honneur</h1>
          <p className="text-sm text-gray-500 mt-1">Gestion des documents de déclaration de santé présentés aux adhérents.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors"
        >
          <Plus size={15} /> Ajouter
        </button>
      </motion.div>

      {/* Form modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <Card className="border-primary/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">{editing ? 'Modifier' : 'Nouvelle déclaration'}</h3>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-700 transition-colors">
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Titre *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="Ex : Déclaration de bon état de santé"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Contenu texte (optionnel)</label>
                  <textarea
                    value={form.contentText}
                    onChange={e => setForm(f => ({ ...f, contentText: e.target.value }))}
                    rows={5}
                    placeholder="Texte de la déclaration affiché à l'adhérent…"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Document PDF / image (optionnel)</label>
                  <div
                    className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:border-primary/40 transition-colors"
                    onClick={() => fileRef.current?.click()}
                  >
                    <Upload size={20} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-xs text-gray-400">
                      {file ? file.name : editing?.documentPath ? 'Fichier existant — cliquez pour remplacer' : 'Cliquez pour sélectionner un fichier (PDF, image)'}
                    </p>
                    <input
                      ref={fileRef}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.webp"
                      className="hidden"
                      onChange={e => setFile(e.target.files?.[0] ?? null)}
                    />
                  </div>
                </div>
                {error && <p className="text-xs text-danger">{error}</p>}
                <div className="flex gap-3">
                  <button type="submit" disabled={submitting} className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-dark disabled:opacity-50 transition-colors">
                    {submitting ? 'Enregistrement…' : editing ? 'Mettre à jour' : 'Créer'}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors">
                    Annuler
                  </button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      {loading ? (
        <Card><div className="py-12 text-center text-sm text-gray-400">Chargement…</div></Card>
      ) : declarations.length === 0 ? (
        <Card>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText size={36} className="text-gray-200 mb-4" />
            <p className="text-sm text-gray-500">Aucune déclaration créée.</p>
            <p className="text-xs text-gray-400 mt-1">Cliquez sur "Ajouter" pour créer votre première déclaration.</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {declarations.map((d, i) => (
            <motion.div key={d.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card>
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${d.isActive ? 'bg-success/10' : 'bg-gray-100'}`}>
                    <FileText size={18} className={d.isActive ? 'text-success' : 'text-gray-400'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900 text-sm">{d.title}</h3>
                      {d.isActive ? (
                        <Badge variant="success" size="sm"><CheckCircle size={10} className="mr-1" />Active</Badge>
                      ) : (
                        <Badge variant="neutral" size="sm"><Clock size={10} className="mr-1" />Inactive</Badge>
                      )}
                    </div>
                    {d.contentText && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">{d.contentText}</p>
                    )}
                    <p className="text-[10px] text-gray-300 mt-2">
                      Créée le {new Date(d.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      {d.documentPath && ' · Document joint'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!d.isActive && (
                      <button
                        onClick={() => handleActivate(d.id)}
                        disabled={activating === d.id}
                        className="text-xs font-medium text-primary hover:text-primary-dark disabled:opacity-50 transition-colors"
                      >
                        {activating === d.id ? '…' : 'Activer'}
                      </button>
                    )}
                    <button
                      onClick={() => openEdit(d)}
                      className="p-1.5 text-gray-400 hover:text-primary transition-colors rounded-lg hover:bg-primary/5"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(d.id)}
                      disabled={deleting === d.id}
                      className="p-1.5 text-gray-400 hover:text-danger transition-colors rounded-lg hover:bg-danger/5 disabled:opacity-50"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
