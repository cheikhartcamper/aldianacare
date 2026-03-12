import { create } from 'zustand';

interface AppState {
  isDarkMode: boolean;
  sidebarOpen: boolean;
  onboardingStep: number;

  toggleDarkMode: () => void;
  toggleSidebar: () => void;
  setOnboardingStep: (step: number) => void;
}

export const useStore = create<AppState>((set) => ({
  isDarkMode: false,
  sidebarOpen: true,
  onboardingStep: 0,

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
  setOnboardingStep: (onboardingStep) => set({ onboardingStep }),
}));
