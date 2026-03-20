import { motion } from 'framer-motion';
import { Gift, Users, TrendingUp, Zap, Award, Share2 } from 'lucide-react';
import { Card, Badge } from '@/components/ui';

export function AdminCommissionsPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }}>
        <h1 className="text-2xl font-bold text-gray-900">Commissions & Parrainage</h1>
        <p className="text-sm text-gray-500 mt-1">Suivi des commissions de parrainage et programme sponsors.</p>
      </motion.div>

      {/* Preview stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Sponsors actifs', value: '—', icon: Users, color: 'text-gray-300', bg: 'bg-gray-50' },
          { label: 'Filleuls', value: '—', icon: Share2, color: 'text-gray-300', bg: 'bg-gray-50' },
          { label: 'Commissions versées', value: '—', icon: TrendingUp, color: 'text-gray-300', bg: 'bg-gray-50' },
          { label: 'Ce mois', value: '—', icon: Zap, color: 'text-gray-300', bg: 'bg-gray-50' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg}`}>
                  <stat.icon size={18} className={stat.color} />
                </div>
                <div>
                  <p className="text-xs text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-300">{stat.value}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold/10 to-primary/10 flex items-center justify-center mb-6">
              <Gift size={36} className="text-gold-dark" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Programme de parrainage</h2>
            <Badge variant="warning" size="sm" className="mb-4">En cours de développement</Badge>
            <p className="text-sm text-gray-500 max-w-lg leading-relaxed">
              Le programme de parrainage permettra aux utilisateurs de parrainer de nouveaux adhérents
              et de percevoir des commissions. Cette page affichera l'historique des commissions,
              les versements et les statistiques des sponsors.
            </p>
            <div className="grid sm:grid-cols-3 gap-4 mt-8 max-w-lg w-full">
              {[
                { icon: Share2, label: 'Code parrainage', desc: 'Unique par adhérent' },
                { icon: Award, label: 'Commissions', desc: 'Automatiques' },
                { icon: Gift, label: 'Bonus paliers', desc: '5, 10, 25 filleuls' },
              ].map((f) => (
                <div key={f.label} className="p-3 rounded-xl bg-gray-50 text-center">
                  <f.icon size={20} className="mx-auto text-gold-dark mb-2" />
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
