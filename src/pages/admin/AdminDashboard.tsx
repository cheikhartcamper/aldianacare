import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users, AlertCircle, ArrowUpRight,
  Loader2, CheckCircle, ArrowRight, FileText, Globe, RefreshCw
} from 'lucide-react';
import { Card, Badge, SkeletonCard, SkeletonList } from '@/components/ui';
import { adminService, type UserWithTrusted } from '@/services/admin.service';
import { Link } from 'react-router-dom';
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const DEMO_TREND = [
  { month: 'Sep', inscrits: 8 },
  { month: 'Oct', inscrits: 14 },
  { month: 'Nov', inscrits: 11 },
  { month: 'Déc', inscrits: 19 },
  { month: 'Jan', inscrits: 23 },
  { month: 'Fév', inscrits: 18 },
  { month: 'Mar', inscrits: 27 },
];

export function AdminDashboard() {
  const [recentUsers, setRecentUsers] = useState<UserWithTrusted[]>([]);
  const [pendingRegistrations, setPendingRegistrations] = useState<UserWithTrusted[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [declarationsCount, setDeclarationsCount] = useState(0);
  const [pendingDeclarations, setPendingDeclarations] = useState(0);
  const [countriesCount, setCountriesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [approving, setApproving] = useState<string | null>(null);
  const [planDistribution, setPlanDistribution] = useState([
    { name: 'Individuel', value: 0, color: '#0F5F43' },
    { name: 'Familial', value: 0, color: '#F2C94C' },
  ]);

  const today = new Date();
  const greeting = today.getHours() < 12 ? 'Bonjour' : today.getHours() < 18 ? 'Bon après-midi' : 'Bonsoir';
  const dateLabel = today.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const fetchData = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const [usersRes, pendingRes, declRes, pendingDeclRes, countriesRes, allUsersRes] = await Promise.all([
        adminService.getUsers({ limit: 5, page: 1 }),
        adminService.getRegistrations({ status: 'pending', limit: 5 }),
        adminService.getDeclarations({ limit: 1 }),
        adminService.getDeclarations({ status: 'pending', limit: 1 }),
        adminService.getCountries().catch(() => null),
        adminService.getUsers({ limit: 500 }),
      ]);
      if (usersRes.success) {
        setRecentUsers(usersRes.data.users);
        setTotalUsers(usersRes.data.pagination.total);
      }
      if (pendingRes.success) {
        setPendingRegistrations(pendingRes.data.registrations);
        setPendingCount(pendingRes.data.pagination.total);
      }
      if (declRes.success) setDeclarationsCount(declRes.data.pagination.total);
      if (pendingDeclRes.success) setPendingDeclarations(pendingDeclRes.data.pagination.total);
      if (countriesRes?.success) setCountriesCount(countriesRes.data.countries.length);
      if (allUsersRes.success) {
        const all = allUsersRes.data.users;
        const ind = all.filter(u => u.planType === 'individual').length;
        const fam = all.filter(u => u.planType === 'family').length;
        const total = ind + fam || 1;
        setPlanDistribution([
          { name: 'Individuel', value: Math.round((ind / total) * 100), color: '#0F5F43' },
          { name: 'Familial', value: Math.round((fam / total) * 100), color: '#F2C94C' },
        ]);
      }
    } catch { /* ignore */ }
    if (!silent) setLoading(false);
    else setRefreshing(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleQuickApprove = async (userId: string) => {
    setApproving(userId);
    try {
      const res = await adminService.approveRegistration(userId);
      if (res.success) {
        setPendingRegistrations((prev) => prev.filter((r) => r.id !== userId));
        setPendingCount((prev) => Math.max(0, prev - 1));
      }
    } catch { /* ignore */ }
    setApproving(null);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{greeting} 👋</h1>
          <p className="text-sm text-gray-500 mt-1 capitalize">{dateLabel} — Vue d'ensemble de la plateforme.</p>
        </div>
        <button
          onClick={() => fetchData(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-gray-900 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-colors shadow-sm"
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          {refreshing ? 'Actualisation…' : 'Rafraîchir'}
        </button>
      </motion.div>

      {/* KPI Stats */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[0,1,2,3].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card>
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users size={20} className="text-primary" />
              </div>
              <Link to="/admin/utilisateurs">
                <ArrowUpRight size={15} className="text-primary" />
              </Link>
            </div>
            <p className="text-xs text-gray-400 mt-3">Inscrits au total</p>
            <p className="text-3xl font-bold text-gray-900 mt-0.5">{totalUsers}</p>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className={pendingCount > 0 ? 'ring-2 ring-amber-300 ring-offset-1' : ''}>
            <div className="flex items-start justify-between">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${pendingCount > 0 ? 'bg-amber-50' : 'bg-gray-50'}`}>
                <AlertCircle size={20} className={pendingCount > 0 ? 'text-amber-500' : 'text-gray-400'} />
              </div>
              {pendingCount > 0 && (
                <Link to="/admin/inscriptions" className="text-xs text-amber-600 font-semibold hover:underline flex items-center gap-1">
                  Traiter <ArrowRight size={11} />
                </Link>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-3">En attente</p>
            <p className={`text-3xl font-bold mt-0.5 ${pendingCount > 0 ? 'text-amber-600' : 'text-gray-900'}`}>
              {pendingCount}
            </p>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className={pendingDeclarations > 0 ? 'ring-2 ring-red-200 ring-offset-1' : ''}>
            <div className="flex items-start justify-between">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${pendingDeclarations > 0 ? 'bg-red-50' : 'bg-primary/10'}`}>
                <FileText size={20} className={pendingDeclarations > 0 ? 'text-red-500' : 'text-primary'} />
              </div>
              <Link to="/admin/declarations">
                <ArrowUpRight size={15} className="text-primary" />
              </Link>
            </div>
            <p className="text-xs text-gray-400 mt-3">Déclarations</p>
            <p className="text-3xl font-bold text-gray-900 mt-0.5">{declarationsCount}</p>
            {pendingDeclarations > 0 && (
              <p className="text-[10px] text-red-500 font-semibold mt-0.5">{pendingDeclarations} en attente</p>
            )}
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                <Globe size={20} className="text-gold-dark" />
              </div>
              <Link to="/admin/parametres">
                <ArrowUpRight size={15} className="text-gold-dark" />
              </Link>
            </div>
            <p className="text-xs text-gray-400 mt-3">Pays couverts</p>
            <p className="text-3xl font-bold text-gray-900 mt-0.5">{countriesCount}</p>
          </Card>
        </motion.div>
      </div>
      )}

      {/* Pending quick-approve section */}
      {!loading && pendingCount > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border border-amber-200 bg-amber-50/40">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertCircle size={17} className="text-amber-500" />
                <h3 className="font-semibold text-gray-900">Inscriptions en attente de validation</h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">{pendingCount}</span>
              </div>
              <Link to="/admin/inscriptions" className="text-sm text-primary font-semibold hover:underline flex items-center gap-1">
                Voir tout <ArrowRight size={14} />
              </Link>
            </div>
            <div className="space-y-2">
              {pendingRegistrations.map((reg) => (
                <div key={reg.id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-amber-100">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                    {reg.firstName.charAt(0)}{reg.lastName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{reg.firstName} {reg.lastName}</p>
                    <p className="text-xs text-gray-400 truncate">{reg.email} · {reg.residenceCountry}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={reg.planType === 'family' ? 'warning' : 'primary'} size="sm">
                      {reg.planType === 'family' ? 'Familial' : 'Individuel'}
                    </Badge>
                    <button
                      onClick={() => handleQuickApprove(reg.id)}
                      disabled={approving === reg.id}
                      className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 disabled:opacity-50 flex items-center gap-1 transition-colors"
                    >
                      {approving === reg.id
                        ? <Loader2 size={12} className="animate-spin" />
                        : <CheckCircle size={12} />}
                      Approuver
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Inscriptions chart */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-semibold text-gray-900">Tendance des inscriptions</h3>
                <p className="text-xs text-gray-400">Projection indicative — en attente API temps-réel</p>
              </div>
              <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">Estimé</span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={DEMO_TREND}>
                  <defs>
                    <linearGradient id="colorInscrits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0F5F43" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#0F5F43" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '12px' }}
                    formatter={(value) => [value, 'Inscriptions']}
                  />
                  <Area type="monotone" dataKey="inscrits" stroke="#0F5F43" strokeWidth={2.5} fill="url(#colorInscrits)" dot={{ fill: '#0F5F43', r: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Plan distribution */}
        <Card>
          <h3 className="font-semibold text-gray-900">Répartition des plans</h3>
          <p className="text-xs text-gray-400 mb-4">Données réelles — {loading ? '…' : totalUsers + ' adhérents'}</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={planDistribution} cx="50%" cy="50%" innerRadius={48} outerRadius={72} dataKey="value" paddingAngle={5}>
                  {planDistribution.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '12px' }}
                  formatter={(v: number | undefined) => [`${v ?? 0}%`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-2">
            {planDistribution.map((plan) => (
              <div key={plan.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: plan.color }} />
                  <span className="text-sm text-gray-600">{plan.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${plan.value}%`, backgroundColor: plan.color }} />
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-10 text-right">{loading ? '—' : `${plan.value}%`}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent users */}
      <Card padding="none">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Derniers inscrits</h3>
          <Link to="/admin/utilisateurs" className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
            Voir tout <ArrowRight size={12} />
          </Link>
        </div>
        {loading ? (
          <SkeletonList rows={5} />
        ) : recentUsers.length === 0 ? (
          <div className="flex items-center justify-center p-8">
            <p className="text-sm text-gray-400">Aucune inscription</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentUsers.map((u) => (
              <div key={u.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/60 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                  {u.firstName?.charAt(0)}{u.lastName?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{u.firstName} {u.lastName}</p>
                  <p className="text-xs text-gray-400 truncate">{u.email}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={u.planType === 'family' ? 'warning' : 'primary'} size="sm">
                    {u.planType === 'family' ? 'Familial' : 'Individuel'}
                  </Badge>
                  <Badge
                    variant={u.registrationStatus === 'approved' ? 'success' : u.registrationStatus === 'rejected' ? 'danger' : 'warning'}
                    dot size="sm"
                  >
                    {u.registrationStatus === 'approved' ? 'Approuvé' : u.registrationStatus === 'rejected' ? 'Rejeté' : 'En attente'}
                  </Badge>
                  <p className="text-[10px] text-gray-400">{new Date(u.createdAt).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
