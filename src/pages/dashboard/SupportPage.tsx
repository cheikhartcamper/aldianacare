import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HeadphonesIcon, Phone, Mail, Globe, Plus, MessageSquare, Clock, CheckCircle, XCircle, ChevronRight } from 'lucide-react';
import { Card, Badge, SkeletonList } from '@/components/ui';
import { messagingService, type Ticket, type TicketType } from '@/services/messaging.service';

const STATUS_CONFIG: Record<string, { label: string; variant: 'success' | 'warning' | 'neutral' | 'danger'; icon: React.ElementType }> = {
  open:        { label: 'Ouvert', variant: 'warning', icon: Clock },
  in_progress: { label: 'En cours', variant: 'neutral', icon: MessageSquare },
  resolved:    { label: 'Résolu', variant: 'success', icon: CheckCircle },
  closed:      { label: 'Clôturé', variant: 'neutral', icon: XCircle },
};

const TICKET_TYPES: { value: TicketType; label: string }[] = [
  { value: 'question', label: 'Question générale' },
  { value: 'contestation', label: 'Contestation / Réclamation' },
  { value: 'modification', label: 'Demande de modification' },
  { value: 'technical', label: 'Problème technique' },
  { value: 'other', label: 'Autre' },
];

export function SupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [apiAvailable, setApiAvailable] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ type: 'question' as TicketType, subject: '', message: '' });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    messagingService.getMyTickets({ limit: 20 })
      .then(res => { if (res.success) setTickets(res.data.tickets); })
      .catch(() => setApiAvailable(false))
      .finally(() => setLoadingTickets(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subject.trim() || !form.message.trim()) { setFormError('Sujet et message requis.'); return; }
    setSubmitting(true);
    setFormError('');
    try {
      const res = await messagingService.createTicket(form);
      if (res.success) {
        setTickets(prev => [res.data, ...prev]);
        setForm({ type: 'question', subject: '', message: '' });
        setShowForm(false);
      }
    } catch { setFormError('Erreur lors de la création du ticket. Veuillez réessayer.'); }
    setSubmitting(false);
  };

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

      {/* Tickets section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Mes demandes</h2>
            <p className="text-xs text-gray-400 mt-0.5">Suivez l'avancement de vos demandes et échangez avec notre équipe.</p>
          </div>
          {apiAvailable && (
            <button
              onClick={() => setShowForm(v => !v)}
              className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors"
            >
              <Plus size={15} />
              Nouvelle demande
            </button>
          )}
        </div>

        {/* New ticket form */}
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="mb-4 border-primary/30">
              <h3 className="font-semibold text-gray-900 mb-4">Nouvelle demande</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Type de demande</label>
                  <select
                    value={form.type}
                    onChange={e => setForm(f => ({ ...f, type: e.target.value as TicketType }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    {TICKET_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Sujet</label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                    placeholder="Résumé de votre demande…"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Message</label>
                  <textarea
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    rows={4}
                    placeholder="Décrivez votre demande en détail…"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                {formError && <p className="text-xs text-danger">{formError}</p>}
                <div className="flex gap-3">
                  <button type="submit" disabled={submitting} className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-dark disabled:opacity-50 transition-colors">
                    {submitting ? 'Envoi…' : 'Envoyer'}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors">
                    Annuler
                  </button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}

        {/* Tickets list */}
        {!apiAvailable ? (
          <Card>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <MessageSquare size={32} className="text-gray-200 mb-3" />
              <p className="text-sm text-gray-500">Le module de tickets sera disponible prochainement.</p>
              <p className="text-xs text-gray-400 mt-1">En attendant, contactez-nous par email ou WhatsApp.</p>
            </div>
          </Card>
        ) : loadingTickets ? (
          <Card padding="none" className="overflow-hidden"><SkeletonList rows={4} /></Card>
        ) : tickets.length === 0 ? (
          <Card>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <MessageSquare size={32} className="text-gray-200 mb-3" />
              <p className="text-sm text-gray-500">Aucune demande pour l'instant.</p>
              <p className="text-xs text-gray-400 mt-1">Cliquez sur "Nouvelle demande" pour contacter notre équipe.</p>
            </div>
          </Card>
        ) : (
          <Card className="p-0 overflow-hidden">
            {tickets.map((ticket, i) => {
              const cfg = STATUS_CONFIG[ticket.status] ?? STATUS_CONFIG.open;
              const Icon = cfg.icon;
              return (
                <div key={ticket.id} className={`flex items-center gap-3 p-4 border-b border-gray-50 last:border-0 ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-primary/5">
                    <MessageSquare size={16} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900 truncate">{ticket.subject}</p>
                      <Badge variant={cfg.variant} size="sm" className="flex-shrink-0">
                        <Icon size={10} className="mr-1" />{cfg.label}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      #{ticket.ticketNumber} · {TICKET_TYPES.find(t => t.value === ticket.type)?.label ?? ticket.type} ·{' '}
                      {new Date(ticket.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />
                </div>
              );
            })}
          </Card>
        )}
      </div>
    </div>
  );
}
