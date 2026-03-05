import { motion } from 'framer-motion';
import { Users, FileText, CreditCard, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const revenueData = [
  { month: 'Sep', revenue: 12400 },
  { month: 'Oct', revenue: 14800 },
  { month: 'Nov', revenue: 16200 },
  { month: 'Dec', revenue: 15600 },
  { month: 'Jan', revenue: 18900 },
  { month: 'Fev', revenue: 21300 },
  { month: 'Mar', revenue: 24100 },
];

const usersByCountry = [
  { country: 'France', users: 5200 },
  { country: 'Belgique', users: 2100 },
  { country: 'Italie', users: 1800 },
  { country: 'Espagne', users: 1400 },
  { country: 'Allemagne', users: 1200 },
  { country: 'Autres', users: 3300 },
];

const planDistribution = [
  { name: 'Basic', value: 3200, color: '#9ca3af' },
  { name: 'Premium', value: 6800, color: '#0F5F43' },
  { name: 'Family', value: 3500, color: '#F2C94C' },
  { name: 'Pathologie', value: 1500, color: '#3B82F6' },
];

const recentUsers = [
  { name: 'Fatou Diop', email: 'fatou@email.com', plan: 'Premium', date: '05 Mar', country: 'France' },
  { name: 'Moussa Konaté', email: 'moussa@email.com', plan: 'Family', date: '04 Mar', country: 'Belgique' },
  { name: 'Aminata Camara', email: 'aminata@email.com', plan: 'Basic', date: '04 Mar', country: 'Italie' },
  { name: 'Ibrahima Ba', email: 'ibrahima@email.com', plan: 'Premium', date: '03 Mar', country: 'France' },
  { name: 'Mariam Touré', email: 'mariam@email.com', plan: 'Pathologie', date: '03 Mar', country: 'Espagne' },
];

const planColors: Record<string, string> = {
  Basic: 'neutral',
  Premium: 'primary',
  Family: 'warning',
  Pathologie: 'info',
};

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Administrateur</h1>
        <p className="text-sm text-gray-500 mt-1">Vue d'ensemble de la plateforme Aldiana Care.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Utilisateurs actifs', value: '15 024', change: '+12.5%', icon: Users, color: 'text-primary bg-primary/10' },
          { title: 'Contrats actifs', value: '12 847', change: '+8.3%', icon: FileText, color: 'text-info bg-info/10' },
          { title: 'Revenu mensuel', value: '24 100€', change: '+13.1%', icon: CreditCard, color: 'text-success bg-success/10' },
          { title: 'Dossiers décès', value: '3', change: 'En cours', icon: AlertTriangle, color: 'text-danger bg-red-50' },
        ].map((stat, i) => (
          <motion.div key={stat.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card>
              <div className="flex items-start justify-between">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
                <span className="flex items-center gap-0.5 text-xs font-medium text-success">
                  <ArrowUpRight size={12} />
                  {stat.change}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-3">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-gray-900">Revenu mensuel</h3>
                <p className="text-xs text-gray-400">Évolution sur 7 mois</p>
              </div>
              <Badge variant="success">+13.1% ce mois</Badge>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0F5F43" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#0F5F43" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}k€`} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '12px' }}
                    formatter={(value) => [`${value}€`, 'Revenu']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#0F5F43" strokeWidth={2} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Plan distribution */}
        <Card>
          <h3 className="font-semibold text-gray-900 mb-4">Répartition des plans</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={planDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={4}>
                  {planDistribution.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {planDistribution.map((plan) => (
              <div key={plan.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: plan.color }} />
                  <span className="text-gray-600">{plan.name}</span>
                </div>
                <span className="font-semibold text-gray-900">{plan.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Users by country */}
        <Card>
          <h3 className="font-semibold text-gray-900 mb-4">Utilisateurs par pays</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={usersByCountry} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="country" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={70} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '12px' }} />
                <Bar dataKey="users" fill="#0F5F43" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Recent users */}
        <Card padding="none">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Inscriptions récentes</h3>
              <button className="text-xs text-primary font-medium hover:underline">Voir tout</button>
            </div>
          </div>
          <div className="divide-y divide-gray-50">
            {recentUsers.map((user) => (
              <div key={user.email} className="flex items-center gap-3 p-4 hover:bg-gray-50/50">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                  {user.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
                <div className="text-right">
                  <Badge variant={planColors[user.plan] as 'primary' | 'neutral' | 'warning' | 'info'} size="sm">{user.plan}</Badge>
                  <p className="text-[10px] text-gray-400 mt-0.5">{user.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
