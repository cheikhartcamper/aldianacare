import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Upload, FileText, Phone, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { Card, Badge, Button, Input, Alert } from '@/components/ui';

const timelineSteps = [
  { status: 'done', label: 'Déclaration reçue', date: '10 Fev 2026', desc: 'Dossier ouvert' },
  { status: 'done', label: 'Documents vérifiés', date: '11 Fev 2026', desc: 'Certificat de décès validé' },
  { status: 'active', label: 'Rapatriement en cours', date: '12 Fev 2026', desc: 'Coordination avec les autorités' },
  { status: 'pending', label: 'Arrivée prévue', date: 'En attente', desc: 'Estimation sous 48h' },
  { status: 'pending', label: 'Dossier clôturé', date: 'En attente', desc: '' },
];

export function DeathDeclarationPage() {
  const [showForm, setShowForm] = useState(false);
  const [hasExistingCase] = useState(true);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Déclaration de décès</h1>
        <p className="text-sm text-gray-500 mt-1">Assistance en cas de décès — rapatriement et formalités.</p>
      </motion.div>

      <Alert variant="warning" title="Section sensible">
        Cette section est accessible uniquement à la personne de confiance ou à un membre de la famille.
        En cas d'urgence, appelez le +33 1 00 00 00 00 (disponible 24h/24).
      </Alert>

      {!showForm && !hasExistingCase && (
        <Card className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-50 rounded-2xl flex items-center justify-center">
            <AlertTriangle size={28} className="text-danger" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Déclarer un décès</h2>
          <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
            Si vous êtes la personne de confiance ou un membre de la famille, vous pouvez déclarer un décès ici.
          </p>
          <Button variant="danger" size="lg" onClick={() => setShowForm(true)} icon={<AlertTriangle size={16} />}>
            Déclarer un décès
          </Button>
        </Card>
      )}

      {showForm && (
        <Card>
          <h2 className="text-lg font-bold text-gray-900 mb-6">Formulaire de déclaration</h2>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Nom du défunt" placeholder="Nom complet" />
              <Input label="Date de décès" type="date" />
            </div>
            <Input label="Lieu de décès" placeholder="Ville, Pays" />
            <Input label="N° de contrat" placeholder="ALC-2026-XXXXXX" />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Certificat de décès</label>
              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-primary/40 transition-colors cursor-pointer">
                <Upload size={24} className="mx-auto mb-2 text-gray-300" />
                <p className="text-sm text-gray-600">Télécharger le certificat de décès</p>
                <p className="text-xs text-gray-400 mt-1">PDF, JPG ou PNG - Max 10MB</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Documents supplémentaires</label>
              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-primary/40 transition-colors cursor-pointer">
                <Upload size={24} className="mx-auto mb-2 text-gray-300" />
                <p className="text-sm text-gray-600">Autres documents (optionnel)</p>
                <p className="text-xs text-gray-400 mt-1">PDF, JPG ou PNG - Max 10MB</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes supplémentaires</label>
              <textarea
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary min-h-[100px] resize-y"
                placeholder="Informations complémentaires..."
              />
            </div>
            <div className="flex gap-3">
              <Button variant="danger" type="submit" icon={<ArrowRight size={16} />}>
                Soumettre la déclaration
              </Button>
              <Button variant="ghost" onClick={() => setShowForm(false)}>Annuler</Button>
            </div>
          </form>
        </Card>
      )}

      {hasExistingCase && (
        <>
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                  <FileText size={20} className="text-danger" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Dossier #DEC-2026-0042</h3>
                  <p className="text-xs text-gray-400">Ouvert le 10 Février 2026</p>
                </div>
              </div>
              <Badge variant="warning" dot>En cours</Badge>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-surface-secondary rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-1">Défunt</p>
                <p className="text-sm font-semibold text-gray-900">Ibrahim Diallo</p>
              </div>
              <div className="bg-surface-secondary rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-1">Contrat</p>
                <p className="text-sm font-semibold text-gray-900">ALC-2026-001234</p>
              </div>
              <div className="bg-surface-secondary rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-1">Lieu de décès</p>
                <p className="text-sm font-semibold text-gray-900">Paris, France</p>
              </div>
              <div className="bg-surface-secondary rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-1">Destination</p>
                <p className="text-sm font-semibold text-gray-900">Dakar, Sénégal</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="secondary" size="sm" icon={<Phone size={14} />}>
                Contacter le gestionnaire
              </Button>
              <Button variant="ghost" size="sm" icon={<FileText size={14} />}>
                Voir les documents
              </Button>
            </div>
          </Card>

          {/* Timeline */}
          <Card>
            <h3 className="font-semibold text-gray-900 mb-6">Suivi du dossier</h3>
            <div className="space-y-6">
              {timelineSteps.map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      step.status === 'done' ? 'bg-success text-white' :
                      step.status === 'active' ? 'bg-primary text-white ring-4 ring-primary/20' :
                      'bg-gray-100 text-gray-400'
                    }`}>
                      {step.status === 'done' ? <CheckCircle size={14} /> :
                       step.status === 'active' ? <Clock size={14} /> :
                       <span className="text-xs">{i + 1}</span>}
                    </div>
                    {i < timelineSteps.length - 1 && (
                      <div className={`w-px flex-1 mt-2 ${step.status === 'done' ? 'bg-success' : 'bg-gray-200'}`} />
                    )}
                  </div>
                  <div className="pb-6">
                    <p className={`text-sm font-semibold ${step.status === 'pending' ? 'text-gray-400' : 'text-gray-900'}`}>
                      {step.label}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{step.date}</p>
                    {step.desc && <p className="text-xs text-gray-500 mt-1">{step.desc}</p>}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
