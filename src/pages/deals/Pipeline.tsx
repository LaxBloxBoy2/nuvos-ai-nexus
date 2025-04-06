
import { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { 
  Building, 
  Calendar, 
  MapPin, 
  Users, 
  Search, 
  PlusCircle, 
  Filter, 
  ChevronDown, 
  Building2, 
  FileText,
  MoreHorizontal,
  Clock
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

// Mock data for deals
interface Deal {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  type: string;
  price: string;
  capRate: string;
  irr: string;
  stage: string;
  dueDate?: string;
  team: string[];
  image?: string;
  priority?: "High" | "Medium" | "Low";
}

const initialDeals: Deal[] = [
  {
    id: "1",
    name: "Oakridge Apartments",
    address: "123 Main St",
    city: "Austin",
    state: "TX",
    type: "Multifamily",
    price: "$32.5M",
    capRate: "5.2%",
    irr: "18.7%",
    stage: "Screening",
    dueDate: "2025-05-20",
    team: ["JD", "AL", "MK"],
    priority: "High",
  },
  {
    id: "2",
    name: "Century Business Park",
    address: "456 Commerce Ave",
    city: "Nashville",
    state: "TN",
    type: "Industrial",
    price: "$48.2M",
    capRate: "6.1%",
    irr: "21.4%",
    stage: "Screening",
    dueDate: "2025-05-28",
    team: ["AL", "MK"],
    priority: "Medium",
  },
  {
    id: "3",
    name: "Metro Office Tower",
    address: "789 Skyline Blvd",
    city: "Charlotte",
    state: "NC",
    type: "Office",
    price: "$65.8M",
    capRate: "4.8%",
    irr: "16.2%",
    stage: "Due Diligence",
    team: ["JD", "RW"],
    priority: "Medium",
  },
  {
    id: "4",
    name: "Riverside Commons",
    address: "321 River Rd",
    city: "Denver",
    state: "CO",
    type: "Retail",
    price: "$27.3M",
    capRate: "5.5%",
    irr: "19.1%",
    stage: "Due Diligence",
    dueDate: "2025-06-10",
    team: ["AL", "RW", "MK"],
    priority: "High",
  },
  {
    id: "5",
    name: "Parkview Medical Plaza",
    address: "555 Health Ave",
    city: "Phoenix",
    state: "AZ",
    type: "Medical Office",
    price: "$18.9M",
    capRate: "5.8%",
    irr: "17.5%",
    stage: "Negotiation",
    team: ["JD"],
    priority: "Low",
  },
  {
    id: "6",
    name: "Summit Logistics Center",
    address: "888 Freight Way",
    city: "Dallas",
    state: "TX",
    type: "Industrial",
    price: "$52.4M",
    capRate: "6.3%",
    irr: "22.8%",
    stage: "Negotiation",
    dueDate: "2025-05-15",
    team: ["MK", "RW"],
    priority: "High",
  },
  {
    id: "7",
    name: "Lakeview Residences",
    address: "777 Shore Dr",
    city: "Chicago",
    state: "IL",
    type: "Multifamily",
    price: "$41.7M",
    capRate: "4.9%",
    irr: "16.8%",
    stage: "Closing",
    dueDate: "2025-05-12",
    team: ["JD", "AL"],
    priority: "Medium",
  },
  {
    id: "8",
    name: "Gateway Shopping Center",
    address: "444 Retail Pkwy",
    city: "Atlanta",
    state: "GA",
    type: "Retail",
    price: "$36.2M",
    capRate: "5.4%",
    irr: "18.3%",
    stage: "Closing",
    team: ["RW"],
    priority: "Low",
  },
];

const Pipeline = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [deals, setDeals] = useState<{ [key: string]: Deal[] }>({
    Screening: initialDeals.filter((deal) => deal.stage === "Screening"),
    "Due Diligence": initialDeals.filter((deal) => deal.stage === "Due Diligence"),
    Negotiation: initialDeals.filter((deal) => deal.stage === "Negotiation"),
    Closing: initialDeals.filter((deal) => deal.stage === "Closing"),
  });
  const { toast } = useToast();

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    // Dropped outside the list
    if (!destination) {
      return;
    }

    // Check if actually moved
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Moving within the same list
    if (source.droppableId === destination.droppableId) {
      const list = [...deals[source.droppableId]];
      const [removed] = list.splice(source.index, 1);
      list.splice(destination.index, 0, removed);
      setDeals({
        ...deals,
        [source.droppableId]: list,
      });
    }
    // Moving from one list to another
    else {
      const sourceList = [...deals[source.droppableId]];
      const destList = [...deals[destination.droppableId]];
      const [removed] = sourceList.splice(source.index, 1);
      removed.stage = destination.droppableId;
      destList.splice(destination.index, 0, removed);
      setDeals({
        ...deals,
        [source.droppableId]: sourceList,
        [destination.droppableId]: destList,
      });

      toast({
        title: "Deal stage updated",
        description: `${removed.name} moved to ${destination.droppableId}`,
      });
    }
  };

  const filteredDeals = Object.keys(deals).reduce((acc, key) => {
    acc[key] = deals[key].filter(
      (deal) =>
        deal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return acc;
  }, {} as { [key: string]: Deal[] });

  const getPropertyTypeColor = (type: string) => {
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

  const getPriorityStyles = (priority?: string) => {
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

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Deal Pipeline</h1>
          <p className="text-gray-500">Track and manage your active deals across stages</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
          <Button variant="outline" className="flex items-center gap-1">
            <Filter size={16} />
            Filter
            <ChevronDown size={14} />
          </Button>
          <Button className="bg-nuvos-teal hover:bg-nuvos-teal/90 flex items-center gap-1">
            <PlusCircle size={16} />
            Add Deal
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <Tabs defaultValue="kanban">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
            <TabsList>
              <TabsTrigger value="kanban">Kanban View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                className="pl-10 w-full sm:w-[300px]"
                placeholder="Search deals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <TabsContent value="kanban">
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.keys(deals).map((stageKey) => (
                  <div key={stageKey} className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{stageKey}</h3>
                        <Badge variant="outline">{filteredDeals[stageKey].length}</Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                      >
                        <MoreHorizontal size={16} />
                      </Button>
                    </div>
                    
                    <Droppable droppableId={stageKey}>
                      {(provided, snapshot) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className={`flex-1 p-3 rounded-lg ${
                            snapshot.isDraggingOver ? "bg-gray-50" : "bg-gray-100/50"
                          } min-h-[500px]`}
                        >
                          <div className="space-y-3">
                            {filteredDeals[stageKey].length === 0 ? (
                              <div className="flex flex-col items-center justify-center py-8 px-4 bg-white border border-dashed border-gray-200 rounded-lg">
                                <FileText className="text-gray-300 mb-2" size={24} />
                                <p className="text-gray-500 text-sm">No deals in this stage</p>
                              </div>
                            ) : (
                              filteredDeals[stageKey].map((deal, index) => (
                                <Draggable key={deal.id} draggableId={deal.id} index={index}>
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={`${
                                        snapshot.isDragging
                                          ? "shadow-lg"
                                          : ""
                                      }`}
                                    >
                                      <Card className="bg-white hover:shadow-md transition-shadow">
                                        <CardContent className="p-4">
                                          <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                              <div className={getPriorityStyles(deal.priority)} title={`Priority: ${deal.priority}`} />
                                              <Badge className={getPropertyTypeColor(deal.type)}>
                                                {deal.type}
                                              </Badge>
                                            </div>
                                            <div className="text-sm font-medium">
                                              {deal.price}
                                            </div>
                                          </div>
                                          <h4 className="font-medium mb-1">{deal.name}</h4>
                                          <div className="flex items-center gap-1 text-gray-500 text-xs mb-3">
                                            <MapPin size={12} />
                                            <span>
                                              {deal.city}, {deal.state}
                                            </span>
                                          </div>
                                          <div className="flex gap-4 text-xs mb-3">
                                            <div>
                                              <p className="text-gray-500">Cap Rate</p>
                                              <p className="font-medium">{deal.capRate}</p>
                                            </div>
                                            <div>
                                              <p className="text-gray-500">IRR</p>
                                              <p className="font-medium">{deal.irr}</p>
                                            </div>
                                          </div>
                                          <div className="flex items-center justify-between">
                                            <div className="flex -space-x-2">
                                              {deal.team.map((member, i) => (
                                                <Avatar key={i} className="h-6 w-6 border-2 border-white">
                                                  <AvatarFallback className="text-xs bg-nuvos-blue text-white">
                                                    {member}
                                                  </AvatarFallback>
                                                </Avatar>
                                              ))}
                                            </div>
                                            {deal.dueDate && (
                                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                                <Clock size={12} />
                                                <span>
                                                  {new Date(deal.dueDate).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                  })}
                                                </span>
                                              </div>
                                            )}
                                          </div>
                                        </CardContent>
                                      </Card>
                                    </div>
                                  )}
                                </Draggable>
                              ))
                            )}
                          </div>
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                ))}
              </div>
            </DragDropContext>
          </TabsContent>

          <TabsContent value="list">
            <div className="rounded-lg border">
              <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b font-medium text-sm">
                <div className="col-span-3">Property</div>
                <div className="col-span-2">Location</div>
                <div className="col-span-1">Type</div>
                <div className="col-span-1">Price</div>
                <div className="col-span-1">Cap Rate</div>
                <div className="col-span-1">IRR</div>
                <div className="col-span-2">Team</div>
                <div className="col-span-1">Stage</div>
              </div>
              
              {initialDeals
                .filter(
                  (deal) =>
                    deal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    deal.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    deal.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    deal.type.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((deal) => (
                  <div 
                    key={deal.id} 
                    className="grid grid-cols-12 gap-4 p-4 border-b last:border-b-0 items-center hover:bg-gray-50 transition-colors"
                  >
                    <div className="col-span-3">
                      <div className="flex items-center gap-2">
                        <div className={getPriorityStyles(deal.priority)} />
                        <div>
                          <p className="font-medium">{deal.name}</p>
                          <p className="text-xs text-gray-500">{deal.address}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2">
                      {deal.city}, {deal.state}
                    </div>
                    <div className="col-span-1">
                      <Badge className={getPropertyTypeColor(deal.type)}>
                        {deal.type}
                      </Badge>
                    </div>
                    <div className="col-span-1">{deal.price}</div>
                    <div className="col-span-1">{deal.capRate}</div>
                    <div className="col-span-1">{deal.irr}</div>
                    <div className="col-span-2">
                      <div className="flex -space-x-2">
                        {deal.team.map((member, i) => (
                          <Avatar key={i} className="h-6 w-6 border-2 border-white">
                            <AvatarFallback className="text-xs bg-nuvos-blue text-white">
                              {member}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                    </div>
                    <div className="col-span-1">
                      <Badge variant="outline">{deal.stage}</Badge>
                    </div>
                  </div>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Pipeline;
