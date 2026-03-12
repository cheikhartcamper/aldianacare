import { motion } from 'framer-motion';
import { HeadphonesIcon, Phone, Mail, Globe, Info } from 'lucide-react';
import { Card } from '@/components/ui';

export function SupportPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Support</h1>
        <p className="text-sm text-gray-500 mt-1">Besoin d'aide ? Notre équipe est disponible 24h/24.</p>
      </motion.div>

      {/* Contact banner */}
      <Card className="bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
            <HeadphonesIcon size={28} />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Comment nous contacter ?</h3>
            <p className="text-white/70 text-sm mt-1">
              Notre équipe support est à votre disposition pour répondre à toutes vos questions.
            </p>
          </div>
        </div>
      </Card>

      {/* Contact methods */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center bg-primary/10 text-primary">
            <Mail size={22} />
          </div>
          <h3 className="font-semibold text-gray-900 text-sm">Email</h3>
          <p className="text-xs text-gray-400 mt-0.5 mb-3">Réponse sous 24h</p>
          <a
            href="mailto:novabridge.lifeguard@gmail.com"
            className="text-sm text-primary font-medium hover:underline break-all"
          >
            novabridge.lifeguard@gmail.com
          </a>
        </Card>
        <Card className="text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center bg-success/10 text-success">
            <Phone size={22} />
          </div>
          <h3 className="font-semibold text-gray-900 text-sm">WhatsApp</h3>
          <p className="text-xs text-gray-400 mt-0.5 mb-3">Disponible 24/7</p>
          <p className="text-sm text-gray-700 font-medium">Contactez-nous via WhatsApp</p>
        </Card>
        <Card className="text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center bg-info/10 text-info">
            <Globe size={22} />
          </div>
          <h3 className="font-semibold text-gray-900 text-sm">Site web</h3>
          <p className="text-xs text-gray-400 mt-0.5 mb-3">Informations & FAQ</p>
          <a
            href="https://aldiianacare.online"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary font-medium hover:underline"
          >
            aldiianacare.online
          </a>
        </Card>
      </div>

      {/* FAQ rapide */}
      <Card>
        <h3 className="font-semibold text-gray-900 mb-4">Questions fréquentes</h3>
        <div className="space-y-3">
          {[
            { q: 'Comment modifier mes informations personnelles ?', a: 'Rendez-vous dans Paramètres pour mettre à jour votre profil, mot de passe et documents.' },
            { q: 'Comment ajouter ou modifier une personne de confiance ?', a: 'Allez dans la section "Personne de confiance" du menu pour gérer vos contacts.' },
            { q: 'Que faire en cas de décès d\'un assuré ?', a: 'Les personnes de confiance peuvent effectuer la déclaration via le formulaire public accessible depuis leur lien dédié.' },
            { q: 'Comment changer de formule ?', a: 'Contactez notre équipe support par email pour toute demande de changement de formule.' },
          ].map(({ q, a }) => (
            <div key={q} className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm font-medium text-gray-900">{q}</p>
              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="border-l-4 border-l-info">
        <div className="flex items-start gap-3">
          <Info size={18} className="text-info mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-600 leading-relaxed">
            Le système de tickets et le chat en direct seront disponibles dans une prochaine mise à jour.
            En attendant, utilisez l'email ou WhatsApp pour nous contacter.
          </p>
        </div>
      </Card>
    </div>
  );
}
