import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import NoteCard from "@/components/NoteCard";
import NotesFilter from "@/components/NotesFilter";
import { BookOpen, GraduationCap } from "lucide-react";

const Index = () => {
  const [search, setSearch] = useState("");
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");

  const { data: notes = [], isLoading } = useQuery({
    queryKey: ["notes", search, branch, year, semester],
    queryFn: async () => {
      let query = supabase.from("notes").select("*").order("created_at", { ascending: false });
      if (branch) query = query.eq("branch", branch);
      if (year) query = query.eq("year", parseInt(year));
      if (semester) query = query.eq("semester", parseInt(semester));
      if (search) query = query.or(`title.ilike.%${search}%,subject.ilike.%${search}%`);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const clearFilters = () => {
    setSearch("");
    setBranch("");
    setYear("");
    setSemester("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="gradient-hero py-16 sm:py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary">
            <GraduationCap className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="mb-3 font-display text-3xl font-bold text-primary-foreground sm:text-4xl">
            Student Notes Sharing Platform
          </h1>
          <p className="mx-auto max-w-lg text-base text-primary-foreground/70">
            Access semester-wise notes, filter by branch and subject, and download PDFs — all in one place.
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        <NotesFilter
          search={search}
          branch={branch}
          year={year}
          semester={semester}
          onSearchChange={setSearch}
          onBranchChange={setBranch}
          onYearChange={setYear}
          onSemesterChange={setSemester}
          onClear={clearFilters}
        />

        {isLoading ? (
          <div className="mt-12 flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : notes.length === 0 ? (
          <div className="mt-16 text-center">
            <BookOpen className="mx-auto mb-3 h-12 w-12 text-muted-foreground/40" />
            <h3 className="font-display text-lg font-semibold text-foreground">No notes found</h3>
            <p className="text-sm text-muted-foreground">Try adjusting your filters or check back later.</p>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                id={note.id}
                title={note.title}
                branch={note.branch}
                year={note.year}
                semester={note.semester}
                subject={note.subject}
                fileName={note.file_name}
                filePath={note.file_path}
                createdAt={note.created_at}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
