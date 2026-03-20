import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Gift, Users, Copy, Send, RefreshCw, CheckCircle,
  Mail, Phone, Loader2, Share2, Percent, AlertCircle
} from 'lucide-react';
import { Card, Badge, Button, Input } from '@/components/ui';
import { referralService, type MyCodeResponse, type Referral } from '@/services/referral.service';

export function SponsorshipDashboard() {
  const [loading, setLoading] = useState(true);
  const [codeData, setCodeData] = useState<MyCodeResponse | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [generating, setGenerating] = useState(false);
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Send form
  const [sendMethod, setSendMethod] = useState<'email' | 'whatsapp'>('whatsapp');
  const [sendRecipient, setSendRecipient] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [codeRes, referralsRes] = await Promise.all([
        referralService.getMyCode(),
        referralService.getMyReferrals(),
      ]);
      setCodeData(codeRes.data);
      setReferrals(referralsRes.data.referrals);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } }).response?.data?.message;
      setError(msg || 'Impossible de charger vos données de parrainage.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void fetchData(); }, [fetchData]);

  const handleGenerate = async () => {
    setGenerating(true);
    setError('');
    setSuccessMsg('');
    try {
      const res = await referralService.generate();
      setCodeData((prev) => prev ? { ...prev, referralCode: res.data.referralCode } : { referralCode: res.data.referralCode, referralCount: 0, discountPercent: 10 });
      setSuccessMsg(`Code généré : ${res.data.referralCode}`);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } }).response?.data?.message;
      setError(msg || 'Impossible de générer le code.');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!codeData?.referralCode) return;
    navigator.clipboard.writeText(codeData.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = async () => {
    if (!sendRecipient.trim()) {
      setError(sendMethod === 'email' ? 'Veuillez saisir une adresse email.' : 'Veuillez saisir un numéro de téléphone.');
      return;
    }
    setSending(true);
    setError('');
    setSuccessMsg('');
    try {
      const res = await referralService.send(sendMethod, sendRecipient.trim());
      setSuccessMsg(res.message || `Code envoyé par ${sendMethod} à ${sendRecipient}`);
      setSendRecipient('');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } }).response?.data?.message;
      setError(msg || 'Impossible d\'envoyer le code.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Parrainage</h1>
          <p className="text-sm text-gray-500 mt-1">Parrainez vos proches et offrez-leur une réduction.</p>
        </div>
        <Button variant="ghost" size="sm" icon={<RefreshCw size={14} />} onClick={() => void fetchData()} disabled={loading}>
          Actualiser
        </Button>
      </motion.div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <div className="flex items-start gap-2">
            <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </Card>
      )}

      {successMsg && (
        <Card className="border-emerald-200 bg-emerald-50">
          <div className="flex items-start gap-2">
            <CheckCircle size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-emerald-700">{successMsg}</p>
          </div>
        </Card>
      )}

      {loading ? (
        <Card>
          <div className="flex items-center justify-center gap-2 py-10 text-gray-500">
            <Loader2 size={18} className="animate-spin" />
            Chargement...
          </div>
        </Card>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                  <Gift size={18} className="text-gold-dark" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Mon code</p>
                  <p className="text-lg font-bold text-gray-900">{codeData?.referralCode || '—'}</p>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Filleuls</p>
                  <p className="text-lg font-bold text-gray-900">{codeData?.referralCount ?? 0}</p>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <Percent size={18} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Réduction filleul</p>
                  <p className="text-lg font-bold text-gray-900">{codeData?.discountPercent ?? 10}%</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Code section */}
          <Card>
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Share2 size={16} className="text-primary" /> Mon code de parrainage
            </h3>

            {codeData?.referralCode ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-gold/10 rounded-xl border border-gold/20">
                  <p className="text-2xl font-bold text-gray-900 tracking-wider flex-1">{codeData.referralCode}</p>
                  <Button variant="outline" size="sm" onClick={handleCopy}>
                    {copied ? <CheckCircle size={14} className="text-emerald-600" /> : <Copy size={14} />}
                    {copied ? 'Copié !' : 'Copier'}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleGenerate} loading={generating}>
                    <RefreshCw size={14} /> Régénérer
                  </Button>
                </div>

                {/* Send form */}
                <div className="p-4 bg-gray-50 rounded-xl space-y-3">
                  <p className="text-sm font-medium text-gray-700">Envoyer mon code à un proche</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSendMethod('whatsapp')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        sendMethod === 'whatsapp' ? 'bg-primary text-white' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <Phone size={12} /> WhatsApp
                    </button>
                    <button
                      onClick={() => setSendMethod('email')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        sendMethod === 'email' ? 'bg-primary text-white' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <Mail size={12} /> Email
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder={sendMethod === 'email' ? 'ami@email.com' : '+221770001234'}
                      value={sendRecipient}
                      onChange={(e) => setSendRecipient(e.target.value)}
                    />
                    <Button variant="gold" size="sm" onClick={handleSend} loading={sending} disabled={!sendRecipient.trim()}>
                      <Send size={14} /> Envoyer
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <Gift size={40} className="mx-auto text-gold-dark/30 mb-3" />
                <p className="text-sm text-gray-500 mb-4">Vous n'avez pas encore de code de parrainage.</p>
                <Button variant="gold" onClick={handleGenerate} loading={generating}>
                  <Gift size={16} /> Générer mon code
                </Button>
              </div>
            )}
          </Card>

          {/* Referrals list */}
          <Card>
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users size={16} className="text-primary" /> Mes filleuls ({referrals.length})
            </h3>

            {referrals.length === 0 ? (
              <div className="text-center py-8">
                <Users size={36} className="mx-auto text-gray-200 mb-3" />
                <p className="text-sm text-gray-400">Aucun filleul pour le moment.</p>
                <p className="text-xs text-gray-300 mt-1">Partagez votre code pour commencer à parrainer.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {referrals.map((r) => (
                  <div key={r.id} className="flex items-center justify-between p-3 rounded-xl bg-surface-secondary border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                        {r.firstName?.charAt(0)}{r.lastName?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{r.firstName} {r.lastName}</p>
                        <p className="text-[10px] text-gray-400">{r.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={r.registrationStatus === 'approved' ? 'success' : r.registrationStatus === 'pending' ? 'warning' : 'danger'}
                        size="sm"
                      >
                        {r.registrationStatus === 'approved' ? 'Approuvé' : r.registrationStatus === 'pending' ? 'En attente' : 'Rejeté'}
                      </Badge>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {new Date(r.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
