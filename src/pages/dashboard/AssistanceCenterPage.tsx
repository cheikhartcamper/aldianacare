import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Phone, MapPin, Clock, AlertTriangle, CheckCircle, FileText,
  Search, Plus, MessageCircle,
  Plane, Users, Activity, Calendar,
  TrendingUp, Eye, Edit, X
} from 'lucide-react';
import { Card, Button, Input } from '@/components/ui';

type CaseStatus = 'urgent' | 'en_cours' | 'en_attente' | 'resolu';
type CasePriority = 'haute' | 'moyenne' | 'basse';

interface AssistanceCase {
  id: string;
  type: string;
  beneficiary: string;
  country: string;
  status: CaseStatus;
  priority: CasePriority;
  date: string;
  lastUpdate: string;
  assignedTo: string;
  description: string;
}

const cases: AssistanceCase[] = [
  {
    id: 'ASS-2026-001',
    type: 'Rapatriement',
    beneficiary: 'Famille Diallo',
    country: 'Sénégal',
    status: 'urgent',
    priority: 'haute',
    date: '05 Mar 2026',
    lastUpdate: 'Il y a 2h',
    assignedTo: 'Aminata Sy',
    description: 'Rapatriement du corps depuis Paris vers Dakar. Vol prévu le 07 Mars.',
  },
  {
    id: 'ASS-2026-002',
    type: 'Assistance funéraire',
    beneficiary: 'Famille Konaté',
    country: 'Mali',
    status: 'en_cours',
    priority: 'haute',
    date: '04 Mar 2026',
    lastUpdate: 'Il y a 5h',
    assignedTo: 'Moussa Traoré',
    description: 'Organisation des funérailles à Bamako. Contact famille locale en cours.',
  },
  {
    id: 'ASS-2026-003',
    type: 'Billet avion famille',
    beneficiary: 'Famille Camara',
    country: 'Guinée',
    status: 'en_attente',
    priority: 'moyenne',
    date: '03 Mar 2026',
    lastUpdate: 'Il y a 1j',
    assignedTo: 'Fatou Diop',
    description: 'Réservation de 3 billets Paris-Conakry pour la famille.',
  },
  {
    id: 'ASS-2026-004',
    type: 'Assistance administrative',
    beneficiary: 'Famille Bah',
    country: 'Côte d\'Ivoire',
    status: 'en_cours',
    priority: 'moyenne',
    date: '02 Mar 2026',
    lastUpdate: 'Il y a 2j',
    assignedTo: 'Ibrahim Keita',
    description: 'Aide aux démarches consulaires pour certificat de décès.',
  },
  {
    id: 'ASS-2026-005',
    type: 'Rapatriement',
    beneficiary: 'Famille Sow',
    country: 'Mauritanie',
    status: 'resolu',
    priority: 'haute',
    date: '28 Fev 2026',
    lastUpdate: 'Il y a 5j',
    assignedTo: 'Aminata Sy',
    description: 'Rapatriement terminé avec succès. Corps remis à la famille.',
  },
  {
    id: 'ASS-2026-006',
    type: 'Assistance funéraire',
    beneficiary: 'Famille Touré',
    country: 'Sénégal',
    status: 'resolu',
    priority: 'basse',
    date: '25 Fev 2026',
    lastUpdate: 'Il y a 8j',
    assignedTo: 'Moussa Traoré',
    description: 'Funérailles organisées à Thiès. Dossier clôturé.',
  },
];

const statusConfig: Record<CaseStatus, { label: string; color: string; bg: string }> = {
  urgent: { label: 'Urgent', color: 'text-red-700', bg: 'bg-red-50' },
  en_cours: { label: 'En cours', color: 'text-amber-700', bg: 'bg-amber-50' },
  en_attente: { label: 'En attente', color: 'text-blue-700', bg: 'bg-blue-50' },
  resolu: { label: 'Résolu', color: 'text-emerald-700', bg: 'bg-emerald-50' },
};

const priorityConfig: Record<CasePriority, { label: string; color: string }> = {
  haute: { label: 'Haute', color: 'text-red-600' },
  moyenne: { label: 'Moyenne', color: 'text-amber-600' },
  basse: { label: 'Basse', color: 'text-gray-500' },
};

const recentActivities = [
  { action: 'Vol réservé pour Famille Diallo', time: 'Il y a 30 min', icon: Plane },
  { action: 'Nouveau dossier ouvert - Famille Konaté', time: 'Il y a 2h', icon: Plus },
  { action: 'Document consulaire reçu - Famille Bah', time: 'Il y a 4h', icon: FileText },
  { action: 'Appel avec ambassade du Mali', time: 'Il y a 6h', icon: Phone },
  { action: 'Dossier Famille Sow clôturé', time: 'Il y a 1j', icon: CheckCircle },
];

const countryManagers = [
  { name: 'Aminata Sy', country: 'Sénégal', cases: 4, available: true },
  { name: 'Moussa Traoré', country: 'Mali', cases: 3, available: true },
  { name: 'Fatou Diop', country: 'Guinée', cases: 2, available: false },
  { name: 'Ibrahim Keita', country: 'Côte d\'Ivoire', cases: 5, available: true },
];

export function AssistanceCenterPage() {
  const [selectedFilter, setSelectedFilter] = useState<string>('tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCase, setSelectedCase] = useState<AssistanceCase | null>(null);

  const filteredCases = cases.filter((c) => {
    const matchesFilter = selectedFilter === 'tous' || c.status === selectedFilter;
    const matchesSearch = c.beneficiary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const urgentCount = cases.filter((c) => c.status === 'urgent').length;
  const activeCount = cases.filter((c) => c.status === 'en_cours' || c.status === 'urgent').length;
  const resolvedCount = cases.filter((c) => c.status === 'resolu').length;
  const avgResolutionTime = '36h';

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Centre d'Assistance</h1>
          <p className="text-sm text-gray-500 mt-1">Gestion des dossiers d'assistance et de rapatriement</p>
        </div>
        <Button variant="primary" size="sm" icon={<Plus size={16} />}>
          Nouveau dossier
        </Button>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Dossiers urgents', value: urgentCount, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50', trend: '-2' },
          { label: 'Dossiers actifs', value: activeCount, icon: Activity, color: 'text-amber-600', bg: 'bg-amber-50', trend: '+3' },
          { label: 'Résolus ce mois', value: resolvedCount, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+12' },
          { label: 'Temps moyen résolution', value: avgResolutionTime, icon: Clock, color: 'text-primary', bg: 'bg-primary/10', trend: '-4h' },
        ].map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">{kpi.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <TrendingUp size={12} className={kpi.trend.startsWith('-') ? 'text-emerald-500' : 'text-amber-500'} />
                    {kpi.trend} vs mois dernier
                  </p>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${kpi.bg}`}>
                  <kpi.icon size={20} className={kpi.color} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters + Search */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'tous', label: 'Tous', count: cases.length },
              { key: 'urgent', label: 'Urgents', count: cases.filter((c) => c.status === 'urgent').length },
              { key: 'en_cours', label: 'En cours', count: cases.filter((c) => c.status === 'en_cours').length },
              { key: 'en_attente', label: 'En attente', count: cases.filter((c) => c.status === 'en_attente').length },
              { key: 'resolu', label: 'Résolus', count: cases.filter((c) => c.status === 'resolu').length },
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setSelectedFilter(filter.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedFilter === filter.key
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
          <div className="w-full sm:w-64">
            <Input
              placeholder="Rechercher un dossier..."
              icon={<Search size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Cases list */}
        <div className="lg:col-span-2 space-y-3">
          {filteredCases.length === 0 ? (
            <Card className="text-center py-12">
              <Search size={32} className="mx-auto mb-3 text-gray-300" />
              <p className="text-sm text-gray-500">Aucun dossier trouvé</p>
            </Card>
          ) : (
            filteredCases.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Card
                  hover
                  className={`cursor-pointer transition-all ${
                    selectedCase?.id === c.id ? 'ring-2 ring-primary/30 border-primary' : ''
                  }`}
                  onClick={() => setSelectedCase(c)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-2 h-full min-h-[60px] rounded-full flex-shrink-0 ${
                      c.status === 'urgent' ? 'bg-red-500' :
                      c.status === 'en_cours' ? 'bg-amber-500' :
                      c.status === 'en_attente' ? 'bg-blue-500' : 'bg-emerald-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm font-semibold text-gray-900">{c.beneficiary}</h3>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusConfig[c.status].bg} ${statusConfig[c.status].color}`}>
                              {statusConfig[c.status].label}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">{c.type} — {c.country}</p>
                        </div>
                        <span className="text-[10px] text-gray-400 flex-shrink-0">{c.id}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-2 line-clamp-1">{c.description}</p>
                      <div className="flex items-center gap-4 mt-3 text-[11px] text-gray-400">
                        <span className="flex items-center gap-1"><Calendar size={11} /> {c.date}</span>
                        <span className="flex items-center gap-1"><Clock size={11} /> {c.lastUpdate}</span>
                        <span className="flex items-center gap-1"><Users size={11} /> {c.assignedTo}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Case detail or placeholder */}
          {selectedCase ? (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 text-sm">Détail du dossier</h3>
                  <button onClick={() => setSelectedCase(null)} className="text-gray-400 hover:text-gray-600">
                    <X size={16} />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Référence</p>
                    <p className="text-sm font-semibold text-primary">{selectedCase.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Bénéficiaire</p>
                    <p className="text-sm font-medium text-gray-900">{selectedCase.beneficiary}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Type</p>
                      <p className="text-sm text-gray-700">{selectedCase.type}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Pays</p>
                      <p className="text-sm text-gray-700 flex items-center gap-1">
                        <MapPin size={12} /> {selectedCase.country}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Statut</p>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusConfig[selectedCase.status].bg} ${statusConfig[selectedCase.status].color}`}>
                        {statusConfig[selectedCase.status].label}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Priorité</p>
                      <span className={`text-xs font-medium ${priorityConfig[selectedCase.priority].color}`}>
                        {priorityConfig[selectedCase.priority].label}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Responsable</p>
                    <p className="text-sm text-gray-700">{selectedCase.assignedTo}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Description</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{selectedCase.description}</p>
                  </div>
                  <div className="pt-3 border-t border-gray-100 flex gap-2">
                    <Button variant="primary" size="sm" fullWidth icon={<Edit size={14} />}>
                      Modifier
                    </Button>
                    <Button variant="outline" size="sm" icon={<MessageCircle size={14} />}>
                      Chat
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ) : (
            <Card className="text-center py-8">
              <Eye size={28} className="mx-auto mb-3 text-gray-300" />
              <p className="text-sm text-gray-500">Sélectionnez un dossier pour voir les détails</p>
            </Card>
          )}

          {/* Recent activity */}
          <Card>
            <h3 className="font-semibold text-gray-900 text-sm mb-4">Activité récente</h3>
            <div className="space-y-3">
              {recentActivities.map((activity, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <activity.icon size={13} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-700 leading-relaxed">{activity.action}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Country managers */}
          <Card>
            <h3 className="font-semibold text-gray-900 text-sm mb-4">Country Managers</h3>
            <div className="space-y-2">
              {countryManagers.map((manager) => (
                <div key={manager.name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users size={14} className="text-primary" />
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                      manager.available ? 'bg-emerald-500' : 'bg-gray-400'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900">{manager.name}</p>
                    <p className="text-[10px] text-gray-400">{manager.country} — {manager.cases} dossiers</p>
                  </div>
                  <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-primary transition-colors">
                    <Phone size={13} />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
