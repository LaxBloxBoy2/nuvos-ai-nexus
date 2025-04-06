
import { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { MoreHorizontal, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Deal } from "@/lib/supabase";
import DealCard from "./DealCard";
import EmptyStage from "./EmptyStage";

interface KanbanViewProps {
  dealsByStage: Record<string, Deal[]>;
  stages: string[];
  loadingDeals: boolean;
  onDragEnd: (result: DropResult) => Promise<void>;
  onAddDealToStage: (stage: string) => void;
  getInitials: (name: string) => string;
  profileName?: string;
}

const KanbanView = ({
  dealsByStage,
  stages,
  loadingDeals,
  onDragEnd,
  onAddDealToStage,
  getInitials,
  profileName
}: KanbanViewProps) => {
  // Utility functions for styling
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

  // Loading state
  if (loadingDeals) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stages.map((stage) => (
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
                    <div className="p-4">
                      <div className="animate-pulse flex flex-col space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                        <div className="h-3 bg-gray-200 rounded w-4/6"></div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stages.map((stageKey) => (
          <div key={stageKey} className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{stageKey}</h3>
                <Badge variant="outline">
                  {dealsByStage[stageKey]?.length || 0}
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
                    onClick={() => onAddDealToStage(stageKey)}
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
                    {dealsByStage[stageKey]?.length === 0 ? (
                      <EmptyStage onAddDeal={() => onAddDealToStage(stageKey)} />
                    ) : (
                      dealsByStage[stageKey]?.map((deal, index) => (
                        <Draggable key={deal.id} draggableId={deal.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={snapshot.isDragging ? "shadow-lg" : ""}
                            >
                              <DealCard 
                                deal={deal}
                                getPropertyTypeColor={getPropertyTypeColor}
                                getPriorityStyles={getPriorityStyles}
                                getInitials={getInitials}
                                profileName={profileName}
                              />
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
  );
};

export default KanbanView;
