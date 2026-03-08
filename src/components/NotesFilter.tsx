import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const BRANCHES = ["CSE", "ECE", "EEE", "ME", "CE", "IT", "AIDS", "AIML"];
const YEARS = [1, 2, 3, 4];
const getSemesters = (year: string) => {
  if (!year) return [];
  const y = parseInt(year);
  return [y * 2 - 1, y * 2];
};

interface FiltersProps {
  search: string;
  branch: string;
  year: string;
  semester: string;
  onSearchChange: (v: string) => void;
  onBranchChange: (v: string) => void;
  onYearChange: (v: string) => void;
  onSemesterChange: (v: string) => void;
  onClear: () => void;
}

const NotesFilter = ({
  search, branch, year, semester,
  onSearchChange, onBranchChange, onYearChange, onSemesterChange, onClear,
}: FiltersProps) => {
  const hasFilters = search || branch || year || semester;

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by subject or title..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <Select value={branch} onValueChange={onBranchChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Branch" />
          </SelectTrigger>
          <SelectContent>
            {BRANCHES.map((b) => (
              <SelectItem key={b} value={b}>{b}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={year} onValueChange={onYearChange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {YEARS.map((y) => (
              <SelectItem key={y} value={String(y)}>Year {y}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={semester} onValueChange={onSemesterChange} disabled={!year}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Semester" />
          </SelectTrigger>
          <SelectContent>
            {getSemesters(year).map((s) => (
              <SelectItem key={s} value={String(s)}>Semester {s}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={onClear} className="gap-1.5">
            <X className="h-3.5 w-3.5" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
};

export default NotesFilter;
