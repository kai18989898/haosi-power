import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { routes } from '@/routes';

interface RouteGuardProps {
  children: React.ReactNode;
}

const SYSTEM_PUBLIC_ROUTES = ['/login', '/403', '/404'];
const ADMIN_ROUTES = routes.filter(r => r.layout === 'admin').map(r => r.path);

const routePublicPaths = routes.filter(r => r.public).map(r => r.path);
const PUBLIC_ROUTES = [...SYSTEM_PUBLIC_ROUTES, ...routePublicPaths];

function matchRoute(path: string, patterns: string[]) {
  return patterns.some(pattern => {
    if (pattern.includes('*')) {
      const regex = new RegExp('^' + pattern.replace('*', '.*') + '$');
      return regex.test(path);
    }
    return path === pattern;
  });
}

export function RouteGuard({ children }: RouteGuardProps) {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (loading) return;
    setAuthChecked(true);

    const isPublic = matchRoute(location.pathname, PUBLIC_ROUTES);
    const isAdmin = matchRoute(location.pathname, ADMIN_ROUTES);

    if (isPublic) return;

    if (!user) {
      navigate('/admin/login', { state: { from: location.pathname }, replace: true });
      return;
    }

    if (isAdmin && profile?.role !== 'admin') {
      navigate('/', { replace: true });
      return;
    }
  }, [user, profile, loading, location.pathname, navigate]);

  if (loading || !authChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}