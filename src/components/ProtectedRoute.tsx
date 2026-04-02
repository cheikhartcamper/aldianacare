import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { PageLoader } from '@/components/ui';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'admin' | 'country_manager';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (requiredRole === 'admin' && user?.role !== 'admin') {
    if (user?.role === 'country_manager') return <Navigate to="/country-manager" replace />;
    return <Navigate to="/app" replace />;
  }

  if (requiredRole === 'country_manager' && user?.role !== 'country_manager') {
    if (user?.role === 'admin') return <Navigate to="/admin" replace />;
    return <Navigate to="/app" replace />;
  }

  return <>{children}</>;
}
