import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Star, ArrowLeft, AlertTriangle, Clock, XCircle, ArrowRight, CheckCircle, KeyRound, Smartphone, Shield } from 'lucide-react';
import { useState, useRef } from 'react';
import { Button, Input, Logo, PageLoader } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/auth.service';

type ForgotStep = 'email' | 'otp' | 'newPassword' | 'success';

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState(() => localStorage.getItem('aldiana_remember_email') || '');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(() => !!localStorage.getItem('aldiana_remember_email'));
  const [error, setError] = useState('');
  const [pendingMsg, setPendingMsg] = useState('');
  const [rejectedMsg, setRejectedMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLoginLoader, setShowLoginLoader] = useState(false);
  const navigateTarget = useRef<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading, user } = useAuth();

  // Forgot password state
  const [showForgot, setShowForgot] = useState(false);
  const [forgotStep, setForgotStep] = useState<ForgotStep>('email');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMethod, setForgotMethod] = useState<'email' | 'whatsapp'>('email');
  const [forgotCode, setForgotCode] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showNewPass, setShowNewPass] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

  const getRedirectPath = (role: string, from?: string) => {
    const isAdminPath = from?.startsWith('/admin');
    const isUserPath = from?.startsWith('/app');
    if (role === 'admin') return (from && isAdminPath) ? from : '/admin';
    return (from && isUserPath) ? from : '/app';
  };

  // Post-login branded loader — takes priority over everything
  if (showLoginLoader) {
    return <PageLoader />;
  }

  // Still determining auth state
  if (isLoading) {
    return <PageLoader />;
  }

  // Already authenticated (back-button / direct visit while logged in)
  if (isAuthenticated && user) {
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname;
    return <Navigate to={getRedirectPath(user.role, from)} replace />;
  }

  const handleForgotStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotLoading(true);
    try {
      const res = await authService.forgotPassword(forgotEmail, forgotMethod);
      if (res.success) {
        setForgotSuccess(res.message);
        setForgotStep('otp');
      } else {
        setForgotError(res.message);
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setForgotError(e.response?.data?.message || 'Erreur lors de l\'envoi du code.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleForgotStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotLoading(true);
    try {
      const res = await authService.verifyResetOtp(forgotEmail, forgotCode);
      if (res.success) {
        setResetToken(res.data.resetToken);
        setForgotStep('newPassword');
      } else {
        setForgotError(res.message);
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setForgotError(e.response?.data?.message || 'Code invalide ou expiré.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleForgotStep3 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      setForgotError('Les mots de passe ne correspondent pas.');
      return;
    }
    setForgotError('');
    setForgotLoading(true);
    try {
      const res = await authService.resetPassword(resetToken, newPass, confirmPass);
      if (res.success) {
        setForgotStep('success');
      } else {
        setForgotError(res.message);
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setForgotError(e.response?.data?.message || 'Erreur lors de la réinitialisation.');
    } finally {
      setForgotLoading(false);
    }
  };

  const closeForgot = () => {
    setShowForgot(false);
    setForgotStep('email');
    setForgotEmail('');
    setForgotCode('');
    setResetToken('');
    setNewPass('');
    setConfirmPass('');
    setForgotError('');
    setForgotSuccess('');
  };

  return (
    <div className="min-h-screen bg-surface-secondary flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=900&h=1200&fit=crop"
            alt="Famille africaine"
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/90 to-primary/70" />
        </div>
        <div className="absolute top-20 right-20 w-64 h-64 bg-gold/15 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-gold/10 rounded-full blur-3xl" />
        <div className="relative text-center text-white p-12 max-w-md">
          <div className="flex flex-col items-center mb-6">
            <Logo size="xl" variant="white" showText={false} className="justify-center" />
            <h2 className="text-2xl font-bold text-white mt-3">Aldiana <span className="text-gold">Care</span></h2>
          </div>
          <p className="text-white/70 leading-relaxed mb-8">
            L'assurance rapatriement et assistance funéraire 100% digitale pour la diaspora ouest-africaine.
          </p>
          <div className="flex items-center justify-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} size={14} className="text-gold fill-gold" />
            ))}
          </div>
          <p className="text-xs text-white/50">Noté 4.9/5 par +2000 familles</p>
        </div>
      </div>

      {/* Right panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {showForgot ? (
            <motion.div
              key="forgot"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md"
            >
              <div className="lg:hidden mb-8">
                <Logo size="md" variant="color" />
              </div>

              <button
                onClick={closeForgot}
                className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary mb-6 transition-colors"
              >
                <ArrowLeft size={16} />
                Retour à la connexion
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <KeyRound size={20} className="text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Réinitialiser le mot de passe</h1>
                  <p className="text-xs text-gray-500">
                    {forgotStep === 'email' && 'Étape 1/3 — Choisir la méthode'}
                    {forgotStep === 'otp' && 'Étape 2/3 — Vérifier le code'}
                    {forgotStep === 'newPassword' && 'Étape 3/3 — Nouveau mot de passe'}
                    {forgotStep === 'success' && 'Terminé !'}
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="flex gap-2 mb-6">
                {['email', 'otp', 'newPassword'].map((step, i) => (
                  <div
                    key={step}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                      i <= ['email', 'otp', 'newPassword', 'success'].indexOf(forgotStep)
                        ? 'bg-primary'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>

              {forgotError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2 mb-4">
                  <AlertTriangle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{forgotError}</p>
                </div>
              )}

              {/* STEP 1: Choose method */}
              {forgotStep === 'email' && (
                <form onSubmit={handleForgotStep1} className="space-y-4">
                  <Input
                    label="Email de votre compte"
                    type="email"
                    placeholder="votre@email.com"
                    icon={<Mail size={16} />}
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Recevoir le code par :</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setForgotMethod('email')}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                          forgotMethod === 'email'
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-gray-200 text-gray-500 hover:border-gray-300'
                        }`}
                      >
                        <Mail size={22} />
                        <span className="text-sm font-medium">Email</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setForgotMethod('whatsapp')}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                          forgotMethod === 'whatsapp'
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-gray-200 text-gray-500 hover:border-gray-300'
                        }`}
                      >
                        <Smartphone size={22} />
                        <span className="text-sm font-medium">WhatsApp</span>
                      </button>
                    </div>
                  </div>
                  <Button type="submit" fullWidth size="lg" disabled={forgotLoading || !forgotEmail}>
                    {forgotLoading ? 'Envoi en cours...' : 'Envoyer le code'}
                    {!forgotLoading && <ArrowRight size={16} className="ml-2" />}
                  </Button>
                </form>
              )}

              {/* STEP 2: Verify OTP code */}
              {forgotStep === 'otp' && (
                <form onSubmit={handleForgotStep2} className="space-y-4">
                  {forgotSuccess && (
                    <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 flex items-start gap-2">
                      <CheckCircle size={16} className="text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-primary">{forgotSuccess}</p>
                    </div>
                  )}
                  <p className="text-sm text-gray-600">
                    Saisissez le code à 6 chiffres envoyé à <span className="font-semibold text-gray-900">{forgotEmail}</span>
                  </p>
                  <Input
                    label="Code de vérification"
                    type="text"
                    placeholder="000000"
                    icon={<Shield size={16} />}
                    value={forgotCode}
                    onChange={(e) => setForgotCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                  />
                  <Button type="submit" fullWidth size="lg" disabled={forgotLoading || forgotCode.length !== 6}>
                    {forgotLoading ? 'Vérification...' : 'Vérifier le code'}
                    {!forgotLoading && <ArrowRight size={16} className="ml-2" />}
                  </Button>
                  <button
                    type="button"
                    onClick={() => { setForgotStep('email'); setForgotError(''); setForgotCode(''); }}
                    className="w-full text-center text-sm text-gray-500 hover:text-primary transition-colors"
                  >
                    Renvoyer un code
                  </button>
                </form>
              )}

              {/* STEP 3: New password */}
              {forgotStep === 'newPassword' && (
                <form onSubmit={handleForgotStep3} className="space-y-4">
                  <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 flex items-start gap-2 mb-2">
                    <CheckCircle size={16} className="text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-primary">Code vérifié ! Définissez votre nouveau mot de passe.</p>
                  </div>
                  <div className="relative">
                    <Input
                      label="Nouveau mot de passe"
                      type={showNewPass ? 'text' : 'password'}
                      placeholder="Min. 8 car., 1 maj, 1 min, 1 chiffre, 1 spécial"
                      icon={<Lock size={16} />}
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600"
                    >
                      {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <Input
                    label="Confirmer le mot de passe"
                    type="password"
                    placeholder="Même mot de passe"
                    icon={<Lock size={16} />}
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    required
                  />
                  {newPass && confirmPass && newPass !== confirmPass && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <XCircle size={12} /> Les mots de passe ne correspondent pas
                    </p>
                  )}
                  <Button type="submit" fullWidth size="lg" disabled={forgotLoading || !newPass || !confirmPass || newPass !== confirmPass}>
                    {forgotLoading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
                  </Button>
                </form>
              )}

              {/* SUCCESS */}
              {forgotStep === 'success' && (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
                    <CheckCircle size={32} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Mot de passe réinitialisé !</h3>
                  <p className="text-sm text-gray-500">
                    Votre mot de passe a été changé avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
                  </p>
                  <Button
                    fullWidth
                    size="lg"
                    variant="gold"
                    onClick={() => { closeForgot(); setEmail(forgotEmail); }}
                  >
                    Se connecter
                  </Button>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-md"
            >
              <div className="lg:hidden mb-8">
                <Logo size="md" variant="color" />
              </div>

              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary mb-6 transition-colors"
              >
                <ArrowLeft size={16} />
                Retour à l'accueil
              </Link>

              <h1 className="text-2xl font-bold text-gray-900 mb-2">Connexion</h1>
              <p className="text-sm text-gray-500 mb-6">Connectez-vous à votre espace Aldiana Care.</p>

              <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setError('');
              setPendingMsg('');
              setRejectedMsg('');
              setIsSubmitting(true);
              setShowLoginLoader(true);
              const result = await login(email, password);
              setIsSubmitting(false);
              if (result.success) {
                if (rememberMe) {
                  localStorage.setItem('aldiana_remember_email', email);
                } else {
                  localStorage.removeItem('aldiana_remember_email');
                }
                const from = (location.state as { from?: { pathname: string } })?.from?.pathname;
                const target = getRedirectPath(result.userRole || 'user', from);
                navigateTarget.current = target;
                setTimeout(() => navigate(navigateTarget.current!, { replace: true }), 800);
              } else {
                setShowLoginLoader(false);
                setIsSubmitting(false);
                if (result.registrationStatus === 'pending') {
                  setPendingMsg(result.message);
                } else if (result.registrationStatus === 'rejected') {
                  setRejectedMsg(result.rejectionReason || result.message);
                } else {
                  setError(result.message);
                }
              }
            }}
          >
            {/* Error messages */}
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2">
                <AlertTriangle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            {pendingMsg && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2">
                <Clock size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-700">{pendingMsg}</p>
              </div>
            )}
            {rejectedMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2">
                <XCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-600">Inscription rejetée</p>
                  <p className="text-xs text-red-500 mt-1">{rejectedMsg}</p>
                </div>
              </div>
            )}

            <Input
              label="Email"
              type="email"
              placeholder="votre@email.com"
              icon={<Mail size={16} />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="relative">
              <Input
                label="Mot de passe"
                type={showPassword ? 'text' : 'password'}
                placeholder="Votre mot de passe"
                icon={<Lock size={16} />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300 text-primary focus:ring-primary cursor-pointer" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Se souvenir de moi
              </label>
              <a
                onClick={(e) => { e.preventDefault(); setShowForgot(true); setForgotEmail(email); }}
                className="text-sm text-primary hover:underline font-medium cursor-pointer"
              >
                Mot de passe oublié ?
              </a>
            </div>

            <Button type="submit" fullWidth size="lg" variant="gold" disabled={isSubmitting}>
              {isSubmitting ? 'Connexion en cours...' : 'Se connecter'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Pas encore de compte ?{' '}
              <Link to="/inscription" className="text-primary font-medium hover:underline">
                Créer un compte
              </Link>
            </p>
          </div>
        </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
