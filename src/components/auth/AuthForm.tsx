
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface AuthFormProps {
  type: "login" | "signup";
}

const AuthForm = ({ type }: AuthFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // This is where we'd connect to an authentication service
      // For now, we'll just simulate a successful login/signup
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Show success message
      toast({
        title: type === "login" ? "Logged in successfully" : "Account created successfully",
        description: "Redirecting to dashboard...",
      });

      // Redirect to dashboard
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          {type === "login" ? "Welcome back" : "Create your account"}
        </CardTitle>
        <CardDescription>
          {type === "login" 
            ? "Enter your email below to login to your account" 
            : "Enter your information to create an account"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {type === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john.doe@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              {type === "login" && (
                <a href="/forgot-password" className="text-xs text-blue-600 hover:underline">
                  Forgot password?
                </a>
              )}
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button
            type="submit"
            className="w-full bg-nuvos-teal hover:bg-nuvos-teal/90"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {type === "login" ? "Logging in..." : "Creating account..."}
              </span>
            ) : (
              <>{type === "login" ? "Login" : "Create account"}</>
            )}
          </Button>
          <div className="mt-4 text-center text-sm">
            {type === "login" ? (
              <>
                Don't have an account?{" "}
                <a href="/signup" className="text-nuvos-teal hover:underline font-medium">
                  Sign up
                </a>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <a href="/login" className="text-nuvos-teal hover:underline font-medium">
                  Login
                </a>
              </>
            )}
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AuthForm;
