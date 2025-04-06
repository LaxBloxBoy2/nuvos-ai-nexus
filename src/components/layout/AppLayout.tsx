
import { ReactNode } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const location = useLocation();
  const { user } = useAuth();
  
  const isDashboard = location.pathname.startsWith("/dashboard") || 
                      location.pathname.startsWith("/deals") || 
                      location.pathname.startsWith("/valuation") ||
                      location.pathname.startsWith("/insights");
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        {user && isDashboard && <Sidebar />}
        <main className={`flex-1 ${user && isDashboard ? 'pl-0 md:pl-64' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
