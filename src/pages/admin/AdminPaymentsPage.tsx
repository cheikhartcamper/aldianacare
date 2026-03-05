import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Download, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, Badge, Button, Input } from '@/components/ui';

const payments = [
  { id: 'PAY-10234', user: 'Amadou Diallo', amount: '19,90€', method: 'Wave', date: '01 Mar 2026', status: 'paid' },
  { id: 'PAY-10233', user: 'Fatou Diop', amount: '29,90€', method: 'Orange Money', date: '01 Mar 2026', status: 'paid' },
  { id: 'PAY-10232', user: 'Moussa Konaté', amount: '9,90€', method: 'Carte Visa', date: '01 Mar 2026', status: 'paid' },
  { id: 'PAY-10231', user: 'Aminata Camara', amount: '19,90€', method: 'Wave', date: '01 Mar 2026', status: 'failed' },
  { id: 'PAY-10230', user: 'Ibrahima Ba', amount: '39,90€', method: 'MTN Money', date: '01 Mar 2026', status: 'paid' },
  { id: 'PAY-10229', user: 'Mariam Touré', amount: '19,90€', method: 'PayPal', date: '28 Fev 2026', status: 'pending' },
];

const statusConfig: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' }> = {
  paid: { label: 'Payé', variant: 'success' },
  pending: { label: 'En attente', variant: 'warning' },
  failed: { label: 'Échoué', variant: 'danger' },
};

export function AdminPaymentsPage() {
  const [search, setSearch] = useState('');
  const filtered = payments.filter((p) => p.user.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Suivi des paiements</h1>
        <p className="text-sm text-gray-500 mt-1">Tous les paiements de la plateforme.</p>
      </motion.div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center">
              <CheckCircle size={20} className="text-success" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Payés ce mois</p>
              <p className="text-xl font-bold text-gray-900">24 100€</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-warning/10 rounded-xl flex items-center justify-center">
              <CreditCard size={20} className="text-warning" />
            </div>
            <div>
              <p className="text-xs text-gray-400">En attente</p>
              <p className="text-xl font-bold text-gray-900">1 240€</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-danger/10 rounded-xl flex items-center justify-center">
              <AlertCircle size={20} className="text-danger" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Impayés</p>
              <p className="text-xl font-bold text-gray-900">380€</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input placeholder="Rechercher..." icon={<Search size={16} />} value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button variant="secondary" size="sm" icon={<Filter size={14} />}>Filtrer</Button>
        <Button variant="secondary" size="sm" icon={<Download size={14} />}>Exporter</Button>
      </div>

      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left p-4 font-medium text-gray-500">Référence</th>
                <th className="text-left p-4 font-medium text-gray-500">Utilisateur</th>
                <th className="text-left p-4 font-medium text-gray-500">Montant</th>
                <th className="text-left p-4 font-medium text-gray-500">Méthode</th>
                <th className="text-left p-4 font-medium text-gray-500">Date</th>
                <th className="text-left p-4 font-medium text-gray-500">Statut</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="p-4 font-mono text-xs text-gray-600">{p.id}</td>
                  <td className="p-4 font-medium text-gray-900">{p.user}</td>
                  <td className="p-4 font-semibold text-gray-900">{p.amount}</td>
                  <td className="p-4 text-gray-600">{p.method}</td>
                  <td className="p-4 text-gray-500">{p.date}</td>
                  <td className="p-4"><Badge variant={statusConfig[p.status].variant} dot size="sm">{statusConfig[p.status].label}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
