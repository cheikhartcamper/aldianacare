import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, AlertTriangle, CheckCircle, Clock, Globe, Search,
  XCircle, RefreshCw, FileText, ArrowRight, TrendingUp,
} from 'lucide-react';
import { Card, PageLoader, Button } from '@/components/ui';
import { countryManagerService, type CountryManagerStats } from '@/services/countryManager.service';
import { useAuth } from '@/contexts/AuthContext';

export function CountryManagerDashboard() {
  const [stats, setStats] = useState<CountryManagerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

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
        setError('Endpoint non disponible côté backend (GET /api/country-manager/dashboard).');
      } else if (e.response?.status === 500) {
        setError('Erreur 500 côté backend. Vérifiez les logs du serveur.');
      } else {
        setError(msg || 'Erreur de connexion. Vérifiez que le backend est actif.');
      }
    }
    setLoading(false);
  };

  useEffect(() => { fetchStats(); }, []);

  if (loading) return <PageLoader variant="inline" size="sm" label="Chargement des statistiques..." />;

  if (error) {
    return (
      <Card>
        <div className="text-center py-14">
          <AlertTriangle size={40} className="mx-auto text-red-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Impossible de charger les statistiques</h3>
          <p className="text-sm text-red-600 max-w-md mx-auto mb-4">{error}</p>
          <Button onClick={fetchStats} variant="primary" size="sm" icon={<RefreshCw size={14} />}>Réessayer</Button>
        </div>
      </Card>
    );
  }

  const pendingUrgent = (stats?.pendingDeclarations ?? 0) + (stats?.inReviewDeclarations ?? 0);

  return (
    <div className="space-y-6">

      {/* Welcome banner */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-700 p-5 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative flex items-start justify-between gap-4">
            <div>
              <p className="text-emerald-100 text-xs font-medium capitalize">{today}</p>
              <h1 className="text-xl font-bold mt-1">
                Bonjour, {user?.firstName} 👋
              </h1>
              {stats?.country && (
                <div className="flex items-center gap-1.5 mt-1">
                  <Globe size={13} className="text-emerald-200" />
                  <p className="text-sm text-emerald-100">
                    Responsable pays — <span className="font-semibold text-white">{stats.country.name}</span>
                  </p>
                </div>
              )}
            </div>
            {pendingUrgent > 0 && (
              <Link
                to="/country-manager/declarations"
                className="flex-shrink-0 flex items-center gap-2 bg-white/15 hover:bg-white/25 transition-colors px-3 py-2 rounded-xl text-sm font-medium"
              >
                <span className="w-5 h-5 bg-amber-400 text-amber-900 rounded-full text-xs font-bold flex items-center justify-center">{pendingUrgent}</span>
                à traiter
                <ArrowRight size={14} />
              </Link>
            )}
          </div>
        </div>
      </motion.div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Assurés',
            value: stats?.totalUsers,
            icon: Users,
            color: 'text-primary',
            bg: 'bg-primary/10',
            textColor: 'text-gray-900',
            link: '/country-manager/assures',
          },
          {
            label: 'En attente',
            value: stats?.pendingDeclarations,
            icon: Clock,
            color: 'text-amber-500',
            bg: 'bg-amber-50',
            textColor: 'text-amber-600',
            link: '/country-manager/declarations',
          },
          {
            label: 'En révision',
            value: stats?.inReviewDeclarations ?? 0,
            icon: Search,
            color: 'text-blue-500',
            bg: 'bg-blue-50',
            textColor: 'text-blue-600',
            link: '/country-manager/declarations',
          },
          {
            label: 'Approuvées',
            value: stats?.approvedDeclarations,
            icon: CheckCircle,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            textColor: 'text-emerald-600',
            link: '/country-manager/declarations',
          },
        ].map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 + i * 0.05 }}>
            <Link to={kpi.link} className="block group">
              <Card className="hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${kpi.bg}`}>
                    <kpi.icon size={18} className={kpi.color} />
                  </div>
                  <ArrowRight size={14} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                </div>
                <p className={`text-2xl font-bold ${kpi.textColor}`}>{kpi.value ?? '—'}</p>
                <p className="text-xs text-gray-400 mt-0.5">{kpi.label}</p>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Declarations summary */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
                  <TrendingUp size={16} className="text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Total déclarations</p>
                  <p className="text-xs text-gray-400">{stats?.country?.name ?? 'Tous pays'} — toutes périodes</p>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalDeclarations ?? 0}</p>
            </div>
            {stats && stats.totalDeclarations > 0 && (
              <div className="space-y-2">
                {[
                  { label: 'Approuvées', value: stats.approvedDeclarations, color: 'bg-emerald-500' },
                  { label: 'En cours',   value: (stats.pendingDeclarations ?? 0) + (stats.inReviewDeclarations ?? 0), color: 'bg-amber-400' },
                  { label: 'Rejetées',   value: stats.rejectedDeclarations, color: 'bg-red-400' },
                ].map((bar) => (
                  <div key={bar.label} className="flex items-center gap-3">
                    <p className="text-xs text-gray-400 w-20 flex-shrink-0">{bar.label}</p>
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${bar.color} transition-all`}
                        style={{ width: `${Math.min(100, (bar.value / stats.totalDeclarations) * 100)}%` }}
                      />
                    </div>
                    <p className="text-xs font-medium text-gray-600 w-6 text-right">{bar.value}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>

        {/* Quick actions */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <p className="text-sm font-semibold text-gray-900 mb-3">Accès rapides</p>
            <div className="space-y-2">
              {[
                { label: 'Voir les déclarations en attente', icon: Clock, path: '/country-manager/declarations', color: 'text-amber-500', bg: 'bg-amber-50', badge: stats?.pendingDeclarations },
                { label: 'Consulter la liste des assurés', icon: Users, path: '/country-manager/assures', color: 'text-primary', bg: 'bg-primary/10', badge: null },
                { label: 'Toutes les déclarations', icon: FileText, path: '/country-manager/declarations', color: 'text-blue-500', bg: 'bg-blue-50', badge: null },
                { label: 'Mon profil', icon: Globe, path: '/country-manager/profil', color: 'text-gray-500', bg: 'bg-gray-100', badge: null },
              ].map((action) => (
                <Link
                  key={action.label}
                  to={action.path}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${action.bg}`}>
                    <action.icon size={15} className={action.color} />
                  </div>
                  <span className="text-sm text-gray-700 flex-1">{action.label}</span>
                  {action.badge ? (
                    <span className="text-xs font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">{action.badge}</span>
                  ) : (
                    <ArrowRight size={13} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                  )}
                </Link>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Rejected note */}
      {(stats?.rejectedDeclarations ?? 0) > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-100">
            <XCircle size={18} className="text-red-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-red-700">
                {stats?.rejectedDeclarations} déclaration{(stats?.rejectedDeclarations ?? 0) > 1 ? 's' : ''} rejetée{(stats?.rejectedDeclarations ?? 0) > 1 ? 's' : ''}
              </p>
              <p className="text-xs text-red-500">Consultez les dossiers pour les motifs de rejet.</p>
            </div>
            <Link to="/country-manager/declarations" className="text-xs font-semibold text-red-600 hover:underline flex-shrink-0">
              Voir →
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
}
