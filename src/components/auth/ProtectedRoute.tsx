
import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log('ProtectedRoute state:', { user: !!user, loading, path: location.pathname });
    
    // Log an error if we've been loading too long
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.error('Auth loading state has not resolved after 5 seconds');
        toast.error('Taking too long to authenticate. Please refresh the page.');
      }
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, [loading, user, location.pathname]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-nuvos-teal mx-auto"></div>
          <p className="mt-4 text-gray-500">Verifying your login status...</p>
          <p className="mt-2 text-xs text-gray-400">If this takes too long, please refresh the page.</p>
        </div>
      </div>
    );
  }

  // Redirect if no user is logged in
  if (!user) {
    console.log('No user found, redirecting to login');
    toast.error('Please log in to access this page');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log('User authenticated, rendering protected content');
  return <>{children}</>;
};

export default ProtectedRoute;
