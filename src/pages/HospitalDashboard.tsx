import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, LogOut, Plus, Users, Eye, Search, Calendar, FileText, Activity, Database, Shield, BarChart3, Bell, ClipboardList, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Player } from "@lottiefiles/react-lottie-player";
import doctor from '../assets/animation/Searchdoctor.json';
import plus from '../assets/animation/plus.json';
import Emergency from '../assets/animation/Emergency.json';
import sym from '../assets/animation/symbols.json';
import logo from '../assets/logo.png'

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
}

const HospitalDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, userProfile, loading } = useAuth();
  
  const [formData, setFormData] = useState({
    uniqueId: "",
    fullName: "",
    surgeryDetails: "",
    medicines: "",
    diagnosis: "",
    notes: ""
  });
  
  const [patientRecords, setPatientRecords] = useState<PatientRecord[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("add");
  const [stats, setStats] = useState({
    totalPatients: 0,
    recentAdditions: 0,
    criticalCases: 0
  });
  const [selectedRecord, setSelectedRecord] = useState<PatientRecord | null>(null);
  const [showRecordModal, setShowRecordModal] = useState(false);

  // Check if user is authenticated and has hospital role
  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/login');
        return;
      }
      
      if (userProfile?.role !== 'hospital') {
        toast({
          title: "Access Denied",
          description: "You need hospital access to view this page",
          variant: "destructive"
        });
        navigate('/login');
        return;
      }
      
      fetchPatientRecords();
    }
  }, [user, userProfile, loading, navigate, toast]);

  const fetchPatientRecords = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('patient_records')
        .select('*')
        .eq('hospital_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPatientRecords(data || []);
      
      // Calculate stats
      const today = new Date();
      const recentRecords = data?.filter(record => {
        const recordDate = new Date(record.created_at);
        return recordDate.toDateString() === today.toDateString();
      }) || [];
      
      const criticalRecords = data?.filter(record => 
        record.diagnosis?.toLowerCase().includes('critical') ||
        record.diagnosis?.toLowerCase().includes('emergency') ||
        record.diagnosis?.toLowerCase().includes('severe')
      ) || [];
      
      setStats({
        totalPatients: data?.length || 0,
        recentAdditions: recentRecords.length,
        criticalCases: criticalRecords.length
      });
    } catch (error) {
      console.error('Error fetching patient records:', error);
      toast({
        title: "Error",
        description: "Failed to load patient records",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    if (!formData.uniqueId || !formData.fullName) {
      toast({
        title: "Validation Error",
        description: "Unique ID and Full Name are required",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to add records",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('patient_records')
        .insert({
          unique_id: formData.uniqueId,
          full_name: formData.fullName,
          surgery_details: formData.surgeryDetails,
          medicines: formData.medicines,
          diagnosis: formData.diagnosis,
          notes: formData.notes,
          hospital_id: user.id
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Duplicate Record",
            description: "A patient with this Unique ID already exists",
            variant: "destructive"
          });
        } else {
          throw error;
        }
        setIsSubmitting(false);
        return;
      }
      
      setPatientRecords(prev => [data, ...prev]);
      setFormData({
        uniqueId: "",
        fullName: "",
        surgeryDetails: "",
        medicines: "",
        diagnosis: "",
        notes: ""
      });
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalPatients: prev.totalPatients + 1,
        recentAdditions: prev.recentAdditions + 1
      }));
      
      toast({
        title: "Success",
        description: "Patient record added successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add patient record",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
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

  const handleViewRecord = (record: PatientRecord) => {
    setSelectedRecord(record);
    setShowRecordModal(true);
  };

  const filteredRecords = patientRecords.filter(record => 
    record.unique_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (record.diagnosis && record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
                  Welcome, {userProfile?.hospital_name || userProfile?.full_name || 'Hospital'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                className="rounded-full border-border/30 hover:border-primary/50 transition-all duration-300 group"
              >
                <Bell className="h-4 w-4" />
              </Button>
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
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-background/80 backdrop-blur-md border-border/20 overflow-hidden">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Patients</p>
                <h3 className="text-3xl font-bold text-foreground">{stats.totalPatients}</h3>
              </div>
              <div className="w-16 h-16">
                <Player
                  autoplay
                  loop
                  src={doctor}
                  style={{ height: '100%', width: '100%' }}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-background/80 backdrop-blur-md border-border/20 overflow-hidden">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today's Additions</p>
                <h3 className="text-3xl font-bold text-foreground">{stats.recentAdditions}</h3>
              </div>
              <div className="w-16 h-16">
                <Player
                  autoplay
                  loop
                  src={plus}
                  style={{ height: '100%', width: '100%' }}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-background/80 backdrop-blur-md border-border/20 overflow-hidden">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical Cases</p>
                <h3 className="text-3xl font-bold text-foreground">{stats.criticalCases}</h3>
              </div>
              <div className="w-16 h-16">
                <Player
                  autoplay
                  loop
                  src={Emergency}
                  style={{ height: '100%', width: '100%' }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs 
          defaultValue="add" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-1 rounded-lg">
            <TabsTrigger 
              value="add" 
              className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Patient</span>
            </TabsTrigger>
            <TabsTrigger 
              value="view" 
              className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Users className="h-4 w-4" />
              <span>View Records</span>
            </TabsTrigger>
          </TabsList>

          {/* Add Patient Tab */}
          <TabsContent value="add">
            <Card className="border-0 bg-background/80 backdrop-blur-md shadow-xl overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16"></div>
              <CardHeader className="relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2 text-foreground">
                      <Plus className="h-5 w-5 text-primary" />
                      <span>Add New Patient Record</span>
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Enter comprehensive patient information and medical history
                    </CardDescription>
                  </div>
                  <div className="w-24 h-24">
                    <Player
                      autoplay
                      loop
                      src={sym}
                      style={{ height: '100%', width: '100%' }}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="uniqueId" className="text-foreground/80 flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        Patient Unique ID *
                      </Label>
                      <Input
                        id="uniqueId"
                        placeholder="e.g., 1234567891234"
                        value={formData.uniqueId}
                        onChange={(e) => handleInputChange('uniqueId', e.target.value)}
                        required
                        className="bg-background/70 border-border/30 focus:border-primary/50 transition-colors duration-300"
                      />
                      <p className="text-xs text-muted-foreground">13-digit unique identifier</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-foreground/80 flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Patient Full Name *
                      </Label>
                      <Input
                        id="fullName"
                        placeholder="Enter patient's full name"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        required
                        className="bg-background/70 border-border/30 focus:border-primary/50 transition-colors duration-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="surgeryDetails" className="text-foreground/80 flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Past Surgery Details
                    </Label>
                    <Textarea
                      id="surgeryDetails"
                      placeholder="Describe any past surgeries, dates, and outcomes..."
                      value={formData.surgeryDetails}
                      onChange={(e) => handleInputChange('surgeryDetails', e.target.value)}
                      rows={3}
                      className="bg-background/70 border-border/30 focus:border-primary/50 transition-colors duration-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medicines" className="text-foreground/80 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Medicines Prescribed
                    </Label>
                    <Textarea
                      id="medicines"
                      placeholder="List current and past medications..."
                      value={formData.medicines}
                      onChange={(e) => handleInputChange('medicines', e.target.value)}
                      rows={3}
                      className="bg-background/70 border-border/30 focus:border-primary/50 transition-colors duration-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="diagnosis" className="text-foreground/80 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Patient's Problem/Diagnosis
                    </Label>
                    <Textarea
                      id="diagnosis"
                      placeholder="Current diagnosis and medical conditions..."
                      value={formData.diagnosis}
                      onChange={(e) => handleInputChange('diagnosis', e.target.value)}
                      rows={3}
                      className="bg-background/70 border-border/30 focus:border-primary/50 transition-colors duration-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-foreground/80">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any other relevant medical information..."
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      rows={3}
                      className="bg-background/70 border-border/30 focus:border-primary/50 transition-colors duration-300"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full rounded-lg bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all duration-300 shadow-lg hover:shadow-primary/20 group"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 border-2 border-background/30 border-t-background rounded-full animate-spin"></div>
                        Adding Record...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span>Add Patient Record</span>
                        <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform" />
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* View Records Tab */}
          <TabsContent value="view">
            <Card className="border-0 bg-background/80 backdrop-blur-md shadow-xl overflow-hidden">
              <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/5 rounded-full -translate-y-16 -translate-x-16"></div>
              <CardHeader className="relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2 text-foreground">
                      <Users className="h-5 w-5 text-primary" />
                      <span>All Patient Records</span>
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      View and manage all patient records added by your hospital
                    </CardDescription>
                  </div>
                  <div className="w-24 h-24">
                    <Player
                      autoplay
                      loop
                      src="https://lottie.host/8a39f2c1-8f1f-4c3e-9d3f-3e3e3e3e3e3e/3q3q3q3q-3q3q-3q3q-3q3q-3q3q3q3q3q3q.json"
                      style={{ height: '100%', width: '100%' }}
                    />
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by ID, name, or diagnosis..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-background/70 border-border/30 focus:border-primary/50 transition-colors duration-300"
                    />
                  </div>
                  <Button 
                    onClick={() => setActiveTab("add")}
                    variant="outline"
                    className="border-border/30 hover:border-primary/50 transition-all duration-300"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Record
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="relative z-10">
                {filteredRecords.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-48 h-48 mx-auto mb-4">
                      <Player
                        autoplay
                        loop
                        src="https://lottie.host/8a39f2c1-8f1f-4c3e-9d3f-3e3e3e3e3e3e/3q3q3q3q-3q3q-3q3q-3q3q-3q3q3q3q3q3q.json"
                        style={{ height: '100%', width: '100%' }}
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Records Found</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchTerm ? "No records match your search" : "Start by adding your first patient record"}
                    </p>
                    <Button 
                      onClick={() => setActiveTab("add")}
                      className="rounded-lg bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all duration-300"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Patient Record
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        Showing {filteredRecords.length} of {patientRecords.length} records
                      </p>
                    </div>
                    
                    <div className="border border-border/20 rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader className="bg-muted/30">
                          <TableRow>
                            <TableHead className="font-semibold">Unique ID</TableHead>
                            <TableHead className="font-semibold">Patient Name</TableHead>
                            <TableHead className="font-semibold">Diagnosis</TableHead>
                            <TableHead className="font-semibold">Date Added</TableHead>
                            <TableHead className="font-semibold text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredRecords.map((record) => (
                            <TableRow key={record.id} className="hover:bg-muted/10 transition-colors duration-200">
                              <TableCell className="font-mono text-sm">{record.unique_id}</TableCell>
                              <TableCell className="font-medium">{record.full_name}</TableCell>
                              <TableCell className="max-w-xs truncate">{record.diagnosis || "N/A"}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(record.created_at).toLocaleDateString()}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="rounded-full border-border/30"
                                  onClick={() => handleViewRecord(record)}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Patient Record Modal */}
      {showRecordModal && selectedRecord && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Patient Record Details</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowRecordModal(false)}
                className="rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Unique ID</Label>
                  <p className="font-mono p-2 bg-muted/30 rounded-md">{selectedRecord.unique_id}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Patient Name</Label>
                  <p className="p-2 bg-muted/30 rounded-md">{selectedRecord.full_name}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">Diagnosis</Label>
                <div className="p-3 bg-muted/30 rounded-md">
                  {selectedRecord.diagnosis || "No diagnosis recorded"}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">Medicines Prescribed</Label>
                <div className="p-3 bg-muted/30 rounded-md whitespace-pre-wrap">
                  {selectedRecord.medicines || "No medicines recorded"}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">Surgery Details</Label>
                <div className="p-3 bg-muted/30 rounded-md whitespace-pre-wrap">
                  {selectedRecord.surgery_details || "No surgery details recorded"}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">Additional Notes</Label>
                <div className="p-3 bg-muted/30 rounded-md whitespace-pre-wrap">
                  {selectedRecord.notes || "No additional notes"}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 pt-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Date Created</Label>
                  <p className="p-2 bg-muted/30 rounded-md">
                    {new Date(selectedRecord.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Last Updated</Label>
                  <p className="p-2 bg-muted/30 rounded-md">
                    {new Date(selectedRecord.updated_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end p-6 border-t">
              <Button onClick={() => setShowRecordModal(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}

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

export default HospitalDashboard;