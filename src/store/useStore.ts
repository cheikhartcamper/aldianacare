import { create } from 'zustand';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'subscriber' | 'family_manager' | 'trusted_person' | 'sponsor' | 'admin';
  avatar?: string;
  contractStatus?: 'active' | 'pending' | 'expired' | 'suspended';
  plan?: string;
}

interface Notification {
  id: string;
  type: 'payment' | 'contract' | 'commission' | 'document' | 'alert';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  isDarkMode: boolean;
  sidebarOpen: boolean;
  notifications: Notification[];
  onboardingStep: number;
  
  setUser: (user: User | null) => void;
  setAuthenticated: (auth: boolean) => void;
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
  addNotification: (notification: Notification) => void;
  markNotificationRead: (id: string) => void;
  setOnboardingStep: (step: number) => void;
  logout: () => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  isAuthenticated: false,
  isDarkMode: false,
  sidebarOpen: true,
  notifications: [
    {
      id: '1',
      type: 'payment',
      title: 'Rappel de paiement',
      message: 'Votre prochaine échéance est dans 5 jours.',
      read: false,
      createdAt: '2026-03-01T10:00:00Z',
    },
    {
      id: '2',
      type: 'contract',
      title: 'Contrat généré',
      message: 'Votre contrat Premium a été généré avec succès.',
      read: false,
      createdAt: '2026-02-28T14:30:00Z',
    },
    {
      id: '3',
      type: 'commission',
      title: 'Commission reçue',
      message: 'Vous avez reçu 15€ de commission de parrainage.',
      read: true,
      createdAt: '2026-02-25T09:15:00Z',
    },
  ],
  onboardingStep: 0,

  setUser: (user) => set({ user }),
  setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  toggleDarkMode: () =>
    set((state) => {
      const newMode = !state.isDarkMode;
      if (newMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return { isDarkMode: newMode };
    }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  addNotification: (notification) =>
    set((state) => ({ notifications: [notification, ...state.notifications] })),
  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),
  setOnboardingStep: (onboardingStep) => set({ onboardingStep }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
