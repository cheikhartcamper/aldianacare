import { useState } from 'react';
import { motion } from 'framer-motion';
import { HeadphonesIcon, MessageCircle, FileText, Phone, Send, Search, ChevronRight } from 'lucide-react';
import { Card, Button, Input } from '@/components/ui';

const helpArticles = [
  { title: 'Comment modifier ma formule ?', category: 'Contrat' },
  { title: 'Comment changer de moyen de paiement ?', category: 'Paiement' },
  { title: 'Comment ajouter une personne de confiance ?', category: 'Compte' },
  { title: 'Que faire en cas de décès ?', category: 'Urgence' },
  { title: 'Comment fonctionne le parrainage ?', category: 'Parrainage' },
  { title: 'Comment télécharger mon contrat ?', category: 'Documents' },
];

const tickets = [
  { id: 'TIC-001', subject: 'Question sur ma couverture', date: '28 Fev 2026', status: 'resolved' },
  { id: 'TIC-002', subject: 'Problème de paiement Wave', date: '15 Fev 2026', status: 'open' },
];

export function SupportPage() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Support</h1>
        <p className="text-sm text-gray-500 mt-1">Besoin d'aide ? Nous sommes là pour vous.</p>
      </motion.div>

      {/* Support options */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: MessageCircle, title: 'Chat en direct', desc: 'Disponible 24/7', color: 'bg-primary/10 text-primary', action: () => setChatOpen(true) },
          { icon: FileText, title: 'Centre d\'aide', desc: 'Articles et guides', color: 'bg-info/10 text-info', action: () => {} },
          { icon: HeadphonesIcon, title: 'Ticket support', desc: 'Réponse sous 24h', color: 'bg-gold/10 text-gold-dark', action: () => {} },
          { icon: Phone, title: 'Country Manager', desc: 'Contact direct', color: 'bg-success/10 text-success', action: () => {} },
        ].map((item) => (
          <Card key={item.title} hover className="cursor-pointer text-center" onClick={item.action}>
            <div className={`w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center ${item.color}`}>
              <item.icon size={22} />
            </div>
            <h3 className="font-semibold text-gray-900 text-sm">{item.title}</h3>
            <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Help center */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Centre d'aide</h3>
          </div>
          <div className="mb-4">
            <Input placeholder="Rechercher un article..." icon={<Search size={16} />} />
          </div>
          <div className="space-y-1">
            {helpArticles.map((article) => (
              <button
                key={article.title}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors text-left group"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900 group-hover:text-primary">{article.title}</p>
                  <p className="text-xs text-gray-400">{article.category}</p>
                </div>
                <ChevronRight size={14} className="text-gray-300" />
              </button>
            ))}
          </div>
        </Card>

        {/* Tickets */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Mes tickets</h3>
            <Button variant="secondary" size="sm">Nouveau ticket</Button>
          </div>
          {tickets.length === 0 ? (
            <div className="text-center py-8">
              <HeadphonesIcon size={32} className="mx-auto mb-3 text-gray-300" />
              <p className="text-sm text-gray-400">Aucun ticket ouvert</p>
            </div>
          ) : (
            <div className="space-y-2">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center gap-3 p-3 rounded-xl bg-surface-secondary hover:bg-surface-tertiary transition-colors cursor-pointer">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${ticket.status === 'open' ? 'bg-warning' : 'bg-success'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{ticket.subject}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>{ticket.id}</span>
                      <span>•</span>
                      <span>{ticket.date}</span>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    ticket.status === 'open' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
                  }`}>
                    {ticket.status === 'open' ? 'Ouvert' : 'Résolu'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Chat widget */}
      {chatOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="fixed bottom-6 right-6 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
        >
          <div className="bg-primary text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle size={18} />
              <span className="font-semibold text-sm">Chat Aldiana Care</span>
            </div>
            <button onClick={() => setChatOpen(false)} className="text-white/70 hover:text-white text-lg">&times;</button>
          </div>
          <div className="p-4 h-64 overflow-y-auto">
            <div className="bg-surface-secondary rounded-xl p-3 mb-3 max-w-[85%]">
              <p className="text-xs text-gray-600">Bonjour ! Comment puis-je vous aider ?</p>
              <p className="text-[10px] text-gray-400 mt-1">Aujourd'hui, 11:00</p>
            </div>
          </div>
          <div className="p-3 border-t border-gray-100">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Votre message..."
                className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-primary-light transition-colors">
                <Send size={14} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
