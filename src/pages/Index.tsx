
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  LineChart,
  Building,
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  Lock,
  MessagesSquare,
  FileText,
  Buildings,
  ArrowUpRight,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-nuvos-blue via-nuvos-blue to-[#132248] text-white pt-16 md:pt-24 pb-20 md:pb-32 px-6">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Model Smarter. Move Faster. <br />
              <span className="text-nuvos-teal">Unlock AI Intelligence in CRE.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-10">
              Nuvos is the AI-powered platform built for commercial real estate investors and asset managers.
              Analyze properties, build sophisticated models, and collaborate on deals—all in one platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="bg-nuvos-teal hover:bg-nuvos-teal/90 text-white">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="container mx-auto mt-16">
          <div className="relative">
            <div className="bg-white p-2 rounded-xl shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80" 
                alt="Nuvos Dashboard Preview" 
                className="w-full h-auto rounded-lg"
              />
            </div>
            <div className="absolute -bottom-5 -right-5 bg-nuvos-teal text-white py-2 px-4 rounded-lg shadow-lg hidden md:block">
              <p className="text-sm font-medium">Powered by AI</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">The Complete CRE Investment Platform</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to analyze, manage, and grow your commercial real estate portfolio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-nuvos-teal/10 flex items-center justify-center mb-6">
                <LineChart className="h-6 w-6 text-nuvos-teal" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Valuation & Forecasting</h3>
              <p className="text-gray-600 mb-4">
                Build sophisticated financial models with auto-calculated NOI, IRR, Cap Rate and cash flow projections.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                  Development pro forma modeling
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                  DCF & IRR calculators
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                  Market scenario simulations
                </li>
              </ul>
              <Link to="/valuation/overview">
                <Button variant="ghost" className="text-nuvos-teal hover:text-nuvos-teal/90 p-0 flex items-center">
                  Learn more
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-nuvos-purple/10 flex items-center justify-center mb-6">
                <Building className="h-6 w-6 text-nuvos-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Deal Management</h3>
              <p className="text-gray-600 mb-4">
                Track your deal pipeline, collaborate with team members, and store all documents in one secure place.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                  Kanban-style deal pipeline
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                  Deal rooms for collaboration
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                  Smart document storage
                </li>
              </ul>
              <Link to="/deals/pipeline">
                <Button variant="ghost" className="text-nuvos-purple hover:text-nuvos-purple/90 p-0 flex items-center">
                  Learn more
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-nuvos-lightblue/10 flex items-center justify-center mb-6">
                <BrainCircuit className="h-6 w-6 text-nuvos-lightblue" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Insights & Collaboration</h3>
              <p className="text-gray-600 mb-4">
                Get AI-powered insights, risk analysis, and automated reports to make better investment decisions.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                  AI deal summaries and analysis
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                  Smart risk alerts
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                  Team chat and file sharing
                </li>
              </ul>
              <Link to="/insights/ai-summaries">
                <Button variant="ghost" className="text-nuvos-lightblue hover:text-nuvos-lightblue/90 p-0 flex items-center">
                  Learn more
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-nuvos-teal">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to transform your CRE investments?</h2>
            <p className="text-xl opacity-90 mb-10">
              Join Nuvos today and see how our AI-powered platform can help you make smarter investment decisions.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/signup">
                <Button size="lg" className="bg-white text-nuvos-teal hover:bg-gray-100">
                  Start Free Trial
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                  Request Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by CRE Professionals</h2>
            <p className="text-xl text-gray-600">
              Hear what our customers have to say about Nuvos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
              <blockquote className="text-gray-600 mb-6">
                "Nuvos has completely transformed how we analyze potential acquisitions. The AI insights have helped us identify opportunities we would have otherwise missed."
              </blockquote>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-300 mr-3"></div>
                <div>
                  <p className="font-medium">Sarah Johnson</p>
                  <p className="text-sm text-gray-500">Director of Acquisitions, Meridian Capital</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
              <blockquote className="text-gray-600 mb-6">
                "The deal management features have streamlined our acquisition process. We've reduced our closing time by 35% since implementing Nuvos."
              </blockquote>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-300 mr-3"></div>
                <div>
                  <p className="font-medium">Michael Chen</p>
                  <p className="text-sm text-gray-500">Managing Partner, Evergreen Investments</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
              <blockquote className="text-gray-600 mb-6">
                "The financial modeling capabilities are incredible. We've been able to run complex scenarios in minutes that used to take days to prepare."
              </blockquote>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-300 mr-3"></div>
                <div>
                  <p className="font-medium">Jessica Williams</p>
                  <p className="text-sm text-gray-500">VP of Finance, Urban Capital Group</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-nuvos-blue text-white py-16 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div>
              <div className="font-grotesk font-bold text-2xl mb-4">
                Nuvos<span className="text-nuvos-teal">.</span>
              </div>
              <p className="text-gray-300 mb-4">
                AI-powered commercial real estate platform for professional investors and asset managers.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Platform</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">Valuation & Forecasting</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Deal Management</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">AI Insights</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Collaboration Tools</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">About</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Blog</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Careers</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Press</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Nuvos. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm mr-6">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
