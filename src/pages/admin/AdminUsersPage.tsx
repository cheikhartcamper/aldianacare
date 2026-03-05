import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Eye, Edit, MoreHorizontal } from 'lucide-react';
import { Card, Badge, Button, Input } from '@/components/ui';

const users = [
  { id: 'USR-001', name: 'Amadou Diallo', email: 'amadou@email.com', plan: 'Premium', country: 'France', status: 'active', date: '15 Dec 2025' },
  { id: 'USR-002', name: 'Fatou Diop', email: 'fatou@email.com', plan: 'Family', country: 'France', status: 'active', date: '20 Jan 2026' },
  { id: 'USR-003', name: 'Moussa Konaté', email: 'moussa@email.com', plan: 'Basic', country: 'Belgique', status: 'active', date: '01 Fev 2026' },
  { id: 'USR-004', name: 'Aminata Camara', email: 'aminata@email.com', plan: 'Premium', country: 'Italie', status: 'suspended', date: '10 Nov 2025' },
  { id: 'USR-005', name: 'Ibrahima Ba', email: 'ibrahima@email.com', plan: 'Pathologie', country: 'Espagne', status: 'active', date: '05 Mar 2026' },
  { id: 'USR-006', name: 'Mariam Touré', email: 'mariam@email.com', plan: 'Premium', country: 'Allemagne', status: 'pending', date: '04 Mar 2026' },
];

const statusVariants: Record<string, 'success' | 'warning' | 'danger'> = {
  active: 'success',
  pending: 'warning',
  suspended: 'danger',
};

const statusLabels: Record<string, string> = {
  active: 'Actif',
  pending: 'En attente',
  suspended: 'Suspendu',
};

export function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Gestion des utilisateurs</h1>
        <p className="text-sm text-gray-500 mt-1">{users.length} utilisateurs inscrits</p>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input placeholder="Rechercher un utilisateur..." icon={<Search size={16} />} value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button variant="secondary" size="sm" icon={<Filter size={14} />}>Filtrer</Button>
      </div>

      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left p-4 font-medium text-gray-500">Utilisateur</th>
                <th className="text-left p-4 font-medium text-gray-500">Plan</th>
                <th className="text-left p-4 font-medium text-gray-500">Pays</th>
                <th className="text-left p-4 font-medium text-gray-500">Date</th>
                <th className="text-left p-4 font-medium text-gray-500">Statut</th>
                <th className="text-left p-4 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                        {user.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4"><Badge variant="primary" size="sm">{user.plan}</Badge></td>
                  <td className="p-4 text-gray-600">{user.country}</td>
                  <td className="p-4 text-gray-500">{user.date}</td>
                  <td className="p-4"><Badge variant={statusVariants[user.status]} dot size="sm">{statusLabels[user.status]}</Badge></td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><Eye size={14} /></button>
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><Edit size={14} /></button>
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><MoreHorizontal size={14} /></button>
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
