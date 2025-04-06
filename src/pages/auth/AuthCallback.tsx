
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('Error during auth callback:', error);
        navigate('/login');
        return;
      }
      
      if (data?.user) {
        // Check if user profile exists
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        if (profileError || !profile) {
          // Create new profile if it doesn't exist
          await supabase.from('users').insert([{
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata.name || data.user.email?.split('@')[0] || 'User',
            role: 'Investor', // Default role
          }]);
        }
        
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-medium mb-2">Authenticating...</h2>
        <p className="text-gray-500">Please wait while we log you in.</p>
      </div>
    </div>
  );
};

export default AuthCallback;
