import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import IntersectObserver from '@/components/common/IntersectObserver';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { RouteGuard } from '@/components/common/RouteGuard';
import { routes, subRoutes } from './routes';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <RouteGuard>
          <IntersectObserver />
          <div className="flex flex-col min-h-screen w-full">
            <main className="flex-1 min-w-0">
              <Routes>
                {routes.map((route, index) => {
                  const children = subRoutes[route.path];
                  return (
                    <Route
                      key={index}
                      path={route.path}
                      element={route.element}
                    >
                      {children?.map((child, idx) => (
                        <Route key={idx} path={route.path === '/' ? '' : undefined} element={child} />
                      ))}
                      {route.layout === 'front' && (
                        <Route path="*" element={<Navigate to="/" replace />} />
                      )}
                    </Route>
                  );
                })}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
          <Toaster />
        </RouteGuard>
      </AuthProvider>
    </Router>
  );
};

export default App;
