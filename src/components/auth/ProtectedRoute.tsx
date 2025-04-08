
import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading, error } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log('ProtectedRoute state:', { user: !!user, loading, error, path: location.pathname });
    
    // Log an error if we've been loading too long, but don't toast yet (to avoid duplicate toasts)
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.error('Auth loading state has not resolved after 3 seconds');
      }
    }, 3000);

    // Only show toast if we're still loading after 5 seconds
    const toastTimeoutId = setTimeout(() => {
      if (loading) {
        toast.error('Taking too long to authenticate. Please refresh the page.');
      }
    }, 5000);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(toastTimeoutId);
    }
  }, [loading, user, location.pathname, error]);

  // If there's an auth error, show it and provide a way to refresh
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="rounded-full h-12 w-12 bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-alert-circle"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <p className="text-lg font-medium mb-2">Authentication Error</p>
          <p className="text-gray-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-nuvos-blue hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // Show loading state while checking authentication, but with a better fallback
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-nuvos-teal mx-auto"></div>
          <p className="mt-4 text-gray-500">Verifying your login status...</p>
          <p className="mt-2 text-xs text-gray-400">If this takes too long, please refresh the page.</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 text-sm text-nuvos-blue hover:text-nuvos-teal transition-colors"
          >
            Click here to refresh
          </button>
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
