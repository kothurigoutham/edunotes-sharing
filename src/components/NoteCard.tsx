import { FileText, Download, Calendar, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface NoteCardProps {
  id: string;
  title: string;
  branch: string;
  year: number;
  semester: number;
  subject: string;
  fileName: string;
  filePath: string;
  createdAt: string;
}

const NoteCard = ({ title, branch, year, semester, subject, fileName, filePath, createdAt }: NoteCardProps) => {
  const handleDownload = () => {
    const { data } = supabase.storage.from("notes-pdfs").getPublicUrl(filePath);
    const link = document.createElement("a");
    link.href = data.publicUrl;
    link.download = fileName;
    link.target = "_blank";
    link.click();
  };

  return (
    <Card className="group animate-fade-in shadow-card transition-all duration-300 hover:shadow-elevated hover:-translate-y-1">
      <CardContent className="p-5">
        <div className="mb-3 flex items-start justify-between">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <Badge variant="secondary" className="text-xs">{branch}</Badge>
        </div>

        <h3 className="mb-1 font-display text-base font-semibold leading-snug text-card-foreground line-clamp-2">
          {title}
        </h3>

        <div className="mb-3 flex items-center gap-1 text-xs text-muted-foreground">
          <BookOpen className="h-3 w-3" />
          <span>{subject}</span>
        </div>

        <div className="mb-4 flex flex-wrap gap-1.5">
          <Badge variant="outline" className="text-xs">Year {year}</Badge>
          <Badge variant="outline" className="text-xs">Sem {semester}</Badge>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {format(new Date(createdAt), "MMM d, yyyy")}
          </span>
          <Button size="sm" onClick={handleDownload} className="gap-1.5">
            <Download className="h-3.5 w-3.5" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NoteCard;
