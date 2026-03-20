import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Eye, MapPin, Calendar, Phone, User, AlertTriangle,
  ChevronLeft, ChevronRight, Plane, FileText, Download,
  CheckCircle, RefreshCw
} from 'lucide-react';
import { Card, Badge, Button, Input, Modal, PageLoader } from '@/components/ui';
import { adminService, type Declaration } from '@/services/admin.service';
import { getImageUrl } from '@/lib/imageUrl';

export function AdminDeathCasesPage() {
  const [cases, setCases] = useState<Declaration[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0 });
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Declaration | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCases = useCallback(async (showLoader = true) => {
    if (showLoader) setLoading(true);
    else setRefreshing(true);
    try {
      const res = await adminService.getDeclarations({ status: 'approved', page, limit: 15 });
      if (res.success) {
        setCases(res.data.declarations);
        setPagination({ total: res.data.pagination.total, totalPages: res.data.pagination.totalPages });
      }
    } catch { setCases([]); }
    setLoading(false);
    setRefreshing(false);
  }, [page]);

  useEffect(() => { fetchCases(); }, [fetchCases]);

  const filteredCases = cases.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.declarationNumber?.toLowerCase().includes(q) ||
      c.deceased?.firstName?.toLowerCase().includes(q) ||
      c.deceased?.lastName?.toLowerCase().includes(q) ||
      c.deathPlace?.toLowerCase().includes(q) ||
      c.deceased?.repatriationCountry?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'easeOut' as const }}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dossiers de décès</h1>
            <p className="text-sm text-gray-500 mt-1">
              {pagination.total} dossier{pagination.total !== 1 ? 's' : ''} approuvé{pagination.total !== 1 ? 's' : ''} — rapatriements en cours
            </p>
          </div>
          <Button
            size="sm"
            variant="ghost"
            icon={<RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />}
            onClick={() => fetchCases(false)}
            disabled={refreshing}
          >
            Actualiser
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <CheckCircle size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Dossiers approuvés</p>
                <p className="text-2xl font-bold text-gray-900">{loading ? '—' : pagination.total}</p>
              </div>
            </div>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                <Plane size={18} className="text-gold-dark" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Rapatriements</p>
                <p className="text-2xl font-bold text-gray-900">{loading ? '—' : cases.filter(c => c.deceased?.repatriationCountry).length}</p>
              </div>
            </div>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Avec certificats</p>
                <p className="text-2xl font-bold text-gray-900">{loading ? '—' : cases.filter(c => c.deathCertificatePath).length}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Search */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <div className="w-full sm:w-80">
            <Input
              placeholder="Rechercher (nº, nom, pays, lieu...)"
              icon={<Search size={14} />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </Card>
      </motion.div>

      {/* Cases List */}
      {loading ? (
        <PageLoader variant="inline" size="sm" label="Chargement des dossiers..." />
      ) : filteredCases.length === 0 ? (
        <Card>
          <div className="text-center py-14">
            <AlertTriangle size={40} className="mx-auto text-gray-200 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun dossier</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              Les dossiers de décès approuvés apparaîtront ici une fois les déclarations validées.
            </p>
          </div>
        </Card>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCases.map((decl, i) => (
              <motion.div
                key={decl.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Card hover className="cursor-pointer" onClick={() => setSelected(decl)}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                        {decl.deceased?.firstName?.charAt(0)}{decl.deceased?.lastName?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{decl.deceased?.firstName} {decl.deceased?.lastName}</p>
                        <p className="text-[10px] text-gray-400 font-mono">{decl.declarationNumber}</p>
                      </div>
                    </div>
                    <Badge variant="success" size="sm" dot>Approuvé</Badge>
                  </div>

                  <div className="space-y-2 text-xs text-gray-500">
                    <p className="flex items-center gap-1.5">
                      <Calendar size={12} className="text-gray-400" />
                      Décès le {new Date(decl.deathDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <MapPin size={12} className="text-gray-400" />
                      {decl.deathPlace}
                    </p>
                    {decl.deceased?.repatriationCountry && (
                      <p className="flex items-center gap-1.5">
                        <Plane size={12} className="text-gold-dark" />
                        <span className="text-gold-dark font-medium capitalize">Rapatriement → {decl.deceased.repatriationCountry}</span>
                      </p>
                    )}
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-[10px] text-gray-400">
                      Déclarant: {decl.declarantFirstName} {decl.declarantLastName}
                    </p>
                    <button className="p-1 rounded-lg hover:bg-primary/10 text-primary">
                      <Eye size={14} />
                    </button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-xs text-gray-400">Page {page}/{pagination.totalPages}</p>
              <div className="flex gap-1">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30"><ChevronLeft size={16} /></button>
                <button onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages} className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30"><ChevronRight size={16} /></button>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Detail Modal */}
      {selected && (
        <Modal isOpen={!!selected} onClose={() => setSelected(null)} size="lg">
          <div className="space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Dossier {selected.declarationNumber}</h2>
                <p className="text-xs text-gray-400">Approuvé le {new Date(selected.updatedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
              <Badge variant="success" dot>Approuvé</Badge>
            </div>

            <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
              <h3 className="text-xs font-semibold text-primary uppercase mb-3 flex items-center gap-2">
                <User size={14} /> Défunt
              </h3>
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-gray-400">Nom complet</p>
                  <p className="font-semibold text-gray-900">{selected.deceased?.firstName} {selected.deceased?.lastName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Pays de rapatriement</p>
                  <p className="font-medium text-gold-dark capitalize flex items-center gap-1"><Plane size={12} /> {selected.deceased?.repatriationCountry || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Date du décès</p>
                  <p className="text-gray-700">{new Date(selected.deathDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Lieu du décès</p>
                  <p className="text-gray-700 flex items-center gap-1"><MapPin size={12} /> {selected.deathPlace}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gold/5 rounded-xl border border-gold/10">
              <h3 className="text-xs font-semibold text-gold-dark uppercase mb-3 flex items-center gap-2">
                <Phone size={14} /> Déclarant
              </h3>
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-gray-400">Nom</p>
                  <p className="font-semibold text-gray-900">{selected.declarantFirstName} {selected.declarantLastName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Téléphone</p>
                  <p className="text-gray-700">{selected.declarantPhone}</p>
                </div>
              </div>
            </div>

            {(selected.deathCertificatePath || selected.deathTypeCertificatePath) && (
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="text-xs font-semibold text-gray-600 uppercase mb-3 flex items-center gap-2">
                  <FileText size={14} /> Documents
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {selected.deathCertificatePath && (
                    <a href={getImageUrl(selected.deathCertificatePath) ?? ''} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-white rounded-lg border hover:border-primary/30 hover:bg-primary/5 transition-colors group">
                      <Download size={16} className="text-primary" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 group-hover:text-primary">Certificat de décès</p>
                        <p className="text-[10px] text-gray-400">Cliquer pour ouvrir</p>
                      </div>
                    </a>
                  )}
                  {selected.deathTypeCertificatePath && (
                    <a href={getImageUrl(selected.deathTypeCertificatePath) ?? ''} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-white rounded-lg border hover:border-primary/30 hover:bg-primary/5 transition-colors group">
                      <Download size={16} className="text-gold-dark" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 group-hover:text-primary">Certificat genre de décès</p>
                        <p className="text-[10px] text-gray-400">Cliquer pour ouvrir</p>
                      </div>
                    </a>
                  )}
                </div>
              </div>
            )}

            {selected.additionalInfo && (
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-400 mb-1">Informations supplémentaires</p>
                <p className="text-sm text-gray-700">{selected.additionalInfo}</p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
