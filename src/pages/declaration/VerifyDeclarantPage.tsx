import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, AlertCircle, CheckCircle } from 'lucide-react';
import { Button, Input, Logo, PageLoader } from '@/components/ui';
import { declarationService, type DeceasedUser } from '@/services/declaration.service';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Logo size="lg" variant="color" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Déclaration de décès</h1>
            <p className="text-sm text-gray-600">
              Étape 2/5 — Vérification de votre identité
            </p>
          </div>

          {/* Deceased info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-xs text-gray-500 mb-2">Personne décédée :</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <User size={20} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {deceased.firstName} {deceased.lastName}
                </p>
                <p className="text-sm text-gray-600">{deceased.email}</p>
              </div>
            </div>
          </div>

          {/* Info box */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex gap-3">
              <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Vérification de personne de confiance</p>
                <p>
                  Vous devez être enregistré comme personne de confiance par le défunt pour pouvoir effectuer cette déclaration.
                  Veuillez saisir vos informations exactement comme elles ont été enregistrées.
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
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2">
                <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button type="submit" fullWidth disabled={isVerifying}>
              <CheckCircle size={18} />
              Vérifier mon identité
            </Button>
          </form>

          {/* Progress indicator */}
          <div className="mt-8 flex items-center justify-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <div className="w-3 h-3 rounded-full bg-gray-300"></div>
            <div className="w-3 h-3 rounded-full bg-gray-300"></div>
            <div className="w-3 h-3 rounded-full bg-gray-300"></div>
          </div>
        </div>

        {/* Back link */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/declaration/search')}
            className="text-sm text-gray-600 hover:text-primary transition-colors"
          >
            ← Retour à la recherche
          </button>
        </div>
      </motion.div>
    </div>
  );
}
