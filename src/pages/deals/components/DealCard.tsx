
import { MapPin, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Deal } from "@/lib/supabase";

interface DealCardProps {
  deal: Deal;
  getPropertyTypeColor: (type: string) => string;
  getPriorityStyles: (priority?: string) => string;
  getInitials: (name: string) => string;
  profileName?: string;
}

const DealCard = ({ 
  deal, 
  getPropertyTypeColor, 
  getPriorityStyles, 
  getInitials,
  profileName = 'User'
}: DealCardProps) => {
  return (
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
                  {getInitials(profileName)}
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
  );
};

export default DealCard;
