import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Shield, Users, Search, Brain, Activity, Stethoscope, Database, ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from '../assets/logo.png';
const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Shield,
      title: "Secure Records",
      description: "Military-grade encryption for all patient data"
    },
    {
      icon: Users,
      title: "Role-Based Access",
      description: "Dedicated portals with granular permission controls"
    },
    {
      icon: Search,
      title: "Instant Search",
      description: "Find patient records in milliseconds with AI-powered search"
    },
    {
      icon: Heart,
      title: "Patient Care",
      description: "Comprehensive medical history with timeline visualization"
    },
    {
      icon: Brain,
      title: "AI Insights",
      description: "Predictive analytics for better treatment outcomes"
    },
    {
      icon: Activity,
      title: "Real-time Updates",
      description: "Live synchronization across all devices"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-primary/5 to-primary/10 opacity-50"></div>
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full filter blur-3xl"></div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-primary/10"
            style={{
              width: Math.floor(Math.random() * 30) + 10,
              height: Math.floor(Math.random() * 30) + 10,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float${Math.floor(Math.random() * 3) + 1} ${Math.random() * 10 + 10}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-border/10 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-xl transform rotate-12"></div>

              </div>
              
              <img src={logo} alt="" style={{ width: "160px", height: "50px" }} />


            </div>
            <Button 
              variant="ghost" 
              className="rounded-full border border-primary/20 hover:bg-primary/10 transition-all duration-300 group"
              onClick={() => navigate('/login')}
            >
              <span className="group-hover:scale-105 transition-transform">Login</span>
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-24 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-8 animate-pulse">

            Revolutionizing Healthcare Data Management
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Comprehensive Patient <br />
            <span className="relative">
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                History Management
              </span>
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary to-purple-600 rounded-full"></div>
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Secure, intelligent platform for healthcare providers to manage and access 
            complete patient surgical and medical histories with cutting-edge technology.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-primary/20 transition-all duration-300 group"
              onClick={() => navigate('/login?role=hospital')}
            >
              <span className="group-hover:scale-105 transition-transform">Hospital Portal</span>
              <Database className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6 rounded-full border-primary/30 hover:border-primary/70 transition-all duration-300 group"
              onClick={() => navigate('/login?role=doctor')}
            >
              <span className="group-hover:scale-105 transition-transform">Doctor Portal</span>
              <Stethoscope className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Built for <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Modern Healthcare</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to securely manage and access patient medical histories with cutting-edge technology
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-0 bg-background/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                <CardHeader>
                  <div className="relative inline-flex">
                    <div className="absolute inset-0 bg-primary/10 rounded-xl transform rotate-6 group-hover:rotate-12 transition-transform duration-300"></div>
                    <feature.icon className="h-12 w-12 text-primary relative z-10 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors duration-300">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 py-24 px-4 bg-gradient-to-br from-slate-100/50 to-blue-100/50 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-foreground mb-6">
              How <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">MediTrack</span> Works
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary/10 rounded-full filter blur-xl"></div>
              <div className="relative bg-background rounded-2xl p-8 shadow-lg border border-border/10">
                <h3 className="text-2xl font-bold text-foreground mb-8 flex items-center">
                  <Database className="h-8 w-8 text-primary mr-3" />
                  For Hospitals
                </h3>
                <div className="space-y-8">
                  <div className="flex items-start space-x-5">
                    <div className="bg-gradient-to-br from-primary to-purple-600 text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-lg">1</div>
                    <div>
                      <h4 className="font-semibold text-foreground text-lg mb-1">Secure Login</h4>
                      <p className="text-muted-foreground">Access your hospital portal with multi-factor authentication</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-5">
                    <div className="bg-gradient-to-br from-primary to-purple-600 text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-lg">2</div>
                    <div>
                      <h4 className="font-semibold text-foreground text-lg mb-1">Add Patient Records</h4>
                      <p className="text-muted-foreground">Create comprehensive medical histories with our intuitive forms</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-5">
                    <div className="bg-gradient-to-br from-primary to-purple-600 text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-lg">3</div>
                    <div>
                      <h4 className="font-semibold text-foreground text-lg mb-1">Manage Records</h4>
                      <p className="text-muted-foreground">View, update, and analyze patient information with advanced tools</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-purple-500/10 rounded-full filter blur-xl"></div>
              <div className="relative bg-background rounded-2xl p-8 shadow-lg border border-border/10">
                <h3 className="text-2xl font-bold text-foreground mb-8 flex items-center">
                  <Stethoscope className="h-8 w-8 text-primary mr-3" />
                  For Doctors
                </h3>
                <div className="space-y-8">
                  <div className="flex items-start space-x-5">
                    <div className="bg-gradient-to-br from-primary to-purple-600 text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-lg">1</div>
                    <div>
                      <h4 className="font-semibold text-foreground text-lg mb-1">Doctor Login</h4>
                      <p className="text-muted-foreground">Access the doctor portal with your secure credentials</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-5">
                    <div className="bg-gradient-to-br from-primary to-purple-600 text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-lg">2</div>
                    <div>
                      <h4 className="font-semibold text-foreground text-lg mb-1">Search Patients</h4>
                      <p className="text-muted-foreground">Find patients by unique ID or name with intelligent search</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-5">
                    <div className="bg-gradient-to-br from-primary to-purple-600 text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-lg">3</div>
                    <div>
                      <h4 className="font-semibold text-foreground text-lg mb-1">View History</h4>
                      <p className="text-muted-foreground">Access complete medical records with visualization tools</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 px-4">
        <div className="container mx-auto text-center">
          <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-2xl p-12 shadow-lg border border-border/10 backdrop-blur-sm">
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Ready to Transform <br />Patient Care?
            </h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Join thousands of healthcare providers using MediTrack to deliver better patient outcomes.
            </p>
            <Button 
              size="lg" 
              className="text-lg px-10 py-7 rounded-full shadow-lg hover:shadow-primary/30 transition-all duration-300 group"
              onClick={() => navigate('/login')}
            >
              <span className="group-hover:scale-105 transition-transform">Get Started Today</span>
              <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-background/80 backdrop-blur-md border-t border-border/10 py-16 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-xl transform rotate-12"></div>
                <Heart className="h-8 w-8 text-primary relative z-10" />
              </div>
              <span className="text-xl font-semibold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">MediTrack</span>
            </div>
            
            <div className="flex flex-wrap gap-6 justify-center">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Features</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Security</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Pricing</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Contact</a>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-muted-foreground">
                © {new Date().getFullYear()} MediTrack. Secure Patient History Management System
              </p>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float1 {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-5deg); }
        }
        @keyframes float3 {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(3deg); }
        }
      `}</style>
    </div>
  );
};

export default Index;