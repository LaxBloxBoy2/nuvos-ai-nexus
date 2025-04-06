
import { Link } from "react-router-dom";
import { Building, BarChart3, Calculator, BrainCircuit, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="w-full bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <span className="font-grotesk font-bold text-2xl text-nuvos-blue">
              Nuvos<span className="text-nuvos-teal">.</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            {user ? (
              <Link to="/dashboard">
                <Button>Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-nuvos-blue">
                  Log in
                </Link>
                <Link to="/signup">
                  <Button>Sign up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="font-grotesk text-4xl md:text-5xl font-bold leading-tight mb-6 text-nuvos-blue">
                Model Smarter. <br />
                Move Faster. <br />
                <span className="text-nuvos-teal">Unlock AI Intelligence in CRE.</span>
              </h1>
              <p className="text-gray-600 text-lg mb-8 max-w-lg">
                Nuvos is the AI-enhanced commercial real estate platform built for professional investors and asset managers.
              </p>
              <div className="flex flex-wrap gap-4">
                {user ? (
                  <Link to="/dashboard">
                    <Button size="lg" className="bg-nuvos-teal hover:bg-nuvos-teal/90">
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/signup">
                      <Button size="lg" className="bg-nuvos-teal hover:bg-nuvos-teal/90">
                        Get Started for Free
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button size="lg" variant="outline">
                        Log in
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="hidden md:block">
              <img
                src="/placeholder.svg"
                alt="Nuvos Platform Overview"
                className="w-full h-auto rounded-lg shadow-lg"
                style={{ maxHeight: '500px', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12 font-grotesk">Built for Commercial Real Estate Professionals</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Building size={24} className="text-nuvos-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Valuation & Forecasting</h3>
              <p className="text-gray-600 mb-4">
                AI-powered property valuation models, cash flow projections, and scenario analysis.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-nuvos-teal rounded-full mr-2"></span>
                  Property development pro-formas
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-nuvos-teal rounded-full mr-2"></span>
                  Acquisition underwriting
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-nuvos-teal rounded-full mr-2"></span>
                  DCF & IRR calculations
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 size={24} className="text-nuvos-teal" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Deal Management</h3>
              <p className="text-gray-600 mb-4">
                Track and manage your deal pipeline through every stage of the investment process.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-nuvos-blue rounded-full mr-2"></span>
                  Kanban deal tracking
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-nuvos-blue rounded-full mr-2"></span>
                  Custom deal stages
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-nuvos-blue rounded-full mr-2"></span>
                  Team collaboration tools
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <BrainCircuit size={24} className="text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Insights</h3>
              <p className="text-gray-600 mb-4">
                Leverage artificial intelligence to uncover insights and optimize your investments.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-2"></span>
                  AI market analysis
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-2"></span>
                  Smart risk alerts
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-2"></span>
                  Automated deal reports
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-nuvos-blue text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-grotesk">Ready to transform your real estate investment strategy?</h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Join the leading commercial real estate professionals leveraging AI and data analytics to make better investment decisions.
          </p>
          {user ? (
            <Link to="/dashboard">
              <Button size="lg" className="bg-white text-nuvos-blue hover:bg-gray-100">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <Link to="/signup">
              <Button size="lg" className="bg-white text-nuvos-blue hover:bg-gray-100">
                Create Your Free Account
              </Button>
            </Link>
          )}
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
                  <li><a href="#" className="text-gray-600 hover:text-nuvos-teal">Features</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-nuvos-teal">Security</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-nuvos-teal">Pricing</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-600 hover:text-nuvos-teal">Documentation</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-nuvos-teal">Guides</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-nuvos-teal">Blog</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Company</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-600 hover:text-nuvos-teal">About</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-nuvos-teal">Careers</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-nuvos-teal">Contact</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Nuvos. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-500 hover:text-nuvos-blue">Terms</a>
              <a href="#" className="text-gray-500 hover:text-nuvos-blue">Privacy</a>
              <a href="#" className="text-gray-500 hover:text-nuvos-blue">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
