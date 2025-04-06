
import AuthForm from "@/components/auth/AuthForm";
import { Link } from "react-router-dom";

const ResetPassword = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-block mb-6">
            <span className="font-grotesk font-bold text-2xl text-nuvos-blue">
              Nuvos<span className="text-nuvos-teal">.</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold">Set a new password</h1>
          <p className="text-gray-500 mt-1">Create a strong password for your account</p>
        </div>
        <AuthForm type="reset-password" />
      </div>
      <p className="mt-10 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Nuvos. All rights reserved.
      </p>
    </div>
  );
};

export default ResetPassword;
