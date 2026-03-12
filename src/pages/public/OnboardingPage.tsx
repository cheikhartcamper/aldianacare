import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield, CheckCircle, ArrowRight, ArrowLeft, User, Mail, Phone,
  MapPin, Camera, Upload, FileText, Users,
  Sparkles, Eye, EyeOff, X, Check, Lock, AlertTriangle, Loader2
} from 'lucide-react';
import { Button, Card, Input } from '@/components/ui';
import { Logo } from '@/components/ui';
import { authService, type ScanCniResponse } from '@/services/auth.service';

const plans = [
  {
    id: 'individuelle',
    apiType: 'individual' as const,
    name: 'Individuelle',
    price: '15',
    priceAnnual: '140',
    period: '/mois',
    desc: 'Adulte en bonne santé',
    features: ['Rapatriement du corps', 'Assistance administrative', 'Support téléphonique', 'Couverture Europe & Afrique', 'Assistance funéraire'],
    popular: false,
  },
  {
    id: 'pathologie',
    apiType: 'individual' as const,
    name: 'Pathologie',
    price: '30',
    priceAnnual: '280',
    period: '/mois',
    desc: 'Maladies chroniques',
    features: ['Tout Individuelle +', 'Couverture pathologies', 'Suivi médical', 'Assistance spécialisée'],
    popular: false,
  },
  {
    id: 'family',
    apiType: 'family' as const,
    name: 'Aldiana Family',
    price: '50',
    priceAnnual: '450',
    period: '/mois',
    desc: 'Père, mère + 3 enfants max (jusqu\'à 5 pers.)',
    features: ['Tout Individuelle +', 'Jusqu\'à 5 personnes couvertes', 'Billet d\'avion famille', 'Capital décès', 'Gestionnaire dédié', 'Priority support 24/7'],
    popular: true,
  },
];

interface TrustedPersonForm {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  relation: string;
  relationDetails: string;
}

interface FamilyMemberForm {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  residenceCountry: string;
  residenceAddress: string;
  repatriationCountry: string;
}

const emptyTrusted: TrustedPersonForm = { firstName: '', lastName: '', phone: '', email: '', relation: '', relationDetails: '' };
const emptyMember: FamilyMemberForm = { firstName: '', lastName: '', dateOfBirth: '', email: '', phone: '', password: '', confirmPassword: '', residenceCountry: '', residenceAddress: '', repatriationCountry: '' };

export function OnboardingPage() {
  const navigate = useNavigate();

  // Step management
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // OTP state
  const [otpPhone, setOtpPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [phoneVerificationToken, setPhoneVerificationToken] = useState('');
  const [otpCountdown, setOtpCountdown] = useState(0);

  // Personal info
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [maritalStatus, setMaritalStatus] = useState('');
  const [residenceCountry, setResidenceCountry] = useState('');
  const [residenceAddress, setResidenceAddress] = useState('');
  const [repatriationCountry, setRepatriationCountry] = useState('');

  // Files
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [cniRectoFile, setCniRectoFile] = useState<File | null>(null);
  const [cniRectoPreview, setCniRectoPreview] = useState<string | null>(null);
  const [cniVersoFile, setCniVersoFile] = useState<File | null>(null);
  const [cniVersoPreview, setCniVersoPreview] = useState<string | null>(null);

  // OCR scan state
  const [isScanningCni, setIsScanningCni] = useState(false);
  const [cniExtractedData, setCniExtractedData] = useState<ScanCniResponse['extracted'] | null>(null);
  const [scanError, setScanError] = useState('');

  // Trusted persons
  const [trustedPersons, setTrustedPersons] = useState<TrustedPersonForm[]>([{ ...emptyTrusted }]);

  // Family members (for family plan)
  const [familyMembers, setFamilyMembers] = useState<FamilyMemberForm[]>([{ ...emptyMember }]);
  const [memberCniFiles, setMemberCniFiles] = useState<Record<string, File>>({});

  // Refs
  const photoInputRef = useRef<HTMLInputElement>(null);
  const cniRectoRef = useRef<HTMLInputElement>(null);
  const cniVersoRef = useRef<HTMLInputElement>(null);

  // Handle OCR scan
  const handleScanCni = async () => {
    if (!cniRectoFile && !cniVersoFile) return;
    setScanError('');
    setIsScanningCni(true);
    try {
      const formData = new FormData();
      if (cniRectoFile) formData.append('cniRecto', cniRectoFile);
      if (cniVersoFile) formData.append('cniVerso', cniVersoFile);
      const res = await authService.scanCni(formData);
      if (res.success && res.data.extracted) {
        const extracted = res.data.extracted;
        setCniExtractedData(extracted);
        // Pre-fill form fields from OCR
        if (extracted.firstName && !firstName) setFirstName(extracted.firstName);
        if (extracted.lastName && !lastName) setLastName(extracted.lastName);
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setScanError(e.response?.data?.message || 'Erreur lors du scan OCR.');
    } finally {
      setIsScanningCni(false);
    }
  };

  // Determine steps based on plan
  const isFamily = selectedPlan === 'family';
  const stepLabels = isFamily
    ? ['Formule', 'Téléphone', 'Informations', 'Documents', 'Personne de confiance', 'Famille', 'Récapitulatif', 'Confirmation']
    : ['Formule', 'Téléphone', 'Informations', 'Documents', 'Personne de confiance', 'Récapitulatif', 'Confirmation'];
  const TOTAL_STEPS = stepLabels.length;
  const progress = (step / TOTAL_STEPS) * 100;

  const nextStep = () => { if (step < TOTAL_STEPS) { setError(''); setStep(step + 1); } };
  const prevStep = () => { if (step > 1) { setError(''); setStep(step - 1); } };

  // OTP countdown timer
  const startOtpCountdown = () => {
    setOtpCountdown(60);
    const interval = setInterval(() => {
      setOtpCountdown((prev) => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  // Send OTP
  const handleSendOtp = async () => {
    if (!otpPhone || otpPhone.length < 8) {
      setError('Veuillez entrer un numéro de téléphone valide (min 8 chiffres).');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      const res = await authService.sendOtp(otpPhone);
      if (res.success) {
        setOtpSent(true);
        startOtpCountdown();
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || 'Erreur lors de l\'envoi du code OTP.');
    }
    setIsSubmitting(false);
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.length !== 6) {
      setError('Veuillez entrer le code à 6 chiffres.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      const res = await authService.verifyOtp(otpPhone, otpCode);
      if (res.success) {
        setPhoneVerificationToken(res.data.phoneVerificationToken);
        setOtpVerified(true);
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || 'Code OTP incorrect.');
    }
    setIsSubmitting(false);
  };

  // File upload handlers
  const handleFileUpload = (setter: (f: File | null) => void, previewSetter: (s: string | null) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setter(file);
      const reader = new FileReader();
      reader.onloadend = () => previewSetter(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Trusted person helpers
  const updateTrusted = (index: number, field: keyof TrustedPersonForm, value: string) => {
    setTrustedPersons(prev => prev.map((p, i) => i === index ? { ...p, [field]: value } : p));
  };
  const addTrusted = () => { if (trustedPersons.length < 3) setTrustedPersons(prev => [...prev, { ...emptyTrusted }]); };
  const removeTrusted = (index: number) => { if (trustedPersons.length > 1) setTrustedPersons(prev => prev.filter((_, i) => i !== index)); };

  // Family member helpers
  const updateMember = (index: number, field: keyof FamilyMemberForm, value: string) => {
    setFamilyMembers(prev => prev.map((m, i) => i === index ? { ...m, [field]: value } : m));
  };
  const addMember = () => { if (familyMembers.length < 4) setFamilyMembers(prev => [...prev, { ...emptyMember }]); };
  const removeMember = (index: number) => { if (familyMembers.length > 1) setFamilyMembers(prev => prev.filter((_, i) => i !== index)); };

  // Submit registration
  const handleSubmit = async () => {
    setError('');
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('firstName', firstName);
      formData.append('lastName', lastName);
      formData.append('email', email);
      formData.append('phone', otpPhone);
      formData.append('password', password);
      formData.append('confirmPassword', confirmPassword);
      formData.append('maritalStatus', maritalStatus);
      formData.append('residenceCountry', residenceCountry);
      formData.append('residenceAddress', residenceAddress);
      formData.append('repatriationCountry', repatriationCountry);
      formData.append('phoneVerificationToken', phoneVerificationToken);
      formData.append('trustedPersons', JSON.stringify(trustedPersons));

      if (photoFile) formData.append('identityPhoto', photoFile);
      if (cniRectoFile) formData.append('cniRecto', cniRectoFile);
      if (cniVersoFile) formData.append('cniVerso', cniVersoFile);
      if (cniExtractedData) formData.append('cniExtractedData', JSON.stringify(cniExtractedData));

      if (isFamily) {
        formData.append('familyMemberCount', String(familyMembers.length));
        formData.append('familyMembers', JSON.stringify(familyMembers));
        // Append member CNI files
        Object.entries(memberCniFiles).forEach(([key, file]) => {
          formData.append(key, file);
        });
        const res = await authService.registerFamily(formData);
        if (res.success) nextStep();
      } else {
        const res = await authService.registerIndividual(formData);
        if (res.success) nextStep();
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string; errors?: string[] } } };
      const msgs = e.response?.data?.errors;
      setError(msgs?.join(', ') || e.response?.data?.message || 'Erreur lors de l\'inscription.');
    }
    setIsSubmitting(false);
  };

  // Determine the review step number and confirmation step number
  const reviewStep = isFamily ? 7 : 6;
  const confirmStep = isFamily ? 8 : 7;

  return (
    <div className="min-h-screen bg-surface-secondary">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/">
            <Logo size="sm" />
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400 hidden sm:block">
              Étape {step} sur {TOTAL_STEPS}
            </span>
            <Link to="/" className="text-xs text-gray-400 hover:text-gray-600">
              Quitter
            </Link>
          </div>
        </div>
      </header>

      {/* Progress bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4">
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-gold rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
          {/* Step indicators */}
          <div className="flex justify-between py-3 overflow-x-auto gap-1">
            {stepLabels.map((label, i) => (
              <button
                key={label}
                onClick={() => i + 1 < step && setStep(i + 1)}
                className={`flex items-center gap-1.5 text-[10px] font-medium whitespace-nowrap px-1 transition-colors ${
                  i + 1 === step
                    ? 'text-primary'
                    : i + 1 < step
                    ? 'text-primary/60 cursor-pointer hover:text-primary'
                    : 'text-gray-300'
                }`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                  i + 1 < step
                    ? 'bg-primary text-white'
                    : i + 1 === step
                    ? 'bg-primary/10 text-primary border border-primary'
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {i + 1 < step ? <Check size={10} /> : i + 1}
                </div>
                <span className="hidden md:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* ===== STEP 1: Choix de la formule ===== */}
            {step === 1 && (
              <div>
                <div className="text-center mb-8">
                  <div className="w-14 h-14 mx-auto mb-4 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <Shield size={28} className="text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Choisissez votre formule</h2>
                  <p className="text-sm text-gray-500">Sélectionnez la couverture qui vous convient</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {plans.map((plan) => (
                    <Card
                      key={plan.id}
                      hover
                      className={`cursor-pointer transition-all ${
                        selectedPlan === plan.id
                          ? 'ring-2 ring-primary border-primary shadow-lg'
                          : ''
                      } ${plan.popular ? 'relative' : ''}`}
                      onClick={() => setSelectedPlan(plan.id)}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <span className="bg-gold text-gray-900 text-[10px] font-bold px-3 py-1 rounded-full">
                            Plus populaire
                          </span>
                        </div>
                      )}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                          <p className="text-xs text-gray-400 mt-0.5">{plan.desc}</p>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          selectedPlan === plan.id
                            ? 'border-primary bg-primary'
                            : 'border-gray-300'
                        }`}>
                          {selectedPlan === plan.id && <Check size={14} className="text-white" />}
                        </div>
                      </div>
                      <div className="mb-4">
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                          <span className="text-sm font-semibold text-gray-500">€</span>
                          <span className="text-gray-400 text-xs">{plan.period}</span>
                        </div>
                        {plan.priceAnnual && (
                          <p className="text-xs text-gray-400 mt-1">
                            {plan.priceAnnual}€ /an
                          </p>
                        )}
                      </div>
                      <ul className="space-y-2">
                        {plan.features.map((f) => (
                          <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                            <CheckCircle size={14} className="text-primary flex-shrink-0 mt-0.5" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* ===== STEP 2: Vérification téléphone (OTP) ===== */}
            {step === 2 && (
              <div>
                <div className="text-center mb-8">
                  <div className="w-14 h-14 mx-auto mb-4 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <Phone size={28} className="text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Vérification du téléphone</h2>
                  <p className="text-sm text-gray-500">Nous allons vérifier votre numéro via WhatsApp</p>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2 mb-4">
                    <AlertTriangle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <Card>
                  <div className="space-y-6">
                    <div>
                      <Input
                        label="Numéro de téléphone (avec indicatif)"
                        type="tel"
                        placeholder="+33 6 12 34 56 78"
                        icon={<Phone size={16} />}
                        value={otpPhone}
                        onChange={(e) => setOtpPhone(e.target.value)}
                        disabled={otpVerified}
                      />
                    </div>

                    {!otpSent && !otpVerified && (
                      <Button variant="primary" fullWidth onClick={handleSendOtp} disabled={isSubmitting}>
                        {isSubmitting ? <><Loader2 size={16} className="animate-spin mr-2" /> Envoi en cours...</> : 'Envoyer le code OTP'}
                      </Button>
                    )}

                    {otpSent && !otpVerified && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">Code OTP (6 chiffres)</label>
                          <input
                            type="text"
                            maxLength={6}
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                            placeholder="000000"
                            className="w-full text-center text-2xl font-mono tracking-[0.5em] rounded-xl border border-gray-200 px-4 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          />
                        </div>
                        <Button variant="gold" fullWidth onClick={handleVerifyOtp} disabled={isSubmitting || otpCode.length !== 6}>
                          {isSubmitting ? <><Loader2 size={16} className="animate-spin mr-2" /> Vérification...</> : 'Vérifier le code'}
                        </Button>
                        <div className="text-center">
                          {otpCountdown > 0 ? (
                            <p className="text-xs text-gray-400">Renvoyer le code dans {otpCountdown}s</p>
                          ) : (
                            <button onClick={handleSendOtp} className="text-xs text-primary font-medium hover:underline" disabled={isSubmitting}>
                              Renvoyer le code
                            </button>
                          )}
                        </div>
                      </>
                    )}

                    {otpVerified && (
                      <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-center">
                        <CheckCircle size={32} className="text-primary mx-auto mb-2" />
                        <p className="text-sm font-semibold text-primary">Numéro vérifié avec succès !</p>
                        <p className="text-xs text-gray-500 mt-1">{otpPhone}</p>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            )}

            {/* ===== STEP 3: Informations personnelles + mot de passe ===== */}
            {step === 3 && (
              <div>
                <div className="text-center mb-8">
                  <div className="w-14 h-14 mx-auto mb-4 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <User size={28} className="text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Vos informations personnelles</h2>
                  <p className="text-sm text-gray-500">Remplissez vos coordonnées pour créer votre compte</p>
                </div>

                <Card>
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input label="Prénom" placeholder="Votre prénom" icon={<User size={16} />} value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                      <Input label="Nom" placeholder="Votre nom de famille" icon={<User size={16} />} value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                    </div>
                    <Input label="Email" type="email" placeholder="votre@email.com" icon={<Mail size={16} />} value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="relative">
                        <Input label="Mot de passe" type={showPassword ? 'text' : 'password'} placeholder="Min 8 car., 1 maj, 1 chiffre, 1 spécial" icon={<Lock size={16} />} value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600">
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      <Input label="Confirmer le mot de passe" type={showPassword ? 'text' : 'password'} placeholder="Retapez votre mot de passe" icon={<Lock size={16} />} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Situation matrimoniale</label>
                      <select value={maritalStatus} onChange={(e) => setMaritalStatus(e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white" required>
                        <option value="">Sélectionnez</option>
                        <option value="celibataire">Célibataire</option>
                        <option value="marie">Marié(e)</option>
                        <option value="divorce">Divorcé(e)</option>
                        <option value="veuf">Veuf/Veuve</option>
                        <option value="separe">Séparé(e)</option>
                        <option value="union_libre">Union libre</option>
                      </select>
                    </div>
                    <Input label="Adresse de résidence" placeholder="Adresse complète" icon={<MapPin size={16} />} value={residenceAddress} onChange={(e) => setResidenceAddress(e.target.value)} required />
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input label="Pays de résidence" placeholder="France" icon={<MapPin size={16} />} value={residenceCountry} onChange={(e) => setResidenceCountry(e.target.value)} required />
                      <Input label="Pays de rapatriement" placeholder="Sénégal" icon={<MapPin size={16} />} value={repatriationCountry} onChange={(e) => setRepatriationCountry(e.target.value)} required />
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* ===== STEP 4: Photo + CNI ===== */}
            {step === 4 && (
              <div>
                <div className="text-center mb-8">
                  <div className="w-14 h-14 mx-auto mb-4 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <Camera size={28} className="text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Photo & Documents</h2>
                  <p className="text-sm text-gray-500">Photo d'identité et pièce d'identité (CNI)</p>
                </div>

                <div className="space-y-6">
                  {/* Photo d'identité */}
                  <Card>
                    <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2"><Camera size={16} className="text-primary" /> Photo d'identité</h3>
                    {photoPreview ? (
                      <div className="relative inline-block">
                        <img src={photoPreview} alt="Photo" className="w-40 h-40 rounded-2xl object-cover mx-auto border-4 border-primary/20" />
                        <button onClick={() => { setPhotoFile(null); setPhotoPreview(null); }} className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"><X size={14} /></button>
                        <p className="text-xs text-primary font-medium mt-3 flex items-center justify-center gap-1"><CheckCircle size={12} /> Photo ajoutée</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="w-28 h-28 mx-auto rounded-2xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center mb-4"><Camera size={32} className="text-gray-300" /></div>
                        <Button variant="outline" size="sm" icon={<Upload size={14} />} onClick={() => photoInputRef.current?.click()}>Importer une photo</Button>
                        <input ref={photoInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFileUpload(setPhotoFile, setPhotoPreview)} />
                        <p className="text-[10px] text-gray-400 mt-2">JPEG, PNG, WEBP — Max 5 Mo</p>
                      </div>
                    )}
                  </Card>

                  {/* CNI Recto */}
                  <Card>
                    <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2"><FileText size={16} className="text-primary" /> CNI — Recto</h3>
                    {cniRectoPreview ? (
                      <div className="relative">
                        <img src={cniRectoPreview} alt="CNI Recto" className="w-full max-h-48 object-contain rounded-xl border border-gray-200" />
                        <button onClick={() => { setCniRectoFile(null); setCniRectoPreview(null); }} className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"><X size={14} /></button>
                      </div>
                    ) : (
                      <div onClick={() => cniRectoRef.current?.click()} className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
                        <Upload size={28} className="mx-auto mb-2 text-gray-300" />
                        <p className="text-sm font-medium text-gray-600">Importer le recto</p>
                        <p className="text-[10px] text-gray-400 mt-1">JPEG, PNG, WEBP — Max 5 Mo</p>
                      </div>
                    )}
                    <input ref={cniRectoRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFileUpload(setCniRectoFile, setCniRectoPreview)} />
                  </Card>

                  {/* CNI Verso */}
                  <Card>
                    <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2"><FileText size={16} className="text-primary" /> CNI — Verso</h3>
                    {cniVersoPreview ? (
                      <div className="relative">
                        <img src={cniVersoPreview} alt="CNI Verso" className="w-full max-h-48 object-contain rounded-xl border border-gray-200" />
                        <button onClick={() => { setCniVersoFile(null); setCniVersoPreview(null); setCniExtractedData(null); }} className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"><X size={14} /></button>
                      </div>
                    ) : (
                      <div onClick={() => cniVersoRef.current?.click()} className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
                        <Upload size={28} className="mx-auto mb-2 text-gray-300" />
                        <p className="text-sm font-medium text-gray-600">Importer le verso</p>
                        <p className="text-[10px] text-gray-400 mt-1">JPEG, PNG, WEBP — Max 5 Mo</p>
                      </div>
                    )}
                    <input ref={cniVersoRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFileUpload(setCniVersoFile, setCniVersoPreview)} />
                  </Card>

                  {/* Scan OCR button — visible si au moins un fichier CNI chargé */}
                  {(cniRectoFile || cniVersoFile) && (
                    <Card className="border-primary/30 bg-primary/5">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Sparkles size={20} className="text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">Scan OCR automatique</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Extrayez automatiquement vos données d'identité depuis vos images CNI
                          </p>
                          {scanError && (
                            <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                              <AlertTriangle size={12} /> {scanError}
                            </p>
                          )}
                          {cniExtractedData && (
                            <div className="mt-3 p-3 bg-white rounded-xl border border-primary/20 space-y-1.5">
                              <p className="text-xs font-semibold text-primary flex items-center gap-1">
                                <CheckCircle size={12} /> Données extraites avec succès
                              </p>
                              {cniExtractedData.lastName && (
                                <p className="text-xs text-gray-600"><span className="font-medium">Nom :</span> {cniExtractedData.lastName}</p>
                              )}
                              {cniExtractedData.firstName && (
                                <p className="text-xs text-gray-600"><span className="font-medium">Prénom :</span> {cniExtractedData.firstName}</p>
                              )}
                              {cniExtractedData.dateOfBirth && (
                                <p className="text-xs text-gray-600"><span className="font-medium">Date de naissance :</span> {cniExtractedData.dateOfBirth}</p>
                              )}
                              {cniExtractedData.cniNumber && (
                                <p className="text-xs text-gray-600"><span className="font-medium">N° CNI :</span> {cniExtractedData.cniNumber}</p>
                              )}
                              {cniExtractedData.expirationDate && (
                                <p className="text-xs text-gray-600"><span className="font-medium">Expiration :</span> {cniExtractedData.expirationDate}</p>
                              )}
                            </div>
                          )}
                        </div>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={handleScanCni}
                          disabled={isScanningCni}
                          className="flex-shrink-0"
                        >
                          {isScanningCni ? (
                            <><Loader2 size={14} className="animate-spin" /> Scan...</>
                          ) : (
                            <><Sparkles size={14} /> Scanner</>
                          )}
                        </Button>
                      </div>
                    </Card>
                  )}
                </div>
              </div>
            )}

            {/* ===== STEP 5: Personne(s) de confiance ===== */}
            {step === 5 && (
              <div>
                <div className="text-center mb-8">
                  <div className="w-14 h-14 mx-auto mb-4 bg-gold/10 rounded-2xl flex items-center justify-center">
                    <Users size={28} className="text-gold-dark" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Personne(s) de confiance</h2>
                  <p className="text-sm text-gray-500">Désignez au moins une personne à contacter en cas de besoin</p>
                </div>

                <div className="space-y-4">
                  {trustedPersons.map((tp, idx) => (
                    <Card key={idx}>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-semibold text-gray-900">Personne {idx + 1}</h4>
                        {trustedPersons.length > 1 && (
                          <button onClick={() => removeTrusted(idx)} className="text-xs text-red-500 hover:text-red-600 font-medium">Supprimer</button>
                        )}
                      </div>
                      <div className="space-y-3">
                        <div className="grid sm:grid-cols-2 gap-3">
                          <Input label="Prénom" placeholder="Prénom" icon={<User size={14} />} value={tp.firstName} onChange={(e) => updateTrusted(idx, 'firstName', e.target.value)} />
                          <Input label="Nom" placeholder="Nom" icon={<User size={14} />} value={tp.lastName} onChange={(e) => updateTrusted(idx, 'lastName', e.target.value)} />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-3">
                          <Input label="Téléphone" type="tel" placeholder="+221 77..." icon={<Phone size={14} />} value={tp.phone} onChange={(e) => updateTrusted(idx, 'phone', e.target.value)} />
                          <Input label="Email (optionnel)" type="email" placeholder="email@exemple.com" icon={<Mail size={14} />} value={tp.email} onChange={(e) => updateTrusted(idx, 'email', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">Relation</label>
                          <select value={tp.relation} onChange={(e) => updateTrusted(idx, 'relation', e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white">
                            <option value="">Sélectionnez</option>
                            <option value="pere">Père</option>
                            <option value="mere">Mère</option>
                            <option value="frere">Frère</option>
                            <option value="soeur">Sœur</option>
                            <option value="ami">Ami(e)</option>
                            <option value="cousin">Cousin(e)</option>
                            <option value="autre">Autre</option>
                          </select>
                        </div>
                        {tp.relation === 'autre' && (
                          <Input label="Précisez la relation" placeholder="Ex: Oncle maternel" value={tp.relationDetails} onChange={(e) => updateTrusted(idx, 'relationDetails', e.target.value)} />
                        )}
                      </div>
                    </Card>
                  ))}
                  {trustedPersons.length < 3 && (
                    <button onClick={addTrusted} className="w-full py-3 rounded-xl border-2 border-dashed border-gray-300 text-sm text-gray-500 hover:border-primary hover:text-primary transition-colors">
                      + Ajouter une personne de confiance
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* ===== STEP 6 (family only): Membres de la famille ===== */}
            {isFamily && step === 6 && (
              <div>
                <div className="text-center mb-8">
                  <div className="w-14 h-14 mx-auto mb-4 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <Users size={28} className="text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Membres de la famille</h2>
                  <p className="text-sm text-gray-500">Ajoutez les membres à couvrir (max 4, hors souscripteur)</p>
                </div>

                <div className="space-y-4">
                  {familyMembers.map((m, idx) => (
                    <Card key={idx}>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-semibold text-gray-900">Membre {idx + 1}</h4>
                        {familyMembers.length > 1 && (
                          <button onClick={() => removeMember(idx)} className="text-xs text-red-500 hover:text-red-600 font-medium">Supprimer</button>
                        )}
                      </div>
                      <div className="space-y-3">
                        <div className="grid sm:grid-cols-2 gap-3">
                          <Input label="Prénom" placeholder="Prénom" value={m.firstName} onChange={(e) => updateMember(idx, 'firstName', e.target.value)} />
                          <Input label="Nom" placeholder="Nom" value={m.lastName} onChange={(e) => updateMember(idx, 'lastName', e.target.value)} />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-3">
                          <Input label="Date de naissance" type="date" value={m.dateOfBirth} onChange={(e) => updateMember(idx, 'dateOfBirth', e.target.value)} />
                          <Input label="Téléphone" type="tel" placeholder="+33..." value={m.phone} onChange={(e) => updateMember(idx, 'phone', e.target.value)} />
                        </div>
                        <Input label="Email (optionnel)" type="email" placeholder="email@exemple.com" value={m.email} onChange={(e) => updateMember(idx, 'email', e.target.value)} />
                        <div className="grid sm:grid-cols-2 gap-3">
                          <Input label="Mot de passe" type="password" placeholder="Min 8 car." value={m.password} onChange={(e) => updateMember(idx, 'password', e.target.value)} />
                          <Input label="Confirmer" type="password" placeholder="Confirmer" value={m.confirmPassword} onChange={(e) => updateMember(idx, 'confirmPassword', e.target.value)} />
                        </div>
                        {/* Show residence fields for adults */}
                        {m.dateOfBirth && new Date().getFullYear() - new Date(m.dateOfBirth).getFullYear() >= 18 && (
                          <>
                            <Input label="Pays de résidence" placeholder="France" value={m.residenceCountry} onChange={(e) => updateMember(idx, 'residenceCountry', e.target.value)} />
                            <Input label="Adresse de résidence" placeholder="Adresse complète" value={m.residenceAddress} onChange={(e) => updateMember(idx, 'residenceAddress', e.target.value)} />
                            <Input label="Pays de rapatriement" placeholder="Sénégal" value={m.repatriationCountry} onChange={(e) => updateMember(idx, 'repatriationCountry', e.target.value)} />
                            <div className="grid sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">CNI Recto (obligatoire)</label>
                                <input type="file" accept="image/jpeg,image/png,image/webp" className="w-full text-sm" onChange={(e) => { const f = e.target.files?.[0]; if (f) setMemberCniFiles(prev => ({ ...prev, [`member_${idx}_cniRecto`]: f })); }} />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">CNI Verso (obligatoire)</label>
                                <input type="file" accept="image/jpeg,image/png,image/webp" className="w-full text-sm" onChange={(e) => { const f = e.target.files?.[0]; if (f) setMemberCniFiles(prev => ({ ...prev, [`member_${idx}_cniVerso`]: f })); }} />
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </Card>
                  ))}
                  {familyMembers.length < 4 && (
                    <button onClick={addMember} className="w-full py-3 rounded-xl border-2 border-dashed border-gray-300 text-sm text-gray-500 hover:border-primary hover:text-primary transition-colors">
                      + Ajouter un membre
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* ===== REVIEW STEP: Récapitulatif & Soumission ===== */}
            {step === reviewStep && (
              <div>
                <div className="text-center mb-8">
                  <div className="w-14 h-14 mx-auto mb-4 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <Eye size={28} className="text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Récapitulatif</h2>
                  <p className="text-sm text-gray-500">Vérifiez vos informations avant de soumettre</p>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2 mb-4">
                    <AlertTriangle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <div className="space-y-4">
                  <Card>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Formule</h4>
                    <p className="text-sm text-gray-600">{plans.find(p => p.id === selectedPlan)?.name} — {plans.find(p => p.id === selectedPlan)?.price}€{plans.find(p => p.id === selectedPlan)?.period}</p>
                  </Card>
                  <Card>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Informations personnelles</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p className="text-gray-400">Nom complet</p><p className="text-gray-900 font-medium">{firstName} {lastName}</p>
                      <p className="text-gray-400">Email</p><p className="text-gray-900">{email}</p>
                      <p className="text-gray-400">Téléphone</p><p className="text-gray-900">{otpPhone}</p>
                      <p className="text-gray-400">Résidence</p><p className="text-gray-900">{residenceCountry}</p>
                      <p className="text-gray-400">Rapatriement</p><p className="text-gray-900">{repatriationCountry}</p>
                    </div>
                  </Card>
                  <Card>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Documents</h4>
                    <div className="flex gap-4 text-sm">
                      <span className={`flex items-center gap-1 ${photoFile ? 'text-primary' : 'text-gray-400'}`}>{photoFile ? <CheckCircle size={14} /> : <X size={14} />} Photo</span>
                      <span className={`flex items-center gap-1 ${cniRectoFile ? 'text-primary' : 'text-gray-400'}`}>{cniRectoFile ? <CheckCircle size={14} /> : <X size={14} />} CNI Recto</span>
                      <span className={`flex items-center gap-1 ${cniVersoFile ? 'text-primary' : 'text-gray-400'}`}>{cniVersoFile ? <CheckCircle size={14} /> : <X size={14} />} CNI Verso</span>
                    </div>
                  </Card>
                  <Card>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Personne(s) de confiance ({trustedPersons.length})</h4>
                    {trustedPersons.map((tp, i) => (
                      <p key={i} className="text-sm text-gray-600">{tp.firstName} {tp.lastName} — {tp.relation} — {tp.phone}</p>
                    ))}
                  </Card>
                  {isFamily && (
                    <Card>
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Membres de la famille ({familyMembers.length})</h4>
                      {familyMembers.map((m, i) => (
                        <p key={i} className="text-sm text-gray-600">{m.firstName} {m.lastName} — {m.dateOfBirth}</p>
                      ))}
                    </Card>
                  )}
                </div>

                <div className="mt-6">
                  <Button variant="gold" fullWidth size="lg" onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? <><Loader2 size={16} className="animate-spin mr-2" /> Envoi en cours...</> : 'Soumettre mon inscription'}
                  </Button>
                </div>
              </div>
            )}

            {/* ===== CONFIRMATION STEP ===== */}
            {step === confirmStep && (
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 15 }}
                  className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center"
                >
                  <Sparkles size={36} className="text-primary" />
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Inscription soumise !</h2>
                <p className="text-sm text-gray-500 mb-8 max-w-md mx-auto">
                  Votre demande est en cours de vérification par notre équipe. Vous recevrez un email de confirmation une fois votre inscription approuvée.
                </p>

                <Card className="max-w-md mx-auto mb-8">
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-center">
                      <p className="text-[10px] text-amber-600 uppercase font-bold mb-1">Statut</p>
                      <p className="text-lg font-bold text-amber-700">En attente de validation</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-gray-50">
                        <p className="text-[10px] text-gray-400 uppercase font-semibold mb-1">Formule</p>
                        <p className="text-sm font-semibold text-gray-900">{plans.find(p => p.id === selectedPlan)?.name}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-gray-50">
                        <p className="text-[10px] text-gray-400 uppercase font-semibold mb-1">Cotisation</p>
                        <p className="text-sm font-semibold text-primary">{plans.find(p => p.id === selectedPlan)?.price}€ /mois</p>
                      </div>
                    </div>
                  </div>
                </Card>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button variant="primary" onClick={() => navigate('/connexion')}>
                    Aller à la page de connexion
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/')}>
                    Retour à l'accueil
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        {step < reviewStep && (
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={step === 1}
              icon={<ArrowLeft size={16} />}
            >
              Retour
            </Button>
            <Button
              variant="primary"
              onClick={nextStep}
              disabled={
                (step === 1 && !selectedPlan) ||
                (step === 2 && !otpVerified)
              }
              icon={<ArrowRight size={16} />}
            >
              Continuer
            </Button>
          </div>
        )}
        {step === reviewStep && (
          <div className="flex items-center justify-start mt-8 pt-6 border-t border-gray-200">
            <Button variant="outline" onClick={prevStep} icon={<ArrowLeft size={16} />}>
              Retour
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
