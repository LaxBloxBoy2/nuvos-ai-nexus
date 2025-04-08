
import { useState, useEffect } from "react";
import { DropResult } from "react-beautiful-dnd";
import { Search, PlusCircle, Filter, ChevronDown, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { Deal } from "@/lib/supabase";
import { getPropertyTypeColor, getPriorityStyles, getInitials } from "./utils/dealUtils";
import KanbanView from "./components/KanbanView";
import ListView from "./components/ListView";
import AddDealDialog from "./components/AddDealDialog";

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState<"Screening" | "Due Diligence" | "Negotiation" | "Closing">("Screening");
  const [isFiltering, setIsFiltering] = useState(false);
  const [filterType, setFilterType] = useState<string | null>(null);

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
          
          // Apply filtering if active
          if (isFiltering && filterType && deal.property_type !== filterType) {
            return acc;
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
  }, [deals, isFiltering, filterType]);

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
        status: destination.droppableId as "Screening" | "Due Diligence" | "Negotiation" | "Closing"
      });
      
      setDealsByStage({
        ...dealsByStage,
        [source.droppableId]: sourceDeals,
        [destination.droppableId]: destDeals
      });

      // Update in database
      const success = await updateDeal(draggableId, {
        status: destination.droppableId as "Screening" | "Due Diligence" | "Negotiation" | "Closing"
      });
      
      if (success) {
        toast.success(`Deal moved to ${destination.droppableId}`);
      } else {
        // Revert the change if update failed
        refreshData(['deals']);
        toast.error("Failed to update deal status");
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

  const handleAddDealToStage = (stage: string) => {
    setSelectedStage(stage as "Screening" | "Due Diligence" | "Negotiation" | "Closing");
    setIsDialogOpen(true);
  };

  const handleCreateDeal = async (newDeal: {
    name: string;
    address: string;
    city: string;
    state: string;
    property_type: string;
    price: string;
    cap_rate: string;
    irr: string;
    status: "Screening" | "Due Diligence" | "Negotiation" | "Closing";
    priority: "High" | "Medium" | "Low";
  }) => {
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
      // Close dialog
      setIsDialogOpen(false);
      toast.success("Deal created successfully");
      // Update deal list
      await refreshData(['deals']);
    }
  };

  // Property types for filtering
  const propertyTypes = [
    "Multifamily", 
    "Industrial", 
    "Office", 
    "Retail", 
    "Medical Office", 
    "Mixed Use",
    "Land",
    "Other"
  ];

  const toggleFilter = (type: string) => {
    if (filterType === type) {
      setIsFiltering(false);
      setFilterType(null);
    } else {
      setIsFiltering(true);
      setFilterType(type);
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
          <div className="relative group">
            <Button variant="outline" className="flex items-center gap-1">
              <Filter size={16} />
              Filter
              <ChevronDown size={14} />
            </Button>
            
            <div className="absolute right-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 bg-white p-2 rounded shadow-lg border z-50">
              <div className="text-sm font-medium p-2 text-gray-700">Property Type</div>
              <div className="space-y-1 p-1">
                {propertyTypes.map(type => (
                  <div 
                    key={type} 
                    className={`px-3 py-2 text-sm rounded cursor-pointer hover:bg-gray-100 ${filterType === type ? 'bg-blue-50 text-blue-700' : ''}`}
                    onClick={() => toggleFilter(type)}
                  >
                    {type}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <Button 
            className="bg-nuvos-teal hover:bg-nuvos-teal/90 flex items-center gap-1"
            onClick={() => {
              setSelectedStage("Screening");
              setIsDialogOpen(true);
            }}
          >
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
            <KanbanView 
              dealsByStage={Object.fromEntries(
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
              )}
              stages={DEAL_STAGES}
              loadingDeals={loadingDeals}
              onDragEnd={handleDragEnd}
              onAddDealToStage={handleAddDealToStage}
              getInitials={getInitials}
              profileName={profile?.name}
            />
          </TabsContent>

          <TabsContent value="list">
            <ListView
              deals={deals.filter(deal => 
                (deal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                deal.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                deal.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                deal.property_type?.toLowerCase().includes(searchQuery.toLowerCase())) &&
                (!isFiltering || deal.property_type === filterType)
              )}
              loadingDeals={loadingDeals}
              searchQuery={searchQuery}
              getPropertyTypeColor={getPropertyTypeColor}
              getPriorityStyles={getPriorityStyles}
              getInitials={getInitials}
              onAddDeal={() => setIsDialogOpen(true)}
              profileName={profile?.name}
            />
          </TabsContent>
        </Tabs>
      </div>
      
      <AddDealDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        initialStatus={selectedStage}
        onCreateDeal={handleCreateDeal}
      />
    </div>
  );
};

export default Pipeline;
