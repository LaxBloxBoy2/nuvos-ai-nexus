
import { BarChart3, Building2, LineChart, TrendingUp, PlusCircle, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart } from "@/components/ui/chart";

const Dashboard = () => {
  // Sample data for charts
  const chartData = [
    {
      name: "Jan",
      Office: 4000,
      Retail: 2400,
      Multifamily: 3200,
      Industrial: 5800,
    },
    {
      name: "Feb",
      Office: 3500,
      Retail: 2100,
      Multifamily: 3400,
      Industrial: 6200,
    },
    {
      name: "Mar",
      Office: 4200,
      Retail: 2300,
      Multifamily: 3800,
      Industrial: 6800,
    },
    {
      name: "Apr",
      Office: 3800,
      Retail: 2500,
      Multifamily: 4100,
      Industrial: 7200,
    },
    {
      name: "May",
      Office: 3600,
      Retail: 2800,
      Multifamily: 4500,
      Industrial: 7500,
    },
    {
      name: "Jun",
      Office: 3900,
      Retail: 3000,
      Multifamily: 4700,
      Industrial: 7800,
    },
  ];

  // Recent activity data
  const recentActivity = [
    {
      id: 1,
      action: "New deal added",
      property: "123 Main Street Office Building",
      time: "2 hours ago",
      status: "New",
    },
    {
      id: 2,
      action: "Valuation updated",
      property: "Riverside Apartments",
      time: "5 hours ago",
      status: "Updated",
    },
    {
      id: 3,
      action: "New comment",
      property: "Downtown Retail Center",
      time: "1 day ago",
      status: "Activity",
    },
    {
      id: 4,
      action: "Deal stage changed",
      property: "West Side Industrial Park",
      time: "2 days ago",
      status: "Updated",
    },
  ];

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-500">Welcome back! Here's an overview of your CRE portfolio.</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
          <Button variant="outline" className="flex items-center gap-1">
            <PlusCircle size={16} />
            New Deal
          </Button>
          <Button className="bg-nuvos-teal hover:bg-nuvos-teal/90 flex items-center gap-1">
            <PlusCircle size={16} />
            Create Model
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Deals</CardDescription>
            <CardTitle className="text-2xl flex items-center justify-between">
              23
              <Building2 className="text-nuvos-teal" size={20} />
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-center text-xs text-green-500 font-medium">
              <TrendingUp size={14} className="mr-1" />
              <span>7% increase</span>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <p className="text-xs text-gray-500">Compared to last month</p>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Average Cap Rate</CardDescription>
            <CardTitle className="text-2xl flex items-center justify-between">
              5.8%
              <LineChart className="text-nuvos-purple" size={20} />
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-center text-xs text-green-500 font-medium">
              <TrendingUp size={14} className="mr-1" />
              <span>0.2% improvement</span>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <p className="text-xs text-gray-500">Across all properties</p>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Portfolio Value</CardDescription>
            <CardTitle className="text-2xl flex items-center justify-between">
              $438.2M
              <BarChart3 className="text-nuvos-teal" size={20} />
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-center text-xs text-green-500 font-medium">
              <TrendingUp size={14} className="mr-1" />
              <span>4.3% increase</span>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <p className="text-xs text-gray-500">Year to date growth</p>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Avg. IRR (Target)</CardDescription>
            <CardTitle className="text-2xl flex items-center justify-between">
              17.3%
              <TrendingUp className="text-nuvos-purple" size={20} />
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-center text-xs text-amber-500 font-medium">
              <ArrowUpRight size={14} className="mr-1" />
              <span>1.2% below target</span>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <p className="text-xs text-gray-500">Target IRR: 18.5%</p>
          </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Portfolio Performance by Property Type</CardTitle>
            <CardDescription>Value in millions ($) for the last 6 months</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[300px] w-full">
              <BarChart
                data={chartData}
                categories={["Office", "Retail", "Multifamily", "Industrial"]}
                index="name"
                colors={["#0A1933", "#12B5B0", "#9B7BFF", "#2A85FF"]}
                valueFormatter={(value) => `$${value / 1000}M`}
                yAxisWidth={60}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from your deals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[280px] overflow-y-auto">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-none">
                  <div className="w-2 h-2 bg-nuvos-teal rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{activity.action}</p>
                    <p className="text-sm text-gray-500">{activity.property}</p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                  <div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      activity.status === "New" 
                        ? "bg-green-100 text-green-800" 
                        : activity.status === "Updated" 
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                    }`}>
                      {activity.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full text-nuvos-teal hover:text-nuvos-teal/90">
              View All Activity
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Active Deal Pipeline</CardTitle>
            <CardDescription>Current deal status across stages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Screening (8)</span>
                  <span className="text-xs text-gray-500">35%</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full">
                  <div className="bg-nuvos-teal h-2 rounded-full" style={{ width: "35%" }}></div>
                </div>
              </div>
              
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Due Diligence (6)</span>
                  <span className="text-xs text-gray-500">26%</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full">
                  <div className="bg-nuvos-purple h-2 rounded-full" style={{ width: "26%" }}></div>
                </div>
              </div>
              
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Negotiation (5)</span>
                  <span className="text-xs text-gray-500">22%</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full">
                  <div className="bg-nuvos-lightblue h-2 rounded-full" style={{ width: "22%" }}></div>
                </div>
              </div>
              
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Closing (4)</span>
                  <span className="text-xs text-gray-500">17%</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: "17%" }}></div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View Pipeline
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Top Properties by Performance</CardTitle>
            <CardDescription>Based on IRR and cash flow</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: "Oakridge Apartments",
                  type: "Multifamily",
                  irr: "24.5%",
                  location: "Austin, TX",
                },
                {
                  name: "Century Business Park",
                  type: "Industrial",
                  irr: "22.1%",
                  location: "Nashville, TN",
                },
                {
                  name: "Metro Office Tower",
                  type: "Office",
                  irr: "19.7%",
                  location: "Charlotte, NC",
                },
                {
                  name: "Riverside Commons",
                  type: "Retail",
                  irr: "18.3%",
                  location: "Denver, CO",
                },
              ].map((property, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-md flex items-center justify-center ${
                      property.type === "Multifamily" ? "bg-nuvos-teal/10 text-nuvos-teal" :
                      property.type === "Industrial" ? "bg-nuvos-purple/10 text-nuvos-purple" :
                      property.type === "Office" ? "bg-nuvos-blue/10 text-nuvos-blue" :
                      "bg-nuvos-lightblue/10 text-nuvos-lightblue"
                    }`}>
                      <Building2 size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{property.name}</h4>
                      <p className="text-xs text-gray-500">{property.type} | {property.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{property.irr}</p>
                    <p className="text-xs text-gray-500">IRR</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View All Properties
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
