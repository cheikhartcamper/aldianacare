import { motion } from 'framer-motion';
import { Shield, Download, FileText, Calendar, CheckCircle, Globe } from 'lucide-react';
import { Card, Button } from '@/components/ui';

export function ContractPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mon contrat</h1>
            <p className="text-sm text-gray-500 mt-1">Détails de votre contrat d'assurance.</p>
          </div>
          <Button size="sm" icon={<Download size={14} />}>Télécharger le contrat PDF</Button>
        </div>
      </motion.div>

      {/* Contract status banner */}
      <Card className="bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Shield size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold">Formule Premium</h2>
                <span className="bg-white/20 text-white text-xs px-2.5 py-0.5 rounded-full font-medium">Actif</span>
              </div>
              <p className="text-white/70 text-sm">Contrat N° ALC-2026-001234</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">19,90€<span className="text-sm font-normal text-white/70">/mois</span></p>
          </div>
        </div>
      </Card>

      {/* Contract details grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Calendar, label: 'Date de début', value: '01 Janvier 2026', color: 'text-primary bg-primary/10' },
          { icon: Calendar, label: 'Date d\'expiration', value: '01 Janvier 2027', color: 'text-info bg-info/10' },
          { icon: Globe, label: 'Zone de couverture', value: 'Monde entier', color: 'text-gold-dark bg-gold/10' },
          { icon: CheckCircle, label: 'Statut', value: 'Actif', color: 'text-success bg-success/10' },
        ].map((item) => (
          <Card key={item.label}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${item.color}`}>
              <item.icon size={18} />
            </div>
            <p className="text-xs text-gray-400">{item.label}</p>
            <p className="text-sm font-bold text-gray-900 mt-0.5">{item.value}</p>
          </Card>
        ))}
      </div>

      {/* Coverage details */}
      <Card>
        <h3 className="font-semibold text-gray-900 mb-4">Couverture incluse</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            'Rapatriement du corps',
            'Assistance administrative complète',
            'Support téléphonique 24/7',
            'Couverture Europe et Afrique',
            'Billet d\'avion pour 2 membres de la famille',
            'Assistance funéraire complète',
            'Couverture Monde entier',
            'Gestionnaire de dossier dédié',
          ].map((item) => (
            <div key={item} className="flex items-center gap-2 p-3 rounded-xl bg-surface-secondary">
              <CheckCircle size={16} className="text-primary flex-shrink-0" />
              <span className="text-sm text-gray-700">{item}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Beneficiary info */}
      <div className="grid sm:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-semibold text-gray-900 mb-4">Souscripteur</h3>
          <div className="space-y-3">
            {[
              { label: 'Nom complet', value: 'Amadou Diallo' },
              { label: 'Date de naissance', value: '15 Mars 1985' },
              { label: 'Nationalité', value: 'Sénégalaise' },
              { label: 'Pays de résidence', value: 'France' },
              { label: 'Email', value: 'amadou@email.com' },
              { label: 'Téléphone', value: '+33 6 12 34 56 78' },
            ].map((item) => (
              <div key={item.label} className="flex justify-between text-sm">
                <span className="text-gray-500">{item.label}</span>
                <span className="font-medium text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold text-gray-900 mb-4">Documents du contrat</h3>
          <div className="space-y-2">
            {[
              { name: 'Contrat d\'assurance', size: '2.4 MB' },
              { name: 'Conditions générales', size: '1.8 MB' },
              { name: 'Attestation de couverture', size: '480 KB' },
              { name: 'Tableau des garanties', size: '320 KB' },
            ].map((doc) => (
              <div key={doc.name} className="flex items-center gap-3 p-3 rounded-xl bg-surface-secondary group hover:bg-surface-tertiary transition-colors cursor-pointer">
                <FileText size={18} className="text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                  <p className="text-xs text-gray-400">{doc.size}</p>
                </div>
                <Download size={16} className="text-gray-400 group-hover:text-primary" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
