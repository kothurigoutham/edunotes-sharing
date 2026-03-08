import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { LogIn, UserPlus, Key } from "lucide-react";

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [crCode, setCrCode] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName }, emailRedirectTo: window.location.origin },
      });

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      // If CR code provided, verify and assign role
      if (crCode.trim() && data.user) {
        const { data: verifyData, error: verifyError } = await supabase.functions.invoke(
          "verify-cr-code",
          { body: { code: crCode.trim(), userId: data.user.id } }
        );

        if (verifyError || !verifyData?.success) {
          toast.warning("Account created but CR code was invalid. You're registered as a student.");
        } else {
          toast.success("Account created as CR! Check your email to confirm.");
          setLoading(false);
          return;
        }
      }

      toast.success("Account created! Check your email to confirm.");
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Signed in successfully!");
        navigate("/");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex items-center justify-center px-4 py-16">
        <Card className="w-full max-w-md shadow-elevated border-t-4 border-t-primary">
          <CardHeader className="text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary shadow-lg">
              {isSignUp ? <UserPlus className="h-7 w-7 text-primary-foreground" /> : <LogIn className="h-7 w-7 text-primary-foreground" />}
            </div>
            <CardTitle className="font-display text-2xl">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </CardTitle>
            <CardDescription>
              {isSignUp ? "Sign up to access and download notes" : "Sign in to access your notes"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Enter your full name" required />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
              </div>

              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="crCode" className="flex items-center gap-2">
                    <Key className="h-4 w-4 text-muted-foreground" />
                    CR Secret Code <span className="text-xs text-muted-foreground">(optional)</span>
                  </Label>
                  <Input
                    id="crCode"
                    type="password"
                    value={crCode}
                    onChange={(e) => setCrCode(e.target.value)}
                    placeholder="Enter code if you're a CR"
                  />
                  <p className="text-xs text-muted-foreground">
                    Have a CR code? Enter it to get upload access.
                  </p>
                </div>
              )}

              <Button type="submit" className="w-full gradient-primary border-0 font-semibold" disabled={loading}>
                {loading ? "Please wait..." : isSignUp ? "Sign Up" : "Sign In"}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-primary hover:underline font-medium"
              >
                {isSignUp ? "Already have an account? Sign in" : "Need an account? Sign up"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
