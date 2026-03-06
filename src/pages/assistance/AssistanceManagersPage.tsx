import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Phone, Mail, MapPin, FolderOpen, CheckCircle,
  Plus, Star, Clock, Edit, X
} from 'lucide-react';
import { Card, Button } from '@/components/ui';

interface CountryManager {
  id: string;
  name: string;
  country: string;
  flag: string;
  city: string;
  phone: string;
  email: string;
  activeCases: number;
  resolvedCases: number;
  rating: number;
  available: boolean;
  joinedDate: string;
  languages: string[];
}

const managers: CountryManager[] = [
  {
    id: 'CM-001', name: 'Aminata Sy', country: 'Sénégal', flag: '🇸🇳', city: 'Dakar',
    phone: '+221 77 123 45 67', email: 'aminata.sy@aldianacare.com',
    activeCases: 4, resolvedCases: 28, rating: 4.9, available: true,
    joinedDate: 'Jan 2024', languages: ['Français', 'Wolof', 'Anglais'],
  },
  {
    id: 'CM-002', name: 'Moussa Traoré', country: 'Mali', flag: '🇲🇱', city: 'Bamako',
    phone: '+223 70 456 78 90', email: 'moussa.traore@aldianacare.com',
    activeCases: 3, resolvedCases: 22, rating: 4.8, available: true,
    joinedDate: 'Mar 2024', languages: ['Français', 'Bambara'],
  },
  {
    id: 'CM-003', name: 'Fatou Diop', country: 'Guinée', flag: '🇬🇳', city: 'Conakry',
    phone: '+224 62 789 01 23', email: 'fatou.diop@aldianacare.com',
    activeCases: 2, resolvedCases: 15, rating: 4.7, available: false,
    joinedDate: 'Juin 2024', languages: ['Français', 'Soussou', 'Peul'],
  },
  {
    id: 'CM-004', name: 'Ibrahim Keita', country: 'Côte d\'Ivoire', flag: '🇨🇮', city: 'Abidjan',
    phone: '+225 07 234 56 78', email: 'ibrahim.keita@aldianacare.com',
    activeCases: 5, resolvedCases: 31, rating: 4.9, available: true,
    joinedDate: 'Fev 2024', languages: ['Français', 'Dioula'],
  },
  {
    id: 'CM-005', name: 'Oumar Ba', country: 'Mauritanie', flag: '🇲🇷', city: 'Nouakchott',
    phone: '+222 36 123 45 67', email: 'oumar.ba@aldianacare.com',
    activeCases: 1, resolvedCases: 8, rating: 4.6, available: true,
    joinedDate: 'Sep 2024', languages: ['Français', 'Arabe', 'Pulaar'],
  },
  {
    id: 'CM-006', name: 'Aïssatou Balde', country: 'Togo', flag: '🇹🇬', city: 'Lomé',
    phone: '+228 90 567 89 01', email: 'aissatou.balde@aldianacare.com',
    activeCases: 0, resolvedCases: 3, rating: 4.5, available: true,
    joinedDate: 'Fev 2026', languages: ['Français', 'Éwé'],
  },
];

export function AssistanceManagersPage() {
  const [selectedManager, setSelectedManager] = useState<CountryManager | null>(null);

  const totalActive = managers.reduce((sum, m) => sum + m.activeCases, 0);
  const totalResolved = managers.reduce((sum, m) => sum + m.resolvedCases, 0);
  const availableCount = managers.filter(m => m.available).length;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Country Managers</h1>
          <p className="text-sm text-gray-500 mt-1">Gestion des responsables pays et leurs performances</p>
        </div>
        <Button variant="primary" size="sm" icon={<Plus size={16} />}>
          Ajouter un manager
        </Button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total managers', value: managers.length, icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Disponibles', value: availableCount, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Dossiers actifs', value: totalActive, icon: FolderOpen, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Total résolus', value: totalResolved, icon: Star, color: 'text-gold-dark', bg: 'bg-gold/10' },
        ].map((stat) => (
          <Card key={stat.label}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg}`}>
                <stat.icon size={20} className={stat.color} />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-[11px] text-gray-500">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Managers grid */}
        <div className="lg:col-span-3 grid sm:grid-cols-2 gap-4">
          {managers.map((manager, i) => (
            <motion.div
              key={manager.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card
                hover
                className={`cursor-pointer transition-all ${
                  selectedManager?.id === manager.id ? 'ring-2 ring-primary/30 border-primary' : ''
                }`}
                onClick={() => setSelectedManager(manager)}
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-gold/10 flex items-center justify-center text-xl">
                      {manager.flag}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                      manager.available ? 'bg-emerald-500' : 'bg-gray-400'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900">{manager.name}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <MapPin size={11} /> {manager.city}, {manager.country}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={12}
                        className={s <= Math.round(manager.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}
                      />
                    ))}
                    <span className="text-[11px] text-gray-500 ml-1">{manager.rating}</span>
                  </div>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    manager.available ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {manager.available ? 'Disponible' : 'Indisponible'}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-[11px] text-gray-400">
                  <span className="flex items-center gap-1"><FolderOpen size={11} /> {manager.activeCases} actifs</span>
                  <span className="flex items-center gap-1"><CheckCircle size={11} /> {manager.resolvedCases} résolus</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-2">
          {selectedManager ? (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
              <Card>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-semibold text-gray-900">Profil manager</h3>
                  <button onClick={() => setSelectedManager(null)} className="p-1 rounded hover:bg-gray-100 text-gray-400">
                    <X size={16} />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Profile header */}
                  <div className="text-center p-4 rounded-xl bg-gradient-to-br from-primary/5 to-gold/10">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-white shadow-sm flex items-center justify-center text-3xl mb-3">
                      {selectedManager.flag}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{selectedManager.name}</h3>
                    <p className="text-xs text-gray-500 flex items-center justify-center gap-1 mt-1">
                      <MapPin size={12} /> {selectedManager.city}, {selectedManager.country}
                    </p>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={14} className={s <= Math.round(selectedManager.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />
                      ))}
                      <span className="text-sm text-gray-600 ml-1 font-medium">{selectedManager.rating}/5</span>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                      <Phone size={14} className="text-gray-400" />
                      <p className="text-sm text-gray-700">{selectedManager.phone}</p>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                      <Mail size={14} className="text-gray-400" />
                      <p className="text-sm text-gray-700 truncate">{selectedManager.email}</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-amber-50 text-center">
                      <p className="text-2xl font-bold text-gold-dark">{selectedManager.activeCases}</p>
                      <p className="text-[10px] text-gold-dark font-medium">Dossiers actifs</p>
                    </div>
                    <div className="p-3 rounded-lg bg-emerald-50 text-center">
                      <p className="text-2xl font-bold text-primary">{selectedManager.resolvedCases}</p>
                      <p className="text-[10px] text-primary font-medium">Dossiers résolus</p>
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="p-3 rounded-lg bg-gray-50">
                    <p className="text-[10px] text-gray-400 uppercase font-semibold mb-2">Langues parlées</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedManager.languages.map((lang) => (
                        <span key={lang} className="text-xs px-2.5 py-1 rounded-full bg-white border border-gray-200 text-gray-700">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex items-center gap-3 text-[11px] text-gray-400">
                    <span className="flex items-center gap-1"><Clock size={11} /> Depuis {selectedManager.joinedDate}</span>
                    <span className="flex items-center gap-1"><Users size={11} /> {selectedManager.id}</span>
                  </div>

                  <div className="pt-3 border-t border-gray-100 grid grid-cols-2 gap-2">
                    <Button variant="primary" size="sm" fullWidth icon={<Phone size={14} />}>Appeler</Button>
                    <Button variant="outline" size="sm" fullWidth icon={<Edit size={14} />}>Modifier</Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ) : (
            <Card className="text-center py-16">
              <Users size={36} className="mx-auto mb-4 text-gray-300" />
              <p className="text-sm font-medium text-gray-500">Sélectionnez un manager</p>
              <p className="text-xs text-gray-400 mt-1">Cliquez pour voir le profil complet</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
