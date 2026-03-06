import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plane, MapPin, Calendar, User, CheckCircle,
  ArrowRight, X
} from 'lucide-react';
import { Card, Button } from '@/components/ui';

type RapatriementStatus = 'planifie' | 'en_transit' | 'arrive' | 'termine';

interface Rapatriement {
  id: string;
  beneficiary: string;
  departure: string;
  arrival: string;
  departureCity: string;
  arrivalCity: string;
  flightNumber: string;
  date: string;
  status: RapatriementStatus;
  assignedTo: string;
  notes: string;
}

const rapatriements: Rapatriement[] = [
  {
    id: 'RAP-001', beneficiary: 'Famille Diallo', departure: 'France', arrival: 'Sénégal',
    departureCity: 'Paris CDG', arrivalCity: 'Dakar DSS', flightNumber: 'AF 718',
    date: '07 Mar 2026', status: 'planifie', assignedTo: 'Aminata Sy',
    notes: 'Vol confirmé. Documents douaniers en préparation. Contact famille Dakar : OK.',
  },
  {
    id: 'RAP-002', beneficiary: 'Famille Ndiaye', departure: 'France', arrival: 'Mali',
    departureCity: 'Marseille MRS', arrivalCity: 'Bamako BKO', flightNumber: 'En recherche',
    date: 'À définir', status: 'planifie', assignedTo: 'Moussa Traoré',
    notes: 'Recherche vol en cours. Possibilité transit via Paris ou Casablanca.',
  },
  {
    id: 'RAP-003', beneficiary: 'Famille Sow', departure: 'Belgique', arrival: 'Mauritanie',
    departureCity: 'Bruxelles BRU', arrivalCity: 'Nouakchott NKC', flightNumber: 'TU 882',
    date: '01 Mar 2026', status: 'termine', assignedTo: 'Aminata Sy',
    notes: 'Rapatriement terminé avec succès. Corps remis à la famille le 01 Mars.',
  },
  {
    id: 'RAP-004', beneficiary: 'Famille Diop', departure: 'Italie', arrival: 'Sénégal',
    departureCity: 'Rome FCO', arrivalCity: 'Dakar DSS', flightNumber: 'IB 3246',
    date: '28 Fev 2026', status: 'termine', assignedTo: 'Aminata Sy',
    notes: 'Arrivée confirmée. Famille présente à l\'aéroport. Dossier clôturé.',
  },
];

const statusConfig: Record<RapatriementStatus, { label: string; color: string; bg: string; icon: typeof Plane }> = {
  planifie: { label: 'Planifié', color: 'text-amber-700', bg: 'bg-amber-50', icon: Calendar },
  en_transit: { label: 'En transit', color: 'text-primary', bg: 'bg-primary/10', icon: Plane },
  arrive: { label: 'Arrivé', color: 'text-primary', bg: 'bg-primary/10', icon: MapPin },
  termine: { label: 'Terminé', color: 'text-emerald-700', bg: 'bg-emerald-50', icon: CheckCircle },
};

export function AssistanceRapatriementsPage() {
  const [selectedRap, setSelectedRap] = useState<Rapatriement | null>(null);

  const activeCount = rapatriements.filter(r => r.status !== 'termine').length;
  const completedCount = rapatriements.filter(r => r.status === 'termine').length;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rapatriements</h1>
          <p className="text-sm text-gray-500 mt-1">Suivi des rapatriements en cours et terminés</p>
        </div>
        <Button variant="primary" size="sm" icon={<Plane size={16} />}>
          Nouveau rapatriement
        </Button>
      </motion.div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'En cours', value: activeCount, color: 'text-gold-dark', bg: 'bg-gold/10', icon: Plane },
          { label: 'Terminés', value: completedCount, color: 'text-primary', bg: 'bg-primary/10', icon: CheckCircle },
          { label: 'Ce mois', value: rapatriements.length, color: 'text-primary', bg: 'bg-primary/10', icon: Calendar },
          { label: 'Pays destination', value: 3, color: 'text-gold-dark', bg: 'bg-gold/10', icon: MapPin },
        ].map((stat) => (
          <Card key={stat.label}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg}`}>
                <stat.icon size={20} className={stat.color} />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-[11px] text-gray-500">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Timeline */}
        <div className="lg:col-span-3 space-y-4">
          {rapatriements.map((rap, i) => {
            return (
              <motion.div
                key={rap.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card
                  hover
                  className={`cursor-pointer transition-all ${
                    selectedRap?.id === rap.id ? 'ring-2 ring-primary/30 border-primary' : ''
                  }`}
                  onClick={() => setSelectedRap(rap)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${statusConfig[rap.status].bg}`}>
                      <Plane size={22} className={statusConfig[rap.status].color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-sm font-semibold text-gray-900">{rap.beneficiary}</h3>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${statusConfig[rap.status].bg} ${statusConfig[rap.status].color}`}>
                          {statusConfig[rap.status].label}
                        </span>
                      </div>

                      {/* Flight route */}
                      <div className="flex items-center gap-2 mb-3 p-2.5 rounded-lg bg-gray-50">
                        <div className="text-center flex-1">
                          <p className="text-xs font-bold text-gray-900">{rap.departureCity}</p>
                          <p className="text-[10px] text-gray-400">{rap.departure}</p>
                        </div>
                        <div className="flex items-center gap-1 px-3">
                          <div className="w-8 h-px bg-gray-300" />
                          <Plane size={14} className="text-primary rotate-0" />
                          <div className="w-8 h-px bg-gray-300" />
                        </div>
                        <div className="text-center flex-1">
                          <p className="text-xs font-bold text-gray-900">{rap.arrivalCity}</p>
                          <p className="text-[10px] text-gray-400">{rap.arrival}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-[11px] text-gray-400">
                        <span className="flex items-center gap-1"><Plane size={11} /> {rap.flightNumber}</span>
                        <span className="flex items-center gap-1"><Calendar size={11} /> {rap.date}</span>
                        <span className="flex items-center gap-1"><User size={11} /> {rap.assignedTo}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Detail */}
        <div className="lg:col-span-2">
          {selectedRap ? (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
              <Card>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-semibold text-gray-900">Détail rapatriement</h3>
                  <button onClick={() => setSelectedRap(null)} className="p-1 rounded hover:bg-gray-100 text-gray-400">
                    <X size={16} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-primary/5 text-center">
                    <Plane size={28} className="mx-auto mb-2 text-primary" />
                    <p className="text-lg font-bold text-gray-900">{selectedRap.flightNumber}</p>
                    <p className="text-xs text-gray-500">{selectedRap.departureCity} → {selectedRap.arrivalCity}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-gray-50">
                      <p className="text-[10px] text-gray-400 uppercase font-semibold mb-1">Bénéficiaire</p>
                      <p className="text-sm font-medium text-gray-900">{selectedRap.beneficiary}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-gray-50">
                      <p className="text-[10px] text-gray-400 uppercase font-semibold mb-1">Date</p>
                      <p className="text-sm font-medium text-gray-900">{selectedRap.date}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-gray-50">
                      <p className="text-[10px] text-gray-400 uppercase font-semibold mb-1">Statut</p>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusConfig[selectedRap.status].bg} ${statusConfig[selectedRap.status].color}`}>
                        {statusConfig[selectedRap.status].label}
                      </span>
                    </div>
                    <div className="p-3 rounded-lg bg-gray-50">
                      <p className="text-[10px] text-gray-400 uppercase font-semibold mb-1">Responsable</p>
                      <p className="text-sm text-gray-700">{selectedRap.assignedTo}</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-gray-50">
                    <p className="text-[10px] text-gray-400 uppercase font-semibold mb-1">Notes</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{selectedRap.notes}</p>
                  </div>

                  <div className="pt-3 border-t border-gray-100">
                    <Button variant="primary" size="sm" fullWidth icon={<ArrowRight size={14} />}>
                      Mettre à jour le statut
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ) : (
            <Card className="text-center py-16">
              <Plane size={36} className="mx-auto mb-4 text-gray-300" />
              <p className="text-sm font-medium text-gray-500">Sélectionnez un rapatriement</p>
              <p className="text-xs text-gray-400 mt-1">Cliquez pour voir les détails du vol</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
