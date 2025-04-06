
import { FileText, PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Deal } from "@/lib/supabase";

interface ListViewProps {
  deals: Deal[];
  loadingDeals: boolean;
  searchQuery: string;
  getPropertyTypeColor: (type: string) => string;
  getPriorityStyles: (priority?: string) => string;
  getInitials: (name: string) => string;
  onAddDeal: () => void;
  profileName?: string;
}

const ListView = ({
  deals,
  loadingDeals,
  searchQuery,
  getPropertyTypeColor,
  getPriorityStyles,
  getInitials,
  onAddDeal,
  profileName = 'User'
}: ListViewProps) => {
  // Filter deals based on search query
  const filteredDeals = deals.filter(deal => 
    (deal.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    deal.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    deal.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    deal.property_type?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loadingDeals) {
    return (
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
    );
  }

  if (filteredDeals.length === 0) {
    return (
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
        <div className="flex flex-col items-center justify-center py-10">
          <FileText className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium mb-1">No deals found</h3>
          <p className="text-gray-500 text-sm text-center mb-4">
            Try adjusting your search or create a new deal
          </p>
          <Button 
            className="bg-nuvos-teal hover:bg-nuvos-teal/90"
            onClick={onAddDeal}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Deal
          </Button>
        </div>
      </div>
    );
  }

  return (
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
      
      {filteredDeals.map((deal) => (
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
                    {getInitials(profileName)}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
          </div>
          <div className="col-span-1">
            <Badge variant="outline">{deal.status}</Badge>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListView;
