import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Phone, FileText, Camera, Shield, Heart, Gift,
  CreditCard, PenTool, CheckCircle, ArrowRight, ArrowLeft
} from 'lucide-react';
import { Button, Input, Card, StepProgress, Logo } from '@/components/ui';

const stepLabels = [
  'Bienvenue', 'Compte', 'Téléphone', 'Identité', 'Document',
  'Selfie', 'Formule', 'Confiance', 'Sponsor', 'Paiement',
  'Signature', 'Confirmation'
];

export function OnboardingPage() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const next = () => {
    if (step < stepLabels.length - 1) setStep(step + 1);
    else navigate('/app');
  };
  const prev = () => { if (step > 0) setStep(step - 1); };

  return (
    <div className="min-h-screen bg-surface-secondary flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo size="md" variant="color" />
            {step === 0 && (
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-primary transition-colors"
              >
                <ArrowLeft size={14} />
                Retour
              </Link>
            )}
          </div>
          <span className="text-sm text-gray-400">Étape {step + 1} sur {stepLabels.length}</span>
        </div>
      </header>

      {/* Progress */}
      <div className="bg-white border-b border-gray-100 py-4 px-6 overflow-x-auto">
        <div className="max-w-4xl mx-auto">
          <StepProgress steps={stepLabels} currentStep={step} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {step === 0 && (
                <Card className="text-center">
                  <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <Shield size={36} className="text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">Bienvenue sur Aldiana Care</h2>
                  <p className="text-gray-500 mb-8 leading-relaxed">
                    Protégez votre famille avec notre assurance rapatriement 100% digitale.
                    La souscription ne prend que quelques minutes.
                  </p>
                  <Button fullWidth size="lg" variant="gold" onClick={next} icon={<ArrowRight size={18} />}>
                    Commencer
                  </Button>
                </Card>
              )}

              {step === 1 && (
                <Card>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <User size={20} className="text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Créez votre compte</h2>
                      <p className="text-xs text-gray-400">Vos informations de connexion</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Prénom" placeholder="Amadou" />
                      <Input label="Nom" placeholder="Diallo" />
                    </div>
                    <Input label="Email" type="email" placeholder="amadou@email.com" />
                    <Input label="Mot de passe" type="password" placeholder="Min. 8 caractères" />
                    <Input label="Confirmer" type="password" placeholder="Confirmez le mot de passe" />
                  </div>
                </Card>
              )}

              {step === 2 && (
                <Card>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Phone size={20} className="text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Vérification téléphone</h2>
                      <p className="text-xs text-gray-400">Nous vous envoyons un code OTP</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Input label="Numéro de téléphone" type="tel" placeholder="+33 6 00 00 00 00" />
                    <div className="flex gap-3">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <input
                          key={i}
                          type="text"
                          maxLength={1}
                          className="w-12 h-12 rounded-xl border border-gray-200 text-center text-lg font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          placeholder="—"
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 text-center">
                      Vous n'avez pas reçu le code ? <button className="text-primary font-medium">Renvoyer</button>
                    </p>
                  </div>
                </Card>
              )}

              {step === 3 && (
                <Card>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <User size={20} className="text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Informations personnelles</h2>
                      <p className="text-xs text-gray-400">Complétez votre profil</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Input label="Date de naissance" type="date" />
                    <Input label="Nationalité" placeholder="Sénégalaise" />
                    <Input label="Pays de résidence" placeholder="France" />
                    <Input label="Ville" placeholder="Paris" />
                    <Input label="Adresse" placeholder="Votre adresse complète" />
                  </div>
                </Card>
              )}

              {step === 4 && (
                <Card>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <FileText size={20} className="text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Pièce d'identité</h2>
                      <p className="text-xs text-gray-400">Téléchargez votre document</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Type de document</label>
                      <select className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                        <option>Passeport</option>
                        <option>Carte d'identité</option>
                        <option>Titre de séjour</option>
                      </select>
                    </div>
                    <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-primary/40 transition-colors cursor-pointer">
                      <FileText size={32} className="mx-auto mb-3 text-gray-300" />
                      <p className="text-sm font-medium text-gray-600">Cliquez pour télécharger</p>
                      <p className="text-xs text-gray-400 mt-1">JPG, PNG ou PDF - Max 5MB</p>
                    </div>
                  </div>
                </Card>
              )}

              {step === 5 && (
                <Card>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Camera size={20} className="text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Photo selfie</h2>
                      <p className="text-xs text-gray-400">Pour vérification d'identité</p>
                    </div>
                  </div>
                  <div className="border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center hover:border-primary/40 transition-colors cursor-pointer">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <Camera size={32} className="text-gray-300" />
                    </div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Prenez une photo selfie</p>
                    <p className="text-xs text-gray-400">Assurez-vous que votre visage est bien visible</p>
                  </div>
                </Card>
              )}

              {step === 6 && (
                <Card>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Shield size={20} className="text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Choisissez votre formule</h2>
                      <p className="text-xs text-gray-400">Sélectionnez votre couverture</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[
                      { name: 'Basic', price: '9,90€/mois', desc: 'Couverture Europe' },
                      { name: 'Premium', price: '19,90€/mois', desc: 'Couverture Monde', popular: true },
                      { name: 'Family', price: '29,90€/mois', desc: 'Toute la famille' },
                      { name: 'Pathologie', price: '39,90€/mois', desc: 'Avec pathologie' },
                    ].map((plan) => (
                      <label
                        key={plan.name}
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          plan.popular ? 'border-primary bg-primary-50' : 'border-gray-100 hover:border-gray-200'
                        }`}
                      >
                        <input type="radio" name="plan" className="text-primary focus:ring-primary" defaultChecked={plan.popular} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">{plan.name}</span>
                            {plan.popular && (
                              <span className="text-[10px] bg-gold text-primary px-2 py-0.5 rounded-full font-bold">Populaire</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400">{plan.desc}</p>
                        </div>
                        <span className="font-bold text-primary">{plan.price}</span>
                      </label>
                    ))}
                  </div>
                </Card>
              )}

              {step === 7 && (
                <Card>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Heart size={20} className="text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Personne de confiance</h2>
                      <p className="text-xs text-gray-400">Cette personne pourra déclarer un décès</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Prénom" placeholder="Prénom" />
                      <Input label="Nom" placeholder="Nom" />
                    </div>
                    <Input label="Téléphone" type="tel" placeholder="+33 6 00 00 00 00" />
                    <Input label="Email" type="email" placeholder="email@exemple.com" />
                    <Input label="Lien de parenté" placeholder="Frère, Soeur, Cousin..." />
                  </div>
                </Card>
              )}

              {step === 8 && (
                <Card>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
                      <Gift size={20} className="text-gold-dark" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Code sponsor</h2>
                      <p className="text-xs text-gray-400">Optionnel — Avez-vous un code parrain ?</p>
                    </div>
                  </div>
                  <Input label="Code sponsor" placeholder="Entrez le code (optionnel)" helperText="Si vous avez été recommandé par un parrain, entrez son code ici." />
                </Card>
              )}

              {step === 9 && (
                <Card>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <CreditCard size={20} className="text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Mode de paiement</h2>
                      <p className="text-xs text-gray-400">Choisissez votre méthode de paiement</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[
                      { name: 'Wave', color: 'bg-blue-50 border-blue-200' },
                      { name: 'Orange Money', color: 'bg-orange-50 border-orange-200' },
                      { name: 'MTN Money', color: 'bg-yellow-50 border-yellow-200' },
                      { name: 'Carte bancaire', color: 'bg-gray-50 border-gray-200' },
                      { name: 'PayPal', color: 'bg-blue-50 border-blue-200' },
                    ].map((method) => (
                      <label
                        key={method.name}
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all hover:border-primary/40 ${method.color}`}
                      >
                        <input type="radio" name="payment" className="text-primary focus:ring-primary" />
                        <span className="font-medium text-gray-900 text-sm">{method.name}</span>
                      </label>
                    ))}
                  </div>
                </Card>
              )}

              {step === 10 && (
                <Card>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <PenTool size={20} className="text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Signature digitale</h2>
                      <p className="text-xs text-gray-400">Signez votre contrat électroniquement</p>
                    </div>
                  </div>
                  <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 mb-4 bg-white min-h-[160px] flex items-center justify-center cursor-crosshair">
                    <p className="text-sm text-gray-400">Signez ici avec votre souris ou votre doigt</p>
                  </div>
                  <label className="flex items-start gap-3 p-3 rounded-xl bg-surface-secondary">
                    <input type="checkbox" className="mt-0.5 text-primary focus:ring-primary rounded" />
                    <span className="text-xs text-gray-600 leading-relaxed">
                      J'accepte les conditions générales d'utilisation et la politique de confidentialité d'Aldiana Care.
                      Je confirme avoir lu et compris les termes du contrat d'assurance.
                    </span>
                  </label>
                </Card>
              )}

              {step === 11 && (
                <Card className="text-center">
                  <div className="w-20 h-20 mx-auto mb-6 bg-success/10 rounded-full flex items-center justify-center">
                    <CheckCircle size={40} className="text-success" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">Félicitations !</h2>
                  <p className="text-gray-500 mb-6 leading-relaxed">
                    Votre souscription est complète. Votre contrat a été généré et envoyé par email.
                    Votre famille est maintenant protégée.
                  </p>
                  <div className="bg-primary-50 rounded-xl p-4 mb-6">
                    <p className="text-sm font-medium text-primary">Contrat N° ALC-2026-001234</p>
                    <p className="text-xs text-primary/70 mt-1">Formule Premium — Couverture Monde</p>
                  </div>
                </Card>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            {step > 0 && step < 11 ? (
              <Button variant="ghost" onClick={prev} icon={<ArrowLeft size={16} />}>
                Retour
              </Button>
            ) : (
              <div />
            )}
            {step > 0 && (
              <Button onClick={next} icon={<ArrowRight size={16} />}>
                {step === 11 ? 'Accéder à mon espace' : 'Continuer'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
