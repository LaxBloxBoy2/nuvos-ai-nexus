import { Link } from "react-router-dom";
import { Building, BarChart3, Calculator, BrainCircuit, ChevronRight, Star, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

const Index = () => {
  const { user } = useAuth();
  const heroRef = useRef<HTMLDivElement>(null);
  
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const fadeInRight = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
  };

  // Create parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrollPosition = window.scrollY;
        heroRef.current.style.transform = `translateY(${scrollPosition * 0.2}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Modern Navbar with Megamenu */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <span className="font-grotesk font-bold text-2xl text-nuvos-blue">
              Nuvos<span className="text-nuvos-teal">.</span>
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex items-center space-x-6">
              <div className="group relative">
                <button className="text-gray-700 hover:text-nuvos-blue font-medium flex items-center gap-1">
                  Valuation
                  <ChevronRight size={14} className="mt-0.5 group-hover:rotate-90 transition-transform duration-300" />
                </button>
                <div className="absolute left-0 mt-2 w-64 p-4 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-left">
                  <div className="space-y-3">
                    <Link to="/valuation/development" className="block px-2 py-1 hover:bg-gray-50 rounded-md text-gray-700 hover:text-nuvos-blue transition-colors">
                      <span className="font-medium">Development Modeling</span>
                      <p className="text-xs text-gray-500">Create detailed pro-formas</p>
                    </Link>
                    <Link to="/valuation/acquisition" className="block px-2 py-1 hover:bg-gray-50 rounded-md text-gray-700 hover:text-nuvos-blue transition-colors">
                      <span className="font-medium">Acquisition Underwriting</span>
                      <p className="text-xs text-gray-500">Analyze potential acquisitions</p>
                    </Link>
                    <Link to="/valuation/calculator" className="block px-2 py-1 hover:bg-gray-50 rounded-md text-gray-700 hover:text-nuvos-blue transition-colors">
                      <span className="font-medium">DCF + IRR Calculator</span>
                      <p className="text-xs text-gray-500">Calculate returns and cash flows</p>
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="group relative">
                <button className="text-gray-700 hover:text-nuvos-blue font-medium flex items-center gap-1">
                  Deal Management
                  <ChevronRight size={14} className="mt-0.5 group-hover:rotate-90 transition-transform duration-300" />
                </button>
                <div className="absolute left-0 mt-2 w-64 p-4 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-left">
                  <div className="space-y-3">
                    <Link to="/deals/pipeline" className="block px-2 py-1 hover:bg-gray-50 rounded-md text-gray-700 hover:text-nuvos-blue transition-colors">
                      <span className="font-medium">Deal Pipeline</span>
                      <p className="text-xs text-gray-500">Track deals in your pipeline</p>
                    </Link>
                    <Link to="/deals/rooms" className="block px-2 py-1 hover:bg-gray-50 rounded-md text-gray-700 hover:text-nuvos-blue transition-colors">
                      <span className="font-medium">Deal Rooms</span>
                      <p className="text-xs text-gray-500">Collaborate on specific deals</p>
                    </Link>
                    <Link to="/deals/documents" className="block px-2 py-1 hover:bg-gray-50 rounded-md text-gray-700 hover:text-nuvos-blue transition-colors">
                      <span className="font-medium">Document Storage</span>
                      <p className="text-xs text-gray-500">Organize deal documents</p>
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="group relative">
                <button className="text-gray-700 hover:text-nuvos-blue font-medium flex items-center gap-1">
                  AI Insights
                  <ChevronRight size={14} className="mt-0.5 group-hover:rotate-90 transition-transform duration-300" />
                </button>
                <div className="absolute left-0 mt-2 w-64 p-4 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-left">
                  <div className="space-y-3">
                    <Link to="/insights/ai-summaries" className="block px-2 py-1 hover:bg-gray-50 rounded-md text-gray-700 hover:text-nuvos-blue transition-colors">
                      <span className="font-medium">AI Deal Analysis</span>
                      <p className="text-xs text-gray-500">AI-generated insights</p>
                    </Link>
                    <Link to="/insights/risk-alerts" className="block px-2 py-1 hover:bg-gray-50 rounded-md text-gray-700 hover:text-nuvos-blue transition-colors">
                      <span className="font-medium">Risk Alerts</span>
                      <p className="text-xs text-gray-500">Get notified of issues</p>
                    </Link>
                    <Link to="/insights/dashboards" className="block px-2 py-1 hover:bg-gray-50 rounded-md text-gray-700 hover:text-nuvos-blue transition-colors">
                      <span className="font-medium">Performance Dashboards</span>
                      <p className="text-xs text-gray-500">Track key metrics</p>
                    </Link>
                  </div>
                </div>
              </div>
            </nav>
            
            <div className="flex items-center gap-4">
              {user ? (
                <Link to="/dashboard">
                  <Button variant="default" className="bg-nuvos-teal hover:bg-nuvos-teal/90 shadow-md">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-nuvos-blue font-medium">
                    Sign in
                  </Link>
                  <Link to="/signup">
                    <Button variant="default" className="bg-nuvos-teal hover:bg-nuvos-teal/90 shadow-md">
                      Start for free
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
          
          {/* Mobile menu button - will be expanded in subsequent implementation */}
          <button className="md:hidden p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Hero Section with animated gradient */}
      <section className="pt-24 pb-16 md:pt-40 md:pb-28 px-4 overflow-hidden relative">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-nuvos-blue/5 via-nuvos-teal/5 to-white" 
          style={{
            backgroundSize: "200% 200%",
            animation: "gradient-shift 8s ease infinite"
          }}
        />
        
        {/* Floating shapes for visual interest */}
        <div className="absolute top-20 right-[20%] w-64 h-64 rounded-full bg-gradient-to-r from-nuvos-teal/20 to-blue-400/10 blur-3xl" />
        <div className="absolute bottom-10 left-[15%] w-72 h-72 rounded-full bg-gradient-to-r from-nuvos-blue/10 to-purple-500/10 blur-3xl" />
        
        <div className="container mx-auto max-w-6xl relative">
          <motion.div 
            className="grid md:grid-cols-2 gap-12 items-center"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <div>
              <motion.span 
                className="inline-block px-3 py-1 bg-blue-50 text-nuvos-blue rounded-full text-sm font-medium mb-6"
                variants={fadeIn}
              >
                AI-Powered Commercial Real Estate
              </motion.span>
              
              <motion.h1 
                className="font-grotesk text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-nuvos-blue"
                variants={fadeIn}
              >
                Model Smarter. <br />
                Move Faster. <br />
                <span className="text-nuvos-teal inline-block relative">
                  Unlock AI Intelligence.
                  <svg className="absolute -bottom-2 left-0 w-full h-2 text-nuvos-teal/30" viewBox="0 0 200 8" preserveAspectRatio="none">
                    <path d="M0,5 C50,0 150,0 200,5 L200,8 L0,8 Z" fill="currentColor"></path>
                  </svg>
                </span>
              </motion.h1>
              
              <motion.p 
                className="text-gray-600 text-lg mb-8 max-w-lg"
                variants={fadeIn}
              >
                Nuvos is the AI-enhanced commercial real estate platform built for professional investors and asset managers.
              </motion.p>
              
              <motion.div 
                className="flex flex-wrap gap-4"
                variants={fadeIn}
              >
                {user ? (
                  <Link to="/dashboard">
                    <Button size="lg" className="bg-nuvos-teal hover:bg-nuvos-teal/90 shadow-lg">
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/signup">
                      <Button size="lg" className="bg-nuvos-teal hover:bg-nuvos-teal/90 shadow-lg font-medium">
                        Get Started for Free
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button size="lg" variant="outline" className="border-gray-300 hover:bg-gray-50">
                        Sign in
                      </Button>
                    </Link>
                  </>
                )}
              </motion.div>
            </div>
            
            <motion.div 
              className="hidden md:block relative"
              variants={fadeIn}
              ref={heroRef}
            >
              <div className="relative z-10">
                <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">
                  <div className="bg-gray-50 p-3 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex space-x-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <div className="text-xs font-medium text-gray-500">Nuvos Dashboard</div>
                    <div className="w-6"></div>
                  </div>
                  <img
                    src="/placeholder.svg"
                    alt="Nuvos Dashboard"
                    className="w-full h-auto"
                    style={{ maxHeight: '340px', objectFit: 'cover' }}
                  />
                </div>
                
                {/* Floating UI elements for visual interest */}
                <div className="absolute -bottom-10 -right-10 bg-white p-4 rounded-lg shadow-lg border border-gray-100 w-48">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-nuvos-teal/20 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-nuvos-teal" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Deal Approved</div>
                      <div className="text-xs text-gray-500">2 minutes ago</div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -top-10 -left-10 bg-white p-4 rounded-lg shadow-lg border border-gray-100 w-52">
                  <div className="text-sm font-medium mb-2">Cap Rate Analysis</div>
                  <div className="h-8 bg-gray-100 rounded-md w-full mb-2"></div>
                  <div className="h-2 bg-nuvos-teal rounded-md w-3/4"></div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-3 py-1 bg-blue-50 text-nuvos-blue rounded-full text-sm font-medium mb-4">How It Works</span>
            <h2 className="text-3xl md:text-4xl font-bold font-grotesk mb-4">Three steps to smarter investments</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Our AI-powered platform transforms complex real estate data into actionable investment intelligence.</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-nuvos-teal/0 via-nuvos-teal/50 to-nuvos-teal/0 transform -translate-y-1/2" />
            
            <motion.div 
              className="bg-white rounded-xl p-6 shadow-md border border-gray-100 relative z-10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="w-12 h-12 bg-nuvos-blue/10 rounded-full flex items-center justify-center mb-5">
                <span className="text-xl font-bold text-nuvos-blue">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Import Your Data</h3>
              <p className="text-gray-600">Connect your existing data sources or manually input property information to get started.</p>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-xl p-6 shadow-md border border-gray-100 relative z-10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="w-12 h-12 bg-nuvos-teal/10 rounded-full flex items-center justify-center mb-5">
                <span className="text-xl font-bold text-nuvos-teal">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">AI-Powered Analysis</h3>
              <p className="text-gray-600">Our AI engine processes your data to generate accurate forecasts and investment recommendations.</p>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-xl p-6 shadow-md border border-gray-100 relative z-10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-5">
                <span className="text-xl font-bold text-blue-500">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Make Smart Decisions</h3>
              <p className="text-gray-600">Use our interactive dashboards and reports to evaluate deals and optimize your investment portfolio.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-3 py-1 bg-blue-50 text-nuvos-blue rounded-full text-sm font-medium mb-4">Key Features</span>
            <h2 className="text-3xl md:text-4xl font-bold font-grotesk mb-4">Built for Commercial Real Estate Professionals</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Comprehensive tools designed specifically for CRE investment analysis and management.</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-white rounded-xl shadow-md hover:shadow-lg border border-gray-100 overflow-hidden transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="h-2.5 w-full bg-nuvos-blue"></div>
              <div className="p-6">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-5">
                  <Building className="h-6 w-6 text-nuvos-blue" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Valuation & Forecasting</h3>
                <p className="text-gray-600 mb-5">AI-powered property valuation models, cash flow projections, and scenario analysis.</p>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-nuvos-teal mr-2 flex-shrink-0" />
                    <span>Property development pro-formas</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-nuvos-teal mr-2 flex-shrink-0" />
                    <span>Acquisition underwriting</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-nuvos-teal mr-2 flex-shrink-0" />
                    <span>DCF & IRR calculations</span>
                  </li>
                </ul>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-xl shadow-md hover:shadow-lg border border-gray-100 overflow-hidden transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="h-2.5 w-full bg-nuvos-teal"></div>
              <div className="p-6">
                <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center mb-5">
                  <BarChart3 className="h-6 w-6 text-nuvos-teal" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Deal Management</h3>
                <p className="text-gray-600 mb-5">Track and manage your deal pipeline through every stage of the investment process.</p>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-nuvos-blue mr-2 flex-shrink-0" />
                    <span>Kanban deal tracking</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-nuvos-blue mr-2 flex-shrink-0" />
                    <span>Custom deal stages</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-nuvos-blue mr-2 flex-shrink-0" />
                    <span>Team collaboration tools</span>
                  </li>
                </ul>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-xl shadow-md hover:shadow-lg border border-gray-100 overflow-hidden transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="h-2.5 w-full bg-purple-500"></div>
              <div className="p-6">
                <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mb-5">
                  <BrainCircuit className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">AI-Powered Insights</h3>
                <p className="text-gray-600 mb-5">Leverage artificial intelligence to uncover insights and optimize your investments.</p>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-purple-600 mr-2 flex-shrink-0" />
                    <span>AI market analysis</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-purple-600 mr-2 flex-shrink-0" />
                    <span>Smart risk alerts</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-purple-600 mr-2 flex-shrink-0" />
                    <span>Automated deal reports</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials/Logos Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            className="text-center mb-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium mb-4">Trusted By Industry Leaders</span>
            <h2 className="text-2xl md:text-3xl font-bold font-grotesk mb-8">Join the leading CRE firms using Nuvos</h2>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((index) => (
              <motion.div 
                key={index}
                className="bg-white h-24 rounded-lg shadow-sm flex items-center justify-center border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-gray-400 font-medium text-xl">Logo {index}</div>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="mt-16 bg-white rounded-2xl shadow-lg border border-gray-100 p-8 relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-transparent rounded-full transform translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
            
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex-shrink-0"></div>
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 text-lg italic mb-3">"Nuvos has transformed how we evaluate potential acquisitions. The AI-powered analysis gives us confidence in our investment decisions."</p>
                <div>
                  <div className="font-semibold">Alex Thompson</div>
                  <div className="text-sm text-gray-500">Managing Director, Thompson Real Estate Capital</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4 bg-nuvos-blue text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(18,181,176,0.2),transparent_50%),radial-gradient(circle_at_top_right,rgba(42,133,255,0.2),transparent_50%)]"></div>
        
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-grotesk">Ready to transform your real estate investment strategy?</h2>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              Join the leading commercial real estate professionals leveraging AI and data analytics to make better investment decisions.
            </p>
            
            {user ? (
              <Link to="/dashboard">
                <Button size="lg" className="bg-white text-nuvos-blue hover:bg-gray-100 font-medium shadow-lg">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/signup">
                  <Button size="lg" className="bg-white text-nuvos-blue hover:bg-gray-100 font-medium shadow-lg">
                    Create Your Free Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                    Sign in
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-100 py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <span className="font-grotesk font-bold text-xl text-nuvos-blue">
                Nuvos<span className="text-nuvos-teal">.</span>
              </span>
              <p className="mt-2 text-gray-600 max-w-xs">
                AI-powered commercial real estate platform for modern investors
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold mb-4">Platform</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-600 hover:text-nuvos-teal transition-colors">Features</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-nuvos-teal transition-colors">Security</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-nuvos-teal transition-colors">Pricing</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-600 hover:text
