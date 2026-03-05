import { motion } from 'framer-motion';
import { Gift, Download, Users, CreditCard } from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui';

const commissions = [
  { sponsor: 'Amadou Diallo', referral: 'Mamadou Sow', type: 'Souscription', amount: '15€', date: '15 Fev 2026', status: 'paid' },
  { sponsor: 'Amadou Diallo', referral: 'Aissatou Barry', type: 'Souscription', amount: '10€', date: '20 Jan 2026', status: 'paid' },
  { sponsor: 'Fatou Diop', referral: 'Boubacar Camara', type: 'Souscription', amount: '15€', date: '10 Jan 2026', status: 'paid' },
  { sponsor: 'Amadou Diallo', referral: 'Ousmane Diallo', type: 'Renouvellement', amount: '10€', date: '01 Mar 2026', status: 'pending' },
  { sponsor: 'Moussa Konaté', referral: 'Aminata Sow', type: 'Souscription', amount: '10€', date: '28 Fev 2026', status: 'paid' },
];

export function AdminCommissionsPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Commissions sponsors</h1>
        <p className="text-sm text-gray-500 mt-1">Suivi des commissions de parrainage.</p>
      </motion.div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
              <Gift size={20} className="text-gold-dark" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Total commissions</p>
              <p className="text-xl font-bold text-gray-900">2 340€</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Users size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Sponsors actifs</p>
              <p className="text-xl font-bold text-gray-900">156</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center">
              <CreditCard size={20} className="text-success" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Ce mois</p>
              <p className="text-xl font-bold text-gray-900">420€</p>
            </div>
          </div>
        </Card>
      </div>

      <Card padding="none">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Historique des commissions</h3>
          <Button variant="secondary" size="sm" icon={<Download size={14} />}>Exporter</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left p-4 font-medium text-gray-500">Sponsor</th>
                <th className="text-left p-4 font-medium text-gray-500">Filleul</th>
                <th className="text-left p-4 font-medium text-gray-500">Type</th>
                <th className="text-left p-4 font-medium text-gray-500">Montant</th>
                <th className="text-left p-4 font-medium text-gray-500">Date</th>
                <th className="text-left p-4 font-medium text-gray-500">Statut</th>
              </tr>
            </thead>
            <tbody>
              {commissions.map((c, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="p-4 font-medium text-gray-900">{c.sponsor}</td>
                  <td className="p-4 text-gray-600">{c.referral}</td>
                  <td className="p-4 text-gray-600">{c.type}</td>
                  <td className="p-4 font-bold text-primary">{c.amount}</td>
                  <td className="p-4 text-gray-500">{c.date}</td>
                  <td className="p-4">
                    <Badge variant={c.status === 'paid' ? 'success' : 'warning'} dot size="sm">
                      {c.status === 'paid' ? 'Versé' : 'En attente'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
