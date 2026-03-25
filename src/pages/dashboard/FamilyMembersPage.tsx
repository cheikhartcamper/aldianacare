import { motion } from 'framer-motion';
import { Users, User, Calendar, Phone, Mail, MapPin, Shield, AlertTriangle, Plus, Trash2, Loader2, ArrowUpCircle, CheckCircle, X } from 'lucide-react';
import { Card, Badge, Button, Input } from '@/components/ui';
import { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/auth.service';

type MemberDraft = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phone: string;
  email: string;
  password: string;
  residenceCountry: string;
  residenceAddress: string;
  repatriationCountry: string;
  cniRecto: File | null;
  cniVerso: File | null;
  photo: File | null;
};

const emptyMember = (): MemberDraft => ({
  firstName: '', lastName: '', dateOfBirth: '', phone: '', email: '', password: '',
  residenceCountry: '', residenceAddress: '', repatriationCountry: '',
  cniRecto: null, cniVerso: null, photo: null,
});

function isAdultByDob(dob: string): boolean {
  if (!dob) return false;
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age >= 18;
}

function getApiError(err: unknown): string {
  const e = err as { response?: { data?: { message?: string; errors?: string[] } } };
  return e.response?.data?.errors?.join(', ') || e.response?.data?.message || 'Une erreur est survenue.';
}

export function FamilyMembersPage() {
  const { user, familyMembers, refreshUser } = useAuth();

  const isFamilyPlan = user?.planType === 'family';

  // Upgrade state
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [members, setMembers] = useState<MemberDraft[]>([emptyMember(), emptyMember()]);
  const [upgrading, setUpgrading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const updateMember = (i: number, field: keyof MemberDraft, value: string | File | null) =>
    setMembers(m => m.map((p, idx) => idx === i ? { ...p, [field]: value } : p));

  const addMember = () => setMembers(m => [...m, emptyMember()]);
  const removeMember = (i: number) => setMembers(m => m.filter((_, idx) => idx !== i));

  const handleUpgrade = async () => {
    setError('');
    for (let i = 0; i < members.length; i++) {
      const m = members[i];
      if (!m.firstName || !m.lastName || !m.dateOfBirth || !m.phone || !m.password) {
        setError(`Membre ${i + 1} : prénom, nom, date de naissance, téléphone et mot de passe sont obligatoires.`);
        return;
      }
      if (isAdultByDob(m.dateOfBirth)) {
        if (!m.residenceCountry || !m.residenceAddress || !m.repatriationCountry) {
          setError(`Membre ${i + 1} (majeur) : pays de résidence, adresse et pays de rapatriement sont obligatoires.`);
          return;
        }
        if (!m.cniRecto || !m.cniVerso) {
          setError(`Membre ${i + 1} (majeur) : les fichiers CNI recto et verso sont obligatoires.`);
          return;
        }
      }
    }

    setUpgrading(true);
    try {
      const fd = new FormData();
      const payload = members.map(m => ({
        firstName: m.firstName,
        lastName: m.lastName,
        dateOfBirth: m.dateOfBirth,
        phone: m.phone,
        email: m.email || undefined,
        password: m.password,
        residenceCountry: m.residenceCountry || undefined,
        residenceAddress: m.residenceAddress || undefined,
        repatriationCountry: m.repatriationCountry || undefined,
      }));
      fd.append('members', JSON.stringify(payload));

      members.forEach((m, i) => {
        if (m.cniRecto) fd.append(`member${i}_cniRecto`, m.cniRecto);
        if (m.cniVerso) fd.append(`member${i}_cniVerso`, m.cniVerso);
        if (m.photo) fd.append(`member${i}_photo`, m.photo);
      });

      const res = await authService.upgradeToFamily(fd);
      if (res.success) {
        setSuccess(res.message || 'Votre compte a été converti en plan familial avec succès !');
        await refreshUser();
        setShowUpgrade(false);
      } else {
        setError(res.message);
      }
    } catch (err: unknown) {
      setError(getApiError(err));
    } finally {
      setUpgrading(false);
    }
  };

  if (!isFamilyPlan) {
    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-gray-900">Membres de la famille</h1>
          <p className="text-sm text-gray-500 mt-1">Gérez les membres couverts par votre plan familial.</p>
        </motion.div>

        {success && (
          <div className="flex items-center gap-2 p-3 bg-success/10 rounded-xl text-success text-sm">
            <CheckCircle size={15} /> {success}
          </div>
        )}

        {!showUpgrade ? (
          <Card>
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ArrowUpCircle size={32} className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Passer au plan familial</h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
                Vous avez actuellement un plan individuel. Convertissez votre compte en plan familial
                pour couvrir vos proches. Votre solde sera automatiquement transféré.
              </p>
              <Button variant="primary" icon={<ArrowUpCircle size={15} />} onClick={() => { setShowUpgrade(true); setError(''); setSuccess(''); }}>
                Passer au plan familial
              </Button>
            </div>
          </Card>
        ) : (
          <Card>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users size={18} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Conversion plan familial</h3>
                  <p className="text-xs text-gray-400">Ajoutez au moins 2 membres de votre famille</p>
                </div>
              </div>
              <button onClick={() => setShowUpgrade(false)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                <X size={16} />
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-2 mb-4 p-3 bg-danger/10 rounded-xl text-danger text-sm">
                <AlertTriangle size={14} /> {error}
              </div>
            )}

            <div className="space-y-5">
              {members.map((m, i) => {
                const adult = isAdultByDob(m.dateOfBirth);
                return (
                  <div key={i} className="p-4 border border-gray-200 rounded-xl bg-gray-50/50">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Membre {i + 1} {m.dateOfBirth ? (adult ? '(majeur)' : '(mineur)') : ''}
                      </span>
                      {members.length > 2 && (
                        <button onClick={() => removeMember(i)} className="p-1 rounded-lg text-gray-400 hover:text-danger hover:bg-danger/10">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <Input label="Prénom *" value={m.firstName} onChange={e => updateMember(i, 'firstName', e.target.value)} placeholder="Prénom" />
                      <Input label="Nom *" value={m.lastName} onChange={e => updateMember(i, 'lastName', e.target.value)} placeholder="Nom" />
                      <Input label="Date de naissance *" type="date" value={m.dateOfBirth} onChange={e => updateMember(i, 'dateOfBirth', e.target.value)} />
                      <Input label="Téléphone *" type="tel" value={m.phone} onChange={e => updateMember(i, 'phone', e.target.value)} placeholder="+221..." />
                      <Input label="Email" type="email" value={m.email} onChange={e => updateMember(i, 'email', e.target.value)} placeholder="optionnel" />
                      <Input label="Mot de passe *" type="password" value={m.password} onChange={e => updateMember(i, 'password', e.target.value)} placeholder="Min 8 caractères" />
                      {adult && (
                        <>
                          <Input label="Pays de résidence *" value={m.residenceCountry} onChange={e => updateMember(i, 'residenceCountry', e.target.value)} placeholder="Ex: France" />
                          <Input label="Adresse de résidence *" value={m.residenceAddress} onChange={e => updateMember(i, 'residenceAddress', e.target.value)} placeholder="Adresse complète" />
                          <Input label="Pays de rapatriement *" value={m.repatriationCountry} onChange={e => updateMember(i, 'repatriationCountry', e.target.value)} placeholder="Ex: Sénégal" />
                          <div className="sm:col-span-2 grid sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1.5">CNI Recto *</label>
                              <input
                                ref={el => { fileRefs.current[`${i}_recto`] = el; }}
                                type="file" accept="image/*"
                                onChange={e => updateMember(i, 'cniRecto', e.target.files?.[0] || null)}
                                className="w-full text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:font-medium file:cursor-pointer"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1.5">CNI Verso *</label>
                              <input
                                ref={el => { fileRefs.current[`${i}_verso`] = el; }}
                                type="file" accept="image/*"
                                onChange={e => updateMember(i, 'cniVerso', e.target.files?.[0] || null)}
                                className="w-full text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:font-medium file:cursor-pointer"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1.5">Photo</label>
                              <input
                                type="file" accept="image/*"
                                onChange={e => updateMember(i, 'photo', e.target.files?.[0] || null)}
                                className="w-full text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-gray-100 file:text-gray-600 file:font-medium file:cursor-pointer"
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-3 mt-4">
              <button onClick={addMember} className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 font-medium">
                <Plus size={15} /> Ajouter un membre
              </button>
            </div>

            <div className="flex gap-3 mt-6">
              <Button onClick={handleUpgrade} icon={upgrading ? <Loader2 size={14} className="animate-spin" /> : <ArrowUpCircle size={14} />} disabled={upgrading}>
                {upgrading ? 'Conversion en cours...' : 'Convertir en plan familial'}
              </Button>
              <Button variant="ghost" onClick={() => setShowUpgrade(false)} disabled={upgrading}>Annuler</Button>
            </div>
          </Card>
        )}
      </div>
    );
  }

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Membres de la famille</h1>
            <p className="text-sm text-gray-500 mt-1">
              {familyMembers.length} membre{familyMembers.length !== 1 ? 's' : ''} couvert{familyMembers.length !== 1 ? 's' : ''} par votre plan familial
            </p>
          </div>
          <Badge variant="primary" size="sm">
            Plan Familial
          </Badge>
        </div>
      </motion.div>

      {/* Info souscripteur */}
      <Card className="border-l-4 border-l-primary">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <Shield size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Souscripteur principal</h3>
            <p className="text-xs text-gray-500">Titulaire du contrat familial</p>
          </div>
        </div>
        <div className="p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center font-bold text-lg">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
              <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Mail size={11} /> {user?.email}</span>
                <span className="flex items-center gap-1"><Phone size={11} /> {user?.phone}</span>
              </div>
            </div>
            <Badge variant="success" dot size="sm">Souscripteur</Badge>
          </div>
        </div>
      </Card>

      {/* Liste des membres */}
      {familyMembers.length === 0 ? (
        <Card>
          <div className="text-center py-10">
            <Users size={32} className="mx-auto text-gray-200 mb-3" />
            <p className="text-sm text-gray-400">Aucun membre enregistré</p>
            <p className="text-xs text-gray-300 mt-1">
              Les membres de votre famille apparaîtront ici après validation de votre inscription.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {familyMembers.map((member, index) => {
            const age = calculateAge(member.dateOfBirth);
            const isAdult = age >= 18;

            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card>
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isAdult ? 'bg-primary/10' : 'bg-gold/10'
                    }`}>
                      <User size={22} className={isAdult ? 'text-primary' : 'text-gold-dark'} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <h3 className="text-base font-semibold text-gray-900">
                          {member.firstName} {member.lastName}
                        </h3>
                        <Badge variant={isAdult ? 'primary' : 'warning'} size="sm">
                          {isAdult ? 'Majeur' : 'Mineur'}
                        </Badge>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar size={14} className="text-gray-400" />
                          <span>
                            {new Date(member.dateOfBirth).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                            <span className="text-xs text-gray-400 ml-1">({age} ans)</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone size={14} className="text-gray-400" />
                          <span>{member.phone}</span>
                        </div>
                        {member.email && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail size={14} className="text-gray-400" />
                            <span>{member.email}</span>
                          </div>
                        )}
                        {member.residenceCountry && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin size={14} className="text-gray-400" />
                            <span>{member.residenceCountry}</span>
                          </div>
                        )}
                      </div>

                      {member.residenceAddress && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-500 mb-0.5">Adresse de résidence</p>
                          <p className="text-sm text-gray-700">{member.residenceAddress}</p>
                        </div>
                      )}

                      {member.repatriationCountry && (
                        <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                          <Shield size={12} className="text-primary" />
                          Rapatriement prévu vers : <span className="font-medium text-gray-700">{member.repatriationCountry}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Note modification */}
      <Card className="bg-amber-50 border-amber-200">
        <div className="flex gap-3">
          <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Modification des membres</p>
            <p className="text-xs text-amber-700 mt-1">
              Pour ajouter ou modifier des membres de votre famille, contactez notre équipe support
              avec vos justificatifs (acte de naissance, livret de famille, etc.).
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
