import { motion } from 'framer-motion';
import { TrendingUp, Users, Globe, Shield } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const monthlyUsers = [
  { month: 'Sep', new: 420, total: 11200 },
  { month: 'Oct', new: 580, total: 11780 },
  { month: 'Nov', new: 650, total: 12430 },
  { month: 'Dec', new: 520, total: 12950 },
  { month: 'Jan', new: 780, total: 13730 },
  { month: 'Fev', new: 690, total: 14420 },
  { month: 'Mar', new: 604, total: 15024 },
];

const revenueByPlan = [
  { plan: 'Basic', revenue: 3168 },
  { plan: 'Premium', revenue: 13536 },
  { plan: 'Family', revenue: 10465 },
  { plan: 'Pathologie', revenue: 5985 },
];

const retentionData = [
  { month: 'Sep', rate: 94 },
  { month: 'Oct', rate: 95 },
  { month: 'Nov', rate: 93 },
  { month: 'Dec', rate: 96 },
  { month: 'Jan', rate: 95 },
  { month: 'Fev', rate: 97 },
  { month: 'Mar', rate: 96 },
];

export function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Statistiques détaillées de la plateforme.</p>
      </motion.div>

      {/* KPIs */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Taux de rétention', value: '96%', change: '+1.2%', icon: TrendingUp, color: 'text-success bg-success/10' },
          { title: 'Nouveaux ce mois', value: '604', change: '+8%', icon: Users, color: 'text-primary bg-primary/10' },
          { title: 'Pays actifs', value: '27', change: '+2', icon: Globe, color: 'text-info bg-info/10' },
          { title: 'ARPU', value: '21,40€', change: '+3.5%', icon: Shield, color: 'text-gold-dark bg-gold/10' },
        ].map((kpi) => (
          <Card key={kpi.title}>
            <div className="flex items-start justify-between">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${kpi.color}`}>
                <kpi.icon size={20} />
              </div>
              <Badge variant="success" size="sm">{kpi.change}</Badge>
            </div>
            <p className="text-xs text-gray-400 mt-3">{kpi.title}</p>
            <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* User growth */}
        <Card>
          <h3 className="font-semibold text-gray-900 mb-4">Croissance des utilisateurs</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyUsers}>
                <defs>
                  <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0F5F43" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#0F5F43" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '12px' }} />
                <Area type="monotone" dataKey="new" stroke="#0F5F43" strokeWidth={2} fill="url(#colorNew)" name="Nouveaux" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Revenue by plan */}
        <Card>
          <h3 className="font-semibold text-gray-900 mb-4">Revenu par formule</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByPlan}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="plan" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}k€`} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '12px' }} formatter={(value) => [`${value}€`, 'Revenu']} />
                <Bar dataKey="revenue" fill="#0F5F43" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Retention */}
      <Card>
        <h3 className="font-semibold text-gray-900 mb-4">Taux de rétention mensuel</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={retentionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis domain={[90, 100]} tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '12px' }} formatter={(value) => [`${value}%`, 'Rétention']} />
              <Line type="monotone" dataKey="rate" stroke="#0F5F43" strokeWidth={2} dot={{ fill: '#0F5F43', r: 4 }} name="Taux" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
