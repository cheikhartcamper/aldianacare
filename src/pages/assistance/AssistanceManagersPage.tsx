import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Phone, Mail, MapPin, FolderOpen, CheckCircle,
  Plus, Clock, X, Shield, Globe, Loader2
} from 'lucide-react';
import { Card, Badge, Button, PageLoader } from '@/components/ui';
import { adminService, type CountryManager } from '@/services/admin.service';

export function AssistanceManagersPage() {
  const [managers, setManagers] = useState<CountryManager[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedManager, setSelectedManager] = useState<CountryManager | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await adminService.getCountryManagers();
        if (res.success) setManagers(res.data.countryManagers);
      } catch { /* ignore */ }
      setLoading(false);
    };
    fetch();
  }, []);

  const activeCount = managers.filter(m => m.isActive).length;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Country Managers</h1>
          <p className="text-sm text-gray-500 mt-1">Gestion des responsables pays</p>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total managers', value: managers.length, icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Actifs', value: activeCount, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Pays couverts', value: new Set(managers.map(m => m.assignedCountry?.name).filter(Boolean)).size, icon: Globe, color: 'text-gold-dark', bg: 'bg-gold/10' },
        ].map((stat) => (
          <Card key={stat.label}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg}`}>
                <stat.icon size={20} className={stat.color} />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{loading ? '—' : stat.value}</p>
                <p className="text-[11px] text-gray-500">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {loading ? (
        <PageLoader variant="inline" size="sm" label="Chargement des managers..." />
      ) : managers.length === 0 ? (
        <Card>
          <div className="text-center py-14">
            <Users size={40} className="mx-auto text-gray-200 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun manager</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">Les country managers sont ajoutés depuis les paramètres admin.</p>
          </div>
        </Card>
      ) : (
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
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-gold/10 flex items-center justify-center text-sm font-bold text-primary">
                        {manager.firstName.charAt(0)}{manager.lastName.charAt(0)}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                        manager.isActive ? 'bg-emerald-500' : 'bg-gray-400'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900">{manager.firstName} {manager.lastName}</h3>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <MapPin size={11} /> {manager.assignedCountry?.name || '—'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <Badge variant={manager.assignedCountry?.type === 'residence' ? 'primary' : 'warning'} size="sm">
                      {manager.assignedCountry?.type === 'residence' ? 'Résidence' : 'Rapatriement'}
                    </Badge>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      manager.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {manager.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-[11px] text-gray-400">
                    <span className="flex items-center gap-1"><Mail size={11} /> {manager.email}</span>
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
                    <div className="text-center p-4 rounded-xl bg-gradient-to-br from-primary/5 to-gold/10">
                      <div className="w-16 h-16 mx-auto rounded-2xl bg-white shadow-sm flex items-center justify-center text-lg font-bold text-primary mb-3">
                        {selectedManager.firstName.charAt(0)}{selectedManager.lastName.charAt(0)}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">{selectedManager.firstName} {selectedManager.lastName}</h3>
                      <p className="text-xs text-gray-500 flex items-center justify-center gap-1 mt-1">
                        <MapPin size={12} /> {selectedManager.assignedCountry?.name || '—'}
                      </p>
                      <Badge variant={selectedManager.isActive ? 'success' : 'danger'} dot size="sm" className="mt-2">
                        {selectedManager.isActive ? 'Actif' : 'Inactif'}
                      </Badge>
                    </div>

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

                    <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                      <p className="text-[10px] text-gray-400 uppercase font-semibold mb-2">Pays assigné</p>
                      <div className="flex items-center gap-2">
                        <Globe size={14} className="text-primary" />
                        <span className="text-sm font-medium text-gray-900 capitalize">{selectedManager.assignedCountry?.name || '—'}</span>
                        <Badge variant={selectedManager.assignedCountry?.type === 'residence' ? 'primary' : 'warning'} size="sm">
                          {selectedManager.assignedCountry?.type === 'residence' ? 'Résidence' : 'Rapatriement'}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-gray-400">
                      <span className="flex items-center gap-1"><Clock size={11} /> Depuis {new Date(selectedManager.createdAt).toLocaleDateString('fr-FR')}</span>
                      <span className="flex items-center gap-1"><Shield size={11} /> {selectedManager.role}</span>
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
      )}
    </div>
  );
}
