
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Process the OAuth callback
        const { data, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          throw new Error(sessionError.message);
        }
        
        if (!data?.session || !data.session.user) {
          console.error("No user found in session");
          throw new Error('No user found in session');
        }
        
        const user = data.session.user;
        console.log("User authenticated:", user.id);
        
        // Call the database function to create user profile with elevated privileges
        const { data: profileData, error: profileError } = await supabase.rpc(
          'create_user_profile',
          { 
            user_id: user.id,
            user_email: user.email || '',
            user_name: user.user_metadata.full_name || user.email?.split('@')[0] || 'User',
            user_role: 'Investor'
          } as {
            user_id: string;
            user_email: string;
            user_name: string;
            user_role: string;
          }
        );
        
        if (profileError) {
          console.error('Error creating user profile:', profileError);
          // Try to continue anyway - user might already exist
        } else {
          console.log('Profile creation result:', profileData);
          toast.success('Account created successfully!');
        }
        
        // Redirect to dashboard
        navigate('/dashboard');
      } catch (error) {
        console.error('Error during auth callback:', error);
        setError(error instanceof Error ? error.message : 'Authentication failed');
        toast.error('Authentication failed. Redirecting to login page...');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="text-center glass p-8 max-w-md">
        {error ? (
          <>
            <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4">
              <p className="font-medium">Authentication failed</p>
              <p className="text-sm mt-1">{error}</p>
              <p className="text-sm mt-2">Redirecting to login page...</p>
            </div>
          </>
        ) : (
          <>
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-nuvos-teal mb-4" />
            <h2 className="text-2xl font-medium mb-2 text-nuvos-blue">Completing authentication...</h2>
            <p className="text-gray-500">Please wait while we finish setting up your account.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
