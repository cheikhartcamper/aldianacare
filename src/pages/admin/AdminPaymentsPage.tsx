import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Users, TrendingUp, Clock, Shield, CheckCircle } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { adminService } from '@/services/admin.service';

export function AdminPaymentsPage() {
  const [totalContracts, setTotalContracts] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await adminService.getRegistrations({ status: 'approved', limit: 1 });
        if (res.success) setTotalContracts(res.data.pagination.total);
      } catch { /* ignore */ }
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'easeOut' as const }}>
        <h1 className="text-2xl font-bold text-gray-900">Suivi des paiements</h1>
        <p className="text-sm text-gray-500 mt-1">Historique et suivi des cotisations de la plateforme.</p>
      </motion.div>

      {/* Preview stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Adhérents actifs', value: loading ? '—' : totalContracts, icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Cotisations ce mois', value: '—', icon: CreditCard, color: 'text-gray-300', bg: 'bg-gray-50', dim: true },
          { label: 'Revenu total', value: '—', icon: TrendingUp, color: 'text-gray-300', bg: 'bg-gray-50', dim: true },
          { label: 'Impayés', value: '—', icon: Clock, color: 'text-gray-300', bg: 'bg-gray-50', dim: true },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg}`}>
                  <stat.icon size={18} className={stat.color} />
                </div>
                <div>
                  <p className="text-xs text-gray-400">{stat.label}</p>
                  <p className={`text-2xl font-bold ${('dim' in stat && stat.dim) ? 'text-gray-300' : 'text-gray-900'}`}>{stat.value}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-gold/10 flex items-center justify-center mb-6">
              <CreditCard size={36} className="text-primary" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Module de paiement</h2>
            <Badge variant="warning" size="sm" className="mb-4">En cours de développement</Badge>
            <p className="text-sm text-gray-500 max-w-lg leading-relaxed">
              L'intégration des moyens de paiement (Wave, Orange Money, carte bancaire) est en cours de développement.
              Cette page affichera les transactions, les reçus, les statistiques de revenus et le suivi des impayés.
            </p>
            <div className="grid sm:grid-cols-3 gap-4 mt-8 max-w-lg w-full">
              {[
                { icon: Shield, label: 'Paiement sécurisé', desc: 'Intégration Wave & OM' },
                { icon: CreditCard, label: 'Reçus automatiques', desc: 'PDF & email' },
                { icon: CheckCircle, label: 'Suivi cotisations', desc: 'Mensuel / annuel' },
              ].map((f) => (
                <div key={f.label} className="p-3 rounded-xl bg-gray-50 text-center">
                  <f.icon size={20} className="mx-auto text-primary mb-2" />
                  <p className="text-xs font-semibold text-gray-900">{f.label}</p>
                  <p className="text-[10px] text-gray-400">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
