
import AuthForm from "@/components/auth/AuthForm";
import { Link } from "react-router-dom";

const Signup = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-block mb-6">
            <span className="font-grotesk font-bold text-2xl text-nuvos-blue">
              Nuvos<span className="text-nuvos-teal">.</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-gray-500 mt-1">Join Nuvos to manage your real estate investments</p>
        </div>
        <AuthForm type="signup" />
      </div>
      <p className="mt-10 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Nuvos. All rights reserved.
      </p>
    </div>
  );
};

export default Signup;
