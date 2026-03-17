import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { Upload as UploadIcon, FileUp } from "lucide-react";

const BRANCHES = ["CSE", "ECE", "EEE", "ME", "CE", "IT", "AIDS", "AIML"];

const Upload = () => {
  const { user, isCR } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState("");
  const [file, setFile] = useState<File | null>(null);

  if (!isCR) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <p className="text-muted-foreground">Access denied. Only CRs can upload notes.</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !user) return;

    setLoading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const randomBytes = new Uint8Array(16);
      crypto.getRandomValues(randomBytes);
      const hex = Array.from(randomBytes).map(b => b.toString(16).padStart(2, '0')).join('');
      const filePath = `${hex}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("notes-pdfs")
        .upload(filePath, file);
      if (uploadError) throw uploadError;

      const { error: insertError } = await supabase.from("notes").insert({
        title,
        branch,
        year: parseInt(year),
        semester: parseInt(semester),
        subject,
        file_path: filePath,
        file_name: file.name,
        uploaded_by: user.id,
      });
      if (insertError) throw insertError;

      toast.success("Note uploaded successfully!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <Card className="shadow-elevated border-t-4 border-t-primary">
          <CardHeader>
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary shadow-lg">
              <UploadIcon className="h-7 w-7 text-primary-foreground" />
            </div>
            <CardTitle className="text-center font-display text-2xl">Upload Notes</CardTitle>
            <CardDescription className="text-center">Share study material with your class</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Data Structures Unit 1" required />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Branch</Label>
                  <Select value={branch} onValueChange={setBranch} required>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {BRANCHES.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Year</Label>
                  <Select value={year} onValueChange={(v) => { setYear(v); setSemester(""); }} required>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4].map((y) => <SelectItem key={y} value={String(y)}>Year {y}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Semester</Label>
                  <Select value={semester} onValueChange={setSemester} required disabled={!year}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {year && [parseInt(year) * 2 - 1, parseInt(year) * 2].map((s) => <SelectItem key={s} value={String(s)}>Sem {s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Data Structures" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">PDF File</Label>
                <div className="flex items-center gap-3 rounded-lg border-2 border-dashed border-primary/30 bg-primary/5 p-4 transition-colors hover:border-primary/50">
                  <FileUp className="h-8 w-8 text-primary" />
                  <div className="flex-1">
                    <Input
                      id="file"
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                      required
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full gradient-primary border-0 font-semibold" disabled={loading || !branch || !year || !semester}>
                {loading ? "Uploading..." : "Upload Note"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Upload;
