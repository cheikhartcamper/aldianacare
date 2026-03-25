import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings, CheckCircle, Globe, Plus, Edit2, Trash2, Loader2,
  MapPin, Plane, Users, Phone, Mail, ShieldCheck, ToggleLeft, ToggleRight
} from 'lucide-react';
import { Card, Badge, Button, Input, Modal, PageLoader, BrandSpinner } from '@/components/ui';
import {
  adminService,
  type AdminSettings as AdminSettingsType,
  type Country,
  type CountryManager
} from '@/services/admin.service';

type SettingsTab = 'general' | 'countries' | 'managers';

export function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');

  // --- General settings ---
  const [settings, setSettings] = useState<AdminSettingsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [maxTrusted, setMaxTrusted] = useState(3);
  const [allowedRelations, setAllowedRelations] = useState('');
  const [minFamilyMembers, setMinFamilyMembers] = useState(2);
  const [familyDiscountPercent, setFamilyDiscountPercent] = useState(15);
  const [eligibilityMonths, setEligibilityMonths] = useState(6);
  const [referralDiscountPercent, setReferralDiscountPercent] = useState(10);

  // --- Countries ---
  const [countries, setCountries] = useState<Country[]>([]);
  const [countriesLoading, setCountriesLoading] = useState(false);
  const [countryModal, setCountryModal] = useState(false);
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);
  const [countryForm, setCountryForm] = useState({ name: '', type: 'residence' as 'residence' | 'repatriation', isActive: true });
  const [countrySaving, setCountrySaving] = useState(false);
  const [countryError, setCountryError] = useState<string | null>(null);
  const [countryDeleting, setCountryDeleting] = useState<string | null>(null);
  const [countryTypeFilter, setCountryTypeFilter] = useState<'all' | 'residence' | 'repatriation'>('all');

  // --- Country Managers ---
  const [managers, setManagers] = useState<CountryManager[]>([]);
  const [managersLoading, setManagersLoading] = useState(false);
  const [managerModal, setManagerModal] = useState(false);
  const [managerForm, setManagerForm] = useState({ firstName: '', lastName: '', email: '', phone: '', countryId: '' });
  const [managerSaving, setManagerSaving] = useState(false);
  const [managerError, setManagerError] = useState<string | null>(null);

  // Fetch general settings
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await adminService.getSettings();
        if (res.success) {
          setSettings(res.data);
          setMaxTrusted(res.data.maxTrustedPersons);
          setAllowedRelations(res.data.allowedRelations.join(', '));
          setMinFamilyMembers(res.data.minFamilyMembers ?? 2);
          setFamilyDiscountPercent(res.data.familyDiscountPercent ?? 15);
          setEligibilityMonths(res.data.eligibilityMonths ?? 6);
          setReferralDiscountPercent(res.data.referralDiscountPercent ?? 10);
        }
      } catch { /* ignore */ }
      setLoading(false);
    };
    fetch();
  }, []);

  // Fetch countries
  const fetchCountries = useCallback(async () => {
    setCountriesLoading(true);
    try {
      const res = await adminService.getCountries();
      if (res.success) setCountries(res.data.countries);
    } catch { /* ignore */ }
    setCountriesLoading(false);
  }, []);

  // Fetch managers
  const fetchManagers = useCallback(async () => {
    setManagersLoading(true);
    try {
      const res = await adminService.getCountryManagers();
      if (res.success) setManagers(res.data.countryManagers);
    } catch { /* ignore */ }
    setManagersLoading(false);
  }, []);

  useEffect(() => {
    if (activeTab === 'countries') fetchCountries();
    if (activeTab === 'managers') { fetchCountries(); fetchManagers(); }
  }, [activeTab, fetchCountries, fetchManagers]);

  const handleSaveSettings = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await adminService.updateSettings({
        maxTrustedPersons: maxTrusted,
        allowedRelations: allowedRelations.split(',').map(s => s.trim()).filter(Boolean),
        minFamilyMembers,
        familyDiscountPercent,
        eligibilityMonths,
        referralDiscountPercent,
      });
      if (res.success) {
        setSettings(res.data);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch { /* ignore */ }
    setSaving(false);
  };

  // Country CRUD
  const openCreateCountry = () => {
    setEditingCountry(null);
    setCountryForm({ name: '', type: 'residence', isActive: true });
    setCountryError(null);
    setCountryModal(true);
  };

  const openEditCountry = (c: Country) => {
    setEditingCountry(c);
    setCountryForm({ name: c.name, type: c.type, isActive: c.isActive });
    setCountryError(null);
    setCountryModal(true);
  };

  const handleSaveCountry = async () => {
    if (!countryForm.name.trim()) return;
    setCountrySaving(true);
    setCountryError(null);
    try {
      if (editingCountry) {
        await adminService.updateCountry(editingCountry.id, countryForm);
      } else {
        await adminService.createCountry(countryForm);
      }
      setCountryModal(false);
      fetchCountries();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setCountryError(msg || 'Erreur lors de l\'enregistrement.');
    }
    setCountrySaving(false);
  };

  const handleDeleteCountry = async (id: string) => {
    setCountryDeleting(id);
    try {
      await adminService.deleteCountry(id);
      fetchCountries();
    } catch { /* ignore */ }
    setCountryDeleting(null);
  };

  const handleToggleCountry = async (c: Country) => {
    try {
      await adminService.updateCountry(c.id, { isActive: !c.isActive });
      fetchCountries();
    } catch { /* ignore */ }
  };

  // Manager CRUD
  const handleCreateManager = async () => {
    if (!managerForm.firstName || !managerForm.email || !managerForm.countryId) return;
    setManagerSaving(true);
    setManagerError(null);
    try {
      const res = await adminService.createCountryManager(managerForm);
      if (res.success) {
        setManagerModal(false);
        setManagerForm({ firstName: '', lastName: '', email: '', phone: '', countryId: '' });
        fetchManagers();
      } else {
        setManagerError(res.message || 'Erreur lors de la création.');
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setManagerError(msg || 'Erreur réseau. Vérifiez votre connexion.');
    }
    setManagerSaving(false);
  };

  const residenceCountries = countries.filter(c => c.type === 'residence' && c.isActive);
  const filteredCountries = countries.filter(c => countryTypeFilter === 'all' || c.type === countryTypeFilter);
  const residenceCount = countries.filter(c => c.type === 'residence').length;
  const repatriationCount = countries.filter(c => c.type === 'repatriation').length;

  const TABS: { key: SettingsTab; label: string; icon: typeof Settings }[] = [
    { key: 'general', label: 'Général', icon: Settings },
    { key: 'countries', label: 'Pays', icon: Globe },
    { key: 'managers', label: 'Country Managers', icon: Users },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-sm text-gray-500 mt-1">Configuration complète de la plateforme Aldiana Care.</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ==================== GENERAL TAB ==================== */}
      {activeTab === 'general' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl space-y-6">
          {loading ? (
            <PageLoader variant="inline" size="sm" label="Chargement des paramètres..." />
          ) : (
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Settings size={18} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Paramètres généraux</h3>
                  <p className="text-xs text-gray-400">Configuration des personnes de confiance et relations</p>
                </div>
              </div>
              <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); handleSaveSettings(); }}>
                <Input
                  label="Nombre max de personnes de confiance"
                  type="number"
                  value={String(maxTrusted)}
                  onChange={(e) => setMaxTrusted(Number(e.target.value))}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Relations autorisées (séparées par virgule)</label>
                  <textarea
                    value={allowedRelations}
                    onChange={(e) => setAllowedRelations(e.target.value)}
                    rows={3}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                    placeholder="père, mère, frère, soeur, conjoint, ami..."
                  />
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-800 mb-3">Plan familial</h4>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <Input
                      label="Membres minimum"
                      type="number"
                      value={String(minFamilyMembers)}
                      onChange={(e) => setMinFamilyMembers(Number(e.target.value))}
                    />
                    <Input
                      label="Réduction familiale (%)"
                      type="number"
                      value={String(familyDiscountPercent)}
                      onChange={(e) => setFamilyDiscountPercent(Number(e.target.value))}
                    />
                    <Input
                      label="Mois d'éligibilité"
                      type="number"
                      value={String(eligibilityMonths)}
                      onChange={(e) => setEligibilityMonths(Number(e.target.value))}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Nombre minimum de membres pour le plan familial, pourcentage de réduction, et mois avant éligibilité au rapatriement.</p>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-800 mb-3">Parrainage</h4>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <Input
                      label="Réduction parrainage (%)"
                      type="number"
                      value={String(referralDiscountPercent)}
                      onChange={(e) => setReferralDiscountPercent(Number(e.target.value))}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Pourcentage de réduction appliqué au premier paiement d'un filleul parrainé.</p>
                </div>
                {settings && (
                  <p className="text-xs text-gray-400">Dernière modification : {new Date(settings.updatedAt).toLocaleString('fr-FR')}</p>
                )}
                <div className="flex items-center gap-3 pt-2">
                  <Button size="sm" disabled={saving}>
                    {saving ? <><BrandSpinner size={14} /> <span className="ml-1.5">Enregistrement...</span></> : 'Enregistrer'}
                  </Button>
                  {saved && <span className="text-sm text-primary flex items-center gap-1"><CheckCircle size={14} /> Enregistré</span>}
                </div>
              </form>
            </Card>
          )}
        </motion.div>
      )}

      {/* ==================== COUNTRIES TAB ==================== */}
      {activeTab === 'countries' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Globe size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Total pays</p>
                  <p className="text-2xl font-bold text-gray-900">{countries.length}</p>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <MapPin size={18} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Résidence</p>
                  <p className="text-2xl font-bold text-gray-900">{residenceCount}</p>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                  <Plane size={18} className="text-gold-dark" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Rapatriement</p>
                  <p className="text-2xl font-bold text-gray-900">{repatriationCount}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Filters + Add */}
          <Card>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                {(['all', 'residence', 'repatriation'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setCountryTypeFilter(type)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      countryTypeFilter === type
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {type === 'all' ? 'Tous' : type === 'residence' ? 'Résidence' : 'Rapatriement'}
                  </button>
                ))}
              </div>
              <Button size="sm" icon={<Plus size={14} />} onClick={openCreateCountry}>
                Ajouter un pays
              </Button>
            </div>
          </Card>

          {/* Countries list */}
          {countriesLoading ? (
            <PageLoader variant="inline" size="sm" label="Chargement des pays..." />
          ) : filteredCountries.length === 0 ? (
            <Card>
              <div className="text-center py-10">
                <Globe size={36} className="mx-auto text-gray-200 mb-3" />
                <p className="text-sm text-gray-500">Aucun pays configuré</p>
                <Button size="sm" className="mt-4" icon={<Plus size={14} />} onClick={openCreateCountry}>
                  Ajouter le premier pays
                </Button>
              </div>
            </Card>
          ) : (
            <Card padding="none">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3.5">Pays</th>
                      <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3.5">Type</th>
                      <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3.5">Statut</th>
                      <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3.5">Ajouté le</th>
                      <th className="text-right text-xs font-semibold text-gray-500 px-5 py-3.5">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCountries.map((country) => (
                      <tr key={country.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                        <td className="px-5 py-3.5">
                          <p className="text-sm font-semibold text-gray-900 capitalize">{country.name}</p>
                        </td>
                        <td className="px-5 py-3.5">
                          <Badge variant={country.type === 'residence' ? 'primary' : 'warning'} size="sm">
                            {country.type === 'residence' ? 'Résidence' : 'Rapatriement'}
                          </Badge>
                        </td>
                        <td className="px-5 py-3.5">
                          <button
                            onClick={() => handleToggleCountry(country)}
                            className="flex items-center gap-2 group"
                          >
                            {country.isActive ? (
                              <ToggleRight size={22} className="text-primary" />
                            ) : (
                              <ToggleLeft size={22} className="text-gray-300" />
                            )}
                            <span className={`text-xs font-medium ${country.isActive ? 'text-primary' : 'text-gray-400'}`}>
                              {country.isActive ? 'Actif' : 'Inactif'}
                            </span>
                          </button>
                        </td>
                        <td className="px-5 py-3.5 text-sm text-gray-500">
                          {new Date(country.createdAt).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => openEditCountry(country)}
                              className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteCountry(country.id)}
                              disabled={countryDeleting === country.id}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
                            >
                              {countryDeleting === country.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Country Create/Edit Modal */}
          <AnimatePresence>
            {countryModal && (
              <Modal isOpen={countryModal} onClose={() => setCountryModal(false)}>
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Globe size={18} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{editingCountry ? 'Modifier le pays' : 'Ajouter un pays'}</h3>
                      <p className="text-xs text-gray-400">{editingCountry ? `Modifier ${editingCountry.name}` : 'Configurer un nouveau pays couvert'}</p>
                    </div>
                  </div>
                  <Input
                    label="Nom du pays"
                    value={countryForm.name}
                    onChange={(e) => setCountryForm({ ...countryForm, name: e.target.value })}
                    placeholder="Ex: Sénégal"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type de pays</label>
                    <div className="flex gap-2">
                      {(['residence', 'repatriation'] as const).map((type) => (
                        <button
                          key={type}
                          onClick={() => setCountryForm({ ...countryForm, type })}
                          className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                            countryForm.type === type
                              ? 'border-primary bg-primary/5 text-primary'
                              : 'border-gray-200 text-gray-500 hover:border-gray-300'
                          }`}
                        >
                          {type === 'residence' ? <MapPin size={16} /> : <Plane size={16} />}
                          {type === 'residence' ? 'Résidence' : 'Rapatriement'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setCountryForm({ ...countryForm, isActive: !countryForm.isActive })}>
                      {countryForm.isActive ? <ToggleRight size={28} className="text-primary" /> : <ToggleLeft size={28} className="text-gray-300" />}
                    </button>
                    <span className="text-sm text-gray-700">{countryForm.isActive ? 'Pays actif' : 'Pays inactif'}</span>
                  </div>
                  {countryError && (
                    <div className="flex items-start gap-2 p-3 bg-red-50 rounded-xl border border-red-200">
                      <MapPin size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-red-600">{countryError}</p>
                    </div>
                  )}
                  <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                    <Button variant="ghost" size="sm" onClick={() => { setCountryModal(false); setCountryError(null); }}>Annuler</Button>
                    <Button
                      size="sm"
                      icon={countrySaving ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                      onClick={handleSaveCountry}
                      disabled={countrySaving || !countryForm.name.trim()}
                    >
                      {countrySaving ? 'Enregistrement...' : editingCountry ? 'Modifier' : 'Ajouter'}
                    </Button>
                  </div>
                </div>
              </Modal>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* ==================== MANAGERS TAB ==================== */}
      {activeTab === 'managers' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <Card>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                  <Users size={18} className="text-gold-dark" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Country Managers</h3>
                  <p className="text-xs text-gray-400">{managers.length} gestionnaire{managers.length !== 1 ? 's' : ''} de pays</p>
                </div>
              </div>
              <Button size="sm" icon={<Plus size={14} />} onClick={() => setManagerModal(true)}>
                Ajouter un manager
              </Button>
            </div>
          </Card>

          {managersLoading ? (
            <PageLoader variant="inline" size="sm" label="Chargement des managers..." />
          ) : managers.length === 0 ? (
            <Card>
              <div className="text-center py-10">
                <Users size={36} className="mx-auto text-gray-200 mb-3" />
                <p className="text-sm text-gray-500">Aucun country manager configuré</p>
                <Button size="sm" className="mt-4" icon={<Plus size={14} />} onClick={() => setManagerModal(true)}>
                  Ajouter le premier manager
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {managers.map((manager, i) => (
                <motion.div
                  key={manager.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card hover>
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                        {manager.firstName.charAt(0)}{manager.lastName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{manager.firstName} {manager.lastName}</p>
                        <p className="text-xs text-gray-400 truncate flex items-center gap-1">
                          <Mail size={10} /> {manager.email}
                        </p>
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                          <Phone size={10} /> {manager.phone}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <Badge variant={manager.assignedCountry?.type === 'residence' ? 'primary' : 'warning'} size="sm">
                          {manager.assignedCountry?.type === 'residence' ? 'Résidence' : 'Rapatriement'}
                        </Badge>
                        <span className="text-xs font-medium text-gray-700 capitalize">{manager.assignedCountry?.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {manager.isActive ? (
                          <ShieldCheck size={14} className="text-primary" />
                        ) : (
                          <span className="text-[10px] text-gray-400">Inactif</span>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* Manager Create Modal */}
          <AnimatePresence>
            {managerModal && (
              <Modal isOpen={managerModal} onClose={() => { setManagerModal(false); setManagerError(null); }}>
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                      <Users size={18} className="text-gold-dark" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Ajouter un Country Manager</h3>
                      <p className="text-xs text-gray-400">Créer un compte gestionnaire de pays</p>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      label="Prénom"
                      value={managerForm.firstName}
                      onChange={(e) => setManagerForm({ ...managerForm, firstName: e.target.value })}
                      placeholder="Aminata"
                    />
                    <Input
                      label="Nom"
                      value={managerForm.lastName}
                      onChange={(e) => setManagerForm({ ...managerForm, lastName: e.target.value })}
                      placeholder="Sy"
                    />
                  </div>
                  <Input
                    label="Email"
                    type="email"
                    value={managerForm.email}
                    onChange={(e) => setManagerForm({ ...managerForm, email: e.target.value })}
                    placeholder="aminata@aldiianacare.online"
                  />
                  <Input
                    label="Téléphone"
                    value={managerForm.phone}
                    onChange={(e) => setManagerForm({ ...managerForm, phone: e.target.value })}
                    placeholder="+221 77 123 45 67"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pays assigné <span className="text-xs text-gray-400">(résidence uniquement)</span></label>
                    <select
                      value={managerForm.countryId}
                      onChange={(e) => setManagerForm({ ...managerForm, countryId: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                      <option value="">Sélectionner un pays</option>
                      {residenceCountries.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    {residenceCountries.length === 0 && (
                      <p className="text-xs text-amber-600 mt-1.5">Aucun pays de résidence actif. Ajoutez d&apos;abord un pays de type &quot;Résidence&quot; dans l&apos;onglet Pays.</p>
                    )}
                  </div>
                  {managerError && (
                    <div className="flex items-start gap-2 p-3 bg-red-50 rounded-xl border border-red-200">
                      <ShieldCheck size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-red-600">{managerError}</p>
                    </div>
                  )}
                  <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                    <Button variant="ghost" size="sm" onClick={() => { setManagerModal(false); setManagerError(null); }}>Annuler</Button>
                    <Button
                      size="sm"
                      icon={managerSaving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                      onClick={handleCreateManager}
                      disabled={managerSaving || !managerForm.firstName || !managerForm.email || !managerForm.countryId}
                    >
                      {managerSaving ? 'Création...' : 'Créer le manager'}
                    </Button>
                  </div>
                </div>
              </Modal>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
