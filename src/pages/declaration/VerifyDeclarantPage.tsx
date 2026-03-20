import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, AlertCircle, CheckCircle, ArrowLeft, Shield, Info } from 'lucide-react';
import { Button, Input, Logo, PageLoader, StepProgress } from '@/components/ui';
import { declarationService, type DeceasedUser } from '@/services/declaration.service';

const DECLARATION_STEPS = ['Recherche', 'Identité', 'Code OTP', 'Validation', 'Déclaration'];

export function VerifyDeclarantPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const deceased = location.state?.deceased as DeceasedUser | undefined;

  const [declarantFirstName, setDeclarantFirstName] = useState('');
  const [declarantLastName, setDeclarantLastName] = useState('');
  const [declarantPhone, setDeclarantPhone] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');

  if (!deceased) {
    navigate('/declaration/search');
    return null;
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsVerifying(true);

    try {
      const response = await declarationService.verifyDeclarant({
        deceasedId: deceased.id,
        declarantFirstName: declarantFirstName.trim(),
        declarantLastName: declarantLastName.trim(),
        declarantPhone: declarantPhone.trim(),
      });

      if (response.success) {
        navigate('/declaration/verify-otp', {
          state: {
            deceased,
            declarant: response.data.declarant,
            verificationSessionToken: response.data.verificationSessionToken,
          },
        });
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erreur lors de la vérification. Veuillez réessayer.';
      setError(message);
    } finally {
      setIsVerifying(false);
    }
  };

  if (isVerifying) {
    return <PageLoader />;
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
          <StepProgress steps={DECLARATION_STEPS} currentStep={1} />
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
              Étape 2 sur 5
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Vérification de votre <span className="text-primary">identité</span>
            </h1>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Confirmez que vous êtes bien une personne de confiance désignée
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
                <p className="text-xs text-primary/60 font-semibold uppercase tracking-wide mb-2">Personne décédée</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                    <User size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {deceased.firstName} {deceased.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{deceased.email}</p>
                  </div>
                </div>
              </div>

              {/* Info box */}
              <div className="mb-6 p-4 bg-gold/5 border border-gold/20 rounded-xl">
                <div className="flex gap-3">
                  <Info size={20} className="text-gold-dark flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-700">
                    <p className="font-semibold text-gold-dark mb-1">Vérification de personne de confiance</p>
                    <p>
                      Vous devez être enregistré comme personne de confiance par le défunt pour pouvoir effectuer cette déclaration.
                      Saisissez vos informations exactement comme elles ont été enregistrées.
                    </p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleVerify} className="space-y-4">
                <Input
                  label="Votre prénom"
                  value={declarantFirstName}
                  onChange={(e) => setDeclarantFirstName(e.target.value)}
                  placeholder="Ex: Iris"
                  required
                />

                <Input
                  label="Votre nom de famille"
                  value={declarantLastName}
                  onChange={(e) => setDeclarantLastName(e.target.value)}
                  placeholder="Ex: Softech"
                  required
                />

                <Input
                  label="Votre numéro de téléphone"
                  type="tel"
                  value={declarantPhone}
                  onChange={(e) => setDeclarantPhone(e.target.value)}
                  placeholder="Ex: +221711444422"
                  required
                  helperText="Doit correspondre au numéro enregistré comme personne de confiance"
                />

                {error && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2">
                      <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  </motion.div>
                )}

                <Button type="submit" fullWidth disabled={isVerifying} className="shadow-lg shadow-primary/20">
                  <CheckCircle size={18} />
                  Vérifier mon identité
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
