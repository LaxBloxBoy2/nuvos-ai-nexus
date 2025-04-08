
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  profile: any | null; // Profile data from users table
  session: Session | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null; data: Session | null }>;
  signUp: (email: string, password: string, userData?: any) => Promise<{ error: AuthError | null; data: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null; data: any }>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  session: null,
  loading: true,
  error: null,
  signIn: () => Promise.resolve({ error: null, data: null }),
  signUp: () => Promise.resolve({ error: null, data: null }),
  signOut: () => Promise.resolve(),
  resetPassword: () => Promise.resolve({ error: null, data: null }),
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Function to fetch user profile from public.users table
    const fetchUserProfile = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) throw error;
        
        console.log('Profile fetched:', data);
        setProfile(data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        // Don't set an auth error here, just log it
      }
    };

    // Set up auth state listener FIRST
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        setSession(session);
        setUser(session?.user || null);

        // If auth state changed to signed in, fetch the user profile
        if (event === 'SIGNED_IN' && session?.user) {
          // Use setTimeout to avoid potential deadlock with auth state changes
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
        }
        
        // Clear loading state after auth state change
        setLoading(false);
      }
    );

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        setError(null);
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        if (data?.session) {
          setSession(data.session);
          setUser(data.session.user);
          
          // Fetch user profile if we have a session
          if (data.session.user) {
            await fetchUserProfile(data.session.user.id);
          }
        }
      } catch (err: any) {
        console.error('Error initializing auth:', err);
        setError(err.message || 'Authentication error');
        toast.error('Failed to initialize authentication');
      } finally {
        setLoading(false);
      }
    };

    // Initialize
    initializeAuth();

    // Cleanup
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      return { data, error: null };
    } catch (err: any) {
      console.error('Error signing in:', err);
      setError(err.message);
      toast.error(err.message || 'Failed to sign in');
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, userData?: any) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData || {},
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
      
      toast.success('Signup successful! Please check your email for verification.');
      return { data, error: null };
    } catch (err: any) {
      console.error('Error signing up:', err);
      setError(err.message);
      toast.error(err.message || 'Failed to sign up');
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      setUser(null);
      setProfile(null);
      setSession(null);
      
      toast.success('Signed out successfully');
    } catch (err: any) {
      console.error('Error signing out:', err);
      setError(err.message);
      toast.error('Failed to sign out');
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      
      toast.success('Password reset instructions sent to your email');
      return { data, error: null };
    } catch (err: any) {
      console.error('Error resetting password:', err);
      setError(err.message);
      toast.error(err.message || 'Failed to reset password');
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    profile,
    session,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
