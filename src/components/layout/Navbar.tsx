
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ChevronDown, 
  Menu, 
  X, 
  Building, 
  BarChart3, 
  Calculator, 
  LineChart, 
  FileText,
  PieChart, 
  Kanban, 
  Users, 
  FileArchive, 
  ListTodo, 
  BrainCircuit, 
  AlertTriangle, 
  BarChart4, 
  MessagesSquare, 
  FileDigit,
  User,
  Settings,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const toggleMegaMenu = (menu: string) => {
    if (activeMegaMenu === menu) {
      setActiveMegaMenu(null);
    } else {
      setActiveMegaMenu(menu);
    }
  };

  const closeMegaMenu = () => {
    setActiveMegaMenu(null);
  };

  // Function to get user initials for avatar
  const getUserInitials = () => {
    if (profile?.name) {
      return profile.name
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    return user?.email?.substring(0, 2).toUpperCase() || 'U';
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (activeMegaMenu) {
      setActiveMegaMenu(null);
    }
  };

  return (
    <nav className="relative bg-white border-b border-gray-100 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link to="/" className="flex items-center" onClick={closeMegaMenu}>
              <span className="font-grotesk font-bold text-xl text-nuvos-blue">
                Nuvos<span className="text-nuvos-teal">.</span>
              </span>
            </Link>
            
            {!isMobile && user && (
              <div className="hidden md:flex space-x-1">
                <button 
                  onClick={() => toggleMegaMenu('valuation')}
                  className={cn(
                    "px-4 py-2 rounded-lg flex items-center gap-1 transition-colors",
                    activeMegaMenu === 'valuation' ? "bg-gray-100" : "hover:bg-gray-50"
                  )}
                >
                  Valuation & Forecasting
                  <ChevronDown size={16} className={cn(
                    "transition-transform duration-200",
                    activeMegaMenu === 'valuation' ? "rotate-180" : ""
                  )} />
                </button>
                
                <button 
                  onClick={() => toggleMegaMenu('deal')}
                  className={cn(
                    "px-4 py-2 rounded-lg flex items-center gap-1 transition-colors",
                    activeMegaMenu === 'deal' ? "bg-gray-100" : "hover:bg-gray-50"
                  )}
                >
                  Deal Management
                  <ChevronDown size={16} className={cn(
                    "transition-transform duration-200",
                    activeMegaMenu === 'deal' ? "rotate-180" : ""
                  )} />
                </button>
                
                <button 
                  onClick={() => toggleMegaMenu('insights')}
                  className={cn(
                    "px-4 py-2 rounded-lg flex items-center gap-1 transition-colors",
                    activeMegaMenu === 'insights' ? "bg-gray-100" : "hover:bg-gray-50"
                  )}
                >
                  Insights & Collaboration
                  <ChevronDown size={16} className={cn(
                    "transition-transform duration-200",
                    activeMegaMenu === 'insights' ? "rotate-180" : ""
                  )} />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!user ? (
              !isMobile ? (
                <>
                  <Link to="/login">
                    <Button variant="ghost" size="sm">Log in</Button>
                  </Link>
                  <Link to="/signup">
                    <Button variant="default" size="sm">Sign up</Button>
                  </Link>
                </>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleMobileMenuToggle}
                >
                  {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </Button>
              )
            ) : (
              <>
                {!isMobile && (
                  <Button variant="outline" size="sm" className="mr-2" onClick={() => navigate('/dashboard')}>
                    Dashboard
                  </Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-nuvos-blue text-white">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{profile?.name || 'User'}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={() => navigate('/profile')}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/settings')}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                {isMobile && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleMobileMenuToggle}
                    className="ml-2"
                  >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mega Menus */}
      {activeMegaMenu && !isMobile && user && (
        <div 
          className="mega-menu active animate-fade-in grid-cols-4 gap-6"
          onMouseLeave={closeMegaMenu}
        >
          {activeMegaMenu === 'valuation' && (
            <>
              <div className="col-span-1">
                <h3 className="font-grotesk font-medium text-xl mb-2">Valuation & Forecasting</h3>
                <p className="text-gray-500 text-sm mb-4">
                  Powerful tools to model, analyze and forecast real estate investments
                </p>
                <Link to="/valuation/overview">
                  <Button className="w-full justify-start" variant="outline">View All Tools</Button>
                </Link>
              </div>
              <div className="col-span-3 grid grid-cols-3 gap-4">
                <Link to="/valuation/development" className="group p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <Building className="mb-2 text-nuvos-teal" />
                  <h3 className="font-medium mb-1">Development Modeling</h3>
                  <p className="text-sm text-gray-500">Create detailed development pro-formas</p>
                </Link>
                <Link to="/valuation/acquisition" className="group p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <BarChart3 className="mb-2 text-nuvos-purple" />
                  <h3 className="font-medium mb-1">Acquisition Underwriting</h3>
                  <p className="text-sm text-gray-500">Analyze potential acquisitions</p>
                </Link>
                <Link to="/valuation/calculator" className="group p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <Calculator className="mb-2 text-nuvos-lightblue" />
                  <h3 className="font-medium mb-1">DCF + IRR Calculator</h3>
                  <p className="text-sm text-gray-500">Calculate returns and cash flows</p>
                </Link>
                <Link to="/valuation/scenarios" className="group p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <LineChart className="mb-2 text-nuvos-teal" />
                  <h3 className="font-medium mb-1">Market Scenario Simulations</h3>
                  <p className="text-sm text-gray-500">Test different market conditions</p>
                </Link>
                <Link to="/valuation/templates" className="group p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <FileText className="mb-2 text-nuvos-purple" />
                  <h3 className="font-medium mb-1">Property-Type Templates</h3>
                  <p className="text-sm text-gray-500">Specialized models by property type</p>
                </Link>
              </div>
            </>
          )}

          {activeMegaMenu === 'deal' && (
            <>
              <div className="col-span-1">
                <h3 className="font-grotesk font-medium text-xl mb-2">Deal Management</h3>
                <p className="text-gray-500 text-sm mb-4">
                  Track, manage and collaborate on real estate deals
                </p>
                <Link to="/deals/overview">
                  <Button className="w-full justify-start" variant="outline">View All Deals</Button>
                </Link>
              </div>
              <div className="col-span-3 grid grid-cols-3 gap-4">
                <Link to="/deals/pipeline" className="group p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <PieChart className="mb-2 text-nuvos-lightblue" />
                  <h3 className="font-medium mb-1">Active Deal Pipeline</h3>
                  <p className="text-sm text-gray-500">Track all deals in your pipeline</p>
                </Link>
                <Link to="/deals/rooms" className="group p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <Kanban className="mb-2 text-nuvos-teal" />
                  <h3 className="font-medium mb-1">Deal Rooms</h3>
                  <p className="text-sm text-gray-500">Collaborate on specific deals</p>
                </Link>
                <Link to="/deals/tasks" className="group p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <ListTodo className="mb-2 text-nuvos-purple" />
                  <h3 className="font-medium mb-1">Assign Tasks & Notes</h3>
                  <p className="text-sm text-gray-500">Manage deal-related tasks</p>
                </Link>
                <Link to="/deals/documents" className="group p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <FileArchive className="mb-2 text-nuvos-lightblue" />
                  <h3 className="font-medium mb-1">Smart Document Storage</h3>
                  <p className="text-sm text-gray-500">Organize and access deal documents</p>
                </Link>
                <Link to="/deals/stages" className="group p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <Users className="mb-2 text-nuvos-teal" />
                  <h3 className="font-medium mb-1">Customizable Deal Stages</h3>
                  <p className="text-sm text-gray-500">Configure your deal workflow</p>
                </Link>
              </div>
            </>
          )}

          {activeMegaMenu === 'insights' && (
            <>
              <div className="col-span-1">
                <h3 className="font-grotesk font-medium text-xl mb-2">Insights & Collaboration</h3>
                <p className="text-gray-500 text-sm mb-4">
                  Leverage AI and team collaboration to gain deeper insights
                </p>
                <Link to="/insights/overview">
                  <Button className="w-full justify-start" variant="outline">View All Insights</Button>
                </Link>
              </div>
              <div className="col-span-3 grid grid-cols-3 gap-4">
                <Link to="/insights/ai-summaries" className="group p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <BrainCircuit className="mb-2 text-nuvos-purple" />
                  <h3 className="font-medium mb-1">AI Deal Summaries</h3>
                  <p className="text-sm text-gray-500">AI-generated deal analysis</p>
                </Link>
                <Link to="/insights/risk-alerts" className="group p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <AlertTriangle className="mb-2 text-nuvos-teal" />
                  <h3 className="font-medium mb-1">Smart Risk Alerts</h3>
                  <p className="text-sm text-gray-500">Get notified of potential issues</p>
                </Link>
                <Link to="/insights/dashboards" className="group p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <BarChart4 className="mb-2 text-nuvos-lightblue" />
                  <h3 className="font-medium mb-1">Live Performance Dashboards</h3>
                  <p className="text-sm text-gray-500">Track portfolio performance</p>
                </Link>
                <Link to="/insights/chat" className="group p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <MessagesSquare className="mb-2 text-nuvos-purple" />
                  <h3 className="font-medium mb-1">Team Chat + File Sharing</h3>
                  <p className="text-sm text-gray-500">Collaborate with your team</p>
                </Link>
                <Link to="/insights/reports" className="group p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <FileDigit className="mb-2 text-nuvos-teal" />
                  <h3 className="font-medium mb-1">Automated Deal Reports</h3>
                  <p className="text-sm text-gray-500">Generate professional reports</p>
                </Link>
              </div>
            </>
          )}
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && isMobile && (
        <div className="md:hidden fixed top-[72px] left-0 right-0 bottom-0 bg-white z-50 overflow-y-auto animate-slide-down">
          <div className="p-4">
            {user ? (
              <>
                <div className="flex items-center p-3 mb-3 border-b">
                  <Avatar className="h-9 w-9 mr-3">
                    <AvatarFallback className="bg-nuvos-blue text-white">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{profile?.name || 'User'}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <Link to="/dashboard" className="menu-item mb-2">
                    Dashboard
                  </Link>
                
                  <button 
                    className="w-full text-left p-3 border-b flex justify-between items-center"
                    onClick={() => toggleMegaMenu('valuation')}
                  >
                    <span className="font-medium">Valuation & Forecasting</span>
                    <ChevronDown size={16} className={activeMegaMenu === 'valuation' ? "rotate-180" : ""} />
                  </button>
                  {activeMegaMenu === 'valuation' && (
                    <div className="pl-3 pt-2 pb-1">
                      <Link to="/valuation/development" className="menu-item">
                        <Building size={16} /> Development Modeling
                      </Link>
                      <Link to="/valuation/acquisition" className="menu-item">
                        <BarChart3 size={16} /> Acquisition Underwriting
                      </Link>
                      <Link to="/valuation/calculator" className="menu-item">
                        <Calculator size={16} /> DCF + IRR Calculator
                      </Link>
                      <Link to="/valuation/scenarios" className="menu-item">
                        <LineChart size={16} /> Market Scenario Simulations
                      </Link>
                      <Link to="/valuation/templates" className="menu-item">
                        <FileText size={16} /> Property-Type Templates
                      </Link>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <button 
                    className="w-full text-left p-3 border-b flex justify-between items-center"
                    onClick={() => toggleMegaMenu('deal')}
                  >
                    <span className="font-medium">Deal Management</span>
                    <ChevronDown size={16} className={activeMegaMenu === 'deal' ? "rotate-180" : ""} />
                  </button>
                  {activeMegaMenu === 'deal' && (
                    <div className="pl-3 pt-2 pb-1">
                      <Link to="/deals/pipeline" className="menu-item">
                        <PieChart size={16} /> Active Deal Pipeline
                      </Link>
                      <Link to="/deals/rooms" className="menu-item">
                        <Kanban size={16} /> Deal Rooms
                      </Link>
                      <Link to="/deals/tasks" className="menu-item">
                        <ListTodo size={16} /> Assign Tasks & Notes
                      </Link>
                      <Link to="/deals/documents" className="menu-item">
                        <FileArchive size={16} /> Smart Document Storage
                      </Link>
                      <Link to="/deals/stages" className="menu-item">
                        <Users size={16} /> Customizable Deal Stages
                      </Link>
                    </div>
                  )}
                </div>
                
                <div className="mb-6">
                  <button 
                    className="w-full text-left p-3 border-b flex justify-between items-center"
                    onClick={() => toggleMegaMenu('insights')}
                  >
                    <span className="font-medium">Insights & Collaboration</span>
                    <ChevronDown size={16} className={activeMegaMenu === 'insights' ? "rotate-180" : ""} />
                  </button>
                  {activeMegaMenu === 'insights' && (
                    <div className="pl-3 pt-2 pb-1">
                      <Link to="/insights/ai-summaries" className="menu-item">
                        <BrainCircuit size={16} /> AI Deal Summaries
                      </Link>
                      <Link to="/insights/risk-alerts" className="menu-item">
                        <AlertTriangle size={16} /> Smart Risk Alerts
                      </Link>
                      <Link to="/insights/dashboards" className="menu-item">
                        <BarChart4 size={16} /> Live Performance Dashboards
                      </Link>
                      <Link to="/insights/chat" className="menu-item">
                        <MessagesSquare size={16} /> Team Chat + File Sharing
                      </Link>
                      <Link to="/insights/reports" className="menu-item">
                        <FileDigit size={16} /> Automated Deal Reports
                      </Link>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 mt-4 pt-4 border-t">
                  <Link to="/profile" className="menu-item">
                    <User size={16} /> Profile
                  </Link>
                  <Link to="/settings" className="menu-item">
                    <Settings size={16} /> Settings
                  </Link>
                  <button onClick={() => signOut()} className="menu-item text-red-500">
                    <LogOut size={16} /> Log out
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link to="/login" className="w-full">
                  <Button variant="outline" className="w-full">Log in</Button>
                </Link>
                <Link to="/signup" className="w-full">
                  <Button variant="default" className="w-full">Sign up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
