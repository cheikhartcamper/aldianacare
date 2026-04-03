import { Link, Outlet, useLocation, useNavigate, NavLink } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, ClipboardList, CreditCard, FileWarning,
  Gift, BarChart3, Settings, LogOut, Menu, X, Bell, ChevronDown,
  HeartPulse, Scroll, FolderOpen
} from 'lucide-react';
import { Logo } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { adminService } from '@/services/admin.service';

const adminLinks = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, available: true },
  { label: 'Inscriptions', path: '/admin/inscriptions', icon: ClipboardList, available: true },
  { label: 'Déclarations', path: '/admin/declarations', icon: FileWarning, available: true },
  { label: 'Utilisateurs', path: '/admin/utilisateurs', icon: Users, available: true },
  { label: 'Paramètres', path: '/admin/parametres', icon: Settings, available: true },
  { label: 'Contrats', path: '/admin/contrats', icon: Scroll, available: true },
  { label: 'Paiements', path: '/admin/paiements', icon: CreditCard, available: true },
  { label: 'Dossiers décès', path: '/admin/dossiers-deces', icon: FolderOpen, available: true },
  { label: 'Commissions', path: '/admin/commissions', icon: Gift, available: true },
  { label: 'Analytics', path: '/admin/analytics', icon: BarChart3, available: true },
  { label: 'Décl. santé', path: '/admin/declarations-sante', icon: HeartPulse, available: true },
];

const pageNames: Record<string, string> = {
  '/admin': 'Tableau de bord',
  '/admin/inscriptions': 'Inscriptions',
  '/admin/declarations': 'Déclarations',
  '/admin/utilisateurs': 'Utilisateurs',
  '/admin/parametres': 'Paramètres',
  '/admin/contrats': 'Contrats',
  '/admin/paiements': 'Paiements',
  '/admin/dossiers-deces': 'Dossiers décès',
  '/admin/commissions': 'Commissions',
  '/admin/analytics': 'Analytics',
  '/admin/declarations-sante': 'Déclarations de santé',
};

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const profileRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => { logout(); navigate('/'); };

  const currentPage = pageNames[location.pathname] ?? 'Administration';
  const initials = user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : 'AD';

  useEffect(() => {
    adminService.getRegistrations({ status: 'pending', limit: 1 })
      .then(res => { if (res.success) setPendingCount(res.data.pagination.total); })
      .catch(() => {});
  }, [location.pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!profileOpen) return;
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [profileOpen]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-gradient-to-b from-gray-900 to-[#0f172a] text-gray-300 transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/5">
          {sidebarOpen && (
            <div className="flex items-center gap-2.5">
              <Logo size="sm" variant="white" showText={false} />
              <div>
                <span className="font-bold text-white text-sm">Aldiana Care</span>
                <span className="block text-[10px] text-gray-500">Administration</span>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-white/8 text-gray-500 hover:text-gray-300 transition-colors"
          >
            <Menu size={18} />
          </button>
        </div>

        {sidebarOpen && user && (
          <div className="mx-3 mt-4 mb-2 p-3 rounded-xl bg-white/6 border border-white/8">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">{user.firstName} {user.lastName}</p>
                <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 py-3 px-3 space-y-0.5 overflow-y-auto">
          {adminLinks.map((link) => {
            const isActive = location.pathname === link.path;
            if (!link.available) {
              return (
                <div
                  key={link.path}
                  className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 cursor-not-allowed opacity-40"
                  title={!sidebarOpen ? `${link.label} (bientôt)` : undefined}
                >
                  <link.icon size={17} />
                  {sidebarOpen && (
                    <>
                      <span>{link.label}</span>
                      <span className="ml-auto text-[10px] bg-gray-800 px-1.5 py-0.5 rounded">Bientôt</span>
                    </>
                  )}
                </div>
              );
            }
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-white/12 text-white'
                    : 'text-gray-400 hover:bg-white/6 hover:text-gray-200'
                }`}
                title={!sidebarOpen ? link.label : undefined}
              >
                {isActive && (
                  <motion.div
                    layoutId="admin-sidebar-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full"
                  />
                )}
                <link.icon size={17} className={isActive ? 'text-white' : 'text-gray-500'} />
                {sidebarOpen && <span>{link.label}</span>}
                {sidebarOpen && link.path === '/admin/inscriptions' && pendingCount > 0 && (
                  <span className="ml-auto min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold bg-amber-500 text-white rounded-full px-1">
                    {pendingCount > 99 ? '99+' : pendingCount}
                  </span>
                )}
                {!sidebarOpen && link.path === '/admin/inscriptions' && pendingCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-red-500/10 hover:text-red-400 font-medium transition-colors"
            title={!sidebarOpen ? 'Déconnexion' : undefined}
          >
            <LogOut size={17} />
            {sidebarOpen && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-gradient-to-b from-gray-900 to-[#0f172a] z-50 lg:hidden flex flex-col"
            >
              <div className="h-16 flex items-center justify-between px-4 border-b border-white/5">
                <div className="flex items-center gap-2.5">
                  <Logo size="sm" variant="white" showText={false} />
                  <div>
                    <span className="font-bold text-white text-sm">Aldiana Care</span>
                    <span className="block text-[10px] text-gray-500">Administration</span>
                  </div>
                </div>
                <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg hover:bg-white/8 text-gray-500 transition-colors">
                  <X size={18} />
                </button>
              </div>
              <nav className="flex-1 py-3 px-3 space-y-0.5 overflow-y-auto">
                {adminLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  if (!link.available) {
                    return (
                      <div key={link.path} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 cursor-not-allowed opacity-40">
                        <link.icon size={17} />
                        <span>{link.label}</span>
                        <span className="ml-auto text-[10px] bg-gray-800 px-1.5 py-0.5 rounded">Bientôt</span>
                      </div>
                    );
                  }
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileOpen(false)}
                      className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive ? 'bg-white/12 text-white' : 'text-gray-400 hover:bg-white/6 hover:text-gray-200'
                      }`}
                    >
                      {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full" />}
                      <link.icon size={17} className={isActive ? 'text-white' : 'text-gray-500'} />
                      <span>{link.label}</span>
                      {link.path === '/admin/inscriptions' && pendingCount > 0 && (
                        <span className="ml-auto min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold bg-amber-500 text-white rounded-full px-1">
                          {pendingCount > 99 ? '99+' : pendingCount}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
              <div className="p-3 border-t border-white/5">
                <button
                  onClick={() => { setMobileOpen(false); handleLogout(); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-red-500/10 hover:text-red-400 font-medium transition-colors"
                >
                  <LogOut size={17} />
                  <span>Déconnexion</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white/95 backdrop-blur-sm border-b border-gray-200/70 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors" onClick={() => setMobileOpen(true)}>
              <Menu size={20} />
            </button>
            <div>
              <p className="text-sm font-semibold text-gray-900">{currentPage}</p>
              <p className="text-[10px] text-gray-400 hidden sm:block">Aldiana Care — Administration</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <NavLink to="/admin/inscriptions" className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell size={18} />
              {pendingCount > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-[16px] h-[16px] flex items-center justify-center text-[9px] font-bold bg-amber-500 text-white rounded-full px-0.5 leading-none">
                  {pendingCount > 9 ? '9+' : pendingCount}
                </span>
              )}
            </NavLink>
            <div className="relative ml-1" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center text-white text-xs font-bold">
                  {initials}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-gray-900 leading-tight">{user?.firstName} {user?.lastName}</p>
                  <p className="text-[10px] text-gray-400">Administrateur</p>
                </div>
                <ChevronDown
                  size={14}
                  className={`text-gray-400 hidden sm:block transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`}
                />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.97 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100 overflow-hidden z-50"
                  >
                    <div className="px-4 py-3.5 bg-gradient-to-br from-gray-50 to-transparent border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gray-900 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{user?.firstName} {user?.lastName}</p>
                          <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="py-1.5">
                      <Link
                        to="/admin/parametres"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        <Settings size={14} className="text-gray-400" /> Paramètres
                      </Link>
                      <div className="mx-3 my-1 border-t border-gray-100" />
                      <button
                        onClick={() => { setProfileOpen(false); logout(); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={14} className="text-red-400" /> Déconnexion
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
