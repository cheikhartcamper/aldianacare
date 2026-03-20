import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3, Users, FileText, Globe, TrendingUp, AlertTriangle,
  CheckCircle, Clock, XCircle, Plane, MapPin
} from 'lucide-react';
import { Card, Badge, PageLoader } from '@/components/ui';
import { adminService, type UserWithTrusted, type Declaration, type Country } from '@/services/admin.service';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const COLORS = ['#0F5F43', '#F2C94C', '#3B82F6', '#EF4444', '#8B5CF6', '#06B6D4'];

export function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [approvedUsers, setApprovedUsers] = useState(0);
  const [pendingUsers, setPendingUsers] = useState(0);
  const [rejectedUsers, setRejectedUsers] = useState(0);
  const [totalDeclarations, setTotalDeclarations] = useState(0);
  const [pendingDecl, setPendingDecl] = useState(0);
  const [approvedDecl, setApprovedDecl] = useState(0);
  const [rejectedDecl, setRejectedDecl] = useState(0);
  const [countries, setCountries] = useState<Country[]>([]);
  const [planData, setPlanData] = useState<{ name: string; value: number; color: string }[]>([]);
  const [statusData, setStatusData] = useState<{ name: string; value: number; color: string }[]>([]);
  const [declarationStatusData, setDeclarationStatusData] = useState<{ name: string; value: number; color: string }[]>([]);
  const [countryData, setCountryData] = useState<{ name: string; residence: number; repatriation: number }[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [usersRes, pendingRegRes, approvedRegRes, rejectedRegRes, declRes, pendingDeclRes, approvedDeclRes, rejectedDeclRes, countriesRes] = await Promise.all([
          adminService.getUsers({ limit: 1 }),
          adminService.getRegistrations({ status: 'pending', limit: 1 }),
          adminService.getRegistrations({ status: 'approved', limit: 1 }),
          adminService.getRegistrations({ status: 'rejected', limit: 1 }),
          adminService.getDeclarations({ limit: 1 }),
          adminService.getDeclarations({ status: 'pending', limit: 1 }),
          adminService.getDeclarations({ status: 'approved', limit: 1 }),
          adminService.getDeclarations({ status: 'rejected', limit: 1 }),
          adminService.getCountries().catch(() => null),
        ]);

        // Users
        const total = usersRes.success ? usersRes.data.pagination.total : 0;
        const pending = pendingRegRes.success ? pendingRegRes.data.pagination.total : 0;
        const approved = approvedRegRes.success ? approvedRegRes.data.pagination.total : 0;
        const rejected = rejectedRegRes.success ? rejectedRegRes.data.pagination.total : 0;
        setTotalUsers(total);
        setPendingUsers(pending);
        setApprovedUsers(approved);
        setRejectedUsers(rejected);

        // Plan distribution: fetch more users to compute
        const allUsersRes = await adminService.getUsers({ limit: 200 });
        if (allUsersRes.success) {
          const users = allUsersRes.data.users;
          const individual = users.filter(u => u.planType === 'individual').length;
          const family = users.filter(u => u.planType === 'family').length;
          setPlanData([
            { name: 'Individuel', value: individual, color: '#0F5F43' },
            { name: 'Familial', value: family, color: '#F2C94C' },
          ]);
        }

        // Registrations status
        setStatusData([
          { name: 'Approuvés', value: approved, color: '#0F5F43' },
          { name: 'En attente', value: pending, color: '#F59E0B' },
          { name: 'Rejetés', value: rejected, color: '#EF4444' },
        ]);

        // Declarations
        const totalD = declRes.success ? declRes.data.pagination.total : 0;
        const pendingD = pendingDeclRes.success ? pendingDeclRes.data.pagination.total : 0;
        const approvedD = approvedDeclRes.success ? approvedDeclRes.data.pagination.total : 0;
        const rejectedD = rejectedDeclRes.success ? rejectedDeclRes.data.pagination.total : 0;
        setTotalDeclarations(totalD);
        setPendingDecl(pendingD);
        setApprovedDecl(approvedD);
        setRejectedDecl(rejectedD);

        setDeclarationStatusData([
          { name: 'Approuvées', value: approvedD, color: '#0F5F43' },
          { name: 'En attente', value: pendingD, color: '#F59E0B' },
          { name: 'Rejetées', value: rejectedD, color: '#EF4444' },
        ]);

        // Countries
        if (countriesRes?.success) {
          setCountries(countriesRes.data.countries);
          const grouped = countriesRes.data.grouped;
          const allNames = new Set([
            ...grouped.residence.map(c => c.name),
            ...grouped.repatriation.map(c => c.name),
          ]);
          setCountryData(Array.from(allNames).map(name => ({
            name,
            residence: grouped.residence.some(c => c.name === name) ? 1 : 0,
            repatriation: grouped.repatriation.some(c => c.name === name) ? 1 : 0,
          })));
        }
      } catch { /* ignore */ }
      setLoading(false);
    };
    fetchAll();
  }, []);

  if (loading) return <PageLoader variant="inline" size="sm" label="Chargement des analytics..." />;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }}>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Statistiques détaillées de la plateforme Aldiana Care — données en temps réel.</p>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Utilisateurs inscrits', value: totalUsers, icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Inscriptions approuvées', value: approvedUsers, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Déclarations totales', value: totalDeclarations, icon: FileText, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Pays couverts', value: countries.length, icon: Globe, color: 'text-gold-dark', bg: 'bg-gold/10' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg}`}>
                  <stat.icon size={18} className={stat.color} />
                </div>
                <div>
                  <p className="text-xs text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Registrations Status */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <h3 className="font-semibold text-gray-900 mb-1">Statut des inscriptions</h3>
            <p className="text-xs text-gray-400 mb-5">Répartition des {totalUsers} inscriptions</p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={5} label={({ name, value }) => `${name}: ${value}`}>
                    {statusData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-2">
              {statusData.map((d) => (
                <div key={d.name} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-xs text-gray-600">{d.name} ({d.value})</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Plan Distribution */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card>
            <h3 className="font-semibold text-gray-900 mb-1">Répartition des plans</h3>
            <p className="text-xs text-gray-400 mb-5">Individuel vs Familial</p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={planData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={5} label={({ name, value }) => `${name}: ${value}`}>
                    {planData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-2">
              {planData.map((d) => (
                <div key={d.name} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-xs text-gray-600">{d.name} ({d.value})</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Declaration Status */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <h3 className="font-semibold text-gray-900 mb-1">Déclarations de décès</h3>
            <p className="text-xs text-gray-400 mb-5">{totalDeclarations} déclarations au total</p>
            {totalDeclarations === 0 ? (
              <div className="text-center py-10">
                <FileText size={32} className="mx-auto text-gray-200 mb-3" />
                <p className="text-sm text-gray-500">Aucune déclaration pour l'instant</p>
              </div>
            ) : (
              <>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={declarationStatusData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                      <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} allowDecimals={false} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '12px' }} />
                      <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                        {declarationStatusData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="p-3 rounded-lg bg-amber-50 text-center">
                    <Clock size={16} className="mx-auto text-amber-500 mb-1" />
                    <p className="text-lg font-bold text-gray-900">{pendingDecl}</p>
                    <p className="text-[10px] text-gray-500">En attente</p>
                  </div>
                  <div className="p-3 rounded-lg bg-primary/5 text-center">
                    <CheckCircle size={16} className="mx-auto text-primary mb-1" />
                    <p className="text-lg font-bold text-gray-900">{approvedDecl}</p>
                    <p className="text-[10px] text-gray-500">Approuvées</p>
                  </div>
                  <div className="p-3 rounded-lg bg-red-50 text-center">
                    <XCircle size={16} className="mx-auto text-red-500 mb-1" />
                    <p className="text-lg font-bold text-gray-900">{rejectedDecl}</p>
                    <p className="text-[10px] text-gray-500">Rejetées</p>
                  </div>
                </div>
              </>
            )}
          </Card>
        </motion.div>

        {/* Countries Coverage */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <Card>
            <h3 className="font-semibold text-gray-900 mb-1">Couverture géographique</h3>
            <p className="text-xs text-gray-400 mb-5">{countries.length} pays configurés</p>
            {countries.length === 0 ? (
              <div className="text-center py-10">
                <Globe size={32} className="mx-auto text-gray-200 mb-3" />
                <p className="text-sm text-gray-500">Aucun pays configuré</p>
              </div>
            ) : (
              <>
                {countryData.length > 0 && (
                  <div className="h-56 mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={countryData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                        <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} allowDecimals={false} />
                        <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={80} />
                        <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '12px' }} />
                        <Legend />
                        <Bar dataKey="residence" name="Résidence" fill="#0F5F43" radius={[0, 4, 4, 0]} />
                        <Bar dataKey="repatriation" name="Rapatriement" fill="#F2C94C" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-primary/5 text-center">
                    <MapPin size={16} className="mx-auto text-primary mb-1" />
                    <p className="text-lg font-bold text-gray-900">{countries.filter(c => c.type === 'residence').length}</p>
                    <p className="text-[10px] text-gray-500">Pays de résidence</p>
                  </div>
                  <div className="p-3 rounded-lg bg-gold/5 text-center">
                    <Plane size={16} className="mx-auto text-gold-dark mb-1" />
                    <p className="text-lg font-bold text-gray-900">{countries.filter(c => c.type === 'repatriation').length}</p>
                    <p className="text-[10px] text-gray-500">Pays de rapatriement</p>
                  </div>
                </div>
              </>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
