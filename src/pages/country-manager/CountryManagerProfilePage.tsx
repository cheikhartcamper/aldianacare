import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Mail, Phone, CheckCircle, AlertTriangle, Save, Eye, EyeOff } from 'lucide-react';
import { Card, Button, Input, Badge } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/auth.service';

export function CountryManagerProfilePage() {
  const { user, refreshUser } = useAuth();

  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  const [passwordForm, setPasswordForm] = useState({ current: '', next: '', confirm: '' });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileError('');
    setProfileSuccess('');
    try {
      const fd = new FormData();
      if (profileForm.firstName) fd.append('firstName', profileForm.firstName);
      if (profileForm.lastName) fd.append('lastName', profileForm.lastName);
      if (profileForm.phone) fd.append('phone', profileForm.phone);
      const res = await authService.updateProfile(fd);
      if (res.success) {
        setProfileSuccess('Profil mis à jour avec succès.');
        await refreshUser();
      } else {
        setProfileError(res.message);
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string; errors?: string[] } } };
      setProfileError(
        e.response?.data?.errors?.join(', ') ||
        e.response?.data?.message ||
        'Erreur lors de la mise à jour.'
      );
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
      fd.append('confirmPassword', passwordForm.confirm);
      const res = await authService.updateProfile(fd);
      if (res.success) {
        setPasswordSuccess('Mot de passe mis à jour avec succès.');
        setPasswordForm({ current: '', next: '', confirm: '' });
      } else {
        setPasswordError(res.message);
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string; errors?: string[] } } };
      setPasswordError(
        e.response?.data?.errors?.join(', ') ||
        e.response?.data?.message ||
        'Erreur lors du changement de mot de passe.'
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl font-bold text-gray-900">Mon profil</h1>
        <p className="text-sm text-gray-500 mt-1">Gérez vos informations personnelles et votre sécurité.</p>
      </motion.div>

      {/* Account overview */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }}>
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <span className="text-xl font-bold text-emerald-600">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-base font-bold text-gray-900">{user?.firstName} {user?.lastName}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <Badge variant="success" size="sm" className="mt-1">Country Manager</Badge>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 grid sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Mail size={14} className="text-gray-400 flex-shrink-0" />
              <span className="truncate">{user?.email}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Phone size={14} className="text-gray-400 flex-shrink-0" />
              <span>{user?.phone || '—'}</span>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Edit profile */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <Card>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <User size={16} className="text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Informations personnelles</h2>
              <p className="text-xs text-gray-400">Prénom, nom et téléphone</p>
            </div>
          </div>

          {profileSuccess && (
            <div className="mb-4 p-3 rounded-xl bg-primary/5 border border-primary/15 flex items-center gap-2">
              <CheckCircle size={15} className="text-primary flex-shrink-0" />
              <p className="text-sm text-primary">{profileSuccess}</p>
            </div>
          )}
          {profileError && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2">
              <AlertTriangle size={15} className="text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-600">{profileError}</p>
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Prénom"
                value={profileForm.firstName}
                onChange={(e) => setProfileForm(f => ({ ...f, firstName: e.target.value }))}
                placeholder="Votre prénom"
                icon={<User size={15} />}
              />
              <Input
                label="Nom"
                value={profileForm.lastName}
                onChange={(e) => setProfileForm(f => ({ ...f, lastName: e.target.value }))}
                placeholder="Votre nom"
                icon={<User size={15} />}
              />
            </div>
            <Input
              label="Téléphone"
              value={profileForm.phone}
              onChange={(e) => setProfileForm(f => ({ ...f, phone: e.target.value }))}
              placeholder="+221 77 000 00 00"
              icon={<Phone size={15} />}
            />
            <div className="flex justify-end pt-1">
              <Button
                type="submit"
                size="sm"
                icon={profileLoading ? undefined : <Save size={14} />}
                disabled={profileLoading}
              >
                {profileLoading ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>

      {/* Change password */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
        <Card>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-gold/10 flex items-center justify-center">
              <Lock size={16} className="text-gold-dark" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Changer le mot de passe</h2>
              <p className="text-xs text-gray-400">Recommandé si vous utilisez le mot de passe temporaire reçu par email</p>
            </div>
          </div>

          {passwordSuccess && (
            <div className="mb-4 p-3 rounded-xl bg-primary/5 border border-primary/15 flex items-center gap-2">
              <CheckCircle size={15} className="text-primary flex-shrink-0" />
              <p className="text-sm text-primary">{passwordSuccess}</p>
            </div>
          )}
          {passwordError && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2">
              <AlertTriangle size={15} className="text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-600">{passwordError}</p>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="relative">
              <Input
                label="Mot de passe actuel"
                type={showCurrent ? 'text' : 'password'}
                value={passwordForm.current}
                onChange={(e) => setPasswordForm(f => ({ ...f, current: e.target.value }))}
                placeholder="Votre mot de passe actuel"
                icon={<Lock size={15} />}
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600"
              >
                {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            <div className="relative">
              <Input
                label="Nouveau mot de passe"
                type={showNext ? 'text' : 'password'}
                value={passwordForm.next}
                onChange={(e) => setPasswordForm(f => ({ ...f, next: e.target.value }))}
                placeholder="Min. 8 car., 1 maj, 1 min, 1 chiffre, 1 spécial"
                icon={<Lock size={15} />}
                required
              />
              <button
                type="button"
                onClick={() => setShowNext(!showNext)}
                className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600"
              >
                {showNext ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            <Input
              label="Confirmer le nouveau mot de passe"
              type="password"
              value={passwordForm.confirm}
              onChange={(e) => setPasswordForm(f => ({ ...f, confirm: e.target.value }))}
              placeholder="Répétez le nouveau mot de passe"
              icon={<Lock size={15} />}
              required
            />
            {passwordForm.next && passwordForm.confirm && passwordForm.next !== passwordForm.confirm && (
              <p className="text-xs text-red-500">Les mots de passe ne correspondent pas.</p>
            )}
            <div className="flex justify-end pt-1">
              <Button
                type="submit"
                size="sm"
                icon={passwordLoading ? undefined : <Save size={14} />}
                disabled={
                  passwordLoading ||
                  !passwordForm.current ||
                  !passwordForm.next ||
                  !passwordForm.confirm ||
                  passwordForm.next !== passwordForm.confirm
                }
              >
                {passwordLoading ? 'Modification...' : 'Modifier le mot de passe'}
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
