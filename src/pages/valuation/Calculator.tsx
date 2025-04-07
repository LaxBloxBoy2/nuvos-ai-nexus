import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { motion } from "framer-motion";

interface Assumptions {
  [key: string]: number;
}

const Calculator = () => {
  const [propertyType, setPropertyType] = useState("Multifamily");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [value, setValue] = useState("1000000");
  const [annualIncome, setAnnualIncome] = useState("100000");
  const [annualExpenses, setAnnualExpenses] = useState("50000");
  const [capRate, setCapRate] = useState(5);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [assumptions, setAssumptions] = useState<Assumptions>({
    "Year 1": 0.02,
    "Year 2": 0.02,
    "Year 3": 0.02,
    "Year 4": 0.02,
    "Year 5": 0.02,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAssumptionYear, setNewAssumptionYear] = useState("");
  const [newAssumptionRate, setNewAssumptionRate] = useState(0);
  const [forecastYears, setForecastYears] = useState(5);
  const [forecastData, setForecastData] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [valuationName, setValuationName] = useState("");
  const [valuationNotes, setValuationNotes] = useState("");
  const { toast } = useToast()
	const { user, profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    generateForecastData();
  }, [value, annualIncome, annualExpenses, assumptions, forecastYears]);

  const handlePropertyTypeChange = (propertyType: string) => {
    setPropertyType(propertyType);
  };

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
  };

  const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCity(event.target.value);
  };

  const handleStateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState(event.target.value);
  };

  const handleZipCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setZipCode(event.target.value);
  };

  const handleValueChange = (value: string) => {
    // Convert string to number before arithmetic operation
    const propertyValue = parseFloat(value) || 0;
    // Use the numeric value for calculations
    setValue(propertyValue.toString());
    
    // Update other dependent calculated fields
    const noi = parseFloat(annualIncome) - parseFloat(annualExpenses);
    // Use numeric values for calculations
    const calculatedCapRate = (noi / propertyValue) * 100;
    setCapRate(isNaN(calculatedCapRate) ? 0 : calculatedCapRate);
  };

  const handleAnnualIncomeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAnnualIncome(event.target.value);
    generateForecastData();
  };

  const handleAnnualExpensesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAnnualExpenses(event.target.value);
    generateForecastData();
  };

  const handleCapRateChange = (value: string) => {
    // Convert string to number before arithmetic operation
    const capRateValue = parseFloat(value) || 0;
    // Use the numeric value for calculations
    setCapRate(capRateValue);
    
    // Update other dependent calculated fields
    const noi = parseFloat(annualIncome) - parseFloat(annualExpenses);
    // Use numeric values for calculations
    const calculatedValue = noi / (capRateValue / 100);
    setValue(calculatedValue.toFixed(2));
  };

  const toggleAdvanced = () => {
    setShowAdvanced(!showAdvanced);
  };

  const handleAssumptionChange = (year: string, rate: number) => {
    setAssumptions((prevAssumptions) => ({
      ...prevAssumptions,
      [year]: rate,
    }));
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setNewAssumptionYear("");
    setNewAssumptionRate(0);
  };

  const handleAddAssumption = () => {
    if (newAssumptionYear && newAssumptionRate) {
      setAssumptions((prevAssumptions) => ({
        ...prevAssumptions,
        [newAssumptionYear]: newAssumptionRate / 100,
      }));
      handleCloseDialog();
    }
  };

  const handleDeleteAssumption = (year: string) => {
    const { [year]: deleted, ...rest } = assumptions;
    setAssumptions(rest);
  };

  const handleForecastYearsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const years = parseInt(event.target.value, 10);
    if (!isNaN(years) && years > 0) {
      setForecastYears(years);
    }
  };

  const generateForecastData = () => {
    let initialValue = parseFloat(value);
    let initialIncome = parseFloat(annualIncome);
    let initialExpenses = parseFloat(annualExpenses);
    const newForecastData = [];

    for (let i = 1; i <= forecastYears; i++) {
      const year = `Year ${i}`;
      const growthRate = assumptions[year] || 0;
      initialValue = initialValue * (1 + growthRate);
      initialIncome = initialIncome * (1 + growthRate);
      initialExpenses = initialExpenses * (1 + growthRate);

      newForecastData.push({
        name: year,
        value: initialValue.toFixed(2),
        income: initialIncome.toFixed(2),
        expenses: initialExpenses.toFixed(2),
      });
    }

    setForecastData(newForecastData);
  };

  const handleSubmitValuation = async () => {
    setIsSubmitting(true);
  
    try {
      if (!user || !profile) {
        throw new Error("User not authenticated or profile not loaded");
      }
  
      // Prepare model inputs and AI forecast outputs
      const modelInputs = {
        propertyType,
        address,
        city,
        state,
        zipCode,
        initialValue: parseFloat(value),
        annualIncome: parseFloat(annualIncome),
        annualExpenses: parseFloat(annualExpenses),
        capRate,
        assumptions,
        forecastYears,
      };
  
      const aiForecastOutputs = forecastData.map(item => ({
        year: item.name,
        value: parseFloat(item.value),
        income: parseFloat(item.income),
        expenses: parseFloat(item.expenses),
      }));
  
      // Insert valuation data into Supabase
      const { data, error } = await supabase
        .from('valuations')
        .insert([
          {
            property_id: '123', // Replace with actual property ID if available
            model_inputs: modelInputs,
            ai_forecast_outputs: aiForecastOutputs,
            created_by: user.id,
          }
        ]);
  
      if (error) {
        console.error("Error submitting valuation:", error);
        toast({
          title: "Error submitting valuation",
          description: "Please try again.",
          variant: "destructive",
        });
      } else {
        console.log("Valuation submitted successfully:", data);
        toast({
          title: "Valuation submitted",
          description: "Your valuation has been saved.",
        });
      }
    } catch (error) {
      console.error("Error submitting valuation:", error);
      toast({
        title: "Unexpected error",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-nuvos-blue mb-2">Property Valuation Calculator</h1>
          <p className="text-gray-500">Estimate the value of a commercial property based on income and expenses.</p>
        </div>

        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={60}>
            <Card className="border border-gray-100 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-nuvos-blue">Property Details</CardTitle>
                <CardDescription className="text-gray-500">Enter the property details to begin valuation.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="property-type">Property Type</Label>
                    <Select onValueChange={handlePropertyTypeChange}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Multifamily">Multifamily</SelectItem>
                        <SelectItem value="Office">Office</SelectItem>
                        <SelectItem value="Retail">Retail</SelectItem>
                        <SelectItem value="Industrial">Industrial</SelectItem>
                        <SelectItem value="Hospitality">Hospitality</SelectItem>
                        <SelectItem value="Land">Land</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      type="text"
                      id="address"
                      className="h-11"
                      value={address}
                      onChange={handleAddressChange}
                      placeholder="123 Main St"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      type="text"
                      id="city"
                      className="h-11"
                      value={city}
                      onChange={handleCityChange}
                      placeholder="Anytown"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      type="text"
                      id="state"
                      className="h-11"
                      value={state}
                      onChange={handleStateChange}
                      placeholder="CA"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zip-code">Zip Code</Label>
                    <Input
                      type="text"
                      id="zip-code"
                      className="h-11"
                      value={zipCode}
                      onChange={handleZipCodeChange}
                      placeholder="90210"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-100 shadow-lg mt-6">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-nuvos-blue">Income & Expenses</CardTitle>
                <CardDescription className="text-gray-500">Enter the property's income and expenses.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="value">Property Value</Label>
                    <Input
                      type="number"
                      id="value"
                      className="h-11"
                      value={value}
                      onChange={(e) => handleValueChange(e.target.value)}
                      placeholder="1000000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="annual-income">Annual Income</Label>
                    <Input
                      type="number"
                      id="annual-income"
                      className="h-11"
                      value={annualIncome}
                      onChange={handleAnnualIncomeChange}
                      placeholder="100000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="annual-expenses">Annual Expenses</Label>
                    <Input
                      type="number"
                      id="annual-expenses"
                      className="h-11"
                      value={annualExpenses}
                      onChange={handleAnnualExpensesChange}
                      placeholder="50000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cap-rate">Cap Rate (%)</Label>
                    <Input
                      type="number"
                      id="cap-rate"
                      className="h-11"
                      value={capRate}
                      onChange={(e) => handleCapRateChange(e.target.value)}
                      placeholder="5"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-100 shadow-lg mt-6">
              <CardHeader className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold text-nuvos-blue">Advanced Settings</CardTitle>
                  <CardDescription className="text-gray-500">Customize your valuation with advanced settings.</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={toggleAdvanced}>
                  {showAdvanced ? "Hide Advanced" : "Show Advanced"}
                </Button>
              </CardHeader>
              {showAdvanced && (
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="forecast-years">Forecast Years</Label>
                    <Input
                      type="number"
                      id="forecast-years"
                      className="h-11"
                      value={forecastYears}
                      onChange={handleForecastYearsChange}
                      placeholder="5"
                    />
                  </div>
                  <Table>
                    <TableCaption>Assumed Growth Rate for the next {forecastYears} years</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Year</TableHead>
                        <TableHead>Growth Rate</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(assumptions).map(([year, rate]) => (
                        <TableRow key={year}>
                          <TableCell className="font-medium">{year}</TableCell>
                          <TableCell>
                            <Slider
                              defaultValue={[rate * 100]}
                              max={10}
                              step={0.5}
                              onValueChange={(value) => handleAssumptionChange(year, value[0] / 100)}
                              aria-label={year}
                            />
                            <span className="text-sm text-gray-500">{rate * 100}%</span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteAssumption(year)}>
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell colSpan={3}>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" className="w-full">Add Assumption</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Add New Assumption</DialogTitle>
                                <DialogDescription>
                                  Add a new year and growth rate assumption to the forecast.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="year" className="text-right">
                                    Year
                                  </Label>
                                  <Input
                                    type="text"
                                    id="year"
                                    value={newAssumptionYear}
                                    onChange={(e) => setNewAssumptionYear(e.target.value)}
                                    className="col-span-3 h-11"
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="rate" className="text-right">
                                    Growth Rate
                                  </Label>
                                  <Input
                                    type="number"
                                    id="rate"
                                    value={newAssumptionRate}
                                    onChange={(e) => setNewAssumptionRate(parseFloat(e.target.value))}
                                    className="col-span-3 h-11"
                                  />
                                </div>
                              </div>
                              <Button type="submit" onClick={handleAddAssumption}>Add</Button>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </CardContent>
              )}
            </Card>
          </ResizablePanel>
          <ResizableHandle className="rotate-90" />
          <ResizablePanel defaultSize={40}>
            <Card className="border border-gray-100 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-nuvos-blue">Valuation Forecast</CardTitle>
                <CardDescription className="text-gray-500">Forecasted property values over the next {forecastYears} years.</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={forecastData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border border-gray-100 shadow-lg mt-6">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-nuvos-blue">Submit Valuation</CardTitle>
                <CardDescription className="text-gray-500">Save this valuation for future reference.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="valuation-name">Valuation Name</Label>
                  <Input
                    type="text"
                    id="valuation-name"
                    className="h-11"
                    value={valuationName}
                    onChange={(e) => setValuationName(e.target.value)}
                    placeholder="Property Valuation"
                  />
                </div>
                <div>
                  <Label htmlFor="valuation-notes">Valuation Notes</Label>
                  <Textarea
                    id="valuation-notes"
                    placeholder="Enter any notes about this valuation."
                    value={valuationNotes}
                    onChange={(e) => setValuationNotes(e.target.value)}
                  />
                </div>
              </CardContent>
              <div className="flex items-center p-6 pt-0">
                <Button className="w-full bg-nuvos-teal hover:bg-nuvos-teal/90 h-12" onClick={handleSubmitValuation} disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Valuation"}
                </Button>
              </div>
            </Card>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </motion.div>
  );
};

export default Calculator;
