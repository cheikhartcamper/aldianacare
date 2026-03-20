import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Upload, AlertCircle, CheckCircle, Calendar, MapPin, ArrowLeft, Shield, User, ArrowRight } from 'lucide-react';
import { Button, Input, Logo, PageLoader, StepProgress } from '@/components/ui';
import { declarationService, type DeceasedUser, type Declarant } from '@/services/declaration.service';

const DECLARATION_STEPS = ['Recherche', 'Identité', 'Code OTP', 'Validation', 'Déclaration'];

export function CreateDeclarationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const deceased = location.state?.deceased as DeceasedUser | undefined;
  const declarant = location.state?.declarant as Declarant | undefined;
  const declarationToken = location.state?.declarationToken as string | undefined;

  const [deathDate, setDeathDate] = useState('');
  const [deathPlace, setDeathPlace] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [deathCertificate, setDeathCertificate] = useState<File | null>(null);
  const [deathTypeCertificate, setDeathTypeCertificate] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [declarationNumber, setDeclarationNumber] = useState('');

  if (!deceased || !declarant || !declarationToken) {
    navigate('/declaration/search');
    return null;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'death' | 'type') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024; // 5 Mo
    if (file.size > maxSize) {
      setError(`Le fichier ${file.name} est trop volumineux (max 5 Mo).`);
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setError('Format de fichier non autorisé. Utilisez JPEG, PNG, WEBP ou PDF.');
      return;
    }

    if (type === 'death') {
      setDeathCertificate(file);
    } else {
      setDeathTypeCertificate(file);
    }
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!deathCertificate || !deathTypeCertificate) {
      setError('Les deux certificats sont obligatoires.');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    if (deathDate > today) {
      setError('La date du décès ne peut pas être dans le futur.');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('declarationToken', declarationToken);
      formData.append('deathDate', deathDate);
      formData.append('deathPlace', deathPlace.trim());
      if (additionalInfo.trim()) {
        formData.append('additionalInfo', additionalInfo.trim());
      }
      formData.append('deathCertificate', deathCertificate);
      formData.append('deathTypeCertificate', deathTypeCertificate);

      const response = await declarationService.createDeclaration(formData);

      if (response.success) {
        setDeclarationNumber(response.data.declaration.declarationNumber);
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la création de la déclaration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return <PageLoader />;
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-gold/5">
        {/* Navbar */}
        <nav className="bg-primary border-b border-primary-dark">
          <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-center">
            <Link to="/" className="flex items-center gap-2">
              <Logo size="sm" variant="white" />
            </Link>
          </div>
        </nav>

        <div className="flex items-center justify-center p-4 min-h-[calc(100vh-56px)]">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="w-full max-w-md"
          >
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg shadow-primary/5 p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle size={48} className="text-primary" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">Déclaration enregistrée</h1>
              <p className="text-gray-500 mb-6">
                Votre déclaration de décès a été soumise avec succès.
              </p>
              <div className="p-4 bg-gradient-to-r from-primary-50 to-gold/5 rounded-xl border border-primary/10 mb-6">
                <p className="text-xs text-primary/60 font-semibold uppercase tracking-wide mb-1">Numéro de déclaration</p>
                <p className="text-2xl font-bold text-primary">{declarationNumber}</p>
              </div>
              <div className="space-y-3 text-sm text-gray-500 mb-8">
                <p>
                  Notre équipe va examiner votre déclaration et les documents fournis.
                </p>
                <p>
                  Vous serez contacté au <span className="font-semibold text-gray-900">{declarant.phone}</span> dans les plus brefs délais.
                </p>
              </div>
              <Button onClick={() => navigate('/')} fullWidth className="shadow-lg shadow-primary/20">
                <ArrowRight size={18} />
                Retour à l'accueil
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-gold/5">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-primary border-b border-primary-dark">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Logo size="sm" variant="white" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-white/70 text-xs">
              <Shield size={12} />
              <span>Processus sécurisé</span>
            </div>
            <button onClick={() => navigate(-1)} className="text-sm text-white/80 hover:text-white transition-colors flex items-center gap-1">
              <ArrowLeft size={14} />
              Retour
            </button>
          </div>
        </div>
      </nav>

      {/* Step Progress */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <StepProgress steps={DECLARATION_STEPS} currentStep={4} />
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gold/10 rounded-full blur-[80px]" />
        </div>
        <div className="max-w-3xl mx-auto px-4 py-10 text-center relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wide mb-3 border border-primary/20">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              Étape 5 sur 5
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Détails et <span className="text-primary">documents</span>
            </h1>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Complétez les informations et joignez les certificats nécessaires
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main content */}
      <section className="pb-16">
        <div className="max-w-2xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg shadow-primary/5 p-6 lg:p-8">
              {/* Deceased info */}
              <div className="mb-6 p-4 bg-gradient-to-r from-primary-50 to-transparent rounded-xl border border-primary/10">
                <p className="text-xs text-primary/60 font-semibold uppercase tracking-wide mb-2">Déclaration pour</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                    <User size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {deceased.firstName} {deceased.lastName}
                    </p>
                    <p className="text-sm text-gray-500">
                      Rapatriement prévu vers : <span className="font-medium text-gold-dark">{deceased.repatriationCountry}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Death date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar size={16} className="inline mr-2 text-primary" />
                    Date du décès *
                  </label>
                  <input
                    type="date"
                    value={deathDate}
                    onChange={(e) => setDeathDate(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-50 focus:border-primary outline-none transition-all"
                  />
                </div>

                {/* Death place */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin size={16} className="inline mr-2 text-primary" />
                    Lieu du décès *
                  </label>
                  <Input
                    value={deathPlace}
                    onChange={(e) => setDeathPlace(e.target.value)}
                    placeholder="Ex: Hôpital Principal de Dakar, Sénégal"
                    required
                  />
                </div>

                {/* Additional info */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Informations supplémentaires (optionnel)
                  </label>
                  <textarea
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    placeholder="Circonstances du décès, souhaits de la famille, etc."
                    rows={4}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-50 focus:border-primary outline-none transition-all resize-none"
                  />
                </div>

                {/* Separator */}
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-100" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-3 text-gray-400 font-medium uppercase tracking-wider">Documents requis</span>
                  </div>
                </div>

                {/* Death certificate */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText size={16} className="inline mr-2 text-primary" />
                    Certificat de décès *
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      id="deathCertificate"
                      accept="image/jpeg,image/png,image/webp,application/pdf"
                      onChange={(e) => handleFileChange(e, 'death')}
                      className="hidden"
                      required
                    />
                    <label
                      htmlFor="deathCertificate"
                      className={`flex items-center justify-center gap-2 w-full px-4 py-4 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                        deathCertificate
                          ? 'border-primary/30 bg-primary-50/50'
                          : 'border-gray-200 hover:border-primary hover:bg-primary-50/30'
                      }`}
                    >
                      <Upload size={20} className={deathCertificate ? 'text-primary' : 'text-gray-400'} />
                      <span className={`text-sm ${deathCertificate ? 'text-primary font-medium' : 'text-gray-500'}`}>
                        {deathCertificate ? deathCertificate.name : 'Choisir un fichier (PDF, JPEG, PNG)'}
                      </span>
                    </label>
                  </div>
                  {deathCertificate && (
                    <p className="mt-2 text-xs text-primary flex items-center gap-1">
                      <CheckCircle size={14} />
                      {(deathCertificate.size / 1024 / 1024).toFixed(2)} Mo
                    </p>
                  )}
                </div>

                {/* Death type certificate */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText size={16} className="inline mr-2 text-primary" />
                    Certificat de genre de décès *
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      id="deathTypeCertificate"
                      accept="image/jpeg,image/png,image/webp,application/pdf"
                      onChange={(e) => handleFileChange(e, 'type')}
                      className="hidden"
                      required
                    />
                    <label
                      htmlFor="deathTypeCertificate"
                      className={`flex items-center justify-center gap-2 w-full px-4 py-4 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                        deathTypeCertificate
                          ? 'border-primary/30 bg-primary-50/50'
                          : 'border-gray-200 hover:border-primary hover:bg-primary-50/30'
                      }`}
                    >
                      <Upload size={20} className={deathTypeCertificate ? 'text-primary' : 'text-gray-400'} />
                      <span className={`text-sm ${deathTypeCertificate ? 'text-primary font-medium' : 'text-gray-500'}`}>
                        {deathTypeCertificate ? deathTypeCertificate.name : 'Choisir un fichier (PDF, JPEG, PNG)'}
                      </span>
                    </label>
                  </div>
                  {deathTypeCertificate && (
                    <p className="mt-2 text-xs text-primary flex items-center gap-1">
                      <CheckCircle size={14} />
                      {(deathTypeCertificate.size / 1024 / 1024).toFixed(2)} Mo
                    </p>
                  )}
                </div>

                {error && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2">
                      <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  </motion.div>
                )}

                <Button type="submit" fullWidth disabled={isSubmitting} className="shadow-lg shadow-primary/20">
                  <CheckCircle size={18} />
                  Soumettre la déclaration
                </Button>
              </form>
            </div>
          </motion.div>

          {/* Cancel link */}
          <div className="text-center mt-6">
            <button
              onClick={() => navigate('/declaration/search')}
              className="text-sm text-gray-400 hover:text-primary transition-colors"
            >
              ← Annuler la déclaration
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
