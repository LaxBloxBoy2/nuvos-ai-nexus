
import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { PlusCircle } from "lucide-react";
import { Deal } from "@/lib/supabase";

type NewDealData = {
  name: string;
  address: string;
  city: string;
  state: string;
  property_type: string;
  price: string;
  cap_rate: string;
  irr: string;
  status: 'Screening' | 'Due Diligence' | 'Negotiation' | 'Closing';
  priority: 'High' | 'Medium' | 'Low';
}

interface AddDealDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialStatus?: 'Screening' | 'Due Diligence' | 'Negotiation' | 'Closing';
  onCreateDeal: (dealData: NewDealData) => Promise<void>;
}

const AddDealDialog = ({ 
  open, 
  onOpenChange, 
  initialStatus = 'Screening',
  onCreateDeal
}: AddDealDialogProps) => {
  const [newDeal, setNewDeal] = useState<NewDealData>({
    name: "",
    address: "",
    city: "",
    state: "",
    property_type: "Multifamily",
    price: "",
    cap_rate: "",
    irr: "",
    status: initialStatus,
    priority: "Medium"
  });

  const handleCreateDeal = async () => {
    // Don't modify the newDeal state, pass it to the parent component
    await onCreateDeal(newDeal);
    
    // Reset form
    setNewDeal({
      name: "",
      address: "",
      city: "",
      state: "",
      property_type: "Multifamily",
      price: "",
      cap_rate: "",
      irr: "",
      status: initialStatus,
      priority: "Medium"
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                onValueChange={(value: 'Screening' | 'Due Diligence' | 'Negotiation' | 'Closing') => setNewDeal({...newDeal, status: value})}
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
  );
};

export default AddDealDialog;
