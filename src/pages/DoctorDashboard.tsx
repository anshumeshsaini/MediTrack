import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Heart, LogOut, Search, FileText, Calendar, Pill, Stethoscope, User, Building, Clock, AlertCircle, Brain, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Player } from "@lottiefiles/react-lottie-player";
import Searchs from '../assets/animation/Searchdoctor.json';
import History from '../assets/animation/History.json';
import sec from '../assets/animation/searchsaa.json';
import sym from '../assets/animation/Emergency.json';
import logo from '../assets/logo.png';

interface PatientRecord {
  id: string;
  unique_id: string;
  full_name: string;
  surgery_details: string;
  medicines: string;
  diagnosis: string;
  notes: string;
  hospital_id: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    hospital_name: string;
    full_name: string;
  };
}

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, userProfile, loading } = useAuth();
  
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState<PatientRecord | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Check if user is authenticated and has doctor role
  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/login');
        return;
      }
      
      if (userProfile?.role !== 'doctor') {
        toast({
          title: "Access Denied",
          description: "You need doctor access to view this page",
          variant: "destructive"
        });
        navigate('/login');
        return;
      }
      
      // Load recent searches from localStorage
      const savedSearches = localStorage.getItem('recentSearches');
      if (savedSearches) {
        setRecentSearches(JSON.parse(savedSearches));
      }
    }
  }, [user, userProfile, loading, navigate, toast]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) {
      toast({
        title: "Search Error",
        description: "Please enter a patient unique ID",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    setHasSearched(true);

    try {
      const { data, error } = await supabase
        .from('patient_records')
        .select(`
          *,
          profiles!patient_records_hospital_id_fkey(hospital_name, full_name)
        `)
        .eq('unique_id', searchId.trim())
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          setSearchResult(null);
          toast({
            title: "No Records Found",
            description: "No patient found with this unique ID",
            variant: "destructive"
          });
        } else {
          throw error;
        }
        return;
      }
      
      setSearchResult(data);
      
      // Save to recent searches
      const newRecentSearches = [searchId.trim(), ...recentSearches.filter(id => id !== searchId.trim())].slice(0, 5);
      setRecentSearches(newRecentSearches);
      localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
      
      toast({
        title: "Patient Found",
        description: `Medical records for ${data.full_name} loaded successfully`
      });
    } catch (error: any) {
      toast({
        title: "Search Error",
        description: error.message || "Failed to search patient records",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out"
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive"
      });
    }
  };

  const formatId = (id: string) => {
    return id.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const getCriticalStatus = (diagnosis: string) => {
    if (!diagnosis) return false;
    const criticalKeywords = ['critical', 'emergency', 'severe', 'urgent', 'acute'];
    return criticalKeywords.some(keyword => diagnosis.toLowerCase().includes(keyword));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-primary/5 to-primary/10 opacity-50"></div>
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full filter blur-3xl"></div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-primary/10"
            style={{
              width: Math.floor(Math.random() * 20) + 10,
              height: Math.floor(Math.random() * 20) + 10,
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
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-xl transform rotate-12"></div>

              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
 <img src={logo} alt="" style={{ width: "160px", height: "50px" }} />
                </h1>
                <p className="text-sm text-muted-foreground">
                  Welcome, Dr. {userProfile?.full_name || 'Doctor'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="rounded-full border-border/30 hover:border-primary/50 transition-all duration-300 group"
              >
                <LogOut className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Search Section */}
        <Card className="mb-8 border-0 bg-background/80 backdrop-blur-md shadow-xl overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16"></div>
          <CardHeader className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center space-x-2">
                  <Search className="h-6 w-6 text-primary" />
                  <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    Patient History Search
                  </span>
                </CardTitle>
                <CardDescription>
                  Enter the patient's unique ID to access their complete medical history
                </CardDescription>
              </div>
              <div className="w-24 h-24">
                <Player
                  autoplay
                  loop
                  src={Searchs}
                  style={{ height: '100%', width: '100%' }}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Enter Patient Unique ID (e.g., 1234 5678 9123)"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    className="text-lg py-6 pl-10 bg-background/70 border-border/30 focus:border-primary/50 transition-colors duration-300"
                    disabled={isSearching}
                  />
                </div>
                <Button 
                  type="submit" 
                  size="lg" 
                  className="sm:px-8 rounded-lg bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all duration-300 shadow-lg hover:shadow-primary/20 group"
                  disabled={isSearching}
                >
                  {isSearching ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-background/30 border-t-background rounded-full animate-spin"></div>
                      Searching...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                      Search
                    </div>
                  )}
                </Button>
              </div>
            </form>

            {recentSearches.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">Recent searches:</p>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((id, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="rounded-full text-xs border-border/30 hover:border-primary/50 transition-colors duration-300"
                      onClick={() => setSearchId(id)}
                    >
                      {formatId(id)}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Search Results */}
        {hasSearched && (
          <div className="space-y-6">
            {searchResult ? (
              <>
                {/* Patient Info Card */}
                <Card className="border-0 bg-background/80 backdrop-blur-md shadow-xl overflow-hidden">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/5 rounded-full -translate-y-16 -translate-x-16"></div>
                  <CardHeader className="relative z-10 bg-gradient-to-r from-primary to-purple-600 text-primary-foreground rounded-t-lg">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <FileText className="h-5 w-5" />
                        <span>Patient Information</span>
                      </CardTitle>
                      {getCriticalStatus(searchResult.diagnosis) && (
                        <div className="flex items-center bg-red-500/20 px-3 py-1 rounded-full">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          <span className="text-sm">Critical Case</span>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 relative z-10">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center text-muted-foreground">
                          <User className="h-4 w-4 mr-2" />
                          <span className="text-sm font-medium">Patient Details</span>
                        </div>
                        <p className="text-lg font-semibold text-foreground">{searchResult.full_name}</p>
                        <p className="text-sm text-muted-foreground">ID: {formatId(searchResult.unique_id)}</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center text-muted-foreground">
                          <Building className="h-4 w-4 mr-2" />
                          <span className="text-sm font-medium">Hospital</span>
                        </div>
                        <p className="text-foreground">{searchResult.profiles?.hospital_name || searchResult.profiles?.full_name || 'Unknown'}</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="h-4 w-4 mr-2" />
                          <span className="text-sm font-medium">Last Updated</span>
                        </div>
                        <p className="text-foreground">
                          {new Date(searchResult.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Medical Details Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Surgery Details */}
                  <Card className="border-0 bg-background/80 backdrop-blur-md shadow-xl overflow-hidden">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-primary">
                        <Stethoscope className="h-5 w-5" />
                        <span>Surgery Details</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground leading-relaxed">
                        {searchResult.surgery_details || "No surgery details recorded"}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Medicines */}
                  <Card className="border-0 bg-background/80 backdrop-blur-md shadow-xl overflow-hidden">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-primary">
                        <Pill className="h-5 w-5" />
                        <span>Prescribed Medicines</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground leading-relaxed">
                        {searchResult.medicines || "No medicines recorded"}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Diagnosis */}
                  <Card className="border-0 bg-background/80 backdrop-blur-md shadow-xl overflow-hidden">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-primary">
                        <Activity className="h-5 w-5" />
                        <span>Diagnosis</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground leading-relaxed">
                        {searchResult.diagnosis || "No diagnosis recorded"}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Additional Notes */}
                  <Card className="border-0 bg-background/80 backdrop-blur-md shadow-xl overflow-hidden">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-primary">
                        <Brain className="h-5 w-5" />
                        <span>Additional Notes</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground leading-relaxed">
                        {searchResult.notes || "No additional notes recorded"}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </>
            ) : (
              <Card className="border-0 bg-background/80 backdrop-blur-md shadow-xl overflow-hidden">
                <CardContent className="text-center py-12">
                  <div className="w-48 h-48 mx-auto mb-4">
                    <Player
                      autoplay
                      loop
                      src={Searchs}
                      style={{ height: '100%', width: '100%' }}
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Records Found</h3>
                  <p className="text-muted-foreground">
                    No patient found with the ID "{searchId}". Please verify the unique ID and try again.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Quick Actions */}
        {!hasSearched && (
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card className="border-0 bg-background/80 backdrop-blur-md shadow-xl overflow-hidden text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 mx-auto mb-4">
                  <Player
                    autoplay
                    loop
                    src={History}
                    style={{ height: '100%', width: '100%' }}
                  />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Search Patients</h3>
                <p className="text-sm text-muted-foreground">Find patient records by unique ID</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-background/80 backdrop-blur-md shadow-xl overflow-hidden text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 mx-auto mb-4">
                  <Player
                    autoplay
                    loop
                    src={sec}
                    style={{ height: '100%', width: '100%' }}
                  />
                </div>
                <h3 className="font-semibold text-foreground mb-2">View History</h3>
                <p className="text-sm text-muted-foreground">Access complete medical histories</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-background/80 backdrop-blur-md shadow-xl overflow-hidden text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 mx-auto mb-4">
                  <Player
                    autoplay
                    loop
                    src={sym}
                    style={{ height: '100%', width: '100%' }}
                  />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Critical Cases</h3>
                <p className="text-sm text-muted-foreground">Identify urgent patient needs</p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

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

export default DoctorDashboard;