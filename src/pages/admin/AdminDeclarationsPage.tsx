import { FileText, AlertCircle } from 'lucide-react';

export function AdminDeclarationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Déclarations de décès</h1>
        <p className="text-sm text-gray-600 mt-1">Gestion des déclarations de rapatriement</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FileText size={32} className="text-amber-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            Module en cours d'activation
          </h2>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="text-sm font-semibold text-amber-900 mb-1">
                  Endpoints API manquants
                </p>
                <p className="text-sm text-amber-800">
                  Les endpoints suivants doivent être implémentés côté backend :
                </p>
                <ul className="text-xs text-amber-700 mt-2 space-y-1 font-mono">
                  <li>• GET /api/admin/declarations</li>
                  <li>• PUT /api/admin/declarations/:id/approve</li>
                  <li>• PUT /api/admin/declarations/:id/reject</li>
                </ul>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            Les déclarations créées par le public via le formulaire sont enregistrées en base de données. 
            Dès que les endpoints admin seront activés, vous pourrez consulter, approuver et rejeter les déclarations ici.
          </p>
        </div>
      </div>
    </div>
  );
}
