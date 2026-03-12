import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Upload, AlertCircle, CheckCircle, Calendar, MapPin } from 'lucide-react';
import { Button, Input, Logo, PageLoader } from '@/components/ui';
import { declarationService, type DeceasedUser, type Declarant } from '@/services/declaration.service';

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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle size={48} className="text-green-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Déclaration enregistrée</h1>
            <p className="text-gray-600 mb-6">
              Votre déclaration de décès a été soumise avec succès.
            </p>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 mb-6">
              <p className="text-xs text-gray-500 mb-1">Numéro de déclaration :</p>
              <p className="text-2xl font-bold text-primary">{declarationNumber}</p>
            </div>
            <div className="space-y-3 text-sm text-gray-600 mb-8">
              <p>
                Notre équipe va examiner votre déclaration et les documents fournis.
              </p>
              <p>
                Vous serez contacté au <span className="font-semibold">{declarant.phone}</span> dans les plus brefs délais.
              </p>
            </div>
            <Button onClick={() => navigate('/')} fullWidth>
              Retour à l'accueil
            </Button>
          </div>
        </motion.div>
      </div>
    );
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
              Étape 5/5 — Détails et documents
            </p>
          </div>

          {/* Deceased info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-xs text-gray-500 mb-2">Déclaration pour :</p>
            <p className="font-semibold text-gray-900">
              {deceased.firstName} {deceased.lastName}
            </p>
            <p className="text-sm text-gray-600">
              Rapatriement prévu vers : {deceased.repatriationCountry}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Death date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar size={16} className="inline mr-2" />
                Date du décès *
              </label>
              <input
                type="date"
                value={deathDate}
                onChange={(e) => setDeathDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-50 focus:border-primary outline-none transition-all"
              />
            </div>

            {/* Death place */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin size={16} className="inline mr-2" />
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
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-50 focus:border-primary outline-none transition-all resize-none"
              />
            </div>

            {/* Death certificate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText size={16} className="inline mr-2" />
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
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary hover:bg-primary-50 transition-all"
                >
                  <Upload size={20} className="text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {deathCertificate ? deathCertificate.name : 'Choisir un fichier (PDF, JPEG, PNG)'}
                  </span>
                </label>
              </div>
              {deathCertificate && (
                <p className="mt-2 text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle size={14} />
                  {(deathCertificate.size / 1024 / 1024).toFixed(2)} Mo
                </p>
              )}
            </div>

            {/* Death type certificate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText size={16} className="inline mr-2" />
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
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary hover:bg-primary-50 transition-all"
                >
                  <Upload size={20} className="text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {deathTypeCertificate ? deathTypeCertificate.name : 'Choisir un fichier (PDF, JPEG, PNG)'}
                  </span>
                </label>
              </div>
              {deathTypeCertificate && (
                <p className="mt-2 text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle size={14} />
                  {(deathTypeCertificate.size / 1024 / 1024).toFixed(2)} Mo
                </p>
              )}
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2">
                <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button type="submit" fullWidth disabled={isSubmitting}>
              <CheckCircle size={18} />
              Soumettre la déclaration
            </Button>
          </form>

          {/* Progress indicator */}
          <div className="mt-8 flex items-center justify-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <div className="w-3 h-3 rounded-full bg-primary"></div>
          </div>
        </div>

        {/* Back link */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/declaration/search')}
            className="text-sm text-gray-600 hover:text-primary transition-colors"
          >
            ← Annuler la déclaration
          </button>
        </div>
      </motion.div>
    </div>
  );
}
