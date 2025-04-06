
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BookOpen, 
  Calculator as CalculatorIcon, 
  DownloadIcon, 
  Share2Icon, 
  Building, 
  Landmark, 
  LineChart as LineChartIcon 
} from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import * as RechartsPrimitive from "recharts";

interface CashFlowYear {
  year: number;
  income: number;
  expenses: number;
  noi: number;
  cashFlow: number;
  cumulative: number;
}

const PropertyCalculator = () => {
  const [propertyType, setPropertyType] = useState("multifamily");
  const [purchasePrice, setPurchasePrice] = useState(10000000);
  const [capRate, setCapRate] = useState(5.5);
  const [annualIncome, setAnnualIncome] = useState(550000);
  const [annualExpenses, setAnnualExpenses] = useState(275000);
  const [growthRate, setGrowthRate] = useState(3);
  const [expenseGrowthRate, setExpenseGrowthRate] = useState(2.5);
  const [holdingPeriod, setHoldingPeriod] = useState(5);
  const [exitCapRate, setExitCapRate] = useState(5.8);
  const [downPayment, setDownPayment] = useState(30);
  const [interestRate, setInterestRate] = useState(4.5);
  const [loanTerm, setLoanTerm] = useState(30);
  
  const [noi, setNoi] = useState(0);
  const [cashFlowData, setCashFlowData] = useState<CashFlowYear[]>([]);
  const [irr, setIrr] = useState(0);
  const [cashOnCash, setCashOnCash] = useState(0);
  const [exitValue, setExitValue] = useState(0);
  const [equity, setEquity] = useState(0);
  const [returnOnInvestment, setReturnOnInvestment] = useState(0);
  
  useEffect(() => {
    calculateResults();
  }, [
    purchasePrice, 
    capRate, 
    annualIncome, 
    annualExpenses, 
    growthRate, 
    expenseGrowthRate, 
    holdingPeriod, 
    exitCapRate, 
    downPayment, 
    interestRate, 
    loanTerm
  ]);

  const calculateResults = () => {
    // Calculate NOI
    const calculatedNoi = annualIncome - annualExpenses;
    setNoi(calculatedNoi);
    
    // Loan details
    const loanAmount = purchasePrice * (1 - downPayment / 100);
    const downPaymentAmount = purchasePrice * (downPayment / 100);
    const monthlyInterest = interestRate / 100 / 12;
    const totalPayments = loanTerm * 12;
    const monthlyPayment = loanAmount * (monthlyInterest * Math.pow(1 + monthlyInterest, totalPayments)) / 
                          (Math.pow(1 + monthlyInterest, totalPayments) - 1);
    const annualDebtService = monthlyPayment * 12;
    
    // Generate cash flow projection
    const cashFlows = [];
    let cumulativeCashFlow = -downPaymentAmount;
    
    for (let year = 1; year <= holdingPeriod; year++) {
      const yearlyIncome = annualIncome * Math.pow(1 + growthRate / 100, year - 1);
      const yearlyExpenses = annualExpenses * Math.pow(1 + expenseGrowthRate / 100, year - 1);
      const yearlyNoi = yearlyIncome - yearlyExpenses;
      const yearlyCashFlow = yearlyNoi - annualDebtService;
      
      cumulativeCashFlow += yearlyCashFlow;
      
      cashFlows.push({
        year,
        income: Math.round(yearlyIncome),
        expenses: Math.round(yearlyExpenses),
        noi: Math.round(yearlyNoi),
        cashFlow: Math.round(yearlyCashFlow),
        cumulative: Math.round(cumulativeCashFlow)
      });
    }
    
    // Calculate exit value
    const finalYearNoi = annualIncome * Math.pow(1 + growthRate / 100, holdingPeriod - 1) - 
                         annualExpenses * Math.pow(1 + expenseGrowthRate / 100, holdingPeriod - 1);
    const calculatedExitValue = finalYearNoi / (exitCapRate / 100);
    setExitValue(calculatedExitValue);
    
    // Calculate remaining loan balance
    const remainingLoanBalance = calculateRemainingLoanBalance(loanAmount, monthlyInterest, totalPayments, holdingPeriod * 12);
    
    // Calculate equity
    const calculatedEquity = calculatedExitValue - remainingLoanBalance;
    setEquity(calculatedEquity);
    
    // Add sale to final year cash flow
    const finalYearWithSale = {
      ...cashFlows[holdingPeriod - 1],
      cashFlow: Math.round(cashFlows[holdingPeriod - 1].cashFlow + calculatedExitValue - remainingLoanBalance)
    };
    cashFlows[holdingPeriod - 1] = finalYearWithSale;
    
    setCashFlowData(cashFlows);
    
    // Calculate IRR
    const initialInvestment = -downPaymentAmount;
    const cashFlowsForIrr = cashFlows.map(cf => cf.cashFlow);
    cashFlowsForIrr.unshift(initialInvestment);
    
    const calculatedIrr = calculateIRR(cashFlowsForIrr) * 100;
    setIrr(parseFloat(calculatedIrr.toFixed(2)));
    
    // Calculate Cash on Cash
    const firstYearCashFlow = cashFlows[0].cashFlow;
    const calculatedCashOnCash = (firstYearCashFlow / downPaymentAmount) * 100;
    setCashOnCash(parseFloat(calculatedCashOnCash.toFixed(2)));
    
    // Calculate Return on Investment
    const totalReturn = calculatedExitValue - remainingLoanBalance + 
                       cashFlows.reduce((sum, cf) => sum + cf.cashFlow, 0) - 
                       cashFlows[holdingPeriod - 1].cashFlow; // Exclude the sale proceeds from the sum
    
    const calculatedRoi = ((totalReturn - downPaymentAmount) / downPaymentAmount) * 100;
    setReturnOnInvestment(parseFloat(calculatedRoi.toFixed(2)));
  };
  
  const calculateRemainingLoanBalance = (principal: number, monthlyInterest: number, totalPayments: number, paymentsMade: number) => {
    const monthlyPayment = principal * (monthlyInterest * Math.pow(1 + monthlyInterest, totalPayments)) / 
                          (Math.pow(1 + monthlyInterest, totalPayments) - 1);
    
    return principal * Math.pow(1 + monthlyInterest, paymentsMade) - 
           monthlyPayment * ((Math.pow(1 + monthlyInterest, paymentsMade) - 1) / monthlyInterest);
  };
  
  const calculateIRR = (cashFlows: number[]) => {
    const guess = 0.1;
    const maxIterations = 1000;
    const precision = 0.0000001;
    
    let irr = guess;
    for (let i = 0; i < maxIterations; i++) {
      const npv = calculateNPV(cashFlows, irr);
      if (Math.abs(npv) < precision) {
        return irr;
      }
      
      const derivative = calculateNPVDerivative(cashFlows, irr);
      const newIrr = irr - npv / derivative;
      
      if (Math.abs(newIrr - irr) < precision) {
        return newIrr;
      }
      
      irr = newIrr;
    }
    
    return irr;
  };
  
  const calculateNPV = (cashFlows: number[], rate: number) => {
    return cashFlows.reduce((npv, cf, i) => npv + cf / Math.pow(1 + rate, i), 0);
  };
  
  const calculateNPVDerivative = (cashFlows: number[], rate: number) => {
    return cashFlows.reduce((derivative, cf, i) => {
      if (i === 0) return derivative;
      return derivative - (i * cf) / Math.pow(1 + rate, i + 1);
    }, 0);
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  // Chart data
  const chartData = cashFlowData.map(cf => ({
    year: `Year ${cf.year}`,
    NOI: cf.noi,
    "Cash Flow": cf.cashFlow,
  }));

  // Build cumulative return data
  const cumulativeData = cashFlowData.map(cf => ({
    year: `Year ${cf.year}`,
    "Cumulative": cf.cumulative,
  }));

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">DCF & IRR Calculator</h1>
          <p className="text-gray-500">Analyze investment returns and cash flows</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3">
          <Button variant="outline" className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            Load Template
          </Button>
          <Button variant="outline" className="flex items-center gap-1">
            <DownloadIcon className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" className="flex items-center gap-1">
            <Share2Icon className="h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Investment Parameters</CardTitle>
              <CardDescription>Adjust the values to see results</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="property-type">Property Type</Label>
                  <Select 
                    value={propertyType} 
                    onValueChange={setPropertyType}
                  >
                    <SelectTrigger id="property-type">
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="multifamily">Multifamily</SelectItem>
                      <SelectItem value="office">Office</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="industrial">Industrial</SelectItem>
                      <SelectItem value="hotel">Hotel</SelectItem>
                      <SelectItem value="medical">Medical Office</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Tabs defaultValue="acquisition">
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="acquisition">Acquisition</TabsTrigger>
                    <TabsTrigger value="income">Income</TabsTrigger>
                    <TabsTrigger value="financing">Financing</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="acquisition" className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="purchase-price">Purchase Price</Label>
                        <span className="text-sm font-medium">{formatCurrency(purchasePrice)}</span>
                      </div>
                      <Input
                        id="purchase-price"
                        type="range"
                        min="1000000"
                        max="100000000"
                        step="100000"
                        value={purchasePrice}
                        onChange={(e) => setPurchasePrice(Number(e.target.value))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="cap-rate">Initial Cap Rate</Label>
                        <span className="text-sm font-medium">{formatPercent(capRate)}</span>
                      </div>
                      <Input
                        id="cap-rate"
                        type="range"
                        min="1"
                        max="10"
                        step="0.1"
                        value={capRate}
                        onChange={(e) => {
                          const newCapRate = Number(e.target.value);
                          setCapRate(newCapRate);
                          setAnnualIncome(purchasePrice * (newCapRate / 100));
                        }}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="exit-cap-rate">Exit Cap Rate</Label>
                        <span className="text-sm font-medium">{formatPercent(exitCapRate)}</span>
                      </div>
                      <Input
                        id="exit-cap-rate"
                        type="range"
                        min="1"
                        max="10"
                        step="0.1"
                        value={exitCapRate}
                        onChange={(e) => setExitCapRate(Number(e.target.value))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="holding-period">Holding Period (Years)</Label>
                        <span className="text-sm font-medium">{holdingPeriod}</span>
                      </div>
                      <Input
                        id="holding-period"
                        type="range"
                        min="1"
                        max="15"
                        step="1"
                        value={holdingPeriod}
                        onChange={(e) => setHoldingPeriod(Number(e.target.value))}
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="income" className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="annual-income">Annual Income</Label>
                        <span className="text-sm font-medium">{formatCurrency(annualIncome)}</span>
                      </div>
                      <Input
                        id="annual-income"
                        type="range"
                        min="100000"
                        max="10000000"
                        step="10000"
                        value={annualIncome}
                        onChange={(e) => setAnnualIncome(Number(e.target.value))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="annual-expenses">Annual Expenses</Label>
                        <span className="text-sm font-medium">{formatCurrency(annualExpenses)}</span>
                      </div>
                      <Input
                        id="annual-expenses"
                        type="range"
                        min="50000"
                        max="5000000"
                        step="10000"
                        value={annualExpenses}
                        onChange={(e) => setAnnualExpenses(Number(e.target.value))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="income-growth">Income Growth Rate</Label>
                        <span className="text-sm font-medium">{formatPercent(growthRate)}</span>
                      </div>
                      <Input
                        id="income-growth"
                        type="range"
                        min="0"
                        max="10"
                        step="0.1"
                        value={growthRate}
                        onChange={(e) => setGrowthRate(Number(e.target.value))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="expense-growth">Expense Growth Rate</Label>
                        <span className="text-sm font-medium">{formatPercent(expenseGrowthRate)}</span>
                      </div>
                      <Input
                        id="expense-growth"
                        type="range"
                        min="0"
                        max="10"
                        step="0.1"
                        value={expenseGrowthRate}
                        onChange={(e) => setExpenseGrowthRate(Number(e.target.value))}
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="financing" className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="down-payment">Down Payment (%)</Label>
                        <span className="text-sm font-medium">{formatPercent(downPayment)}</span>
                      </div>
                      <Input
                        id="down-payment"
                        type="range"
                        min="10"
                        max="100"
                        step="5"
                        value={downPayment}
                        onChange={(e) => setDownPayment(Number(e.target.value))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="interest-rate">Interest Rate</Label>
                        <span className="text-sm font-medium">{formatPercent(interestRate)}</span>
                      </div>
                      <Input
                        id="interest-rate"
                        type="range"
                        min="1"
                        max="10"
                        step="0.1"
                        value={interestRate}
                        onChange={(e) => setInterestRate(Number(e.target.value))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="loan-term">Loan Term (Years)</Label>
                        <span className="text-sm font-medium">{loanTerm}</span>
                      </div>
                      <Input
                        id="loan-term"
                        type="range"
                        min="5"
                        max="30"
                        step="5"
                        value={loanTerm}
                        onChange={(e) => setLoanTerm(Number(e.target.value))}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full flex items-center gap-2">
                <CalculatorIcon className="h-4 w-4" />
                Run Simulation
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Key Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-gray-500 text-sm mb-1">IRR</div>
                    <div className="text-2xl font-bold text-nuvos-blue">{formatPercent(irr)}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-gray-500 text-sm mb-1">Cash on Cash</div>
                    <div className="text-2xl font-bold text-nuvos-teal">{formatPercent(cashOnCash)}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-gray-500 text-sm mb-1">Exit Value</div>
                    <div className="text-2xl font-bold text-nuvos-purple">{formatCurrency(exitValue)}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-gray-500 text-sm mb-1">Total ROI</div>
                    <div className="text-2xl font-bold text-nuvos-lightblue">{formatPercent(returnOnInvestment)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Cash Flow Projection</CardTitle>
                <CardDescription>Annual NOI and cash flow over time</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="chart">
                  <TabsList className="mb-4">
                    <TabsTrigger value="chart">Chart</TabsTrigger>
                    <TabsTrigger value="cumulative">Cumulative</TabsTrigger>
                    <TabsTrigger value="table">Table</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="chart">
                    <div className="h-[300px]">
                      <ChartContainer
                        config={{
                          NOI: { color: "#12B5B0" },
                          "Cash Flow": { color: "#0A1933" }
                        }}
                      >
                        <RechartsPrimitive.LineChart data={chartData}>
                          <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" />
                          <RechartsPrimitive.XAxis dataKey="year" />
                          <RechartsPrimitive.YAxis 
                            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                            width={60}
                          />
                          <RechartsPrimitive.Tooltip
                            content={({ active, payload }) => (
                              <ChartTooltipContent 
                                active={active} 
                                payload={payload}
                                formatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                              />
                            )}
                          />
                          <RechartsPrimitive.Line type="monotone" dataKey="NOI" stroke="#12B5B0" />
                          <RechartsPrimitive.Line type="monotone" dataKey="Cash Flow" stroke="#0A1933" />
                        </RechartsPrimitive.LineChart>
                      </ChartContainer>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="cumulative">
                    <div className="h-[300px]">
                      <ChartContainer
                        config={{
                          Cumulative: { color: "#9B7BFF" }
                        }}
                      >
                        <RechartsPrimitive.LineChart data={cumulativeData}>
                          <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" />
                          <RechartsPrimitive.XAxis dataKey="year" />
                          <RechartsPrimitive.YAxis 
                            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                            width={60}
                          />
                          <RechartsPrimitive.Tooltip
                            content={({ active, payload }) => (
                              <ChartTooltipContent 
                                active={active} 
                                payload={payload}
                                formatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                              />
                            )}
                          />
                          <RechartsPrimitive.Line type="monotone" dataKey="Cumulative" stroke="#9B7BFF" />
                        </RechartsPrimitive.LineChart>
                      </ChartContainer>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="table">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2">Year</th>
                            <th className="text-right py-2">Income</th>
                            <th className="text-right py-2">Expenses</th>
                            <th className="text-right py-2">NOI</th>
                            <th className="text-right py-2">Cash Flow</th>
                            <th className="text-right py-2">Cumulative</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cashFlowData.map((cf) => (
                            <tr key={cf.year} className="border-b">
                              <td className="py-2">Year {cf.year}</td>
                              <td className="text-right py-2">{formatCurrency(cf.income)}</td>
                              <td className="text-right py-2">{formatCurrency(cf.expenses)}</td>
                              <td className="text-right py-2">{formatCurrency(cf.noi)}</td>
                              <td className="text-right py-2">{formatCurrency(cf.cashFlow)}</td>
                              <td className="text-right py-2">{formatCurrency(cf.cumulative)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Investment Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-gray-500">Purchase Price:</span>
                      <span className="font-medium">{formatCurrency(purchasePrice)}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-gray-500">Initial Cap Rate:</span>
                      <span className="font-medium">{formatPercent(capRate)}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-gray-500">NOI (Year 1):</span>
                      <span className="font-medium">{formatCurrency(noi)}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-gray-500">Holding Period:</span>
                      <span className="font-medium">{holdingPeriod} years</span>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-gray-500">Exit Cap Rate:</span>
                      <span className="font-medium">{formatPercent(exitCapRate)}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-gray-500">Exit Value:</span>
                      <span className="font-medium">{formatCurrency(exitValue)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Landmark className="h-5 w-5" />
                    Financing Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-gray-500">Down Payment:</span>
                      <span className="font-medium">{formatCurrency(purchasePrice * (downPayment / 100))}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-gray-500">Loan Amount:</span>
                      <span className="font-medium">{formatCurrency(purchasePrice * (1 - downPayment / 100))}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-gray-500">Interest Rate:</span>
                      <span className="font-medium">{formatPercent(interestRate)}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-gray-500">Loan Term:</span>
                      <span className="font-medium">{loanTerm} years</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-gray-500">Annual Debt Service:</span>
                      <span className="font-medium">
                        {formatCurrency(
                          purchasePrice * 
                          (1 - downPayment / 100) * 
                          ((interestRate / 100 / 12) * Math.pow(1 + interestRate / 100 / 12, loanTerm * 12)) / 
                          (Math.pow(1 + interestRate / 100 / 12, loanTerm * 12) - 1) * 
                          12
                        )}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCalculator;
