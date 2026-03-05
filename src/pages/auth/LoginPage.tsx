import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Star } from 'lucide-react';
import { useState } from 'react';
import { Button, Input, Logo } from '@/components/ui';

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

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

          <h1 className="text-2xl font-bold text-gray-900 mb-2">Connexion</h1>
          <p className="text-sm text-gray-500 mb-8">Accédez à votre espace personnel Aldiana Care.</p>

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              navigate('/app');
            }}
          >
            <Input
              label="Email"
              type="email"
              placeholder="votre@email.com"
              icon={<Mail size={16} />}
            />
            <div className="relative">
              <Input
                label="Mot de passe"
                type={showPassword ? 'text' : 'password'}
                placeholder="Votre mot de passe"
                icon={<Lock size={16} />}
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
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                Se souvenir de moi
              </label>
              <a href="#" className="text-sm text-primary hover:underline font-medium">
                Mot de passe oublié ?
              </a>
            </div>

            <Button type="submit" fullWidth size="lg" variant="gold">
              Se connecter
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

          <div className="mt-8 text-center">
            <Link to="/admin" className="text-xs text-gray-400 hover:text-gray-600">
              Accès administrateur
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
