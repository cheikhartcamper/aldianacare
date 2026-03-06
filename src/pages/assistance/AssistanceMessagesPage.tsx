import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Send, Phone, Paperclip, MoreVertical,
  User, CheckCheck, MapPin
} from 'lucide-react';
import { Card } from '@/components/ui';

interface Conversation {
  id: string;
  name: string;
  role: string;
  country: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

interface Message {
  id: string;
  sender: 'agent' | 'contact';
  text: string;
  time: string;
  read: boolean;
}

const conversations: Conversation[] = [
  { id: '1', name: 'Aminata Sy', role: 'Country Manager', country: 'Sénégal', lastMessage: 'Le vol AF 718 est confirmé pour demain matin', time: '10:45', unread: 2, online: true },
  { id: '2', name: 'Moussa Traoré', role: 'Country Manager', country: 'Mali', lastMessage: 'J\'ai contacté la famille à Kayes', time: '09:30', unread: 0, online: true },
  { id: '3', name: 'Famille Diallo', role: 'Bénéficiaire', country: 'Sénégal', lastMessage: 'Merci pour votre aide, nous attendons...', time: '08:15', unread: 1, online: false },
  { id: '4', name: 'Fatou Diop', role: 'Country Manager', country: 'Guinée', lastMessage: 'Je serai disponible demain pour le dossier Camara', time: 'Hier', unread: 0, online: false },
  { id: '5', name: 'Ibrahim Keita', role: 'Country Manager', country: 'Côte d\'Ivoire', lastMessage: 'Documents consulaires envoyés au client', time: 'Hier', unread: 0, online: true },
  { id: '6', name: 'Famille Konaté', role: 'Bénéficiaire', country: 'Mali', lastMessage: 'Pouvez-vous nous donner une mise à jour ?', time: 'Hier', unread: 3, online: false },
];

const messagesByConv: Record<string, Message[]> = {
  '1': [
    { id: 'm1', sender: 'contact', text: 'Bonjour, j\'ai des nouvelles sur le dossier Diallo.', time: '10:20', read: true },
    { id: 'm2', sender: 'agent', text: 'Oui Aminata, je vous écoute. Où en est le rapatriement ?', time: '10:22', read: true },
    { id: 'm3', sender: 'contact', text: 'Le vol AF 718 est confirmé pour demain matin. Départ CDG à 11h30, arrivée DSS à 16h45.', time: '10:30', read: true },
    { id: 'm4', sender: 'contact', text: 'La famille sera présente à l\'aéroport de Dakar. J\'ai confirmé avec le frère du défunt.', time: '10:45', read: false },
  ],
  '2': [
    { id: 'm5', sender: 'agent', text: 'Moussa, avez-vous pu joindre la famille Ndiaye à Kayes ?', time: '09:00', read: true },
    { id: 'm6', sender: 'contact', text: 'J\'ai contacté la famille à Kayes. Ils sont prêts à recevoir le corps.', time: '09:15', read: true },
    { id: 'm7', sender: 'contact', text: 'Par contre, il faudrait un vol avec transit via Bamako car il n\'y a pas de direct vers Kayes.', time: '09:30', read: true },
  ],
  '3': [
    { id: 'm8', sender: 'contact', text: 'Bonjour, nous souhaitions savoir où en est le rapatriement de notre père.', time: '07:50', read: true },
    { id: 'm9', sender: 'agent', text: 'Bonjour Madame Diallo. Le vol est prévu pour demain. Je vous enverrai tous les détails dans la journée.', time: '08:00', read: true },
    { id: 'm10', sender: 'contact', text: 'Merci pour votre aide, nous attendons les informations.', time: '08:15', read: false },
  ],
};

export function AssistanceMessagesPage() {
  const [selectedConv, setSelectedConv] = useState<Conversation>(conversations[0]);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const currentMessages = messagesByConv[selectedConv.id] || [];

  const filteredConversations = conversations.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-sm text-gray-500 mt-1">Communications avec les country managers et bénéficiaires</p>
      </motion.div>

      <Card padding="none" className="overflow-hidden">
        <div className="flex h-[600px]">
          {/* Conversations list */}
          <div className="w-80 border-r border-gray-100 flex flex-col flex-shrink-0">
            <div className="p-3 border-b border-gray-100">
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
                <Search size={15} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="flex-1 text-sm bg-transparent outline-none text-gray-700 placeholder-gray-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConv(conv)}
                  className={`w-full flex items-start gap-3 p-3 text-left transition-colors ${
                    selectedConv.id === conv.id
                      ? 'bg-primary/5 border-r-2 border-primary'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      conv.role === 'Country Manager' ? 'bg-primary/10' : 'bg-gold/10'
                    }`}>
                      <User size={18} className={conv.role === 'Country Manager' ? 'text-primary' : 'text-gold-dark'} />
                    </div>
                    {conv.online && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="text-sm font-semibold text-gray-900 truncate">{conv.name}</p>
                      <span className="text-[10px] text-gray-400 flex-shrink-0">{conv.time}</span>
                    </div>
                    <p className="text-[10px] text-gray-400 flex items-center gap-1 mb-1">
                      <MapPin size={9} /> {conv.country} — {conv.role}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{conv.lastMessage}</p>
                  </div>
                  {conv.unread > 0 && (
                    <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-1">
                      {conv.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Chat area */}
          <div className="flex-1 flex flex-col">
            {/* Chat header */}
            <div className="h-16 border-b border-gray-100 flex items-center justify-between px-5">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                    selectedConv.role === 'Country Manager' ? 'bg-primary/10' : 'bg-gold/10'
                  }`}>
                    <User size={16} className={selectedConv.role === 'Country Manager' ? 'text-primary' : 'text-gold-dark'} />
                  </div>
                  {selectedConv.online && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{selectedConv.name}</p>
                  <p className="text-[10px] text-gray-400">
                    {selectedConv.role} — {selectedConv.country}
                    {selectedConv.online && <span className="text-emerald-500 ml-2">● En ligne</span>}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600">
                  <Phone size={16} />
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50/50">
              {currentMessages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                    msg.sender === 'agent'
                      ? 'bg-primary text-white rounded-br-md'
                      : 'bg-white border border-gray-100 text-gray-800 rounded-bl-md shadow-sm'
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    <div className={`flex items-center justify-end gap-1 mt-1 ${
                      msg.sender === 'agent' ? 'text-white/40' : 'text-gray-400'
                    }`}>
                      <span className="text-[10px]">{msg.time}</span>
                      {msg.sender === 'agent' && <CheckCheck size={12} className={msg.read ? 'text-gold' : ''} />}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-100 bg-white">
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600">
                  <Paperclip size={18} />
                </button>
                <input
                  type="text"
                  placeholder="Écrire un message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <button className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-primary-light transition-colors">
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
