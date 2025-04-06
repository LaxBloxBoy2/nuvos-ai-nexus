
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { BrainCircuit, Building, Download, Link, Loader2, MessageSquare, Plus, Share2, ThumbsUp } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const AiSummaries = () => {
  const [loading, setLoading] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState("oakridge");
  const [analysisTab, setAnalysisTab] = useState("summary");
  const [userPrompt, setUserPrompt] = useState("");
  const [promptLoading, setPromptLoading] = useState(false);
  
  const handleGenerateAnalysis = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const handleAskQuestion = () => {
    if (!userPrompt) return;
    
    setPromptLoading(true);
    // Simulate API call
    setTimeout(() => {
      setPromptLoading(false);
      setUserPrompt("");
      // Add to conversation in real app
    }, 1500);
  };
  
  const properties = [
    { 
      id: "oakridge", 
      name: "Oakridge Apartments", 
      type: "Multifamily", 
      location: "Austin, TX",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    },
    { 
      id: "century", 
      name: "Century Business Park", 
      type: "Industrial", 
      location: "Nashville, TN",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80", 
    },
    { 
      id: "metro", 
      name: "Metro Office Tower", 
      type: "Office", 
      location: "Charlotte, NC",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80", 
    },
  ];
  
  const selectedProperty = properties.find(p => p.id === selectedDeal);
  
  const conversations = [
    { 
      id: 1, 
      sender: "user", 
      content: "What are the main risks for this property investment?", 
      timestamp: "2 days ago" 
    },
    { 
      id: 2, 
      sender: "ai", 
      content: "Based on my analysis, the main risks for Oakridge Apartments include:\n\n1. Market oversupply: Austin has seen significant multifamily development in recent years, with 10,000+ units coming online in the next 18 months.\n\n2. Rising interest rates: Current projections show potential increases that could impact refinancing costs.\n\n3. Employment concentration: ~40% of tenants work in the tech sector, making rental income vulnerable to tech industry volatility.\n\n4. Maintenance needs: The property will require roof replacement within 2-3 years based on inspection reports.\n\nRisk mitigation strategies include diversifying tenant mix, budgeting for capital improvements, and implementing a phased renovation approach to justify rent increases while maintaining occupancy.",
      timestamp: "2 days ago" 
    },
    { 
      id: 3, 
      sender: "user", 
      content: "What comparable properties have sold recently in the area?", 
      timestamp: "1 day ago" 
    },
    { 
      id: 4, 
      sender: "ai", 
      content: "Recent comparable multifamily sales in Austin (within 5 miles radius, similar vintage):\n\n1. Riverview Apartments - $245/sq ft, 180 units, sold March 2025\n2. The Madison at Riverside - $262/sq ft, 156 units, sold January 2025\n3. Crescent Heights - $271/sq ft, 210 units, sold November 2024\n\nAveraging $259/sq ft, which is 3.8% higher than the current valuation of Oakridge Apartments ($249/sq ft). Cap rates ranged from 4.9% to 5.3%, averaging 5.1%, which is slightly lower than Oakridge's 5.2% cap rate, suggesting the current valuation is aligned with market pricing.",
      timestamp: "1 day ago" 
    },
  ];

  // Summary data
  const summaryData = {
    strengths: [
      "Strong location in high-growth Austin submarket",
      "Solid historical occupancy rate (95%+)",
      "Below market rents offer value-add opportunity",
      "Newer building systems (HVAC replaced 2023)",
      "Proximity to major tech employers"
    ],
    weaknesses: [
      "Aging exterior façade requires updating",
      "Limited amenities compared to newer competitors",
      "Higher than average maintenance costs",
      "Some units need significant renovation",
      "Increasing competition from new developments"
    ],
    opportunities: [
      "Value-add renovation program to increase rents",
      "Optimizing utility expenses through green initiatives",
      "Implementing technology amenities for millennial appeal",
      "Potential rezoning for additional units in unused land",
      "Local demand increasing from tech employment growth"
    ],
    threats: [
      "New supply of 1,200+ units within 3-mile radius",
      "Potential economic slowdown affecting tech sector jobs",
      "Rising interest rates impacting exit cap rates",
      "Increasing property taxes in Travis County",
      "Regulatory changes affecting multifamily operations"
    ]
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">AI Deal Analysis</h1>
          <p className="text-gray-500">Smart insights and risk assessment for your investments</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
          <Button variant="outline" className="flex items-center gap-1">
            <Download size={16} />
            Export Analysis
          </Button>
          <Button variant="outline" className="flex items-center gap-1">
            <Share2 size={16} />
            Share
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Select Property</CardTitle>
              <CardDescription>Choose a deal to analyze</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                value={selectedDeal}
                onValueChange={setSelectedDeal}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a property" />
                </SelectTrigger>
                <SelectContent>
                  {properties.map((property) => (
                    <SelectItem key={property.id} value={property.id}>
                      <div className="flex items-center gap-2">
                        <Building size={16} />
                        <span>{property.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedProperty && (
                <Card className="border border-gray-100">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-md bg-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
                        {selectedProperty.image ? (
                          <img
                            src={selectedProperty.image}
                            alt={selectedProperty.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Building size={24} className="text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{selectedProperty.name}</h3>
                        <div className="flex items-center gap-1 text-gray-500 text-sm">
                          <Badge variant="outline">{selectedProperty.type}</Badge>
                          <span>•</span>
                          <span>{selectedProperty.location}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-start gap-3">
                  <BrainCircuit className="text-nuvos-teal mt-0.5" size={20} />
                  <div>
                    <h3 className="font-medium mb-1">AI Analysis Features</h3>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-gray-500"></div>
                        <span>Automated SWOT analysis</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-gray-500"></div>
                        <span>Risk assessment scoring</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-gray-500"></div>
                        <span>Market comparison data</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-gray-500"></div>
                        <span>Interactive Q&A with AI</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleGenerateAnalysis}
                disabled={loading}
                className="w-full bg-nuvos-teal hover:bg-nuvos-teal/90"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    Generating Analysis...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <BrainCircuit size={16} />
                    Generate Analysis
                  </span>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Market Data</CardTitle>
              <CardDescription>Key metrics for Austin multifamily</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-3">
                <div className="flex justify-between py-1 border-b">
                  <span className="text-gray-500">Avg. Market Rent:</span>
                  <span className="font-medium">$1,850/mo</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span className="text-gray-500">Market Vacancy:</span>
                  <span className="font-medium">4.2%</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span className="text-gray-500">Avg. Cap Rate:</span>
                  <span className="font-medium">5.1%</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span className="text-gray-500">YoY Rent Growth:</span>
                  <span className="font-medium text-green-600">+3.8%</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">New Supply:</span>
                  <span className="font-medium">3,200 units</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader className="pb-0">
              <CardTitle className="flex items-center gap-2">
                <BrainCircuit className="text-nuvos-teal" />
                AI Deal Analysis
              </CardTitle>
              <CardDescription>
                Generated insights for {selectedProperty?.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <Tabs value={analysisTab} onValueChange={setAnalysisTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="summary">SWOT Analysis</TabsTrigger>
                  <TabsTrigger value="risks">Risk Assessment</TabsTrigger>
                  <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                </TabsList>
                
                <TabsContent value="summary">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="border border-gray-100">
                      <CardHeader className="pb-2 bg-green-50 border-b">
                        <CardTitle className="text-lg text-green-700">Strengths</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <ul className="space-y-2">
                          {summaryData.strengths.map((item, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2"></div>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card className="border border-gray-100">
                      <CardHeader className="pb-2 bg-red-50 border-b">
                        <CardTitle className="text-lg text-red-700">Weaknesses</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <ul className="space-y-2">
                          {summaryData.weaknesses.map((item, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2"></div>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card className="border border-gray-100">
                      <CardHeader className="pb-2 bg-blue-50 border-b">
                        <CardTitle className="text-lg text-blue-700">Opportunities</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <ul className="space-y-2">
                          {summaryData.opportunities.map((item, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2"></div>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card className="border border-gray-100">
                      <CardHeader className="pb-2 bg-amber-50 border-b">
                        <CardTitle className="text-lg text-amber-700">Threats</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <ul className="space-y-2">
                          {summaryData.threats.map((item, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2"></div>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="risks">
                  <Card className="border border-gray-100 mb-4">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Risk Score: <span className="text-amber-600">Moderate</span></CardTitle>
                      <CardDescription>Overall investment risk assessment</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <p className="mb-1 text-sm font-medium flex justify-between">
                          <span>Risk Level</span>
                          <span>65/100</span>
                        </p>
                        <div className="w-full bg-gray-200 h-2 rounded-full">
                          <div className="bg-amber-500 h-2 rounded-full" style={{ width: "65%" }}></div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Market Risk</span>
                            <span className="text-sm text-amber-600">Moderate (62%)</span>
                          </div>
                          <div className="w-full bg-gray-200 h-1.5 rounded-full">
                            <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: "62%" }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Financial Risk</span>
                            <span className="text-sm text-green-600">Low (35%)</span>
                          </div>
                          <div className="w-full bg-gray-200 h-1.5 rounded-full">
                            <div className="bg-green-500 h-1.5 rounded-full" style={{ width: "35%" }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Property Condition Risk</span>
                            <span className="text-sm text-amber-600">Moderate (55%)</span>
                          </div>
                          <div className="w-full bg-gray-200 h-1.5 rounded-full">
                            <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: "55%" }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Location Risk</span>
                            <span className="text-sm text-green-600">Low (28%)</span>
                          </div>
                          <div className="w-full bg-gray-200 h-1.5 rounded-full">
                            <div className="bg-green-500 h-1.5 rounded-full" style={{ width: "28%" }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Economic Risk</span>
                            <span className="text-sm text-red-600">High (78%)</span>
                          </div>
                          <div className="w-full bg-gray-200 h-1.5 rounded-full">
                            <div className="bg-red-500 h-1.5 rounded-full" style={{ width: "78%" }}></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-gray-100">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Key Risk Factors</CardTitle>
                      <CardDescription>Top 3 risks to monitor</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg bg-red-50 border-red-100">
                          <h3 className="font-medium mb-1 flex items-center gap-2 text-red-800">
                            <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                            New Supply Pipeline
                          </h3>
                          <p className="text-sm">1,200+ new units within a 3-mile radius will be completed in the next 12 months, potentially impacting occupancy and rent growth.</p>
                        </div>
                        
                        <div className="p-4 border rounded-lg bg-amber-50 border-amber-100">
                          <h3 className="font-medium mb-1 flex items-center gap-2 text-amber-800">
                            <span className="w-2 h-2 bg-amber-600 rounded-full"></span>
                            Tenant Concentration Risk
                          </h3>
                          <p className="text-sm">40% of current tenants work in the tech sector, creating potential vulnerability if major employers reduce headcount.</p>
                        </div>
                        
                        <div className="p-4 border rounded-lg bg-amber-50 border-amber-100">
                          <h3 className="font-medium mb-1 flex items-center gap-2 text-amber-800">
                            <span className="w-2 h-2 bg-amber-600 rounded-full"></span>
                            Interest Rate Exposure
                          </h3>
                          <p className="text-sm">Exit cap rate sensitivity could reduce projected returns by 15-20% if rates increase by another 75 basis points.</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button variant="outline" className="w-full">View Full Risk Assessment</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="recommendations">
                  <Card className="border border-gray-100 mb-4">
                    <CardHeader>
                      <CardTitle>Investment Recommendation</CardTitle>
                      <CardDescription>AI-generated recommendation based on analysis</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4 p-4 border border-green-100 rounded-lg bg-green-50">
                        <p className="text-lg font-medium text-green-800">Proceed with caution - implement recommended risk mitigations</p>
                      </div>
                      
                      <p className="mb-4">
                        Oakridge Apartments represents a moderate-risk investment opportunity with potential for strong returns through a targeted value-add strategy. The property's location in a high-growth submarket of Austin provides long-term appreciation potential, while below-market rents offer immediate upside through strategic renovations.
                      </p>
                      
                      <p className="mb-4">
                        However, significant new supply and tech-sector employment concentration create near-term risks that should be actively managed. A phased renovation approach is recommended to minimize disruption and gradually increase rents while maintaining strong occupancy.
                      </p>
                      
                      <h3 className="font-medium text-lg mb-3">Strategic Recommendations:</h3>
                      <ul className="space-y-2 mb-4">
                        <li className="flex items-start gap-2">
                          <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <div className="w-2 h-2 rounded-full bg-green-600"></div>
                          </div>
                          <span>Implement a tiered renovation strategy targeting 20% of units per quarter to minimize vacancy impact</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <div className="w-2 h-2 rounded-full bg-green-600"></div>
                          </div>
                          <span>Budget for roof replacement in Year 3 to address deferred maintenance issues</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <div className="w-2 h-2 rounded-full bg-green-600"></div>
                          </div>
                          <span>Diversify tenant mix through targeted marketing to healthcare and education sectors</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <div className="w-2 h-2 rounded-full bg-green-600"></div>
                          </div>
                          <span>Implement utility submetering to reduce operational expenses by an estimated 12%</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <div className="w-2 h-2 rounded-full bg-green-600"></div>
                          </div>
                          <span>Consider fixed-rate debt with longer term to mitigate interest rate risk</span>
                        </li>
                      </ul>
                      
                      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                        <div>
                          <h4 className="font-medium mb-1">Expected Returns (with recommendations)</h4>
                          <div className="flex gap-4 text-sm">
                            <span className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-nuvos-teal rounded-full"></div>
                              IRR: 18.3%
                            </span>
                            <span className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-nuvos-purple rounded-full"></div>
                              Cash on Cash: 8.2%
                            </span>
                            <span className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-nuvos-lightblue rounded-full"></div>
                              Equity Multiple: 2.1x
                            </span>
                          </div>
                        </div>
                        <div>
                          <Button variant="ghost" size="sm" className="flex items-center gap-1">
                            <Link size={14} />
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Assistant</CardTitle>
              <CardDescription>Ask questions about this property</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[320px] overflow-y-auto p-4">
                {conversations.map((message) => (
                  <div key={message.id} className={`flex items-start gap-3 mb-4 ${message.sender === 'user' ? 'justify-end' : ''}`}>
                    {message.sender === 'ai' && (
                      <Avatar className="mt-0.5">
                        <AvatarFallback className="bg-nuvos-teal text-white">AI</AvatarFallback>
                      </Avatar>
                    )}
                    <div className={`p-3 rounded-lg max-w-[80%] ${
                      message.sender === 'user' 
                        ? 'bg-nuvos-blue text-white' 
                        : 'bg-gray-100'
                    }`}>
                      <p className="whitespace-pre-line text-sm">{message.content}</p>
                      <p className="text-xs text-gray-500 mt-1">{message.timestamp}</p>
                    </div>
                    {message.sender === 'user' && (
                      <Avatar className="mt-0.5">
                        <AvatarFallback className="bg-nuvos-blue text-white">JD</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
              </div>
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Ask a question about this property..."
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    className="resize-none"
                  />
                  <Button 
                    onClick={handleAskQuestion} 
                    disabled={promptLoading || !userPrompt}
                    size="icon"
                    className="h-auto bg-nuvos-teal hover:bg-nuvos-teal/90"
                  >
                    {promptLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageSquare className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Button variant="outline" size="sm" className="text-xs" onClick={() => setUserPrompt("What's the projected IRR for this property?")}>
                    Projected IRR?
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs" onClick={() => setUserPrompt("How does this compare to similar properties?")}>
                    Market comparison
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs" onClick={() => setUserPrompt("What financing terms would you recommend?")}>
                    Financing advice
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AiSummaries;
