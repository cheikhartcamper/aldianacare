import { motion } from 'framer-motion';
import { FileText, Download, Eye, Share2, Upload, CheckCircle, Clock } from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui';

const documents = [
  { name: 'Contrat d\'assurance Premium', type: 'Contrat', date: '01 Jan 2026', size: '2.4 MB', status: 'validated' },
  { name: 'Reçu paiement Mars 2026', type: 'Reçu', date: '01 Mar 2026', size: '156 KB', status: 'validated' },
  { name: 'Reçu paiement Février 2026', type: 'Reçu', date: '01 Fev 2026', size: '148 KB', status: 'validated' },
  { name: 'Passeport - Amadou Diallo', type: 'Identité', date: '15 Dec 2025', size: '1.2 MB', status: 'validated' },
  { name: 'Certificat de résidence', type: 'Certificat', date: '10 Dec 2025', size: '890 KB', status: 'pending' },
  { name: 'Photo selfie vérification', type: 'Identité', date: '15 Dec 2025', size: '3.1 MB', status: 'validated' },
];

const statusConfig = {
  validated: { label: 'Validé', variant: 'success' as const, icon: CheckCircle },
  pending: { label: 'En attente', variant: 'warning' as const, icon: Clock },
};

export function DocumentsPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
            <p className="text-sm text-gray-500 mt-1">Tous vos documents en un seul endroit.</p>
          </div>
          <Button size="sm" icon={<Upload size={14} />}>Ajouter un document</Button>
        </div>
      </motion.div>

      {/* Document categories */}
      <div className="grid sm:grid-cols-4 gap-4">
        {[
          { label: 'Contrats', count: 1, color: 'bg-primary/10 text-primary' },
          { label: 'Reçus', count: 2, color: 'bg-info/10 text-info' },
          { label: 'Identité', count: 2, color: 'bg-gold/10 text-gold-dark' },
          { label: 'Certificats', count: 1, color: 'bg-success/10 text-success' },
        ].map((cat) => (
          <Card key={cat.label} hover className="text-center cursor-pointer">
            <div className={`w-10 h-10 mx-auto mb-2 rounded-xl flex items-center justify-center ${cat.color}`}>
              <FileText size={18} />
            </div>
            <p className="text-sm font-semibold text-gray-900">{cat.label}</p>
            <p className="text-xs text-gray-400">{cat.count} document(s)</p>
          </Card>
        ))}
      </div>

      {/* Documents list */}
      <Card padding="none">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Tous les documents</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {documents.map((doc) => {
            const config = statusConfig[doc.status as keyof typeof statusConfig];
            return (
              <div key={doc.name} className="flex items-center gap-4 p-4 hover:bg-gray-50/50 transition-colors">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText size={18} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                    <span>{doc.type}</span>
                    <span>{doc.date}</span>
                    <span>{doc.size}</span>
                  </div>
                </div>
                <Badge variant={config.variant} dot size="sm">{config.label}</Badge>
                <div className="flex items-center gap-1">
                  <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600" title="Voir">
                    <Eye size={16} />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600" title="Télécharger">
                    <Download size={16} />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600" title="Partager">
                    <Share2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
