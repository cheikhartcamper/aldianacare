import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Eye, Edit, MoreHorizontal, Loader2 } from 'lucide-react';
import { Card, Badge, Button, Input } from '@/components/ui';
import { adminService, type UserWithTrusted } from '@/services/admin.service';

const statusVariants: Record<string, 'success' | 'warning' | 'danger'> = {
  approved: 'success',
  pending: 'warning',
  rejected: 'danger',
};

const statusLabels: Record<string, string> = {
  approved: 'Approuvé',
  pending: 'En attente',
  rejected: 'Rejeté',
};

export function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<UserWithTrusted[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await adminService.getUsers({ limit: 100 });
        if (res.success) {
          setUsers(res.data.users);
          setTotalUsers(res.data.pagination.total);
        }
      } catch { /* ignore */ }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const filtered = users.filter((u) =>
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Gestion des utilisateurs</h1>
        <p className="text-sm text-gray-500 mt-1">{totalUsers} utilisateurs inscrits</p>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input placeholder="Rechercher un utilisateur..." icon={<Search size={16} />} value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button variant="secondary" size="sm" icon={<Filter size={14} />}>Filtrer</Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="animate-spin text-primary" />
        </div>
      ) : (
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
                {filtered.map((u) => (
                  <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                          {u.firstName?.charAt(0)}{u.lastName?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{u.firstName} {u.lastName}</p>
                          <p className="text-xs text-gray-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4"><Badge variant="primary" size="sm">{u.planType === 'family' ? 'Familial' : 'Individuel'}</Badge></td>
                    <td className="p-4 text-gray-600">{u.residenceCountry || '-'}</td>
                    <td className="p-4 text-gray-500">{new Date(u.createdAt).toLocaleDateString('fr-FR')}</td>
                    <td className="p-4"><Badge variant={statusVariants[u.registrationStatus] || 'warning'} dot size="sm">{statusLabels[u.registrationStatus] || u.registrationStatus}</Badge></td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><Eye size={14} /></button>
                        <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><Edit size={14} /></button>
                        <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><MoreHorizontal size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="p-8 text-center text-gray-400">Aucun utilisateur trouvé</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
