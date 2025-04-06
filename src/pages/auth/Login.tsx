
import AuthForm from "@/components/auth/AuthForm";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Login = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="flex min-h-screen">
      {/* Left side - Login form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Link to="/" className="inline-block mb-8">
              <span className="font-grotesk font-bold text-2xl text-nuvos-blue">
                Nuvos<span className="text-nuvos-teal">.</span>
              </span>
            </Link>
            <motion.h1 
              className="text-3xl font-bold text-nuvos-blue mb-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Welcome back
            </motion.h1>
            <motion.p 
              className="text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Sign in to your account to continue
            </motion.p>
          </div>
          <AuthForm type="login" />
        </div>
        <p className="mt-10 text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Nuvos. All rights reserved.
        </p>
      </div>
      
      {/* Right side - Decorative background */}
      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-nuvos-blue via-blue-600 to-nuvos-teal relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.2),transparent_50%),radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="max-w-md"
          >
            <h2 className="text-3xl font-bold font-grotesk mb-4">Smarter investment decisions with AI</h2>
            <p className="text-blue-100 mb-8">
              Nuvos helps commercial real estate professionals analyze opportunities, manage deals, and optimize returns.
            </p>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
              <blockquote className="text-white/90 italic mb-4">
                "Nuvos has transformed our investment process. We're making more informed decisions in half the time."
              </blockquote>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-white/20 rounded-full"></div>
                <div className="ml-3">
                  <div className="font-medium">Sarah Chen</div>
                  <div className="text-sm text-blue-200">Director of Acquisitions, RST Capital</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
