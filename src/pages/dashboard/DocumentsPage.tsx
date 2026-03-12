import { motion } from 'framer-motion';
import { FileText, Download, Eye, Camera, CheckCircle, Clock, ImageIcon, AlertTriangle } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';

export function DocumentsPage() {
  const { user } = useAuth();

  const apiUrl = import.meta.env.VITE_API_URL || 'https://aldiianacare.online/api';
  const baseUrl = apiUrl.replace('/api', '');

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  const docs: Array<{
    key: string;
    name: string;
    type: string;
    path: string | null;
    isImage: boolean;
    date: string;
  }> = [
    {
      key: 'cniRecto',
      name: 'CNI — Recto',
      type: 'Pièce d\'identité',
      path: user?.cniRectoPath || null,
      isImage: true,
      date: user?.createdAt || '',
    },
    {
      key: 'cniVerso',
      name: 'CNI — Verso',
      type: 'Pièce d\'identité',
      path: user?.cniVersoPath || null,
      isImage: true,
      date: user?.createdAt || '',
    },
    {
      key: 'identityPhoto',
      name: 'Photo d\'identité',
      type: 'Identité',
      path: user?.identityPhotoPath || null,
      isImage: true,
      date: user?.createdAt || '',
    },
  ];

  const availableDocs = docs.filter((d) => d.path);
  const missingDocs = docs.filter((d) => !d.path);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="text-sm text-gray-500 mt-1">
            Vos pièces d'identité transmises lors de l'inscription.
          </p>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center">
              <CheckCircle size={20} className="text-success" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Documents fournis</p>
              <p className="text-lg font-bold text-gray-900">{availableDocs.length}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-warning/10 rounded-xl flex items-center justify-center">
              <Clock size={20} className="text-warning" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Documents manquants</p>
              <p className="text-lg font-bold text-gray-900">{missingDocs.length}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              user?.registrationStatus === 'approved' ? 'bg-success/10' :
              user?.registrationStatus === 'rejected' ? 'bg-danger/10' : 'bg-amber-50'
            }`}>
              <FileText size={20} className={
                user?.registrationStatus === 'approved' ? 'text-success' :
                user?.registrationStatus === 'rejected' ? 'text-danger' : 'text-amber-500'
              } />
            </div>
            <div>
              <p className="text-xs text-gray-400">Statut du dossier</p>
              <p className="text-sm font-bold text-gray-900">
                {user?.registrationStatus === 'approved' ? 'Approuvé' :
                 user?.registrationStatus === 'rejected' ? 'Rejeté' : 'En vérification'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Documents disponibles */}
      {availableDocs.length > 0 && (
        <Card padding="none">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Documents transmis</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {availableDocs.map((doc) => {
              const fileUrl = `${baseUrl}/${doc.path}`;
              return (
                <div key={doc.key} className="flex items-center gap-4 p-4 hover:bg-gray-50/50 transition-colors">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {doc.isImage ? (
                      <img
                        src={fileUrl}
                        alt={doc.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          (e.target as HTMLImageElement).parentElement!.querySelector('.fallback-icon')?.setAttribute('style', 'display:flex');
                        }}
                      />
                    ) : (
                      <FileText size={20} className="text-primary" />
                    )}
                    <span className="fallback-icon hidden items-center justify-center">
                      <ImageIcon size={20} className="text-primary" />
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                      <span>{doc.type}</span>
                      {doc.date && <span>{formatDate(doc.date)}</span>}
                    </div>
                  </div>
                  <Badge variant="success" dot size="sm">Fourni</Badge>
                  <div className="flex items-center gap-1">
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-primary transition-colors"
                      title="Voir"
                    >
                      <Eye size={16} />
                    </a>
                    <a
                      href={fileUrl}
                      download
                      className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-primary transition-colors"
                      title="Télécharger"
                    >
                      <Download size={16} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Données OCR extraites */}
      {user?.cniExtractedData && Object.keys(user.cniExtractedData).length > 0 && (
        <Card>
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Camera size={16} className="text-primary" />
            Données extraites (OCR)
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { key: 'lastName', label: 'Nom' },
              { key: 'firstName', label: 'Prénom' },
              { key: 'dateOfBirth', label: 'Date de naissance' },
              { key: 'placeOfBirth', label: 'Lieu de naissance' },
              { key: 'cniNumber', label: 'Numéro CNI' },
              { key: 'expirationDate', label: 'Date d\'expiration' },
              { key: 'nationality', label: 'Nationalité' },
              { key: 'address', label: 'Adresse' },
            ].map(({ key, label }) => {
              const value = user.cniExtractedData?.[key];
              if (!value) return null;
              return (
                <div key={key} className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="text-sm font-medium text-gray-900 mt-0.5">{String(value)}</p>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
            <CheckCircle size={11} className="text-success" />
            Données extraites automatiquement par scan OCR lors de l'inscription
          </p>
        </Card>
      )}

      {/* Documents manquants */}
      {missingDocs.length > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <div className="flex gap-3">
            <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800">Documents non fournis</p>
              <ul className="mt-2 space-y-1">
                {missingDocs.map((doc) => (
                  <li key={doc.key} className="text-xs text-amber-700 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                    {doc.name}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-amber-600 mt-2">
                Contactez le support pour soumettre les documents manquants.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Aucun document */}
      {availableDocs.length === 0 && (
        <Card>
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <FileText size={36} className="text-gray-200 mb-3" />
            <p className="text-sm font-medium text-gray-500">Aucun document disponible</p>
            <p className="text-xs text-gray-400 mt-1">
              Vos documents apparaîtront ici une fois votre inscription complétée.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
