import { useState, useCallback, useRef, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, FileText, LogOut, Menu, X, Globe,
  ChevronDown, Bell, UserCircle,
} from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { useAuth } from '@/contexts/AuthContext';
import { getImageUrls } from '@/lib/imageUrl';

const cmLinks = [
  { label: 'Tableau de bord', path: '/country-manager', icon: LayoutDashboard },
  { label: 'Assurés', path: '/country-manager/assures', icon: Users },
  { label: 'Déclarations', path: '/country-manager/declarations', icon: FileText },
  { label: 'Mon profil', path: '/country-manager/profil', icon: UserCircle },
];

const pageNames: Record<string, string> = {
  '/country-manager': 'Tableau de bord',
  '/country-manager/assures': 'Assurés',
  '/country-manager/declarations': 'Déclarations',
  '/country-manager/profil': 'Mon profil',
};

const SIDEBAR_BG = 'from-[#0a4f37] to-[#0d6b49]';

function NavItem({
  link,
  isActive,
  onClick,
}: {
  link: { label: string; path: string; icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }> };
  isActive: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      to={link.path}
      onClick={onClick}
      className={`group relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
        isActive ? 'bg-white/15 text-white font-medium' : 'text-white/55 hover:bg-white/8 hover:text-white/85'
      }`}
    >
      {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-gold rounded-r-full" />}
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
        isActive ? 'bg-white/10' : 'bg-transparent group-hover:bg-white/5'
      }`}>
        <link.icon size={16} strokeWidth={1.8} />
      </div>
      <span className="truncate">{link.label}</span>
    </Link>
  );
}

export function CountryManagerLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const triedFallback = useRef(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const avatarUrls = getImageUrls(user?.identityPhotoPath);

  const currentPage = pageNames[location.pathname] ?? 'Country Manager';
  const displayName = user ? `${user.firstName} ${user.lastName}` : '';
  const showAvatar = !!avatarUrls && !avatarError;

  const handleLogout = () => { logout(); navigate('/'); };

  const onAvatarError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    if (avatarUrls && !triedFallback.current) {
      triedFallback.current = true;
      (e.target as HTMLImageElement).src = avatarUrls[1];
    } else {
      setAvatarError(true);
    }
  }, [avatarUrls]);

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

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const UserCard = ({ borderColor = 'border-[#0a4f37]' }: { borderColor?: string }) => (
    <div className="mx-3 mt-4 mb-2 p-3 rounded-xl bg-white/8 border border-white/10">
      <div className="flex items-center gap-3">
        <div className="relative flex-shrink-0">
          {showAvatar ? (
            <img src={avatarUrls![0]} alt="" className="w-9 h-9 rounded-full object-cover border-2 border-white/20" onError={onAvatarError} />
          ) : (
            <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
              <UserCircle size={16} className="text-white" />
            </div>
          )}
          <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 bg-emerald-400 ${borderColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-white truncate">{displayName}</p>
          <div className="flex items-center gap-1 mt-0.5">
            <Globe size={9} className="text-white/40 flex-shrink-0" />
            <p className="text-[11px] text-white/40 font-medium truncate">Country Manager</p>
          </div>
        </div>
      </div>
    </div>
  );

  const SidebarNav = ({ onNav }: { onNav?: () => void }) => (
    <>
      <div className="px-5 pt-3 pb-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/30">Menu</p>
      </div>
      <nav className="px-2 space-y-0.5">
        {cmLinks.map((link) => (
          <NavItem
            key={link.path}
            link={link}
            isActive={link.path === '/country-manager' ? location.pathname === link.path : location.pathname.startsWith(link.path)}
            onClick={onNav}
          />
        ))}
      </nav>
    </>
  );

  return (
    <div className="min-h-screen bg-surface-secondary flex">
      {/* ── Desktop sidebar ── */}
      <aside className={`hidden lg:flex flex-col w-[260px] bg-gradient-to-b ${SIDEBAR_BG} flex-shrink-0`}>
        <div className="h-16 flex items-center px-5 border-b border-white/10">
          <Link to="/country-manager">
            <Logo size="sm" variant="white" />
          </Link>
        </div>

        <UserCard />

        <div className="flex-1 overflow-y-auto mt-2">
          <SidebarNav />
        </div>

        <div className="p-2 mt-auto border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/35 hover:bg-red-500/15 hover:text-red-300 transition-all duration-200"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <LogOut size={16} strokeWidth={1.8} />
            </div>
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* ── Mobile sidebar overlay ── */}
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
              className={`fixed left-0 top-0 bottom-0 w-[280px] bg-gradient-to-b ${SIDEBAR_BG} z-50 lg:hidden flex flex-col`}
            >
              <div className="h-16 flex items-center justify-between px-5 border-b border-white/10">
                <Link to="/country-manager">
                  <Logo size="sm" variant="white" />
                </Link>
                <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg hover:bg-white/10 text-white/60 transition-colors">
                  <X size={18} />
                </button>
              </div>

              <UserCard borderColor="border-[#0a4f37]" />

              <div className="flex-1 overflow-y-auto mt-2">
                <SidebarNav onNav={() => setMobileOpen(false)} />
              </div>

              <div className="p-2 border-t border-white/10">
                <button
                  onClick={handleLogout}
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

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white/95 backdrop-blur-sm border-b border-gray-100 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors" onClick={() => setMobileOpen(true)}>
              <Menu size={20} />
            </button>
            <div className="hidden sm:block">
              <h2 className="text-sm font-semibold text-gray-900">{currentPage}</h2>
              <p className="text-[10px] text-gray-400">Espace Country Manager</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell size={18} />
            </button>

            <div className="relative ml-1" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-gray-100 transition-colors"
              >
                {showAvatar ? (
                  <img src={avatarUrls![0]} alt="" className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/20" onError={onAvatarError} />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-primary/10">
                    <UserCircle size={15} className="text-primary" />
                  </div>
                )}
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-gray-900 leading-tight truncate max-w-[110px]">{displayName}</p>
                  <p className="text-[10px] text-emerald-600 font-medium">Country Manager</p>
                </div>
                <ChevronDown size={13} className={`text-gray-400 hidden sm:block transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
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
                            <UserCircle size={18} className="text-primary" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{displayName}</p>
                          <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                          <span className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-[9px] font-semibold">
                            <Globe size={9} /> Country Manager
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="py-1.5">
                      <Link
                        to="/country-manager/profil"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        <UserCircle size={14} className="text-gray-400" /> Mon profil
                      </Link>
                      <div className="mx-3 my-1 border-t border-gray-100" />
                      <button
                        onClick={() => { setProfileOpen(false); handleLogout(); }}
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

        {/* Page content */}
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
