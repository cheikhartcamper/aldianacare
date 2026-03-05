import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Eye, Download } from 'lucide-react';
import { Card, Badge, Button, Input } from '@/components/ui';

const contracts = [
  { id: 'ALC-2026-001234', user: 'Amadou Diallo', plan: 'Premium', start: '01 Jan 2026', end: '01 Jan 2027', amount: '19,90€', status: 'active' },
  { id: 'ALC-2026-001235', user: 'Fatou Diop', plan: 'Family', start: '20 Jan 2026', end: '20 Jan 2027', amount: '29,90€', status: 'active' },
  { id: 'ALC-2026-001236', user: 'Moussa Konaté', plan: 'Basic', start: '01 Fev 2026', end: '01 Fev 2027', amount: '9,90€', status: 'active' },
  { id: 'ALC-2025-001100', user: 'Aminata Camara', plan: 'Premium', start: '10 Nov 2025', end: '10 Nov 2026', amount: '19,90€', status: 'suspended' },
  { id: 'ALC-2026-001237', user: 'Ibrahima Ba', plan: 'Pathologie', start: '05 Mar 2026', end: '05 Mar 2027', amount: '39,90€', status: 'active' },
];

const statusVariants: Record<string, 'success' | 'warning' | 'danger'> = { active: 'success', pending: 'warning', suspended: 'danger' };
const statusLabels: Record<string, string> = { active: 'Actif', pending: 'En attente', suspended: 'Suspendu' };

export function AdminContractsPage() {
  const [search, setSearch] = useState('');
  const filtered = contracts.filter((c) => c.user.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Gestion des contrats</h1>
        <p className="text-sm text-gray-500 mt-1">{contracts.length} contrats au total</p>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input placeholder="Rechercher par nom ou N° contrat..." icon={<Search size={16} />} value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button variant="secondary" size="sm" icon={<Filter size={14} />}>Filtrer</Button>
        <Button variant="secondary" size="sm" icon={<Download size={14} />}>Exporter</Button>
      </div>

      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left p-4 font-medium text-gray-500">N° Contrat</th>
                <th className="text-left p-4 font-medium text-gray-500">Souscripteur</th>
                <th className="text-left p-4 font-medium text-gray-500">Formule</th>
                <th className="text-left p-4 font-medium text-gray-500">Début</th>
                <th className="text-left p-4 font-medium text-gray-500">Fin</th>
                <th className="text-left p-4 font-medium text-gray-500">Mensualité</th>
                <th className="text-left p-4 font-medium text-gray-500">Statut</th>
                <th className="text-left p-4 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="p-4 font-mono text-xs text-gray-600">{c.id}</td>
                  <td className="p-4 font-medium text-gray-900">{c.user}</td>
                  <td className="p-4"><Badge variant="primary" size="sm">{c.plan}</Badge></td>
                  <td className="p-4 text-gray-500">{c.start}</td>
                  <td className="p-4 text-gray-500">{c.end}</td>
                  <td className="p-4 font-semibold text-primary">{c.amount}</td>
                  <td className="p-4"><Badge variant={statusVariants[c.status]} dot size="sm">{statusLabels[c.status]}</Badge></td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><Eye size={14} /></button>
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><Download size={14} /></button>
                    </div>
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
