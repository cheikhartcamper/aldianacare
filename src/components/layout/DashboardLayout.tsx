import { Link, Outlet, useLocation } from 'react-router-dom';
import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FileText, CreditCard, Gift, HeadphonesIcon,
  Bell, Settings, LogOut, Menu, X, ChevronDown, Shield, Heart,
  FolderOpen, User, Users
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Badge, Logo } from '@/components/ui';
import { getImageUrls } from '@/lib/imageUrl';

const mainLinks = [
  { label: 'Tableau de bord', path: '/app', icon: LayoutDashboard },
  { label: 'Mon contrat', path: '/app/contrat', icon: FileText },
  { label: 'Nos offres', path: '/app/offres', icon: Shield },
  { label: 'Paiements', path: '/app/paiements', icon: CreditCard },
  { label: 'Documents', path: '/app/documents', icon: FolderOpen },
];

const secondaryLinks = [
  { label: 'Personne de confiance', path: '/app/personne-confiance', icon: Heart },
  { label: 'Famille', path: '/app/famille', icon: Users },
  { label: 'Parrainage', path: '/app/parrainage', icon: Gift },
  { label: 'Support', path: '/app/support', icon: HeadphonesIcon },
];

function NavLink({ link, isActive, onClick }: { link: { label: string; path: string; icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }> }; isActive: boolean; onClick?: () => void }) {
  return (
    <Link
      to={link.path}
      onClick={onClick}
      className={`group relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
        isActive
          ? 'bg-white/15 text-white font-medium'
          : 'text-white/55 hover:bg-white/8 hover:text-white/85'
      }`}
    >
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-gold rounded-r-full" />
      )}
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
        isActive ? 'bg-white/10' : 'bg-transparent group-hover:bg-white/5'
      }`}>
        <link.icon size={16} strokeWidth={1.8} />
      </div>
      <span className="truncate">{link.label}</span>
    </Link>
  );
}

function SidebarContent({ location, onLinkClick }: { location: { pathname: string }; onLinkClick?: () => void }) {
  const visibleSecondaryLinks = secondaryLinks;
  
  return (
    <>
      <div className="px-5 pt-3 pb-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/30">Menu</p>
      </div>
      <nav className="px-2 space-y-0.5">
        {mainLinks.map((link) => (
          <NavLink
            key={link.path}
            link={link}
            isActive={location.pathname === link.path}
            onClick={onLinkClick}
          />
        ))}
      </nav>

      <div className="mx-4 my-3 border-t border-white/10" />

      <div className="px-5 pb-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/30">Services</p>
      </div>
      <nav className="px-2 space-y-0.5">
        {visibleSecondaryLinks.map((link) => (
          <NavLink
            key={link.path}
            link={link}
            isActive={location.pathname === link.path}
            onClick={onLinkClick}
          />
        ))}
      </nav>
    </>
  );
}

export function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const triedFallback = useRef(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { user, logout } = useAuth();
  const avatarUrls = getImageUrls(user?.identityPhotoPath);

  const onAvatarError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    if (avatarUrls && !triedFallback.current) {
      triedFallback.current = true;
      (e.target as HTMLImageElement).src = avatarUrls[1];
    } else {
      setAvatarError(true);
    }
  }, [avatarUrls]);

  const showAvatar = !!avatarUrls && !avatarError;
  const displayName = user ? `${user.firstName} ${user.lastName}` : 'Utilisateur';
  const shortName = user ? `${user.firstName} ${user.lastName.charAt(0)}.` : '';
  const planLabel = user?.planType === 'family' ? 'Familial' : 'Individuel';

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
    <div className="min-h-screen bg-surface-secondary flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-[260px] bg-gradient-to-b from-[#0a4f37] to-[#0d6b49] flex-shrink-0">
        <div className="h-16 flex items-center px-5 border-b border-white/10">
          <Link to="/app">
            <Logo size="sm" variant="white" />
          </Link>
        </div>

        <div className="mx-3 mt-4 mb-2 p-3 rounded-xl bg-white/8 border border-white/10">
          <div className="flex items-center gap-3">
            {showAvatar ? (
              <img src={avatarUrls![0]} alt="" className="w-9 h-9 rounded-full object-cover border-2 border-white/20 flex-shrink-0" onError={onAvatarError} />
            ) : (
              <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
                <User size={16} className="text-white" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-white truncate">{displayName}</p>
              <p className="text-[11px] text-white/40 font-medium">{planLabel}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto mt-2">
          <SidebarContent location={location} />
        </div>

        <div className="p-2 mt-auto border-t border-white/10">
          <Link
            to="/app/parametres"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
              location.pathname === '/app/parametres'
                ? 'bg-white/15 text-white font-medium'
                : 'text-white/50 hover:bg-white/8 hover:text-white/80'
            }`}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <Settings size={16} strokeWidth={1.8} />
            </div>
            <span>Paramètres</span>
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/35 hover:bg-red-500/15 hover:text-red-300 transition-all duration-200"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <LogOut size={16} strokeWidth={1.8} />
            </div>
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
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
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed left-0 top-0 bottom-0 w-[280px] bg-gradient-to-b from-[#0a4f37] to-[#0d6b49] z-50 lg:hidden flex flex-col"
            >
              <div className="h-16 flex items-center justify-between px-5 border-b border-white/10">
                <Link to="/app">
                  <Logo size="sm" variant="white" />
                </Link>
                <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg hover:bg-white/10 text-white/60 transition-colors">
                  <X size={18} />
                </button>
              </div>

              <div className="mx-3 mt-4 mb-2 p-3 rounded-xl bg-white/8 border border-white/10">
                <div className="flex items-center gap-3">
                  {showAvatar ? (
                    <img src={avatarUrls![0]} alt="" className="w-9 h-9 rounded-full object-cover border-2 border-white/20" onError={onAvatarError} />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
                      <User size={16} className="text-white" />
                    </div>
                  )}
                  <div>
                    <p className="text-[13px] font-semibold text-white">{displayName}</p>
                    <p className="text-[11px] text-white/40 font-medium">{planLabel}</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto mt-2">
                <SidebarContent location={location} onLinkClick={() => setMobileOpen(false)} />
              </div>

              <div className="p-2 border-t border-white/10">
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/35 hover:bg-red-500/15 hover:text-red-300 transition-all"
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                    <LogOut size={16} />
                  </div>
                  <span>Déconnexion</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white/95 backdrop-blur-sm border-b border-gray-100 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors" onClick={() => setMobileOpen(true)}>
              <Menu size={20} />
            </button>
            <p className="text-sm text-gray-500 hidden sm:block">
              Bienvenue, <span className="text-gray-900 font-semibold">{displayName}</span>
            </p>
          </div>

          <div className="flex items-center gap-1">
            <Link
              to="/app/notifications"
              className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Bell size={18} />
            </Link>

            <div className="relative ml-1" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-gray-100 transition-colors"
              >
                {showAvatar ? (
                  <img src={avatarUrls![0]} alt="" className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/20" onError={onAvatarError} />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-primary/10">
                    <User size={15} className="text-primary" />
                  </div>
                )}
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-gray-900 leading-tight">{shortName}</p>
                  <p className="text-[10px] text-gray-400">{planLabel}</p>
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
                    className="absolute right-0 top-full mt-2 w-60 bg-white rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100 overflow-hidden z-50"
                  >
                    <div className="px-4 py-3.5 bg-gradient-to-br from-primary/5 to-transparent border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        {showAvatar ? (
                          <img src={avatarUrls![0]} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" onError={onAvatarError} />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <User size={18} className="text-primary" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{displayName}</p>
                          <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                          <Badge variant="primary" size="sm" className="mt-1">{planLabel}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="py-1.5">
                      <Link
                        to="/app/parametres"
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

        {/* Page content with smooth transitions */}
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
