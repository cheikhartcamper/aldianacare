import { useState, useCallback, useRef, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, FileText, LogOut, Menu, X, Globe, ChevronDown, Bell, UserCircle,
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

export function CountryManagerLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const avatarUrls = getImageUrls(user?.identityPhotoPath);
  const triedFallback = useRef(false);

  const currentPage = pageNames[location.pathname] ?? 'Country Manager';

  const onAvatarError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    if (avatarUrls && !triedFallback.current) {
      triedFallback.current = true;
      (e.target as HTMLImageElement).src = avatarUrls[1];
    }
  }, [avatarUrls]);

  const handleLogout = () => {
    console.log('CountryManager handleLogout called');
    logout();
    navigate('/connexion');
  };

  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [dropdownOpen]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const AvatarBlock = ({ size = 8, textSize = 'text-xs' }: { size?: number; textSize?: string }) => (
    <div
      className="rounded-full bg-emerald-100 overflow-hidden flex items-center justify-center flex-shrink-0"
      style={{ width: `${size * 4}px`, height: `${size * 4}px` }}
    >
      {avatarUrls ? (
        <img src={avatarUrls[0]} alt="avatar" className="w-full h-full object-cover" onError={onAvatarError} />
      ) : (
        <span className={`font-bold text-emerald-600 ${textSize}`}>
          {user?.firstName?.[0]}{user?.lastName?.[0]}
        </span>
      )}
    </div>
  );

  const SidebarInner = ({ onNav }: { onNav?: () => void }) => (
    <div className="flex flex-col h-full">
      {/* ── Sidebar header ── */}
      <div className="h-16 flex items-center px-4 border-b border-gray-100 flex-shrink-0 gap-3">
        <Logo size="sm" showText={false} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900 leading-none">Aldiana Care</p>
          <div className="flex items-center gap-1 mt-1">
            <Globe size={9} className="text-emerald-600 flex-shrink-0" />
            <span className="text-[10px] font-semibold text-emerald-600 leading-none">Country Manager</span>
          </div>
        </div>
      </div>

      {/* ── User card ── */}
      {user && (
        <div className="mx-3 mt-3 mb-1 p-3 rounded-xl bg-gradient-to-br from-emerald-50 to-transparent border border-emerald-100/60">
          <div className="flex items-center gap-2.5">
            <AvatarBlock size={9} textSize="text-xs" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-800 truncate">{user.firstName} {user.lastName}</p>
              <p className="text-[10px] text-emerald-600 font-medium truncate">{user.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Nav ── */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {cmLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.path === '/country-manager'}
            onClick={onNav}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary text-white shadow-sm shadow-primary/20'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="cm-sidebar-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-white/50 rounded-r-full"
                  />
                )}
                <link.icon size={16} className={isActive ? 'text-white/90' : 'text-gray-400'} />
                <span className="truncate">{link.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Logout ── */}
      <div className="p-3 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors w-full group"
        >
          <LogOut size={16} className="group-hover:translate-x-0.5 transition-transform" />
          Déconnexion
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 shadow-sm flex-shrink-0">
        <SidebarInner />
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed left-0 top-0 h-full w-64 bg-white shadow-2xl z-50 lg:hidden"
            >
              <div className="absolute top-3.5 right-3.5 z-10">
                <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
                  <X size={16} />
                </button>
              </div>
              <SidebarInner onNav={() => setSidebarOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* ── Header ── */}
        <header className="h-16 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 lg:px-6 flex items-center justify-between flex-shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <Menu size={20} />
            </button>
            <div>
              <p className="text-sm font-bold text-gray-900 leading-tight">{currentPage}</p>
              <p className="text-[10px] text-gray-400 leading-none mt-0.5 hidden lg:block">Espace Country Manager</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell size={18} />
            </button>

            <div className="relative ml-1" ref={profileRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <AvatarBlock size={8} textSize="text-xs" />
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-gray-800 leading-tight truncate max-w-[110px]">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-[10px] text-emerald-600 font-medium">Country Manager</p>
                </div>
                <ChevronDown
                  size={13}
                  className={`text-gray-400 hidden sm:block transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.97 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl shadow-gray-200/70 border border-gray-100 overflow-hidden z-50"
                  >
                    <div className="px-4 py-3.5 bg-gradient-to-br from-emerald-50/80 to-transparent border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <AvatarBlock size={9} textSize="text-sm" />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">{user?.firstName} {user?.lastName}</p>
                          <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                          <span className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded-md bg-emerald-100 border border-emerald-200/60">
                            <Globe size={9} className="text-emerald-600" />
                            <span className="text-[9px] font-semibold text-emerald-700">Country Manager</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="py-1.5">
                      <NavLink
                        to="/country-manager/profil"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <UserCircle size={14} className="text-gray-400" /> Mon profil
                      </NavLink>
                      <div className="mx-3 my-1 h-px bg-gray-100" />
                      <button
                        onClick={() => { setDropdownOpen(false); handleLogout(); }}
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
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
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
