import { Link, Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, FileText, CreditCard, AlertTriangle,
  Gift, BarChart3, Settings, LogOut, Menu, X, Bell, Moon, Sun,
  ChevronDown
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Logo } from '@/components/ui';

const adminLinks = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Utilisateurs', path: '/admin/utilisateurs', icon: Users },
  { label: 'Contrats', path: '/admin/contrats', icon: FileText },
  { label: 'Paiements', path: '/admin/paiements', icon: CreditCard },
  { label: 'Dossiers décès', path: '/admin/dossiers-deces', icon: AlertTriangle },
  { label: 'Commissions', path: '/admin/commissions', icon: Gift },
  { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
  { label: 'Paramètres', path: '/admin/parametres', icon: Settings },
];

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const { isDarkMode, toggleDarkMode } = useStore();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-gray-900 text-gray-300 transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <Logo size="sm" variant="white" showText={false} />
              <div>
                <span className="font-bold text-white text-sm">Aldiana Care</span>
                <span className="block text-[10px] text-gray-500">Administration</span>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-800 text-gray-500"
          >
            <Menu size={18} />
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {adminLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
                title={!sidebarOpen ? link.label : undefined}
              >
                <link.icon size={18} />
                {sidebarOpen && <span>{link.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-gray-800">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-gray-800 hover:text-white font-medium"
          >
            <LogOut size={18} />
            {sidebarOpen && <span>Déconnexion</span>}
          </Link>
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
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-gray-900 z-50 lg:hidden flex flex-col"
            >
              <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                      <path d="M12 6c-1.5 0-2.8.8-3.5 2-.4.7-.5 1.3-.5 2 0 2.5 2 4.5 4 6 2-1.5 4-3.5 4-6 0-.7-.1-1.3-.5-2-.7-1.2-2-2-3.5-2z"/>
                    </svg>
                  </div>
                  <span className="font-bold text-white text-sm">Admin</span>
                </div>
                <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg hover:bg-gray-800 text-gray-500">
                  <X size={18} />
                </button>
              </div>
              <nav className="flex-1 py-4 px-3 space-y-1">
                {adminLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isActive ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      <link.icon size={18} />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 rounded-lg hover:bg-gray-100" onClick={() => setMobileOpen(true)}>
              <Menu size={20} />
            </button>
            <h1 className="text-sm font-semibold text-gray-900">Administration Aldiana Care</h1>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={toggleDarkMode} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400">
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-400">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full" />
            </button>
            <div className="relative ml-2">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-gray-50"
              >
                <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center text-white text-xs font-bold">
                  AD
                </div>
                <span className="text-xs font-medium text-gray-700 hidden sm:block">Admin</span>
                <ChevronDown size={14} className="text-gray-400" />
              </button>
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border py-2 z-50"
                  >
                    <Link to="/admin/parametres" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                      <Settings size={14} /> Paramètres
                    </Link>
                    <Link to="/" className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                      <LogOut size={14} /> Déconnexion
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
