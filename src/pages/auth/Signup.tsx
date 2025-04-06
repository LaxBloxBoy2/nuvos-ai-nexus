
import AuthForm from "@/components/auth/AuthForm";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Signup = () => {
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
      {/* Left side - Sign up form */}
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
              Create your account
            </motion.h1>
            <motion.p 
              className="text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Join Nuvos to manage your real estate investments
            </motion.p>
          </div>
          <AuthForm type="signup" />
        </div>
        <p className="mt-10 text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Nuvos. All rights reserved.
        </p>
      </div>
      
      {/* Right side - Decorative background */}
      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-nuvos-teal via-teal-500 to-blue-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.2),transparent_50%),radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="max-w-md"
          >
            <h2 className="text-3xl font-bold font-grotesk mb-4">Unlock AI-powered real estate intelligence</h2>
            <p className="text-blue-50 mb-8">
              Get access to property valuations, deal management tools, and AI-enhanced market insights.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 flex flex-col items-center text-center">
                <div className="text-3xl font-bold mb-1">2.5x</div>
                <div className="text-sm">Faster Deal Analysis</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 flex flex-col items-center text-center">
                <div className="text-3xl font-bold mb-1">85%</div>
                <div className="text-sm">More Accurate Forecasts</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 flex flex-col items-center text-center">
                <div className="text-3xl font-bold mb-1">40%</div>
                <div className="text-sm">Time Saved on Reporting</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 flex flex-col items-center text-center">
                <div className="text-3xl font-bold mb-1">100%</div>
                <div className="text-sm">Cloud-Based Platform</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
