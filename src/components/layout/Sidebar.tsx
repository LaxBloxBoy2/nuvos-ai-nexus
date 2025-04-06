
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Building, 
  PieChart, 
  BarChart3, 
  Users, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Calculator,
  FileText,
  BrainCircuit
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  
  if (isMobile) return null;

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      title: "Deal Pipeline",
      icon: Building,
      path: "/deals/pipeline",
    },
    {
      title: "Deal Rooms",
      icon: PieChart,
      path: "/deals/rooms",
    },
    {
      title: "Valuation",
      icon: Calculator,
      path: "/valuation/overview",
    },
    {
      title: "Reports",
      icon: FileText,
      path: "/insights/reports",
    },
    {
      title: "AI Insights",
      icon: BrainCircuit,
      path: "/insights/ai-summaries",
    },
    {
      title: "Team",
      icon: Users,
      path: "/team",
    },
    {
      title: "Settings",
      icon: Settings,
      path: "/settings",
    },
  ];

  return (
    <aside className={cn(
      "fixed top-[73px] left-0 h-[calc(100vh-73px)] bg-white border-r border-gray-100 transition-all duration-300 z-40",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex flex-col h-full">
        <div className="flex-1 py-6 overflow-y-auto">
          <ul className="space-y-1 px-3">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                    location.pathname.startsWith(item.path)
                      ? "bg-gray-100 text-nuvos-blue font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <item.icon size={20} className="flex-shrink-0" />
                  {!collapsed && <span>{item.title}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 border-t border-gray-100">
          {!collapsed ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <div className="bg-nuvos-teal w-full h-full flex items-center justify-center text-white font-medium">
                    JD
                  </div>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-gray-500">Investor</p>
                </div>
              </div>
              <button
                onClick={() => setCollapsed(true)}
                className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                aria-label="Collapse sidebar"
              >
                <ChevronLeft size={16} />
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <button
                onClick={() => setCollapsed(false)}
                className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                aria-label="Expand sidebar"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
