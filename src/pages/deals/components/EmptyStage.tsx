
import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStageProps {
  onAddDeal: () => void;
}

const EmptyStage = ({ onAddDeal }: EmptyStageProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 bg-white border border-dashed border-gray-200 rounded-lg">
      <FileText className="text-gray-300 mb-2" size={24} />
      <p className="text-gray-500 text-sm">No deals in this stage</p>
      <Button 
        variant="ghost" 
        size="sm" 
        className="mt-2" 
        onClick={onAddDeal}
      >
        <Plus className="mr-1 h-4 w-4" />
        Add Deal
      </Button>
    </div>
  );
};

export default EmptyStage;
