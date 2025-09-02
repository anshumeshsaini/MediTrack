import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Heart, Eye, EyeOff, ArrowRight, Stethoscope, Building, Lock, UserPlus, User, Shield } from "lucide-react";
import logo  from '../../assets/logo copy.png';

export const AuthForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    role: ""
  });
  const [signupData, setSignupData] = useState({
    email: "",
    password: "",
    fullName: "",
    role: "",
    hospitalName: "",
    doctorLicense: ""
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (error) throw error;

      // Get user profile to check role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', data.user.id)
        .single();

      if (profileError) throw profileError;

      // Check if role matches
      if (profile.role !== loginData.role) {
        toast({
          title: "Access Denied",
          description: "Your account role doesn't match the selected role",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Login Successful",
        description: `Welcome back!`
      });

      // Redirect based on role
      if (profile.role === 'hospital') {
        navigate('/hospital-dashboard');
      } else {
        navigate('/doctor-dashboard');
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            role: signupData.role,
            full_name: signupData.fullName,
            hospital_name: signupData.role === 'hospital' ? signupData.hospitalName : null,
            doctor_license: signupData.role === 'doctor' ? signupData.doctorLicense : null
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Account Created",
        description: "Please check your email to verify your account",
      });

      // Clear form
      setSignupData({
        email: "",
        password: "",
        fullName: "",
        role: "",
        hospitalName: "",
        doctorLicense: ""
      });
    } catch (error: any) {
      toast({
        title: "Signup Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4 relative overflow-hidden">
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

      <Card className="w-full max-w-md border-0 bg-background/80 backdrop-blur-md shadow-xl relative z-10 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/10 rounded-full"></div>
        
        <CardHeader className="text-center relative">
          <div className="absolute top-4 left-4">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-xl transform rotate-12"></div>
 <img src={logo} alt="" style={{ width: "160px", height: "50px" }} />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            MediTrack
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Secure access to medical records portal
          </CardDescription>
        </CardHeader>
        
        <CardContent className="relative z-10">
          <Tabs 
            defaultValue="login" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-1 rounded-lg">
              <TabsTrigger 
                value="login" 
                className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-300 flex items-center justify-center gap-2"
              >
                <User className="h-4 w-4" />
                Login
              </TabsTrigger>
              <TabsTrigger 
                value="signup" 
                className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-300 flex items-center justify-center gap-2"
              >
                <UserPlus className="h-4 w-4" />
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground/80 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={loginData.email}
                    onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                    required
                    className="bg-background/70 border-border/30 focus:border-primary/50 transition-colors duration-300"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground/80 flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                      required
                      className="bg-background/70 border-border/30 focus:border-primary/50 transition-colors duration-300 pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="text-foreground/80">Role</Label>
                  <Select value={loginData.role} onValueChange={(value) => setLoginData(prev => ({ ...prev, role: value }))}>
                    <SelectTrigger className="bg-background/70 border-border/30 focus:border-primary/50 transition-colors duration-300">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hospital" className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        Hospital
                      </SelectItem>
                      <SelectItem value="doctor" className="flex items-center gap-2">
                        <Stethoscope className="h-4 w-4" />
                        Doctor
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  type="submit" 
                  className="w-full mt-2 rounded-lg bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all duration-300 shadow-lg hover:shadow-primary/20 group"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-background/30 border-t-background rounded-full animate-spin"></div>
                      Signing In...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>Sign In</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-foreground/80 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Email
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={signupData.email}
                    onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                    required
                    className="bg-background/70 border-border/30 focus:border-primary/50 transition-colors duration-300"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-foreground/80 flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={signupData.password}
                      onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
                      required
                      className="bg-background/70 border-border/30 focus:border-primary/50 transition-colors duration-300 pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="full-name" className="text-foreground/80">Full Name</Label>
                  <Input
                    id="full-name"
                    placeholder="Enter your full name"
                    value={signupData.fullName}
                    onChange={(e) => setSignupData(prev => ({ ...prev, fullName: e.target.value }))}
                    required
                    className="bg-background/70 border-border/30 focus:border-primary/50 transition-colors duration-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-role" className="text-foreground/80">Role</Label>
                  <Select value={signupData.role} onValueChange={(value) => setSignupData(prev => ({ ...prev, role: value }))}>
                    <SelectTrigger className="bg-background/70 border-border/30 focus:border-primary/50 transition-colors duration-300">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hospital" className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        Hospital
                      </SelectItem>
                      <SelectItem value="doctor" className="flex items-center gap-2">
                        <Stethoscope className="h-4 w-4" />
                        Doctor
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {signupData.role === 'hospital' && (
                  <div className="space-y-2 animate-in fade-in-50">
                    <Label htmlFor="hospital-name" className="text-foreground/80 flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Hospital Name
                    </Label>
                    <Input
                      id="hospital-name"
                      placeholder="Enter hospital name"
                      value={signupData.hospitalName}
                      onChange={(e) => setSignupData(prev => ({ ...prev, hospitalName: e.target.value }))}
                      required
                      className="bg-background/70 border-border/30 focus:border-primary/50 transition-colors duration-300"
                    />
                  </div>
                )}

                {signupData.role === 'doctor' && (
                  <div className="space-y-2 animate-in fade-in-50">
                    <Label htmlFor="doctor-license" className="text-foreground/80 flex items-center gap-2">
                      <Stethoscope className="h-4 w-4" />
                      Medical License Number
                    </Label>
                    <Input
                      id="doctor-license"
                      placeholder="Enter license number"
                      value={signupData.doctorLicense}
                      onChange={(e) => setSignupData(prev => ({ ...prev, doctorLicense: e.target.value }))}
                      required
                      className="bg-background/70 border-border/30 focus:border-primary/50 transition-colors duration-300"
                    />
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full mt-2 rounded-lg bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all duration-300 shadow-lg hover:shadow-primary/20 group"
                  disabled={isLoading || !signupData.role}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-background/30 border-t-background rounded-full animate-spin"></div>
                      Creating Account...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>Create Account</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

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