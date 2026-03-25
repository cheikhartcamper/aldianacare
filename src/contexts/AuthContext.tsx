import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { authService, type User, type TrustedPerson, type FamilyMember } from '@/services/auth.service';

interface AuthContextType {
  user: User | null;
  trustedPersons: TrustedPerson[];
  familyMembers: FamilyMember[];
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string; registrationStatus?: string; rejectionReason?: string | null; userRole?: 'user' | 'admin' | 'country_manager' }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [trustedPersons, setTrustedPersons] = useState<TrustedPerson[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('aldiana_token'));
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!token;

  const logout = useCallback(() => {
    localStorage.removeItem('aldiana_token');
    localStorage.removeItem('aldiana_user');
    setUser(null);
    setToken(null);
    setTrustedPersons([]);
    setFamilyMembers([]);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const res = await authService.getMe();
      if (res.success) {
        setUser(res.data.user);
        setTrustedPersons(res.data.trustedPersons || []);
        setFamilyMembers(res.data.familyMembers || []);
        localStorage.setItem('aldiana_user', JSON.stringify(res.data.user));
      }
    } catch {
      logout();
    }
  }, [logout]);

  // On mount: if token exists, fetch user profile
  useEffect(() => {
    const init = async () => {
      if (token) {
        try {
          await refreshUser();
        } catch {
          logout();
        }
      }
      setIsLoading(false);
    };
    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = async (email: string, password: string) => {
    try {
      const res = await authService.login(email, password);
      if (res.success && res.data) {
        const { user: userData, token: jwt } = res.data;
        localStorage.setItem('aldiana_token', jwt);
        localStorage.setItem('aldiana_user', JSON.stringify(userData));
        setToken(jwt);
        setUser(userData);
        // Fetch full profile (trusted persons, family members)
        try {
          const meRes = await authService.getMe();
          if (meRes.success) {
            setUser(meRes.data.user);
            setTrustedPersons(meRes.data.trustedPersons || []);
            setFamilyMembers(meRes.data.familyMembers || []);
            localStorage.setItem('aldiana_user', JSON.stringify(meRes.data.user));
          }
        } catch {
          // Non-blocking, profile already set
        }
        return { success: true, message: res.message, userRole: userData.role };
      }
      return { success: false, message: res.message };
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string; registrationStatus?: string; rejectionReason?: string | null }; status?: number } };
      const status = error.response?.status;
      const data = error.response?.data;
      if (status === 403 && data?.registrationStatus) {
        return {
          success: false,
          message: data.message || 'Accès refusé.',
          registrationStatus: data.registrationStatus,
          rejectionReason: data.rejectionReason,
        };
      }
      return {
        success: false,
        message: data?.message || 'Erreur de connexion. Veuillez réessayer.',
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        trustedPersons,
        familyMembers,
        token,
        isAuthenticated,
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
