import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { PageLoader } from '@/components/ui';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'admin';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/connexion" state={{ from: location }} replace />;
  }

  if (requiredRole === 'admin' && user?.role !== 'admin') {
    return <Navigate to="/app" replace />;
  }

  return <>{children}</>;
}
