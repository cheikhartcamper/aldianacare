import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, AlertCircle, CheckCircle, RefreshCw, ArrowLeft, MessageSquare } from 'lucide-react';
import { Button, Logo, PageLoader, StepProgress } from '@/components/ui';
import { declarationService, type DeceasedUser, type Declarant } from '@/services/declaration.service';

const DECLARATION_STEPS = ['Recherche', 'Identité', 'Code OTP', 'Validation', 'Déclaration'];

export function VerifyOtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const deceased = location.state?.deceased as DeceasedUser | undefined;
  const declarant = location.state?.declarant as Declarant | undefined;
  const verificationSessionToken = location.state?.verificationSessionToken as string | undefined;

  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(300);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (!deceased || !declarant || !verificationSessionToken) {
      navigate('/declaration/search');
      return;
    }
    sendOtp();
  }, []);

  useEffect(() => {
    if (otpSent && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [otpSent, countdown]);

  const sendOtp = async () => {
    if (!verificationSessionToken) return;
    
    setIsSendingOtp(true);
    setError('');

    try {
      await declarationService.sendOtp({ verificationSessionToken });
      setOtpSent(true);
      setCountdown(300);
      setCanResend(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de l\'envoi du code OTP.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otpCode];
    newOtp[index] = value.slice(-1);
    setOtpCode(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationSessionToken) return;

    const code = otpCode.join('');
    if (code.length !== 6) {
      setError('Veuillez saisir le code à 6 chiffres.');
      return;
    }

    setError('');
    setIsVerifying(true);

    try {
      const response = await declarationService.verifyOtp({
        verificationSessionToken,
        code,
      });

      if (response.success) {
        navigate('/declaration/create', {
          state: {
            deceased,
            declarant,
            declarationToken: response.data.declarationToken,
          },
        });
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Code OTP incorrect. Veuillez réessayer.';
      const attemptsRemaining = err.response?.data?.attemptsRemaining;
      if (attemptsRemaining !== undefined) {
        setError(`${message} ${attemptsRemaining} tentative(s) restante(s).`);
      } else {
        setError(message);
      }
      setOtpCode(['', '', '', '', '', '']);
      document.getElementById('otp-0')?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  if (isSendingOtp && !otpSent) {
    return <PageLoader />;
  }

  if (!deceased || !declarant || !verificationSessionToken) {
    return null;
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
          <StepProgress steps={DECLARATION_STEPS} currentStep={2} />
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
              Étape 3 sur 5
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Vérification <span className="text-primary">WhatsApp</span>
            </h1>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Saisissez le code de sécurité envoyé sur votre téléphone
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main content */}
      <section className="pb-16">
        <div className="max-w-md mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg shadow-primary/5 p-6 lg:p-8">
              {/* Success info */}
              <div className="mb-6 p-4 bg-gradient-to-r from-primary-50 to-transparent border border-primary/10 rounded-xl">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MessageSquare size={16} className="text-primary" />
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-primary mb-1">Code envoyé !</p>
                    <p className="text-gray-600">
                      Un code à 6 chiffres a été envoyé par WhatsApp au{' '}
                      <span className="font-semibold text-gray-900">{declarant.phone}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* OTP Input */}
              <form onSubmit={handleVerify} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                    Saisissez le code reçu
                  </label>
                  <div className="flex gap-2 justify-center">
                    {otpCode.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary-50 outline-none transition-all bg-primary-50/30"
                        disabled={isVerifying}
                      />
                    ))}
                  </div>
                </div>

                {/* Countdown */}
                {countdown > 0 && (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                    <p className="text-sm text-gray-600">
                      Code valide pendant : <span className="font-bold text-primary">{formatTime(countdown)}</span>
                    </p>
                  </div>
                )}

                {error && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2">
                      <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  </motion.div>
                )}

                <Button type="submit" fullWidth disabled={isVerifying || otpCode.join('').length !== 6} className="shadow-lg shadow-primary/20">
                  <CheckCircle size={18} />
                  {isVerifying ? 'Vérification...' : 'Vérifier le code'}
                </Button>

                {/* Resend */}
                {canResend && (
                  <button
                    type="button"
                    onClick={sendOtp}
                    disabled={isSendingOtp}
                    className="w-full py-2.5 text-sm text-primary hover:text-primary-dark font-semibold flex items-center justify-center gap-2 transition-colors rounded-xl hover:bg-primary-50"
                  >
                    <RefreshCw size={16} />
                    Renvoyer le code
                  </button>
                )}
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
