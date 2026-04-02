import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FolderOpen, Plane, Users, MessageCircle,
  Bell, Settings, LogOut, Menu, X, ChevronDown,
  LifeBuoy, Search, User
} from 'lucide-react';
import { Logo } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';

const mainLinks = [
  { label: 'Tableau de bord', path: '/assistance', icon: LayoutDashboard },
  { label: 'Dossiers', path: '/assistance/dossiers', icon: FolderOpen },
  { label: 'Rapatriements', path: '/assistance/rapatriements', icon: Plane },
  { label: 'Country Managers', path: '/assistance/managers', icon: Users },
  { label: 'Messages', path: '/assistance/messages', icon: MessageCircle },
];

const bottomLinks = [
  { label: 'Paramètres', path: '/assistance/parametres', icon: Settings },
];

function NavLink({ link, isActive, onClick }: { link: { label: string; path: string; icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }> }; isActive: boolean; onClick?: () => void }) {
  return (
    <Link
      to={link.path}
      onClick={onClick}
      className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
        isActive
          ? 'bg-white/15 text-white font-medium shadow-sm'
          : 'text-white/50 hover:bg-white/8 hover:text-white/80'
      }`}
    >
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-gold rounded-r-full" />
      )}
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
        isActive ? 'bg-white/10' : 'bg-transparent group-hover:bg-white/5'
      }`}>
        <link.icon size={17} strokeWidth={1.8} />
      </div>
      <span className="truncate">{link.label}</span>
    </Link>
  );
}

function SidebarContent({ location, onLinkClick }: { location: { pathname: string }; onLinkClick?: () => void }) {
  return (
    <>
      <div className="px-5 pt-4 pb-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/25">Navigation</p>
      </div>
      <nav className="px-3 space-y-1">
        {mainLinks.map((link) => (
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

export function AssistanceLayout() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleLogout = () => { logout(); navigate('/'); };
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-surface-secondary flex">
      {/* Desktop Sidebar — dark navy blue, distinct from client green */}
      <aside className="hidden lg:flex flex-col w-[270px] bg-gradient-to-b from-[#1a1f3d] to-[#232950] flex-shrink-0">
        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-white/10">
          <Link to="/assistance">
            <Logo size="sm" variant="white" />
          </Link>
        </div>

        {/* Assistance badge — gold accent */}
        <div className="mx-3 mt-4 mb-1 px-3 py-2 rounded-lg bg-gold/10 border border-gold/20">
          <div className="flex items-center gap-2">
            <LifeBuoy size={15} className="text-gold" />
            <p className="text-xs font-bold text-gold">Centre d'Assistance</p>
          </div>
        </div>

        {/* Agent card */}
        <div className="mx-3 mt-3 mb-2 p-3 rounded-xl bg-white/5 border border-white/8">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <User size={18} className="text-primary-light" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#232950]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-white truncate">Agent Assistance</p>
              <p className="text-[11px] text-primary-light/70 font-medium">En ligne</p>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <div className="flex-1 overflow-y-auto mt-2">
          <SidebarContent location={location} />
        </div>

        {/* Bottom section */}
        <div className="p-3 mt-auto border-t border-white/10">
          {bottomLinks.map((link) => (
            <NavLink key={link.path} link={link} isActive={location.pathname === link.path} />
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/30 hover:bg-red-500/15 hover:text-red-400 transition-all mt-1 w-full"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <LogOut size={17} strokeWidth={1.8} />
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
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 bottom-0 w-[280px] bg-gradient-to-b from-[#1a1f3d] to-[#232950] z-50 lg:hidden flex flex-col"
            >
              <div className="h-16 flex items-center justify-between px-5 border-b border-white/10">
                <Link to="/assistance">
                  <Logo size="sm" variant="white" />
                </Link>
                <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg hover:bg-white/10 text-white/60">
                  <X size={18} />
                </button>
              </div>

              <div className="mx-3 mt-4 mb-1 px-3 py-2 rounded-lg bg-gold/10 border border-gold/20">
                <div className="flex items-center gap-2">
                  <LifeBuoy size={15} className="text-gold" />
                  <p className="text-xs font-bold text-gold">Centre d'Assistance</p>
                </div>
              </div>

              <div className="mx-3 mt-3 mb-2 p-3 rounded-xl bg-white/5 border border-white/8">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <User size={18} className="text-primary-light" />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#232950]" />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-white">Agent Assistance</p>
                    <p className="text-[11px] text-primary-light/70 font-medium">En ligne</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto mt-2">
                <SidebarContent location={location} onLinkClick={() => setMobileOpen(false)} />
              </div>

              <div className="p-3 border-t border-white/10">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/30 hover:bg-red-500/15 hover:text-red-400 transition-all w-full"
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                    <LogOut size={17} />
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
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 rounded-lg hover:bg-gray-100" onClick={() => setMobileOpen(true)}>
              <Menu size={20} />
            </button>
            <h1 className="text-sm font-medium text-gray-500 hidden sm:block">
              <span className="text-gray-900 font-semibold">Centre d'Assistance</span> — Aldiana Care
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 w-64">
              <Search size={15} className="text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un dossier..."
                className="flex-1 text-sm bg-transparent outline-none text-gray-700 placeholder-gray-400"
              />
            </div>

            <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-4 h-4 bg-danger text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            <div className="relative ml-2">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User size={15} className="text-primary" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-gray-900">Agent</p>
                  <p className="text-[10px] text-gray-400">Assistance</p>
                </div>
                <ChevronDown size={14} className="text-gray-400 hidden sm:block" />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 5, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">Agent Assistance</p>
                      <p className="text-xs text-gray-400">agent@aldianacare.com</p>
                    </div>
                    <div className="py-1">
                      <Link to="/assistance/parametres" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                        <Settings size={14} /> Paramètres
                      </Link>
                      <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full">
                        <LogOut size={14} /> Déconnexion
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
          <Outlet />
        </main>
      </div>
    </div>
  );
}
