import { motion } from 'framer-motion';
import { CreditCard, Download, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui';

const payments = [
  { id: 'PAY-001', date: '01 Mars 2026', amount: '19,90€', method: 'Wave', status: 'paid' },
  { id: 'PAY-002', date: '01 Fev 2026', amount: '19,90€', method: 'Wave', status: 'paid' },
  { id: 'PAY-003', date: '01 Jan 2026', amount: '19,90€', method: 'Orange Money', status: 'paid' },
  { id: 'PAY-004', date: '01 Dec 2025', amount: '19,90€', method: 'Wave', status: 'paid' },
  { id: 'PAY-005', date: '01 Nov 2025', amount: '19,90€', method: 'Carte bancaire', status: 'paid' },
  { id: 'PAY-006', date: '01 Oct 2025', amount: '19,90€', method: 'Wave', status: 'paid' },
];

const statusConfig = {
  paid: { label: 'Payé', variant: 'success' as const, icon: CheckCircle },
  pending: { label: 'En attente', variant: 'warning' as const, icon: Clock },
  failed: { label: 'Échoué', variant: 'danger' as const, icon: AlertCircle },
};

export function PaymentsPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Paiements</h1>
        <p className="text-sm text-gray-500 mt-1">Gérez vos paiements et consultez l'historique.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center">
              <CheckCircle size={20} className="text-success" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Total payé</p>
              <p className="text-lg font-bold text-gray-900">119,40€</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-info/10 rounded-xl flex items-center justify-center">
              <CreditCard size={20} className="text-info" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Prochaine échéance</p>
              <p className="text-lg font-bold text-gray-900">01 Avril 2026</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <CreditCard size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Moyen de paiement</p>
              <p className="text-lg font-bold text-gray-900">Wave</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Payment methods */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Moyens de paiement</h3>
          <Button variant="secondary" size="sm">Ajouter</Button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { name: 'Wave', info: '•••• 7890', active: true },
            { name: 'Orange Money', info: '•••• 4567', active: false },
            { name: 'Carte Visa', info: '•••• 1234', active: false },
          ].map((m) => (
            <div key={m.name} className={`p-4 rounded-xl border-2 ${m.active ? 'border-primary bg-primary-50' : 'border-gray-100'}`}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900">{m.name}</span>
                {m.active && <Badge variant="primary" size="sm">Actif</Badge>}
              </div>
              <p className="text-xs text-gray-400 mt-1">{m.info}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Payment history */}
      <Card padding="none">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Historique des paiements</h3>
            <Button variant="ghost" size="sm" icon={<Download size={14} />}>Exporter</Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left p-4 font-medium text-gray-500">Référence</th>
                <th className="text-left p-4 font-medium text-gray-500">Date</th>
                <th className="text-left p-4 font-medium text-gray-500">Montant</th>
                <th className="text-left p-4 font-medium text-gray-500">Méthode</th>
                <th className="text-left p-4 font-medium text-gray-500">Statut</th>
                <th className="text-left p-4 font-medium text-gray-500">Reçu</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => {
                const config = statusConfig[p.status as keyof typeof statusConfig];
                return (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="p-4 font-mono text-xs text-gray-600">{p.id}</td>
                    <td className="p-4 text-gray-700">{p.date}</td>
                    <td className="p-4 font-semibold text-gray-900">{p.amount}</td>
                    <td className="p-4 text-gray-600">{p.method}</td>
                    <td className="p-4">
                      <Badge variant={config.variant} dot size="sm">{config.label}</Badge>
                    </td>
                    <td className="p-4">
                      <button className="text-primary hover:underline text-xs font-medium">
                        <Download size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
