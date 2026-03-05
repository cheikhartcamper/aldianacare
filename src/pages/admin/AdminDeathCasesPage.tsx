import { motion } from 'framer-motion';
import { AlertTriangle, Eye, Clock, CheckCircle } from 'lucide-react';
import { Card, Badge } from '@/components/ui';

const cases = [
  { id: 'DEC-2026-0042', deceased: 'Ibrahim Diallo', contract: 'ALC-2026-001234', declarant: 'Fatou Diallo', origin: 'Paris, France', dest: 'Dakar, Sénégal', date: '10 Fev 2026', status: 'in_progress' },
  { id: 'DEC-2026-0041', deceased: 'Oumar Sy', contract: 'ALC-2025-000890', declarant: 'Aissatou Sy', origin: 'Bruxelles, Belgique', dest: 'Bamako, Mali', date: '25 Jan 2026', status: 'completed' },
  { id: 'DEC-2026-0040', deceased: 'Kadiatou Bah', contract: 'ALC-2025-000756', declarant: 'Mamadou Bah', origin: 'Rome, Italie', dest: 'Conakry, Guinée', date: '15 Jan 2026', status: 'completed' },
];

const statusConfig: Record<string, { label: string; variant: 'success' | 'warning' | 'danger'; icon: typeof CheckCircle }> = {
  in_progress: { label: 'En cours', variant: 'warning', icon: Clock },
  completed: { label: 'Clôturé', variant: 'success', icon: CheckCircle },
  pending: { label: 'En attente', variant: 'danger', icon: AlertTriangle },
};

export function AdminDeathCasesPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Dossiers décès</h1>
        <p className="text-sm text-gray-500 mt-1">Suivi des dossiers de rapatriement.</p>
      </motion.div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-warning/10 rounded-xl flex items-center justify-center">
              <Clock size={20} className="text-warning" />
            </div>
            <div>
              <p className="text-xs text-gray-400">En cours</p>
              <p className="text-2xl font-bold text-gray-900">1</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center">
              <CheckCircle size={20} className="text-success" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Clôturés</p>
              <p className="text-2xl font-bold text-gray-900">2</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <AlertTriangle size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Total</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </Card>
      </div>

      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left p-4 font-medium text-gray-500">Dossier</th>
                <th className="text-left p-4 font-medium text-gray-500">Défunt</th>
                <th className="text-left p-4 font-medium text-gray-500">Déclarant</th>
                <th className="text-left p-4 font-medium text-gray-500">Trajet</th>
                <th className="text-left p-4 font-medium text-gray-500">Date</th>
                <th className="text-left p-4 font-medium text-gray-500">Statut</th>
                <th className="text-left p-4 font-medium text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((c) => {
                const config = statusConfig[c.status];
                return (
                  <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="p-4 font-mono text-xs text-gray-600">{c.id}</td>
                    <td className="p-4 font-medium text-gray-900">{c.deceased}</td>
                    <td className="p-4 text-gray-600">{c.declarant}</td>
                    <td className="p-4 text-gray-600 text-xs">{c.origin} → {c.dest}</td>
                    <td className="p-4 text-gray-500">{c.date}</td>
                    <td className="p-4"><Badge variant={config.variant} dot size="sm">{config.label}</Badge></td>
                    <td className="p-4">
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><Eye size={14} /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
