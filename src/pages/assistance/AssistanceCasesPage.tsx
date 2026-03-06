import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Plus, Clock, MapPin, Users, Calendar, Eye, Edit,
  MessageCircle, X, Plane, FileText
} from 'lucide-react';
import { Card, Button, Input } from '@/components/ui';

type CaseStatus = 'urgent' | 'en_cours' | 'en_attente' | 'resolu';

interface Case {
  id: string;
  type: string;
  beneficiary: string;
  contract: string;
  country: string;
  city: string;
  status: CaseStatus;
  priority: 'haute' | 'moyenne' | 'basse';
  date: string;
  lastUpdate: string;
  assignedTo: string;
  description: string;
  phone: string;
}

const allCases: Case[] = [
  {
    id: 'ASS-2026-001', type: 'Rapatriement', beneficiary: 'Famille Diallo', contract: 'FAM-2024-0892',
    country: 'Sénégal', city: 'Dakar', status: 'urgent', priority: 'haute',
    date: '05 Mar 2026', lastUpdate: 'Il y a 2h', assignedTo: 'Aminata Sy',
    description: 'Rapatriement du corps depuis Paris vers Dakar. Vol AF 718 prévu le 07 Mars. Contact famille locale en cours pour réception.',
    phone: '+221 77 123 45 67',
  },
  {
    id: 'ASS-2026-002', type: 'Assistance funéraire', beneficiary: 'Famille Konaté', contract: 'FAM-2024-1204',
    country: 'Mali', city: 'Bamako', status: 'en_cours', priority: 'haute',
    date: '04 Mar 2026', lastUpdate: 'Il y a 5h', assignedTo: 'Moussa Traoré',
    description: 'Organisation des funérailles à Bamako. Coordination avec les autorités locales et la famille sur place. Cérémonie prévue le 08 Mars.',
    phone: '+223 70 456 78 90',
  },
  {
    id: 'ASS-2026-003', type: 'Billet avion famille', beneficiary: 'Famille Camara', contract: 'IND-2025-0456',
    country: 'Guinée', city: 'Conakry', status: 'en_attente', priority: 'moyenne',
    date: '03 Mar 2026', lastUpdate: 'Il y a 1j', assignedTo: 'Fatou Diop',
    description: 'Réservation de 3 billets Paris-Conakry pour accompagnement famille. Attente confirmation des dates par la famille.',
    phone: '+224 62 789 01 23',
  },
  {
    id: 'ASS-2026-004', type: 'Assistance administrative', beneficiary: 'Famille Bah', contract: 'FAM-2025-0789',
    country: 'Côte d\'Ivoire', city: 'Abidjan', status: 'en_cours', priority: 'moyenne',
    date: '02 Mar 2026', lastUpdate: 'Il y a 2j', assignedTo: 'Ibrahim Keita',
    description: 'Aide aux démarches consulaires pour certificat de décès. Documents en cours de traitement auprès du consulat.',
    phone: '+225 07 234 56 78',
  },
  {
    id: 'ASS-2026-005', type: 'Rapatriement', beneficiary: 'Famille Sow', contract: 'IND-2024-1567',
    country: 'Mauritanie', city: 'Nouakchott', status: 'resolu', priority: 'haute',
    date: '28 Fev 2026', lastUpdate: 'Il y a 5j', assignedTo: 'Aminata Sy',
    description: 'Rapatriement terminé avec succès. Corps remis à la famille le 01 Mars. Dossier clôturé.',
    phone: '+222 36 123 45 67',
  },
  {
    id: 'ASS-2026-006', type: 'Assistance funéraire', beneficiary: 'Famille Touré', contract: 'FAM-2025-0234',
    country: 'Sénégal', city: 'Thiès', status: 'resolu', priority: 'basse',
    date: '25 Fev 2026', lastUpdate: 'Il y a 8j', assignedTo: 'Moussa Traoré',
    description: 'Funérailles organisées à Thiès. Famille satisfaite de la prise en charge. Dossier clôturé avec succès.',
    phone: '+221 76 456 78 90',
  },
  {
    id: 'ASS-2026-007', type: 'Rapatriement', beneficiary: 'Famille Ndiaye', contract: 'FAM-2024-1890',
    country: 'Mali', city: 'Kayes', status: 'urgent', priority: 'haute',
    date: '05 Mar 2026', lastUpdate: 'Il y a 4h', assignedTo: 'Moussa Traoré',
    description: 'Rapatriement urgent depuis Marseille vers Kayes. Recherche de vol disponible en cours. Famille très inquiète.',
    phone: '+223 66 789 01 23',
  },
  {
    id: 'ASS-2026-008', type: 'Assistance funéraire', beneficiary: 'Famille Barry', contract: 'IND-2025-0678',
    country: 'Guinée', city: 'Labé', status: 'urgent', priority: 'haute',
    date: '05 Mar 2026', lastUpdate: 'Il y a 6h', assignedTo: 'Fatou Diop',
    description: 'Décès survenu à Lyon. Famille demande une assistance funéraire complète et un rapatriement vers Labé.',
    phone: '+224 66 012 34 56',
  },
];

const statusConfig: Record<CaseStatus, { label: string; color: string; bg: string; dot: string }> = {
  urgent: { label: 'Urgent', color: 'text-red-700', bg: 'bg-red-50', dot: 'bg-red-500' },
  en_cours: { label: 'En cours', color: 'text-amber-700', bg: 'bg-amber-50', dot: 'bg-amber-500' },
  en_attente: { label: 'En attente', color: 'text-blue-700', bg: 'bg-blue-50', dot: 'bg-blue-500' },
  resolu: { label: 'Résolu', color: 'text-emerald-700', bg: 'bg-emerald-50', dot: 'bg-emerald-500' },
};

export function AssistanceCasesPage() {
  const [selectedFilter, setSelectedFilter] = useState<string>('tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);

  const filteredCases = allCases.filter((c) => {
    const matchesFilter = selectedFilter === 'tous' || c.status === selectedFilter;
    const matchesSearch =
      c.beneficiary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.country.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dossiers d'assistance</h1>
          <p className="text-sm text-gray-500 mt-1">{allCases.length} dossiers au total — {allCases.filter(c => c.status === 'urgent').length} urgents</p>
        </div>
        <Button variant="primary" size="sm" icon={<Plus size={16} />}>
          Nouveau dossier
        </Button>
      </motion.div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'tous', label: 'Tous' },
              { key: 'urgent', label: 'Urgents' },
              { key: 'en_cours', label: 'En cours' },
              { key: 'en_attente', label: 'En attente' },
              { key: 'resolu', label: 'Résolus' },
            ].map((filter) => {
              const count = filter.key === 'tous'
                ? allCases.length
                : allCases.filter((c) => c.status === filter.key).length;
              return (
                <button
                  key={filter.key}
                  onClick={() => setSelectedFilter(filter.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedFilter === filter.key
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filter.label} ({count})
                </button>
              );
            })}
          </div>
          <div className="w-full sm:w-72">
            <Input
              placeholder="Rechercher par nom, ID, pays..."
              icon={<Search size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Cases list */}
        <div className="lg:col-span-3 space-y-3">
          {filteredCases.length === 0 ? (
            <Card className="text-center py-12">
              <Search size={32} className="mx-auto mb-3 text-gray-300" />
              <p className="text-sm text-gray-500">Aucun dossier trouvé</p>
            </Card>
          ) : (
            filteredCases.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 8 }}
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
                  <div className="flex items-start gap-3">
                    <div className={`w-1.5 rounded-full self-stretch flex-shrink-0 ${statusConfig[c.status].dot}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-semibold text-gray-900">{c.beneficiary}</h3>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusConfig[c.status].bg} ${statusConfig[c.status].color}`}>
                            {statusConfig[c.status].label}
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-400 flex-shrink-0 font-mono">{c.id}</span>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{c.type}</p>
                      <p className="text-xs text-gray-600 line-clamp-1 mb-2">{c.description}</p>
                      <div className="flex items-center gap-3 text-[11px] text-gray-400 flex-wrap">
                        <span className="flex items-center gap-1"><MapPin size={11} /> {c.country}, {c.city}</span>
                        <span className="flex items-center gap-1"><Calendar size={11} /> {c.date}</span>
                        <span className="flex items-center gap-1"><Users size={11} /> {c.assignedTo}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-2 space-y-4">
          {selectedCase ? (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
              <Card>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${statusConfig[selectedCase.status].dot}`} />
                    <h3 className="font-semibold text-gray-900">Détail du dossier</h3>
                  </div>
                  <button onClick={() => setSelectedCase(null)} className="p-1 rounded hover:bg-gray-100 text-gray-400">
                    <X size={16} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${statusConfig[selectedCase.status].bg}`}>
                      {selectedCase.type === 'Rapatriement' ? (
                        <Plane size={18} className={statusConfig[selectedCase.status].color} />
                      ) : selectedCase.type === 'Billet avion famille' ? (
                        <Plane size={18} className={statusConfig[selectedCase.status].color} />
                      ) : (
                        <FileText size={18} className={statusConfig[selectedCase.status].color} />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{selectedCase.type}</p>
                      <p className="text-[11px] text-gray-500 font-mono">{selectedCase.id}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-gray-50">
                      <p className="text-[10px] text-gray-400 uppercase font-semibold mb-1">Bénéficiaire</p>
                      <p className="text-sm font-medium text-gray-900">{selectedCase.beneficiary}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-gray-50">
                      <p className="text-[10px] text-gray-400 uppercase font-semibold mb-1">Contrat</p>
                      <p className="text-sm font-medium text-primary">{selectedCase.contract}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-gray-50">
                      <p className="text-[10px] text-gray-400 uppercase font-semibold mb-1">Pays / Ville</p>
                      <p className="text-sm text-gray-700 flex items-center gap-1"><MapPin size={12} /> {selectedCase.country}, {selectedCase.city}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-gray-50">
                      <p className="text-[10px] text-gray-400 uppercase font-semibold mb-1">Téléphone</p>
                      <p className="text-sm text-gray-700">{selectedCase.phone}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-gray-50">
                      <p className="text-[10px] text-gray-400 uppercase font-semibold mb-1">Statut</p>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusConfig[selectedCase.status].bg} ${statusConfig[selectedCase.status].color}`}>
                        {statusConfig[selectedCase.status].label}
                      </span>
                    </div>
                    <div className="p-3 rounded-lg bg-gray-50">
                      <p className="text-[10px] text-gray-400 uppercase font-semibold mb-1">Responsable</p>
                      <p className="text-sm text-gray-700">{selectedCase.assignedTo}</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-gray-50">
                    <p className="text-[10px] text-gray-400 uppercase font-semibold mb-1">Description</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{selectedCase.description}</p>
                  </div>

                  <div className="text-[11px] text-gray-400 flex items-center gap-3">
                    <span className="flex items-center gap-1"><Calendar size={11} /> Créé le {selectedCase.date}</span>
                    <span className="flex items-center gap-1"><Clock size={11} /> Mis à jour {selectedCase.lastUpdate}</span>
                  </div>

                  <div className="pt-3 border-t border-gray-100 grid grid-cols-2 gap-2">
                    <Button variant="primary" size="sm" fullWidth icon={<Edit size={14} />}>Modifier</Button>
                    <Button variant="outline" size="sm" fullWidth icon={<MessageCircle size={14} />}>Contacter</Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ) : (
            <Card className="text-center py-16">
              <Eye size={36} className="mx-auto mb-4 text-gray-300" />
              <p className="text-sm font-medium text-gray-500">Sélectionnez un dossier</p>
              <p className="text-xs text-gray-400 mt-1">Cliquez sur un dossier pour voir les détails</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
