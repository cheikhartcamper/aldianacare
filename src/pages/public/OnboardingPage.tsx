import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield, CheckCircle, ArrowRight, ArrowLeft, User, Mail, Phone,
  MapPin, Calendar, Camera, Upload, FileText, Users, CreditCard,
  PenTool, Sparkles, Gift, Eye, X, Check, Globe
} from 'lucide-react';
import { Button, Card, Input } from '@/components/ui';
import { Logo } from '@/components/ui';

const TOTAL_STEPS = 9;

const stepLabels = [
  'Formule',
  'Informations',
  'Photo',
  'Documents',
  'Personne de confiance',
  'Sponsor',
  'Paiement',
  'Signature',
  'Confirmation',
];

const plans = [
  {
    id: 'individuelle',
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
    name: 'Aldiana Family',
    price: '50',
    priceAnnual: '450',
    period: '/mois',
    desc: 'Père, mère + 3 enfants max (jusqu\'à 5 pers.)',
    features: ['Tout Individuelle +', 'Jusqu\'à 5 personnes couvertes', 'Billet d\'avion famille', 'Capital décès', 'Gestionnaire dédié', 'Priority support 24/7'],
    popular: true,
  },
  {
    id: 'option-risque',
    name: 'Option Indemnité de Risque',
    price: '+25',
    priceAnnual: '+250',
    period: '/mois',
    desc: 'Pandémie, guerre, nucléaire',
    features: ['En complément des formules', 'Couverture pandémie', 'Couverture guerre', 'Risque nucléaire'],
    popular: false,
    isOption: true,
  },
];

export function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [idPreview, setIdPreview] = useState<string | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  const [signatureMode, setSignatureMode] = useState<'draw' | 'upload'>('draw');
  const [sponsorCode, setSponsorCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const navigate = useNavigate();

  const photoInputRef = useRef<HTMLInputElement>(null);
  const idInputRef = useRef<HTMLInputElement>(null);
  const signInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const progress = (step / TOTAL_STEPS) * 100;

  const nextStep = () => { if (step < TOTAL_STEPS) setStep(step + 1); };
  const prevStep = () => { if (step > 1) setStep(step - 1); };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleIdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setIdPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSignUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSignaturePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setSignaturePreview(null);
      }
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
    const rect = canvas.getBoundingClientRect();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    canvas.onmousemove = (ev) => {
      ctx.lineTo(ev.clientX - rect.left, ev.clientY - rect.top);
      ctx.strokeStyle = '#1a1a1a';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.stroke();
    };
    canvas.onmouseup = () => {
      canvas.onmousemove = null;
      setSignaturePreview(canvas.toDataURL());
    };
  };

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

            {/* ===== STEP 2: Informations personnelles ===== */}
            {step === 2 && (
              <div>
                <div className="text-center mb-8">
                  <div className="w-14 h-14 mx-auto mb-4 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <User size={28} className="text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Vos informations personnelles</h2>
                  <p className="text-sm text-gray-500">Remplissez vos coordonnées pour créer votre contrat</p>
                </div>

                <Card>
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input label="Prénom" placeholder="Votre prénom" icon={<User size={16} />} />
                      <Input label="Nom" placeholder="Votre nom de famille" icon={<User size={16} />} />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input label="Date de naissance" type="date" icon={<Calendar size={16} />} />
                      <Input label="Lieu de naissance" placeholder="Ville, Pays" icon={<MapPin size={16} />} />
                    </div>
                    <Input label="Email" type="email" placeholder="votre@email.com" icon={<Mail size={16} />} />
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input label="Téléphone" type="tel" placeholder="+33 6 12 34 56 78" icon={<Phone size={16} />} />
                      <Input label="Nationalité" placeholder="Ex: Sénégalaise" icon={<MapPin size={16} />} />
                    </div>
                    <Input label="Adresse de résidence" placeholder="Adresse complète" icon={<MapPin size={16} />} />
                    <div className="grid sm:grid-cols-3 gap-4">
                      <Input label="Code postal" placeholder="75001" />
                      <Input label="Ville" placeholder="Paris" />
                      <Input label="Pays de résidence" placeholder="France" />
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* ===== STEP 3: Photo du souscripteur ===== */}
            {step === 3 && (
              <div>
                <div className="text-center mb-8">
                  <div className="w-14 h-14 mx-auto mb-4 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <Camera size={28} className="text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Photo du souscripteur</h2>
                  <p className="text-sm text-gray-500">Prenez une photo ou importez une image récente de vous</p>
                </div>

                <Card className="text-center">
                  {photoPreview ? (
                    <div className="relative inline-block">
                      <img src={photoPreview} alt="Photo souscripteur" className="w-48 h-48 rounded-2xl object-cover mx-auto border-4 border-primary/20" />
                      <button
                        onClick={() => setPhotoPreview(null)}
                        className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                      >
                        <X size={14} />
                      </button>
                      <p className="text-sm text-primary font-medium mt-4 flex items-center justify-center gap-1">
                        <CheckCircle size={14} /> Photo ajoutée avec succès
                      </p>
                    </div>
                  ) : (
                    <div className="py-8">
                      <div className="w-32 h-32 mx-auto rounded-2xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center mb-6">
                        <Camera size={40} className="text-gray-300" />
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button
                          variant="primary"
                          icon={<Camera size={16} />}
                          onClick={() => photoInputRef.current?.click()}
                        >
                          Prendre une photo
                        </Button>
                        <Button
                          variant="outline"
                          icon={<Upload size={16} />}
                          onClick={() => photoInputRef.current?.click()}
                        >
                          Importer une image
                        </Button>
                      </div>
                      <input
                        ref={photoInputRef}
                        type="file"
                        accept="image/*"
                        capture="user"
                        className="hidden"
                        onChange={handlePhotoUpload}
                      />
                      <p className="text-[11px] text-gray-400 mt-4">Format accepté : JPG, PNG. Taille max : 5 Mo</p>
                    </div>
                  )}
                </Card>
              </div>
            )}

            {/* ===== STEP 4: Documents d'identité ===== */}
            {step === 4 && (
              <div>
                <div className="text-center mb-8">
                  <div className="w-14 h-14 mx-auto mb-4 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <FileText size={28} className="text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Pièce d'identité & documents</h2>
                  <p className="text-sm text-gray-500">Photographiez ou importez votre pièce d'identité en cours de validité</p>
                </div>

                <Card>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Type de document</label>
                      <select className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white">
                        <option value="">Sélectionnez le type</option>
                        <option value="passport">Passeport</option>
                        <option value="cni">Carte nationale d'identité</option>
                        <option value="titre_sejour">Titre de séjour</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Recto du document</label>
                      {idPreview ? (
                        <div className="relative">
                          <img src={idPreview} alt="Document" className="w-full max-h-64 object-contain rounded-xl border border-gray-200" />
                          <button
                            onClick={() => setIdPreview(null)}
                            className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => idInputRef.current?.click()}
                          className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
                        >
                          <Upload size={32} className="mx-auto mb-3 text-gray-300" />
                          <p className="text-sm font-medium text-gray-600">Cliquez pour importer ou photographier</p>
                          <p className="text-[11px] text-gray-400 mt-1">JPG, PNG ou PDF — Max 10 Mo</p>
                        </div>
                      )}
                      <input
                        ref={idInputRef}
                        type="file"
                        accept="image/*,.pdf"
                        capture="environment"
                        className="hidden"
                        onChange={handleIdUpload}
                      />
                    </div>

                    <div>
                      <Input label="Numéro du document" placeholder="Ex: 12AB34567" icon={<FileText size={16} />} />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input label="Date de délivrance" type="date" icon={<Calendar size={16} />} />
                      <Input label="Date d'expiration" type="date" icon={<Calendar size={16} />} />
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* ===== STEP 5: Personne de confiance ===== */}
            {step === 5 && (
              <div>
                <div className="text-center mb-8">
                  <div className="w-14 h-14 mx-auto mb-4 bg-gold/10 rounded-2xl flex items-center justify-center">
                    <Users size={28} className="text-gold-dark" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Personne de confiance</h2>
                  <p className="text-sm text-gray-500">Désignez une personne à contacter en cas de besoin</p>
                </div>

                <Card>
                  <div className="p-3 rounded-xl bg-gold/5 border border-gold/20 mb-6">
                    <p className="text-xs text-gold-dark leading-relaxed">
                      <strong>Important :</strong> Cette personne sera votre contact principal en cas de déclenchement de votre contrat. 
                      Elle recevra les informations relatives au rapatriement et à l'assistance funéraire.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input label="Prénom" placeholder="Prénom de la personne" icon={<User size={16} />} />
                      <Input label="Nom" placeholder="Nom de la personne" icon={<User size={16} />} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Lien de parenté</label>
                      <select className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white">
                        <option value="">Sélectionnez</option>
                        <option value="conjoint">Conjoint(e)</option>
                        <option value="parent">Parent (père/mère)</option>
                        <option value="enfant">Enfant</option>
                        <option value="frere_soeur">Frère / Sœur</option>
                        <option value="autre">Autre membre de la famille</option>
                        <option value="ami">Ami(e) proche</option>
                      </select>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input label="Téléphone" type="tel" placeholder="+221 77 123 45 67" icon={<Phone size={16} />} />
                      <Input label="Email" type="email" placeholder="email@exemple.com" icon={<Mail size={16} />} />
                    </div>
                    <Input label="Adresse" placeholder="Adresse complète" icon={<MapPin size={16} />} />
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input label="Ville" placeholder="Dakar" icon={<MapPin size={16} />} />
                      <Input label="Pays" placeholder="Sénégal" icon={<MapPin size={16} />} />
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* ===== STEP 6: Code sponsor ===== */}
            {step === 6 && (
              <div>
                <div className="text-center mb-8">
                  <div className="w-14 h-14 mx-auto mb-4 bg-gold/10 rounded-2xl flex items-center justify-center">
                    <Gift size={28} className="text-gold-dark" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Code sponsor</h2>
                  <p className="text-sm text-gray-500">Avez-vous un code de parrainage ? (optionnel)</p>
                </div>

                <Card className="text-center">
                  <div className="max-w-sm mx-auto space-y-6">
                    <div className="w-20 h-20 mx-auto bg-gold/10 rounded-2xl flex items-center justify-center">
                      <Gift size={36} className="text-gold-dark" />
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Si un proche vous a recommandé Aldiana Care, entrez son code pour bénéficier d'avantages exclusifs.
                    </p>
                    <div>
                      <input
                        type="text"
                        value={sponsorCode}
                        onChange={(e) => setSponsorCode(e.target.value.toUpperCase())}
                        placeholder="Ex: ALDC-2024-XXXX"
                        className="w-full text-center text-lg font-mono tracking-widest rounded-xl border border-gray-200 px-4 py-4 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
                      />
                    </div>
                    {sponsorCode && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 rounded-xl bg-primary/5 border border-primary/20"
                      >
                        <p className="text-sm text-primary font-medium flex items-center justify-center gap-1">
                          <CheckCircle size={14} /> Code sponsor enregistré
                        </p>
                      </motion.div>
                    )}
                    <p className="text-[11px] text-gray-400">
                      Vous pouvez passer cette étape si vous n'avez pas de code
                    </p>
                  </div>
                </Card>
              </div>
            )}

            {/* ===== STEP 7: Paiement ===== */}
            {step === 7 && (
              <div>
                <div className="text-center mb-8">
                  <div className="w-14 h-14 mx-auto mb-4 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <CreditCard size={28} className="text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Moyen de paiement</h2>
                  <p className="text-sm text-gray-500">Choisissez comment vous souhaitez régler votre cotisation</p>
                </div>

                <div className="space-y-4">
                  {/* Plan summary */}
                  <Card className="bg-primary/5 border-primary/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          Formule {selectedPlan === 'family' ? 'Aldiana Family' : selectedPlan === 'pathologie' ? 'Pathologie' : selectedPlan === 'option-risque' ? 'Option Indemnité de Risque' : 'Individuelle'}
                        </p>
                        <p className="text-xs text-gray-500">Cotisation mensuelle</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">
                          {selectedPlan === 'family' ? '50' : selectedPlan === 'pathologie' ? '30' : selectedPlan === 'option-risque' ? '+25' : '15'}€
                        </p>
                        <p className="text-xs text-gray-500">/mois</p>
                      </div>
                    </div>
                  </Card>

                  {/* Payment methods */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { id: 'card', label: 'Carte bancaire', desc: 'Visa, Mastercard', icon: CreditCard },
                      { id: 'mobile_money', label: 'Mobile Money', desc: 'Orange Money, Wave, MTN', icon: Phone },
                      { id: 'virement', label: 'Virement bancaire', desc: 'Transfert SEPA', icon: ArrowRight },
                      { id: 'western_union', label: 'Western Union', desc: 'Transfert d\'argent', icon: Globe },
                    ].map((method) => (
                      <Card
                        key={method.id}
                        hover
                        className={`cursor-pointer transition-all ${
                          paymentMethod === method.id
                            ? 'ring-2 ring-primary border-primary'
                            : ''
                        }`}
                        onClick={() => setPaymentMethod(method.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            paymentMethod === method.id ? 'bg-primary/10' : 'bg-gray-100'
                          }`}>
                            <method.icon size={20} className={paymentMethod === method.id ? 'text-primary' : 'text-gray-400'} />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900">{method.label}</p>
                            <p className="text-[11px] text-gray-400">{method.desc}</p>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            paymentMethod === method.id
                              ? 'border-primary bg-primary'
                              : 'border-gray-300'
                          }`}>
                            {paymentMethod === method.id && <Check size={12} className="text-white" />}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ===== STEP 8: Signature digitale ===== */}
            {step === 8 && (
              <div>
                <div className="text-center mb-8">
                  <div className="w-14 h-14 mx-auto mb-4 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <PenTool size={28} className="text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Signature digitale</h2>
                  <p className="text-sm text-gray-500">Signez votre contrat en dessinant ou en important votre signature</p>
                </div>

                <Card>
                  <div className="space-y-6">
                    {/* Mode toggle */}
                    <div className="flex bg-gray-100 rounded-xl p-1 max-w-xs mx-auto">
                      <button
                        onClick={() => { setSignatureMode('draw'); setSignaturePreview(null); }}
                        className={`flex-1 py-2 px-4 rounded-lg text-xs font-medium transition-all ${
                          signatureMode === 'draw' ? 'bg-white shadow text-primary' : 'text-gray-500'
                        }`}
                      >
                        <PenTool size={12} className="inline mr-1" /> Dessiner
                      </button>
                      <button
                        onClick={() => { setSignatureMode('upload'); setSignaturePreview(null); clearCanvas(); }}
                        className={`flex-1 py-2 px-4 rounded-lg text-xs font-medium transition-all ${
                          signatureMode === 'upload' ? 'bg-white shadow text-primary' : 'text-gray-500'
                        }`}
                      >
                        <Upload size={12} className="inline mr-1" /> Importer
                      </button>
                    </div>

                    {signatureMode === 'draw' ? (
                      <div>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl overflow-hidden bg-white">
                          <canvas
                            ref={canvasRef}
                            width={600}
                            height={200}
                            className="w-full cursor-crosshair"
                            onMouseDown={startDrawing}
                          />
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <p className="text-[11px] text-gray-400">Dessinez votre signature ci-dessus avec la souris</p>
                          <button
                            onClick={clearCanvas}
                            className="text-xs text-red-500 hover:text-red-600 font-medium"
                          >
                            Effacer
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        {signaturePreview ? (
                          <div className="relative">
                            <img src={signaturePreview} alt="Signature" className="w-full max-h-48 object-contain rounded-xl border border-gray-200 bg-white p-4" />
                            <button
                              onClick={() => setSignaturePreview(null)}
                              className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <div
                            onClick={() => signInputRef.current?.click()}
                            className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
                          >
                            <Upload size={32} className="mx-auto mb-3 text-gray-300" />
                            <p className="text-sm font-medium text-gray-600">Importez une image de votre signature</p>
                            <p className="text-[11px] text-gray-400 mt-1">PNG ou JPG avec fond transparent recommandé</p>
                          </div>
                        )}
                        <input
                          ref={signInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleSignUpload}
                        />
                      </div>
                    )}

                    {/* Terms */}
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={acceptTerms}
                          onChange={(e) => setAcceptTerms(e.target.checked)}
                          className="mt-1 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span className="text-xs text-gray-600 leading-relaxed">
                          En signant ce contrat, je déclare avoir lu et accepté les{' '}
                          <a href="#" className="text-primary font-medium underline">conditions générales</a>,
                          la{' '}
                          <a href="#" className="text-primary font-medium underline">politique de confidentialité</a>{' '}
                          et les{' '}
                          <a href="#" className="text-primary font-medium underline">conditions particulières</a>{' '}
                          d'Aldiana Care. Je certifie que les informations fournies sont exactes.
                        </span>
                      </label>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* ===== STEP 9: Confirmation ===== */}
            {step === 9 && (
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 15 }}
                  className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center"
                >
                  <Sparkles size={36} className="text-primary" />
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Félicitations !</h2>
                <p className="text-sm text-gray-500 mb-8 max-w-md mx-auto">
                  Votre contrat Aldiana Care a été généré avec succès. Vous êtes maintenant protégé(e).
                </p>

                <Card className="max-w-md mx-auto mb-8">
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-primary/5 text-center">
                      <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Numéro de contrat</p>
                      <p className="text-xl font-bold font-mono text-primary">ALC-2026-{Math.random().toString(36).substring(2, 8).toUpperCase()}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-gray-50">
                        <p className="text-[10px] text-gray-400 uppercase font-semibold mb-1">Formule</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {selectedPlan === 'family' ? 'Aldiana Family' : selectedPlan === 'pathologie' ? 'Pathologie' : selectedPlan === 'option-risque' ? 'Option Indemnité de Risque' : 'Individuelle'}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-gray-50">
                        <p className="text-[10px] text-gray-400 uppercase font-semibold mb-1">Cotisation</p>
                        <p className="text-sm font-semibold text-primary">
                          {selectedPlan === 'family' ? '50' : selectedPlan === 'pathologie' ? '30' : selectedPlan === 'option-risque' ? '+25' : '15'}€ /mois
                        </p>
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-gray-50">
                      <p className="text-[10px] text-gray-400 uppercase font-semibold mb-1">Statut</p>
                      <p className="text-sm font-semibold text-primary flex items-center justify-center gap-1">
                        <CheckCircle size={14} /> Contrat actif
                      </p>
                    </div>
                  </div>
                </Card>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button variant="primary" icon={<Eye size={16} />} onClick={() => navigate('/app')}>
                    Accéder à mon espace
                  </Button>
                  <Button variant="outline" icon={<FileText size={16} />}>
                    Télécharger le contrat PDF
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        {step < 9 && (
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
              disabled={step === 1 && !selectedPlan}
              icon={<ArrowRight size={16} />}
            >
              {step === 8 ? 'Signer et confirmer' : 'Continuer'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
