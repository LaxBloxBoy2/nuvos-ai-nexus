
import { useState, useEffect } from "react";
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
  Clock,
  Plus
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { Deal } from "@/lib/supabase";

type DealsByStage = {
  [key: string]: Deal[];
};

// Define the deal stages
const DEAL_STAGES = ["Screening", "Due Diligence", "Negotiation", "Closing"];

const Pipeline = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [dealsByStage, setDealsByStage] = useState<DealsByStage>({
    Screening: [],
    "Due Diligence": [],
    Negotiation: [],
    Closing: []
  });
  const [newDeal, setNewDeal] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    property_type: "Multifamily",
    price: "",
    cap_rate: "",
    irr: "",
    status: "Screening",
    priority: "Medium" as "High" | "Medium" | "Low" | undefined
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { user, profile } = useAuth();
  const { deals, loadingDeals, createDeal, updateDeal, refreshData } = useData();

  useEffect(() => {
    refreshData(['deals']);
  }, []);

  useEffect(() => {
    if (deals.length > 0) {
      const grouped = deals.reduce<DealsByStage>((acc, deal) => {
        // Only include deals in our defined stages
        if (DEAL_STAGES.includes(deal.status)) {
          if (!acc[deal.status]) {
            acc[deal.status] = [];
          }
          acc[deal.status].push(deal);
        }
        return acc;
      }, {
        Screening: [],
        "Due Diligence": [],
        Negotiation: [],
        Closing: []
      });
      
      setDealsByStage(grouped);
    }
  }, [deals]);

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

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

    // Find the moved deal
    const deal = dealsByStage[source.droppableId].find(d => d.id === draggableId);
    if (!deal) return;

    // If changing stages, update in database
    if (source.droppableId !== destination.droppableId) {
      // Optimistically update local state
      const sourceDeals = [...dealsByStage[source.droppableId]];
      const [removed] = sourceDeals.splice(source.index, 1);
      
      const destDeals = [...dealsByStage[destination.droppableId]];
      destDeals.splice(destination.index, 0, {
        ...removed,
        status: destination.droppableId
      });
      
      setDealsByStage({
        ...dealsByStage,
        [source.droppableId]: sourceDeals,
        [destination.droppableId]: destDeals
      });

      // Update in database
      const success = await updateDeal(draggableId, {
        status: destination.droppableId
      });
      
      if (success) {
        toast.success(`Deal moved to ${destination.droppableId}`);
      } else {
        // Revert the change if update failed
        refreshData(['deals']);
      }
    } else {
      // Just reordering within the same stage (only update local state)
      const sourceDeals = [...dealsByStage[source.droppableId]];
      const [removed] = sourceDeals.splice(source.index, 1);
      sourceDeals.splice(destination.index, 0, removed);
      
      setDealsByStage({
        ...dealsByStage,
        [source.droppableId]: sourceDeals
      });
    }
  };

  const handleCreateDeal = async () => {
    // Basic validation
    if (!newDeal.name || !newDeal.address || !newDeal.city || !newDeal.state) {
      toast.error("Please fill in all required fields");
      return;
    }

    const dealData = {
      name: newDeal.name,
      address: newDeal.address,
      property_id: "", // This would normally come from a selected property
      city: newDeal.city,
      state: newDeal.state,
      property_type: newDeal.property_type,
      price: newDeal.price,
      cap_rate: newDeal.cap_rate,
      irr: newDeal.irr,
      status: newDeal.status,
      priority: newDeal.priority,
      team_members: [user?.id || ""],
      notes: ""
    };

    const newDealId = await createDeal(dealData);
    
    if (newDealId) {
      // Reset form and close dialog
      setNewDeal({
        name: "",
        address: "",
        city: "",
        state: "",
        property_type: "Multifamily",
        price: "",
        cap_rate: "",
        irr: "",
        status: "Screening",
        priority: "Medium"
      });
      setIsDialogOpen(false);
      
      // Update deal list
      await refreshData(['deals']);
    }
  };

  const filteredDealsByStage = Object.fromEntries(
    Object.entries(dealsByStage).map(([stage, stageDeals]) => [
      stage,
      stageDeals.filter(
        deal =>
          deal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          deal.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          deal.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          deal.property_type?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    ])
  );

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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
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
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-nuvos-teal hover:bg-nuvos-teal/90 flex items-center gap-1">
                <PlusCircle size={16} />
                Add Deal
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Add New Deal</DialogTitle>
                <DialogDescription>
                  Enter the details of your new real estate opportunity
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="name">Deal Name*</Label>
                    <Input 
                      id="name"
                      value={newDeal.name}
                      onChange={(e) => setNewDeal({...newDeal, name: e.target.value})}
                      placeholder="Enter deal name"
                      className="mt-2"
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <Label htmlFor="address">Address*</Label>
                    <Input 
                      id="address"
                      value={newDeal.address}
                      onChange={(e) => setNewDeal({...newDeal, address: e.target.value})}
                      placeholder="Street address"
                      className="mt-2"
                    />
                  </div>
                  
                  <div className="col-span-1">
                    <Label htmlFor="city">City*</Label>
                    <Input 
                      id="city"
                      value={newDeal.city}
                      onChange={(e) => setNewDeal({...newDeal, city: e.target.value})}
                      placeholder="City"
                      className="mt-2"
                    />
                  </div>
                  
                  <div className="col-span-1">
                    <Label htmlFor="state">State*</Label>
                    <Input 
                      id="state"
                      value={newDeal.state}
                      onChange={(e) => setNewDeal({...newDeal, state: e.target.value})}
                      placeholder="State"
                      className="mt-2"
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <Label htmlFor="property_type">Property Type</Label>
                    <Select 
                      value={newDeal.property_type}
                      onValueChange={(value) => setNewDeal({...newDeal, property_type: value})}
                    >
                      <SelectTrigger id="property_type" className="mt-2">
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="Multifamily">Multifamily</SelectItem>
                          <SelectItem value="Office">Office</SelectItem>
                          <SelectItem value="Retail">Retail</SelectItem>
                          <SelectItem value="Industrial">Industrial</SelectItem>
                          <SelectItem value="Medical Office">Medical Office</SelectItem>
                          <SelectItem value="Mixed Use">Mixed Use</SelectItem>
                          <SelectItem value="Land">Land</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="col-span-1">
                    <Label htmlFor="price">Price</Label>
                    <Input 
                      id="price"
                      value={newDeal.price}
                      onChange={(e) => setNewDeal({...newDeal, price: e.target.value})}
                      placeholder="$0.00M"
                      className="mt-2"
                    />
                  </div>
                  
                  <div className="col-span-1">
                    <Label htmlFor="status">Initial Status</Label>
                    <Select 
                      value={newDeal.status}
                      onValueChange={(value) => setNewDeal({...newDeal, status: value})}
                    >
                      <SelectTrigger id="status" className="mt-2">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="Screening">Screening</SelectItem>
                          <SelectItem value="Due Diligence">Due Diligence</SelectItem>
                          <SelectItem value="Negotiation">Negotiation</SelectItem>
                          <SelectItem value="Closing">Closing</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="col-span-1">
                    <Label htmlFor="cap_rate">Cap Rate</Label>
                    <Input 
                      id="cap_rate"
                      value={newDeal.cap_rate}
                      onChange={(e) => setNewDeal({...newDeal, cap_rate: e.target.value})}
                      placeholder="5.2%"
                      className="mt-2"
                    />
                  </div>
                  
                  <div className="col-span-1">
                    <Label htmlFor="irr">IRR</Label>
                    <Input 
                      id="irr"
                      value={newDeal.irr}
                      onChange={(e) => setNewDeal({...newDeal, irr: e.target.value})}
                      placeholder="15.0%"
                      className="mt-2"
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select 
                      value={newDeal.priority}
                      onValueChange={(value: "High" | "Medium" | "Low") => setNewDeal({...newDeal, priority: value})}
                    >
                      <SelectTrigger id="priority" className="mt-2">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Low">Low</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button 
                  className="bg-nuvos-teal hover:bg-nuvos-teal/90"
                  onClick={handleCreateDeal}
                >
                  Create Deal
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
            {loadingDeals ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {DEAL_STAGES.map((stage) => (
                  <div key={stage} className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{stage}</h3>
                        <Badge variant="outline">
                          <div className="w-4 h-4 animate-pulse bg-gray-200 rounded-full"></div>
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex-1 p-3 rounded-lg bg-gray-100/50 min-h-[500px]">
                      <div className="space-y-3">
                        {[1, 2, 3].map((item) => (
                          <Card key={item} className="bg-white">
                            <CardContent className="p-4">
                              <div className="animate-pulse flex flex-col space-y-3">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                                <div className="h-3 bg-gray-200 rounded w-4/6"></div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <DragDropContext onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {DEAL_STAGES.map((stageKey) => (
                    <div key={stageKey} className="flex flex-col h-full">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{stageKey}</h3>
                          <Badge variant="outline">
                            {filteredDealsByStage[stageKey]?.length || 0}
                          </Badge>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreHorizontal size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={() => {
                                setNewDeal({...newDeal, status: stageKey});
                                setIsDialogOpen(true);
                              }}
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Add Deal to {stageKey}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      <Droppable droppableId={stageKey}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`flex-1 p-3 rounded-lg ${
                              snapshot.isDraggingOver ? "bg-gray-50" : "bg-gray-100/50"
                            } min-h-[500px]`}
                          >
                            <div className="space-y-3">
                              {filteredDealsByStage[stageKey]?.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 px-4 bg-white border border-dashed border-gray-200 rounded-lg">
                                  <FileText className="text-gray-300 mb-2" size={24} />
                                  <p className="text-gray-500 text-sm">No deals in this stage</p>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="mt-2" 
                                    onClick={() => {
                                      setNewDeal({...newDeal, status: stageKey});
                                      setIsDialogOpen(true);
                                    }}
                                  >
                                    <Plus className="mr-1 h-4 w-4" />
                                    Add Deal
                                  </Button>
                                </div>
                              ) : (
                                filteredDealsByStage[stageKey]?.map((deal, index) => (
                                  <Draggable key={deal.id} draggableId={deal.id} index={index}>
                                    {(provided, snapshot) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className={snapshot.isDragging ? "shadow-lg" : ""}
                                      >
                                        <Card className="bg-white hover:shadow-md transition-shadow">
                                          <CardContent className="p-4">
                                            <div className="flex items-center justify-between mb-2">
                                              <div className="flex items-center gap-2">
                                                <div 
                                                  className={getPriorityStyles(deal.priority)} 
                                                  title={`Priority: ${deal.priority}`} 
                                                />
                                                <Badge className={getPropertyTypeColor(deal.property_type || "Other")}>
                                                  {deal.property_type || "Other"}
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
                                                <p className="font-medium">{deal.cap_rate}</p>
                                              </div>
                                              <div>
                                                <p className="text-gray-500">IRR</p>
                                                <p className="font-medium">{deal.irr}</p>
                                              </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                              <div className="flex -space-x-2">
                                                {deal.team_members?.map((member, i) => (
                                                  <Avatar key={i} className="h-6 w-6 border-2 border-white">
                                                    <AvatarFallback className="text-xs bg-nuvos-blue text-white">
                                                      {getInitials(profile?.name || 'User')}
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
            )}
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
              
              {loadingDeals ? (
                <div>
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div 
                      key={item} 
                      className="grid grid-cols-12 gap-4 p-4 border-b animate-pulse"
                    >
                      <div className="col-span-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </div>
                      <div className="col-span-2">
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                      <div className="col-span-1">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                      </div>
                      <div className="col-span-1">
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      </div>
                      <div className="col-span-1">
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                      <div className="col-span-1">
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                      <div className="col-span-2">
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      </div>
                      <div className="col-span-1">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                deals
                  .filter(deal => 
                    (deal.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    deal.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    deal.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    deal.property_type?.toLowerCase().includes(searchQuery.toLowerCase()))
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
                        <Badge className={getPropertyTypeColor(deal.property_type || "Other")}>
                          {deal.property_type || "Other"}
                        </Badge>
                      </div>
                      <div className="col-span-1">{deal.price}</div>
                      <div className="col-span-1">{deal.cap_rate}</div>
                      <div className="col-span-1">{deal.irr}</div>
                      <div className="col-span-2">
                        <div className="flex -space-x-2">
                          {deal.team_members?.map((member, i) => (
                            <Avatar key={i} className="h-6 w-6 border-2 border-white">
                              <AvatarFallback className="text-xs bg-nuvos-blue text-white">
                                {profile?.name ? getInitials(profile.name) : 'U'}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                      </div>
                      <div className="col-span-1">
                        <Badge variant="outline">{deal.status}</Badge>
                      </div>
                    </div>
                  ))
              )}
              
              {!loadingDeals && deals.filter(deal => 
                (deal.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                deal.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                deal.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                deal.property_type?.toLowerCase().includes(searchQuery.toLowerCase()))
              ).length === 0 && (
                <div className="flex flex-col items-center justify-center py-10">
                  <FileText className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-1">No deals found</h3>
                  <p className="text-gray-500 text-sm text-center mb-4">
                    Try adjusting your search or create a new deal
                  </p>
                  <Button 
                    className="bg-nuvos-teal hover:bg-nuvos-teal/90"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Deal
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Pipeline;
