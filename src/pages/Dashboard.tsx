
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Building, 
  BarChart3, 
  Users, 
  FileText, 
  PlusCircle,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Loader2
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { CartesianGrid, LineChart as RechartsLineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart as RechartsBarChart, Bar } from "recharts";
import { toast } from "sonner";

const Dashboard = () => {
  const { user, profile } = useAuth();
  const { deals, properties, tasks, loadingDeals, loadingProperties, loadingTasks, refreshData } = useData();
  const [performanceData, setPerformanceData] = useState([]);
  const [loadingPerformance, setLoadingPerformance] = useState(false);
  
  useEffect(() => {
    // Fetch all required data when the component mounts
    refreshData(['deals', 'properties', 'tasks']);
    fetchPerformanceData();
  }, []);

  // Fetch performance metrics
  const fetchPerformanceData = async () => {
    setLoadingPerformance(true);
    try {
      // For now we'll use mock data since the performance_metrics table doesn't exist yet
      // In a real implementation, you would fetch this from Supabase
      const mockData = [
        { month: 'Jan', value: 12 },
        { month: 'Feb', value: 19 },
        { month: 'Mar', value: 15 },
        { month: 'Apr', value: 25 },
        { month: 'May', value: 32 },
        { month: 'Jun', value: 28 },
        { month: 'Jul', value: 35 },
      ];
      setPerformanceData(mockData);
    } catch (error) {
      console.error('Error fetching performance data:', error);
      toast.error('Failed to load performance data');
    } finally {
      setLoadingPerformance(false);
    }
  };
  
  // Count deals by status
  const dealsByStatus = deals.reduce((acc, deal) => {
    acc[deal.status] = (acc[deal.status] || 0) + 1;
    return acc;
  }, {});
  
  const dealsData = [
    { name: 'Screening', count: dealsByStatus['Screening'] || 0 },
    { name: 'Due Diligence', count: dealsByStatus['Due Diligence'] || 0 },
    { name: 'Negotiation', count: dealsByStatus['Negotiation'] || 0 },
    { name: 'Closing', count: dealsByStatus['Closing'] || 0 },
    { name: 'Closed', count: dealsByStatus['Closed'] || 0 },
  ];
  
  // Get property types distribution
  const propertyTypeCount = properties.reduce((acc, property) => {
    acc[property.property_type] = (acc[property.property_type] || 0) + 1;
    return acc;
  }, {});
  
  const propertyData = Object.keys(propertyTypeCount).map(type => ({
    name: type,
    count: propertyTypeCount[type]
  }));
  
  // Get upcoming tasks
  const upcomingTasks = tasks
    .filter(task => task.status !== 'Completed')
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
    .slice(0, 5);
    
  // Get recent deals
  const recentDeals = [...deals]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);
  
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };
  
  const getPropertyTypeColor = (type) => {
    switch (type) {
      case "Multifamily":
        return "bg-blue-100 text-blue-800";
      case "Industrial":
        return "bg-purple-100 text-purple-800";
      case "Office":
        return "bg-amber-100 text-amber-800";
      case "Retail":
        return "bg-emerald-100 text-emerald-800";
      case "Medical Office":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  const getPriorityStyles = (priority) => {
    switch (priority) {
      case "High":
        return "w-2 h-2 bg-red-500 rounded-full";
      case "Medium":
        return "w-2 h-2 bg-amber-500 rounded-full";
      case "Low":
        return "w-2 h-2 bg-green-500 rounded-full";
      default:
        return "w-2 h-2 bg-gray-300 rounded-full";
    }
  };
  
  const getTaskStatusColor = (status) => {
    switch (status) {
      case "Not Started":
        return "bg-gray-100 text-gray-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Loading placeholders
  const LoadingPlaceholder = ({ count = 3 }) => (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="h-20 bg-gray-100 animate-pulse rounded-lg"></div>
      ))}
    </div>
  );

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-bold">Welcome, {profile?.name || 'Investor'}</h1>
        <p className="text-gray-500">Here's an overview of your real estate portfolio and active deals</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Active Deals</p>
                <p className="text-3xl font-bold">
                  {loadingDeals ? (
                    <span className="w-8 h-6 bg-gray-200 animate-pulse inline-block"></span>
                  ) : (
                    deals.filter(d => d.status !== 'Closed' && d.status !== 'Dead').length
                  )}
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-full text-nuvos-blue">
                <Building size={20} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Properties</p>
                <p className="text-3xl font-bold">
                  {loadingProperties ? (
                    <span className="w-8 h-6 bg-gray-200 animate-pulse inline-block"></span>
                  ) : (
                    properties.length
                  )}
                </p>
              </div>
              <div className="p-2 bg-teal-100 rounded-full text-nuvos-teal">
                <BarChart3 size={20} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Open Tasks</p>
                <p className="text-3xl font-bold">
                  {loadingTasks ? (
                    <span className="w-8 h-6 bg-gray-200 animate-pulse inline-block"></span>
                  ) : (
                    tasks.filter(t => t.status !== 'Completed').length
                  )}
                </p>
              </div>
              <div className="p-2 bg-purple-100 rounded-full text-purple-600">
                <FileText size={20} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Team Members</p>
                <p className="text-3xl font-bold">1</p>
              </div>
              <div className="p-2 bg-amber-100 rounded-full text-amber-600">
                <Users size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>Deal Pipeline</CardTitle>
              <Link to="/deals/pipeline">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
            <CardDescription>Distribution of deals across stages</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingDeals ? (
              <div className="h-80 flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-nuvos-teal" />
              </div>
            ) : dealsData.some(d => d.count > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <RechartsBarChart data={dealsData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                </RechartsBarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex flex-col items-center justify-center">
                <Building className="h-16 w-16 text-gray-300 mb-2" />
                <p className="text-gray-500">No deals yet</p>
                <Link to="/deals/pipeline" className="mt-4">
                  <Button className="bg-nuvos-teal hover:bg-nuvos-teal/90">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add First Deal
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>Portfolio Performance</CardTitle>
              <Button variant="ghost" size="sm">View Report</Button>
            </div>
            <CardDescription>Year-to-date performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingPerformance ? (
              <div className="h-80 flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-nuvos-teal" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <RechartsLineChart data={performanceData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                </RechartsLineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>Recent Deals</CardTitle>
              <Link to="/deals/pipeline">
                <Button variant="ghost" size="sm">View All Deals</Button>
              </Link>
            </div>
            <CardDescription>Your most recent real estate opportunities</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingDeals ? (
              <LoadingPlaceholder count={3} />
            ) : recentDeals.length > 0 ? (
              <div className="space-y-4">
                {recentDeals.map((deal) => (
                  <div 
                    key={deal.id}
                    className="p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={getPriorityStyles(deal.priority)} title={`Priority: ${deal.priority}`} />
                        <div>
                          <h4 className="font-medium">{deal.name}</h4>
                          <div className="flex items-center gap-1 text-gray-500 text-xs mb-2">
                            <MapPin size={12} />
                            <span>{deal.city || 'N/A'}, {deal.state || 'N/A'}</span>
                          </div>
                          <div className="flex gap-3">
                            <Badge className={getPropertyTypeColor(deal.property_type || "Other")}>
                              {deal.property_type || "Other"}
                            </Badge>
                            <Badge variant="outline">{deal.status}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{deal.price || 'N/A'}</div>
                        <div className="text-xs text-gray-500">Cap Rate: {deal.cap_rate || 'N/A'}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10">
                <Building className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium mb-1">No deals yet</h3>
                <p className="text-gray-500 text-sm text-center mb-4">
                  Start tracking your real estate opportunities
                </p>
                <Link to="/deals/pipeline">
                  <Button className="bg-nuvos-teal hover:bg-nuvos-teal/90">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add First Deal
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>Upcoming Tasks</CardTitle>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            <CardDescription>Tasks that need your attention</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingTasks ? (
              <LoadingPlaceholder count={3} />
            ) : upcomingTasks.length > 0 ? (
              <div className="space-y-2">
                {upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-medium">{task.title}</div>
                      <Badge className={getTaskStatusColor(task.status)}>
                        {task.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        {new Date(task.due_date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <span>Assigned to:</span>
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className="text-[10px] bg-nuvos-blue text-white">
                            {getInitials(profile?.name || 'User')}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <CheckCircle2 className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium mb-1">No tasks yet</h3>
                <p className="text-gray-500 text-sm text-center mb-4">
                  You're all caught up!
                </p>
                <Button variant="outline">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Task
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
