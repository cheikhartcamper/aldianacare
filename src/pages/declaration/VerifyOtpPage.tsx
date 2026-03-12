import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { Button, PageLoader } from '@/components/ui';
import { declarationService, type DeceasedUser, type Declarant } from '@/services/declaration.service';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center">
                <Shield size={32} className="text-primary" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Vérification WhatsApp</h1>
            <p className="text-sm text-gray-600">
              Étape 3-4/5 — Code de sécurité
            </p>
          </div>

          {/* Info */}
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex gap-3">
              <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-green-800">
                <p className="font-medium mb-1">Code envoyé !</p>
                <p>
                  Un code à 6 chiffres a été envoyé par WhatsApp au numéro{' '}
                  <span className="font-semibold">{declarant.phone}</span>
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
                    className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary-50 outline-none transition-all"
                    disabled={isVerifying}
                  />
                ))}
              </div>
            </div>

            {/* Countdown */}
            {countdown > 0 && (
              <p className="text-sm text-center text-gray-600">
                Code valide pendant : <span className="font-semibold text-primary">{formatTime(countdown)}</span>
              </p>
            )}

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2">
                <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button type="submit" fullWidth disabled={isVerifying || otpCode.join('').length !== 6}>
              <CheckCircle size={18} />
              {isVerifying ? 'Vérification...' : 'Vérifier le code'}
            </Button>

            {/* Resend */}
            {canResend && (
              <button
                type="button"
                onClick={sendOtp}
                disabled={isSendingOtp}
                className="w-full py-2 text-sm text-primary hover:text-primary-dark font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <RefreshCw size={16} />
                Renvoyer le code
              </button>
            )}
          </form>

          {/* Progress indicator */}
          <div className="mt-8 flex items-center justify-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <div className="w-3 h-3 rounded-full bg-primary"></div>
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
            ← Annuler la déclaration
          </button>
        </div>
      </motion.div>
    </div>
  );
}
