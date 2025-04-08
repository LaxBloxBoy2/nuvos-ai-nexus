
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { supabase, UserProfile, UserRole } from '@/lib/supabase';
import { toast } from 'sonner';
import { PostgrestError } from '@supabase/supabase-js';

// Update the AuthContextType to include PostgrestError possibility in signUp return type
interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, name: string, role: UserRole) => Promise<{ error: AuthError | PostgrestError | null }>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ error: AuthError | null }>;
  resetPassword: (password: string) => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user profile from the database with better error handling
  const fetchProfile = async (userId: string) => {
    try {
      console.log("Fetching profile for user:", userId);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user profile:', error);
        // Don't throw error, just log it and continue
        return;
      }
      
      console.log("Profile fetched:", data);
      setProfile(data as UserProfile);
    } catch (error) {
      console.error('Unexpected error fetching user profile:', error);
      // We still don't want to throw here, just log the error
    }
  };

  useEffect(() => {
    console.log("AuthProvider initializing...");
    let authListener: { subscription: { unsubscribe: () => void } } | null = null;
    
    const initializeAuth = async () => {
      try {
        // First set up the auth state listener BEFORE checking session
        authListener = supabase.auth.onAuthStateChange(
          (event, currentSession) => {
            console.log("Auth state changed:", event, currentSession?.user?.id);
            
            // Use synchronous state updates only within the callback
            if (currentSession) {
              setSession(currentSession);
              setUser(currentSession.user);
              
              // Schedule async operations outside the callback using setTimeout(0)
              if (currentSession.user) {
                setTimeout(() => {
                  fetchProfile(currentSession.user.id);
                }, 0);
              }
            } else {
              setSession(null);
              setUser(null);
              setProfile(null);
            }
            
            setLoading(false);
          }
        );

        // Then check for existing session
        console.log("Getting initial session");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          toast.error("Authentication error: " + error.message);
          setLoading(false);
          return;
        }
        
        const initialSession = data.session;
        console.log("Initial session:", initialSession?.user?.id || "No session");
        
        if (initialSession) {
          setSession(initialSession);
          setUser(initialSession.user);
          await fetchProfile(initialSession.user.id);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Unexpected error during auth initialization:", error);
        toast.error("Failed to initialize authentication. Please refresh the page.");
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      console.log("Cleaning up auth listener");
      if (authListener) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (!error) {
        navigate('/dashboard');
        toast.success('Signed in successfully');
      } else {
        // Handle specific error cases
        if (error.message === 'Invalid login credentials') {
          toast.error('Invalid email or password. Please check your credentials and try again.');
        } else if (error.message.includes('network')) {
          toast.error('Network error. Please check your internet connection and try again.');
        } else {
          toast.error(`Authentication error: ${error.message}`);
        }
      }
      
      setLoading(false);
      return { error };
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error('An unexpected error occurred. Please try again later.');
      setLoading(false);
      return { error: error as AuthError };
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, name: string, role: UserRole) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            name,
            role
          }
        }
      });
      
      if (error) {
        // Handle specific error cases
        if (error.message.includes('email')) {
          toast.error('Invalid email address or this email is already in use.');
        } else if (error.message.includes('password')) {
          toast.error('Password must be at least 8 characters long.');
        } else {
          toast.error(`Sign up error: ${error.message}`);
        }
        setLoading(false);
        return { error };
      }
      
      if (data.user) {
        // Instead of directly creating a profile, rely on the auth webhook/trigger 
        // or the AuthCallback component to handle profile creation
        toast.success('Account created successfully! Please check your email for verification.');
        navigate('/login');
      }
      
      setLoading(false);
      return { error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      toast.error('An unexpected error occurred. Please try again later.');
      setLoading(false);
      return { error: error as AuthError };
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        toast.error(`Google sign-in error: ${error.message}`);
        setLoading(false);
        throw error;
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      toast.error('Failed to sign in with Google. Please try again later.');
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      navigate('/login');
      toast.success('Signed out successfully');
      setLoading(false);
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
      setLoading(false);
    }
  };

  // Forgot password
  const forgotPassword = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (!error) {
        toast.success('Password reset link sent to your email');
      } else {
        toast.error(`Error sending reset link: ${error.message}`);
      }
      
      setLoading(false);
      return { error };
    } catch (error) {
      console.error('Forgot password error:', error);
      toast.error('An unexpected error occurred. Please try again later.');
      setLoading(false);
      return { error: error as AuthError };
    }
  };

  // Reset password
  const resetPassword = async (password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({
        password
      });
      
      if (!error) {
        toast.success('Password updated successfully');
        navigate('/login');
      } else {
        toast.error(`Error resetting password: ${error.message}`);
      }
      
      setLoading(false);
      return { error };
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error('An unexpected error occurred. Please try again later.');
      setLoading(false);
      return { error: error as AuthError };
    }
  };

  const value = {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    forgotPassword,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
