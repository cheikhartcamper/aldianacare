import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  AlertTriangle, CheckCircle, Clock, Activity, TrendingUp, TrendingDown,
  Plane, FolderOpen, Users, ArrowRight, MapPin, Phone, FileText
} from 'lucide-react';
import { Card, Button } from '@/components/ui';

const stats = [
  { label: 'Dossiers urgents', value: 3, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50', trend: '-2', trendUp: false },
  { label: 'Dossiers en cours', value: 8, icon: Activity, color: 'text-amber-600', bg: 'bg-amber-50', trend: '+3', trendUp: true },
  { label: 'Rapatriements actifs', value: 2, icon: Plane, color: 'text-primary', bg: 'bg-primary/10', trend: '0', trendUp: false },
  { label: 'Résolus ce mois', value: 14, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+5', trendUp: true },
  { label: 'Temps moyen', value: '36h', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50', trend: '-8h', trendUp: false },
  { label: 'Country Managers', value: 6, icon: Users, color: 'text-gold-dark', bg: 'bg-gold/10', trend: '+1', trendUp: true },
];

const urgentCases = [
  { id: 'ASS-2026-001', type: 'Rapatriement', beneficiary: 'Famille Diallo', country: 'Sénégal', time: 'Il y a 2h', assignedTo: 'Aminata Sy' },
  { id: 'ASS-2026-007', type: 'Rapatriement', beneficiary: 'Famille Ndiaye', country: 'Mali', time: 'Il y a 4h', assignedTo: 'Moussa Traoré' },
  { id: 'ASS-2026-008', type: 'Assistance funéraire', beneficiary: 'Famille Barry', country: 'Guinée', time: 'Il y a 6h', assignedTo: 'Fatou Diop' },
];

const recentActivity = [
  { action: 'Vol AF 718 réservé — Paris → Dakar', time: 'Il y a 30 min', type: 'rapatriement' },
  { action: 'Nouveau dossier ouvert — Famille Konaté', time: 'Il y a 1h', type: 'dossier' },
  { action: 'Document consulaire reçu — Famille Bah', time: 'Il y a 3h', type: 'document' },
  { action: 'Appel terminé — Ambassade du Mali', time: 'Il y a 5h', type: 'appel' },
  { action: 'Dossier Famille Sow clôturé avec succès', time: 'Il y a 8h', type: 'resolu' },
  { action: 'Nouveau country manager ajouté — Togo', time: 'Il y a 1j', type: 'manager' },
];

const activityIcons: Record<string, typeof Plane> = {
  rapatriement: Plane,
  dossier: FolderOpen,
  document: FileText,
  appel: Phone,
  resolu: CheckCircle,
  manager: Users,
};

const activityColors: Record<string, string> = {
  rapatriement: 'bg-primary/10 text-primary',
  dossier: 'bg-gold/10 text-gold-dark',
  document: 'bg-primary/10 text-primary',
  appel: 'bg-emerald-100 text-emerald-600',
  resolu: 'bg-emerald-100 text-emerald-600',
  manager: 'bg-gold/10 text-gold-dark',
};

const countryStats = [
  { country: 'Sénégal', flag: '🇸🇳', cases: 12, resolved: 9 },
  { country: 'Mali', flag: '🇲🇱', cases: 8, resolved: 6 },
  { country: 'Guinée', flag: '🇬🇳', cases: 6, resolved: 5 },
  { country: 'Côte d\'Ivoire', flag: '🇨🇮', cases: 10, resolved: 8 },
  { country: 'Mauritanie', flag: '🇲🇷', cases: 4, resolved: 4 },
];

export function AssistanceDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-sm text-gray-500 mt-1">Vue d'ensemble du centre d'assistance Aldiana Care</p>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <Card>
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg}`}>
                  <stat.icon size={20} className={stat.color} />
                </div>
                <div className={`flex items-center gap-0.5 text-[11px] font-medium ${
                  stat.trend.startsWith('-') ? 'text-emerald-600' : stat.trend === '0' ? 'text-gray-400' : 'text-amber-600'
                }`}>
                  {stat.trend !== '0' && (stat.trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />)}
                  {stat.trend}
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-[11px] text-gray-500 mt-0.5">{stat.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Urgent cases */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <h3 className="font-semibold text-gray-900">Dossiers urgents</h3>
              </div>
              <Link to="/assistance/dossiers">
                <Button variant="secondary" size="sm" icon={<ArrowRight size={14} />}>Voir tout</Button>
              </Link>
            </div>
            <div className="space-y-3">
              {urgentCases.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 p-3 rounded-xl bg-red-50/50 border border-red-100 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle size={18} className="text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900">{c.beneficiary}</p>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-red-100 text-red-700">Urgent</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Plane size={11} /> {c.type}</span>
                      <span className="flex items-center gap-1"><MapPin size={11} /> {c.country}</span>
                      <span className="flex items-center gap-1"><Clock size={11} /> {c.time}</span>
                    </div>
                  </div>
                  <div className="hidden sm:block text-right">
                    <p className="text-xs text-gray-500">{c.assignedTo}</p>
                    <p className="text-[10px] text-gray-400">{c.id}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent activity */}
        <Card>
          <h3 className="font-semibold text-gray-900 mb-5">Activité récente</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, i) => {
              const Icon = activityIcons[activity.type] || FolderOpen;
              const colorClass = activityColors[activity.type] || 'bg-gray-100 text-gray-600';
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-start gap-3"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${colorClass}`}>
                    <Icon size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-700 leading-relaxed">{activity.action}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{activity.time}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Country stats */}
      <Card>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-gray-900">Statistiques par pays</h3>
          <Link to="/assistance/managers">
            <Button variant="secondary" size="sm">Voir les managers</Button>
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {countryStats.map((cs, i) => (
            <motion.div
              key={cs.country}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{cs.flag}</span>
                <p className="text-sm font-semibold text-gray-900">{cs.country}</p>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{cs.cases}</p>
                  <p className="text-[10px] text-gray-500">Dossiers total</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary">{cs.resolved}</p>
                  <p className="text-[10px] text-gray-500">Résolus</p>
                </div>
              </div>
              <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-primary h-1.5 rounded-full transition-all"
                  style={{ width: `${(cs.resolved / cs.cases) * 100}%` }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}
