
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
        
        // Check if user profile exists
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (profileError && profileError.code !== 'PGRST116') {
          // PGRST116 is the error code for "no rows found"
          console.error('Error fetching user profile:', profileError);
        }
          
        if (!profile) {
          console.log("Creating new profile for user:", user.id);
          // Create new profile if it doesn't exist
          const { error: insertError } = await supabase.from('users').insert([{
            id: user.id,
            email: user.email,
            name: user.user_metadata.full_name || user.email?.split('@')[0] || 'User',
            role: 'Investor', // Default role
            created_at: new Date().toISOString(),
          }]);
          
          if (insertError) {
            console.error('Error creating user profile:', insertError);
            // Continue anyway, we don't want to block the user
          } else {
            toast.success('Account created successfully!');
          }
        } else {
          toast.success('Logged in successfully!');
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
