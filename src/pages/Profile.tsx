import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { User, Key, CheckCircle, Upload, LogOut } from "lucide-react";
import { Navigate } from "react-router-dom";

const Profile = () => {
  const { user, isCR, loading } = useAuth();
  const [crCode, setCrCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!loading && !user) {
    return <Navigate to="/login" replace />;
  }

  const handleActivateCR = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!crCode.trim() || !user) return;
    setSubmitting(true);

    const { data, error } = await supabase.functions.invoke("verify-cr-code", {
      body: { code: crCode.trim(), userId: user.id },
    });

    if (error || !data?.success) {
      toast.error("Invalid CR code. Please try again.");
    } else {
      toast.success("CR role activated! You now have upload access.");
      window.location.reload();
    }
    setSubmitting(false);
  };

  const handleDeactivateCR = async () => {
    if (!user) return;
    setSubmitting(true);

    const { error } = await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", user.id)
      .eq("role", "cr");

    if (error) {
      toast.error("Failed to leave CR role. Please try again.");
    } else {
      toast.success("You have left the CR role.");
      window.location.reload();
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex items-center justify-center px-4 py-16">
        <Card className="w-full max-w-md shadow-elevated border-t-4 border-t-primary">
          <CardHeader className="text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary shadow-lg">
              <User className="h-7 w-7 text-primary-foreground" />
            </div>
            <CardTitle className="font-display text-2xl">My Profile</CardTitle>
            <CardDescription>{user?.email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Role status */}
            <div className="rounded-lg border bg-muted/50 p-4">
              <p className="text-sm font-medium text-muted-foreground mb-1">Your Role</p>
              {isCR ? (
                <div className="flex items-center gap-2 text-primary font-semibold">
                  <CheckCircle className="h-5 w-5" />
                  Class Representative (CR)
                  <Upload className="h-4 w-4 ml-auto" />
                </div>
              ) : (
                <p className="text-sm text-foreground">Student</p>
              )}
            </div>

            {/* CR deactivation */}
            {isCR && (
              <div className="space-y-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                <p className="text-sm font-semibold text-destructive flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  Leave CR Role
                </p>
                <p className="text-xs text-muted-foreground">
                  Step down from your CR role. You will lose access to Upload Notes and the CR Dashboard.
                </p>
                <Button
                  variant="destructive"
                  className="w-full font-semibold"
                  disabled={submitting}
                  onClick={handleDeactivateCR}
                >
                  {submitting ? "Processing..." : "Leave CR Role"}
                </Button>
              </div>
            )}

            {/* CR activation */}
            {!isCR && (
              <form onSubmit={handleActivateCR} className="space-y-3 rounded-lg border border-primary/30 bg-primary/5 p-4">
                <Label htmlFor="crCode" className="flex items-center gap-2 text-primary font-semibold">
                  <Key className="h-4 w-4" />
                  Activate CR Access
                </Label>
                <p className="text-xs text-muted-foreground">
                  Have a CR secret code? Enter it below to unlock the Upload Notes feature.
                </p>
                <Input
                  id="crCode"
                  type="password"
                  value={crCode}
                  onChange={(e) => setCrCode(e.target.value)}
                  placeholder="Enter CR secret code"
                  className="border-primary/30"
                  required
                />
                <Button type="submit" className="w-full gradient-primary border-0 font-semibold" disabled={submitting}>
                  {submitting ? "Verifying..." : "Activate CR Role"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
