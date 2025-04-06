
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserRole } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { AlertCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface AuthFormProps {
  type: "login" | "signup" | "forgot-password" | "reset-password";
}

const AuthForm = ({ type }: AuthFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("Investor");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  
  const { signIn, signUp, signInWithGoogle, forgotPassword, resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    
    try {
      if (type === "login") {
        const { error } = await signIn(email, password);
        if (error) {
          setErrorMsg(error.message);
        }
      } else if (type === "signup") {
        if (password !== confirmPassword) {
          setErrorMsg("Passwords do not match");
          setLoading(false);
          return;
        }
        
        const { error } = await signUp(email, password, name, role);
        if (error) {
          setErrorMsg(error.message);
        }
      } else if (type === "forgot-password") {
        const { error } = await forgotPassword(email);
        if (error) {
          setErrorMsg(error.message);
        }
      } else if (type === "reset-password") {
        if (password !== confirmPassword) {
          setErrorMsg("Passwords do not match");
          setLoading(false);
          return;
        }
        
        const { error } = await resetPassword(password);
        if (error) {
          setErrorMsg(error.message);
        }
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setErrorMsg("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg("");
    
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Google sign in error:", error);
      setErrorMsg("Failed to sign in with Google. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Form content based on type
  const renderForm = () => {
    if (type === "login") {
      return (
        <>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john.doe@example.com"
                disabled={loading}
                className="h-11"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-xs text-nuvos-teal hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                className="h-11"
                required
              />
            </div>
          </div>
          
          {errorMsg && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-700">
              <AlertCircle className="h-4 w-4" />
              <p>{errorMsg}</p>
            </div>
          )}
          
          <div className="flex flex-col mt-6">
            <Button
              type="submit"
              className="w-full bg-nuvos-teal hover:bg-nuvos-teal/90 h-12"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </Button>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-gray-500">Or continue with</span>
              </div>
            </div>
            
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 border-gray-300 hover:bg-gray-50"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <svg 
                viewBox="0 0 24 24" 
                className="h-5 w-5 mr-2" 
                aria-hidden="true"
              >
                <path 
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" 
                  fill="#4285F4" 
                />
                <path 
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" 
                  fill="#34A853" 
                />
                <path 
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" 
                  fill="#FBBC05" 
                />
                <path 
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" 
                  fill="#EA4335" 
                />
              </svg>
              Google
            </Button>
          </div>
          
          <div className="mt-8 text-center text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-nuvos-teal hover:underline font-medium">
              Sign up
            </Link>
          </div>
        </>
      );
    } else if (type === "signup") {
      return (
        <>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                disabled={loading}
                className="h-11"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john.doe@example.com"
                disabled={loading}
                className="h-11"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={role}
                onValueChange={(value) => setRole(value as UserRole)}
                disabled={loading}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Investor">Investor</SelectItem>
                  <SelectItem value="Analyst">Analyst</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                className="h-11"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                className="h-11"
                required
              />
            </div>
          </div>
          
          {errorMsg && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-700">
              <AlertCircle className="h-4 w-4" />
              <p>{errorMsg}</p>
            </div>
          )}
          
          <div className="flex flex-col mt-6">
            <Button
              type="submit"
              className="w-full bg-nuvos-teal hover:bg-nuvos-teal/90 h-12"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account...
                </span>
              ) : (
                "Create account"
              )}
            </Button>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-gray-500">Or continue with</span>
              </div>
            </div>
            
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 border-gray-300 hover:bg-gray-50"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <svg 
                viewBox="0 0 24 24" 
                className="h-5 w-5 mr-2" 
                aria-hidden="true"
              >
                <path 
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" 
                  fill="#4285F4" 
                />
                <path 
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" 
                  fill="#34A853" 
                />
                <path 
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" 
                  fill="#FBBC05" 
                />
                <path 
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" 
                  fill="#EA4335" 
                />
              </svg>
              Google
            </Button>
          </div>
          
          <div className="mt-8 text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-nuvos-teal hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </>
      );
    } else if (type === "forgot-password") {
      return (
        <>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john.doe@example.com"
                disabled={loading}
                className="h-11"
                required
              />
            </div>
          </div>
          
          {errorMsg && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-700">
              <AlertCircle className="h-4 w-4" />
              <p>{errorMsg}</p>
            </div>
          )}
          
          <div className="flex flex-col mt-6">
            <Button
              type="submit"
              className="w-full bg-nuvos-teal hover:bg-nuvos-teal/90 h-12"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending email...
                </span>
              ) : (
                "Send reset link"
              )}
            </Button>
          </div>
          
          <div className="mt-8 text-center text-sm">
            Remember your password?{" "}
            <Link to="/login" className="text-nuvos-teal hover:underline font-medium">
              Back to login
            </Link>
          </div>
        </>
      );
    } else if (type === "reset-password") {
      return (
        <>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                className="h-11"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                className="h-11"
                required
              />
            </div>
          </div>
          
          {errorMsg && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-700">
              <AlertCircle className="h-4 w-4" />
              <p>{errorMsg}</p>
            </div>
          )}
          
          <div className="flex flex-col mt-6">
            <Button
              type="submit"
              className="w-full bg-nuvos-teal hover:bg-nuvos-teal/90 h-12"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating password...
                </span>
              ) : (
                "Reset password"
              )}
            </Button>
          </div>
        </>
      );
    }
    
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="w-full max-w-md mx-auto border border-gray-100 shadow-lg">
        <CardHeader className="pb-6">
          <CardTitle className="text-2xl font-bold text-nuvos-blue">
            {type === "login" ? "Welcome back" : 
             type === "signup" ? "Create your account" :
             type === "forgot-password" ? "Reset your password" :
             "Set new password"}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {type === "login" 
              ? "Enter your email below to login to your account" 
              : type === "signup"
              ? "Enter your information to create an account"
              : type === "forgot-password"
              ? "We'll send you a link to reset your password"
              : "Enter your new password below"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="pb-6">
            {renderForm()}
          </CardContent>
        </form>
      </Card>
    </motion.div>
  );
};

export default AuthForm;
