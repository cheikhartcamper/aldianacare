import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Star, ArrowLeft, AlertTriangle, Clock, XCircle } from 'lucide-react';
import { useState, useRef } from 'react';
import { Button, Input, Logo, PageLoader } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
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
              <a href="#" className="text-sm text-primary hover:underline font-medium">
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
      </div>
    </div>
  );
}
