import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, AlertTriangle, CheckCircle, Clock, Globe, Search, XCircle, RefreshCw } from 'lucide-react';
import { Card, PageLoader, Button } from '@/components/ui';
import { countryManagerService, type CountryManagerStats } from '@/services/countryManager.service';

export function CountryManagerDashboard() {
  const [stats, setStats] = useState<CountryManagerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await countryManagerService.getDashboard();
      if (res.success) {
        setStats(res.data);
      } else {
        setError(res.message || 'Impossible de charger les statistiques.');
      }
    } catch (err: unknown) {
      const e = err as { response?: { status?: number; data?: { message?: string } } };
      const msg = e.response?.data?.message || '';
      if (e.response?.status === 404 || msg.toLowerCase().includes('route non trouv')) {
        setError('Endpoint non disponible côté backend. Implémentez GET /api/country-manager/dashboard.');
      } else if (e.response?.status === 500) {
        setError('Le backend renvoie une erreur 500. Vérifiez les logs du serveur.');
      } else {
        setError(msg || 'Erreur de connexion. Vérifiez que le backend est actif.');
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <PageLoader variant="inline" size="sm" label="Chargement des statistiques..." />;

  if (error) {
    return (
      <Card>
        <div className="text-center py-14">
          <AlertTriangle size={40} className="mx-auto text-red-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Impossible de charger les statistiques</h3>
          <p className="text-sm text-red-600 max-w-md mx-auto mb-4">{error}</p>
          <Button onClick={fetchStats} variant="primary" size="sm" icon={<RefreshCw size={14} />}>
            Réessayer
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
            <Globe size={16} className="text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
            {stats?.country && (
              <p className="text-sm text-gray-500">Pays assigné : <span className="font-semibold text-emerald-700">{stats.country.name}</span></p>
            )}
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Assurés', value: stats?.totalUsers, icon: Users, color: 'text-primary', bg: 'bg-primary/10', textColor: 'text-gray-900' },
          { label: 'En attente', value: stats?.pendingDeclarations, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50', textColor: 'text-amber-600' },
          { label: 'En révision', value: stats?.inReviewDeclarations ?? 0, icon: Search, color: 'text-blue-500', bg: 'bg-blue-50', textColor: 'text-blue-600' },
          { label: 'Approuvées', value: stats?.approvedDeclarations, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', textColor: 'text-green-600' },
          { label: 'Rejetées', value: stats?.rejectedDeclarations, icon: XCircle, color: 'text-red-500', bg: 'bg-red-50', textColor: 'text-red-500' },
        ].map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 + i * 0.05 }}>
            <Card>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${kpi.bg}`}>
                  <kpi.icon size={18} className={kpi.color} />
                </div>
                <div>
                  <p className="text-xs text-gray-400">{kpi.label}</p>
                  <p className={`text-xl font-bold ${kpi.textColor}`}>{kpi.value ?? '—'}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Total declarations summary */}
      {stats && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <AlertTriangle size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Total déclarations</p>
                  <p className="text-xs text-gray-400 mt-0.5">{stats.country?.name} — toutes périodes</p>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.totalDeclarations}</p>
            </div>
          </Card>
        </motion.div>
      )}

      {!stats && !loading && (
        <Card>
          <div className="text-center py-10">
            <Globe size={36} className="text-gray-200 mx-auto mb-3" />
            <p className="text-sm text-gray-500">Aucune statistique disponible</p>
            <p className="text-xs text-gray-400 mt-1">Le tableau de bord se mettra à jour automatiquement.</p>
          </div>
        </Card>
      )}
    </div>
  );
}
