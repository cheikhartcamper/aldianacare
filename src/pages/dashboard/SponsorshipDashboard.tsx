import { motion } from 'framer-motion';
import { Users, CreditCard, Copy, Share2, TrendingUp } from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const commissionData = [
  { month: 'Oct', amount: 10 },
  { month: 'Nov', amount: 15 },
  { month: 'Dec', amount: 10 },
  { month: 'Jan', amount: 20 },
  { month: 'Fev', amount: 15 },
  { month: 'Mar', amount: 10 },
];

const referrals = [
  { name: 'Mamadou Sow', date: '15 Fev 2026', plan: 'Premium', commission: '15€', status: 'active' },
  { name: 'Aissatou Barry', date: '20 Jan 2026', plan: 'Basic', commission: '10€', status: 'active' },
  { name: 'Ousmane Diallo', date: '05 Dec 2025', plan: 'Family', commission: '20€', status: 'active' },
];

export function SponsorshipDashboard() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Parrainage</h1>
        <p className="text-sm text-gray-500 mt-1">Suivez vos filleuls et vos commissions.</p>
      </motion.div>

      {/* Referral link */}
      <Card className="bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="font-semibold text-lg">Votre lien de parrainage</h3>
            <p className="text-white/70 text-sm mt-1">Partagez ce lien et gagnez des commissions.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-white/10 rounded-xl px-4 py-2.5 text-sm font-mono backdrop-blur-sm">
              aldianacare.com/r/AMADOU2026
            </div>
            <Button variant="gold" size="sm" icon={<Copy size={14} />} onClick={() => navigator.clipboard.writeText('https://aldianacare.com/r/AMADOU2026')}>
              Copier
            </Button>
            <Button variant="gold" size="sm" icon={<Share2 size={14} />}>
              Partager
            </Button>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Users size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Filleuls</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
              <CreditCard size={20} className="text-gold-dark" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Total commissions</p>
              <p className="text-2xl font-bold text-gray-900">45€</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center">
              <TrendingUp size={20} className="text-success" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Ce mois</p>
              <p className="text-2xl font-bold text-gray-900">10€</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Chart */}
        <Card>
          <h3 className="font-semibold text-gray-900 mb-4">Commissions mensuelles</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={commissionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '12px' }}
                  formatter={(value) => [`${value}€`, 'Commission']}
                />
                <Bar dataKey="amount" fill="#0F5F43" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Referral list */}
        <Card>
          <h3 className="font-semibold text-gray-900 mb-4">Mes filleuls</h3>
          <div className="space-y-3">
            {referrals.map((r) => (
              <div key={r.name} className="flex items-center gap-3 p-3 rounded-xl bg-surface-secondary">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users size={16} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{r.name}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>{r.date}</span>
                    <span>•</span>
                    <span>{r.plan}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-primary">{r.commission}</p>
                  <Badge variant="success" size="sm">Actif</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Commission history */}
      <Card padding="none">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Historique des commissions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left p-4 font-medium text-gray-500">Date</th>
                <th className="text-left p-4 font-medium text-gray-500">Filleul</th>
                <th className="text-left p-4 font-medium text-gray-500">Type</th>
                <th className="text-left p-4 font-medium text-gray-500">Montant</th>
                <th className="text-left p-4 font-medium text-gray-500">Statut</th>
              </tr>
            </thead>
            <tbody>
              {[
                { date: '01 Mar 2026', name: 'Ousmane Diallo', type: 'Renouvellement', amount: '10€', status: 'paid' },
                { date: '15 Fev 2026', name: 'Mamadou Sow', type: 'Souscription', amount: '15€', status: 'paid' },
                { date: '20 Jan 2026', name: 'Aissatou Barry', type: 'Souscription', amount: '10€', status: 'paid' },
                { date: '05 Dec 2025', name: 'Ousmane Diallo', type: 'Souscription', amount: '20€', status: 'paid' },
              ].map((c, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="p-4 text-gray-600">{c.date}</td>
                  <td className="p-4 font-medium text-gray-900">{c.name}</td>
                  <td className="p-4 text-gray-600">{c.type}</td>
                  <td className="p-4 font-bold text-primary">{c.amount}</td>
                  <td className="p-4"><Badge variant="success" dot size="sm">Versé</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
