import { motion } from 'framer-motion';
import { User, Lock, Bell, Globe, Moon, Shield, CheckCircle, AlertTriangle, Save, Upload, X } from 'lucide-react';
import { Card, Button, Input, Badge } from '@/components/ui';
import { useStore } from '@/store/useStore';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useRef } from 'react';
import { authService } from '@/services/auth.service';

const MARITAL_STATUS_OPTIONS = [
  { value: 'celibataire', label: 'Célibataire' },
  { value: 'marie', label: 'Marié(e)' },
  { value: 'divorce', label: 'Divorcé(e)' },
  { value: 'veuf', label: 'Veuf/Veuve' },
  { value: 'separe', label: 'Séparé(e)' },
  { value: 'union_libre', label: 'Union libre' },
];

export function SettingsPage() {
  const { isDarkMode, toggleDarkMode } = useStore();
  const { user, refreshUser } = useAuth();

  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    maritalStatus: user?.maritalStatus || '',
    residenceCountry: user?.residenceCountry || '',
    residenceAddress: user?.residenceAddress || '',
    repatriationCountry: user?.repatriationCountry || '',
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  const [passwordForm, setPasswordForm] = useState({ current: '', next: '', confirm: '' });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [docFiles, setDocFiles] = useState<{ cniRecto?: File; cniVerso?: File; identityPhoto?: File }>({});
  const [docLoading, setDocLoading] = useState(false);
  const [docSuccess, setDocSuccess] = useState('');
  const [docError, setDocError] = useState('');
  const cniRectoRef = useRef<HTMLInputElement>(null);
  const cniVersoRef = useRef<HTMLInputElement>(null);
  const photoRef = useRef<HTMLInputElement>(null);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileError('');
    setProfileSuccess('');
    try {
      const fd = new FormData();
      Object.entries(profileForm).forEach(([k, v]) => { if (v) fd.append(k, v); });
      const res = await authService.updateProfile(fd);
      if (res.success) {
        setProfileSuccess(`Profil mis à jour : ${res.data.updatedFields.join(', ') || 'aucune modification'}`);
        await refreshUser();
      } else {
        setProfileError(res.message);
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string; errors?: string[] } } };
      setProfileError(e.response?.data?.errors?.join(', ') || e.response?.data?.message || 'Erreur lors de la mise à jour.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.next !== passwordForm.confirm) {
      setPasswordError('Les mots de passe ne correspondent pas.');
      return;
    }
    setPasswordLoading(true);
    setPasswordError('');
    setPasswordSuccess('');
    try {
      const fd = new FormData();
      fd.append('currentPassword', passwordForm.current);
      fd.append('newPassword', passwordForm.next);
      fd.append('confirmNewPassword', passwordForm.confirm);
      const res = await authService.updateProfile(fd);
      if (res.success) {
        setPasswordSuccess('Mot de passe mis à jour avec succès.');
        setPasswordForm({ current: '', next: '', confirm: '' });
      } else {
        setPasswordError(res.message);
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setPasswordError(e.response?.data?.message || 'Erreur lors du changement de mot de passe.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDocSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docFiles.cniRecto && !docFiles.cniVerso && !docFiles.identityPhoto) {
      setDocError('Sélectionnez au moins un fichier à mettre à jour.');
      return;
    }
    setDocLoading(true);
    setDocError('');
    setDocSuccess('');
    try {
      const fd = new FormData();
      if (docFiles.cniRecto) fd.append('cniRecto', docFiles.cniRecto);
      if (docFiles.cniVerso) fd.append('cniVerso', docFiles.cniVerso);
      if (docFiles.identityPhoto) fd.append('identityPhoto', docFiles.identityPhoto);
      const res = await authService.updateProfile(fd);
      if (res.success) {
        setDocSuccess('Documents mis à jour avec succès.');
        setDocFiles({});
        await refreshUser();
      } else {
        setDocError(res.message);
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setDocError(e.response?.data?.message || 'Erreur lors de la mise à jour des documents.');
    } finally {
      setDocLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-sm text-gray-500 mt-1">Modifiez vos informations de compte.</p>
      </motion.div>

      {/* Statut compte */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-primary" />
            <h3 className="font-semibold text-gray-900">Statut du compte</h3>
          </div>
          <Badge
            variant={user?.registrationStatus === 'approved' ? 'success' : user?.registrationStatus === 'rejected' ? 'danger' : 'warning'}
            dot
          >
            {user?.registrationStatus === 'approved' ? 'Approuvé' : user?.registrationStatus === 'rejected' ? 'Rejeté' : 'En attente'}
          </Badge>
        </div>
        <div className="grid sm:grid-cols-3 gap-3 text-sm">
          <div className="p-3 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-400 mb-0.5">Email</p>
            <p className="font-medium text-gray-900 break-all">{user?.email || '—'}</p>
            <p className="text-xs text-gray-400 mt-1">(non modifiable)</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-400 mb-0.5">Formule</p>
            <Badge variant="primary" size="sm">{user?.planType === 'family' ? 'Familiale' : 'Individuelle'}</Badge>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-400 mb-0.5">Membre depuis</p>
            <p className="font-medium text-gray-900">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
            </p>
          </div>
        </div>
        {user?.registrationStatus === 'rejected' && user.rejectionReason && (
          <div className="mt-3 flex gap-2 p-3 bg-red-50 rounded-xl border border-red-200">
            <AlertTriangle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-red-800">Motif du rejet</p>
              <p className="text-xs text-red-700 mt-0.5">{user.rejectionReason}</p>
            </div>
          </div>
        )}
      </Card>

      {/* Informations personnelles */}
      <Card>
        <div className="flex items-center gap-3 mb-5">
          <User size={18} className="text-primary" />
          <h3 className="font-semibold text-gray-900">Informations personnelles</h3>
        </div>
        {profileSuccess && (
          <div className="flex items-center gap-2 mb-4 p-3 bg-success/10 rounded-xl text-success text-sm">
            <CheckCircle size={15} /> {profileSuccess}
          </div>
        )}
        {profileError && (
          <div className="flex items-center gap-2 mb-4 p-3 bg-danger/10 rounded-xl text-danger text-sm">
            <AlertTriangle size={15} /> {profileError}
          </div>
        )}
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Prénom"
              value={profileForm.firstName}
              onChange={(e) => setProfileForm(p => ({ ...p, firstName: e.target.value }))}
            />
            <Input
              label="Nom"
              value={profileForm.lastName}
              onChange={(e) => setProfileForm(p => ({ ...p, lastName: e.target.value }))}
            />
          </div>
          <Input
            label="Téléphone"
            type="tel"
            placeholder="+221..."
            value={profileForm.phone}
            onChange={(e) => setProfileForm(p => ({ ...p, phone: e.target.value }))}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Situation matrimoniale</label>
            <select
              value={profileForm.maritalStatus}
              onChange={(e) => setProfileForm(p => ({ ...p, maritalStatus: e.target.value }))}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Sélectionner...</option>
              {MARITAL_STATUS_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Pays de résidence"
              value={profileForm.residenceCountry}
              onChange={(e) => setProfileForm(p => ({ ...p, residenceCountry: e.target.value }))}
            />
            <Input
              label="Pays de rapatriement"
              value={profileForm.repatriationCountry}
              onChange={(e) => setProfileForm(p => ({ ...p, repatriationCountry: e.target.value }))}
            />
          </div>
          <Input
            label="Adresse de résidence"
            value={profileForm.residenceAddress}
            onChange={(e) => setProfileForm(p => ({ ...p, residenceAddress: e.target.value }))}
          />
          <Button type="submit" size="sm" icon={<Save size={14} />} disabled={profileLoading}>
            {profileLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </Button>
        </form>
      </Card>

      {/* Mot de passe */}
      <Card>
        <div className="flex items-center gap-3 mb-5">
          <Lock size={18} className="text-primary" />
          <h3 className="font-semibold text-gray-900">Changer le mot de passe</h3>
        </div>
        {passwordSuccess && (
          <div className="flex items-center gap-2 mb-4 p-3 bg-success/10 rounded-xl text-success text-sm">
            <CheckCircle size={15} /> {passwordSuccess}
          </div>
        )}
        {passwordError && (
          <div className="flex items-center gap-2 mb-4 p-3 bg-danger/10 rounded-xl text-danger text-sm">
            <AlertTriangle size={15} /> {passwordError}
          </div>
        )}
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <Input
            label="Mot de passe actuel"
            type="password"
            placeholder="••••••••"
            value={passwordForm.current}
            onChange={(e) => setPasswordForm(p => ({ ...p, current: e.target.value }))}
          />
          <Input
            label="Nouveau mot de passe"
            type="password"
            placeholder="Min. 8 car., 1 maj, 1 min, 1 chiffre, 1 spécial"
            value={passwordForm.next}
            onChange={(e) => setPasswordForm(p => ({ ...p, next: e.target.value }))}
          />
          <Input
            label="Confirmer le nouveau mot de passe"
            type="password"
            placeholder="Même mot de passe"
            value={passwordForm.confirm}
            onChange={(e) => setPasswordForm(p => ({ ...p, confirm: e.target.value }))}
          />
          <Button type="submit" size="sm" icon={<Lock size={14} />} disabled={passwordLoading || !passwordForm.current || !passwordForm.next}>
            {passwordLoading ? 'Modification...' : 'Changer le mot de passe'}
          </Button>
        </form>
      </Card>

      {/* Documents d'identité */}
      <Card>
        <div className="flex items-center gap-3 mb-5">
          <Upload size={18} className="text-primary" />
          <h3 className="font-semibold text-gray-900">Mettre à jour les documents</h3>
        </div>
        {docSuccess && (
          <div className="flex items-center gap-2 mb-4 p-3 bg-success/10 rounded-xl text-success text-sm">
            <CheckCircle size={15} /> {docSuccess}
          </div>
        )}
        {docError && (
          <div className="flex items-center gap-2 mb-4 p-3 bg-danger/10 rounded-xl text-danger text-sm">
            <AlertTriangle size={15} /> {docError}
          </div>
        )}
        <form onSubmit={handleDocSubmit} className="space-y-3">
          {([
            { key: 'cniRecto', label: 'CNI — Recto', ref: cniRectoRef },
            { key: 'cniVerso', label: 'CNI — Verso', ref: cniVersoRef },
            { key: 'identityPhoto', label: 'Photo d\'identité', ref: photoRef },
          ] as const).map(({ key, label, ref }) => (
            <div key={key} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-700">{label}</p>
                {docFiles[key] ? (
                  <p className="text-xs text-primary mt-0.5">{docFiles[key]!.name}</p>
                ) : (
                  <p className="text-xs text-gray-400 mt-0.5">Aucun fichier sélectionné</p>
                )}
              </div>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                ref={ref}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setDocFiles(d => ({ ...d, [key]: file }));
                }}
              />
              {docFiles[key] ? (
                <button
                  type="button"
                  onClick={() => setDocFiles(d => { const n = { ...d }; delete n[key]; return n; })}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-danger hover:bg-danger/10 transition-colors"
                >
                  <X size={14} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => ref.current?.click()}
                  className="text-xs px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium"
                >
                  Parcourir
                </button>
              )}
            </div>
          ))}
          <Button type="submit" size="sm" icon={<Upload size={14} />} disabled={docLoading || Object.keys(docFiles).length === 0}>
            {docLoading ? 'Envoi...' : 'Mettre à jour les documents'}
          </Button>
        </form>
      </Card>

      {/* Préférences */}
      <Card>
        <div className="flex items-center gap-3 mb-5">
          <Shield size={18} className="text-primary" />
          <h3 className="font-semibold text-gray-900">Préférences</h3>
        </div>
        <div className="space-y-3">
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
                <p className="text-xs text-gray-400">Recevoir les rappels et alertes</p>
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
                <p className="text-xs text-gray-400">Interface en français</p>
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
        <p className="text-sm text-gray-500 mb-4">Ces actions sont irréversibles. Contactez le support pour supprimer votre compte.</p>
        <Button variant="danger" size="sm" disabled>Supprimer mon compte</Button>
      </Card>
    </div>
  );
}
