import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import NoteCard from "@/components/NoteCard";
import NotesFilter from "@/components/NotesFilter";
import { BookOpen, GraduationCap, Upload, Search, Download, Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: Upload, title: "Easy Uploads", desc: "Upload PDFs and tag by subject and branch for quick discovery." },
  { icon: Search, title: "Powerful Search", desc: "Find notes fast with keyword and filter-based search." },
  { icon: Download, title: "One-click Download", desc: "Grab what you need instantly with clean, secure downloads." },
  { icon: Star, title: "Organized by Semester", desc: "Notes are organized by branch, year, and semester for easy access." },
];

const testimonials = [
  "EduNotes saved my semester! Found exactly what I needed.",
  "Uploading my notes helped classmates and boosted my GPA.",
  "Clean, fast, and organized — the best place for study notes.",
];

const Index = () => {
  const [search, setSearch] = useState("");
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [testimonialIdx, setTestimonialIdx] = useState(0);

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

      {/* Hero with background image */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="/hero-bg.jpg" alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 gradient-hero" />
        </div>
        <div className="relative z-10 py-24 sm:py-32">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-4 font-display text-4xl font-extrabold text-primary-foreground sm:text-5xl lg:text-6xl">
              Share & Discover Notes at <span className="block">EduNotes</span>
            </h1>
            <p className="mx-auto mb-8 max-w-xl text-lg text-primary-foreground/80">
              Upload your notes, filter by subject & branch, and download what you need.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" asChild className="gradient-primary border-0 px-8 text-base font-semibold shadow-lg">
                <Link to="/login">Join Now</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-primary-foreground/30 bg-primary-foreground/10 px-8 text-base font-semibold text-primary-foreground backdrop-blur-sm hover:bg-primary-foreground/20 hover:text-primary-foreground">
                <a href="#browse">Browse Notes</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="mb-2 font-display text-3xl font-bold text-foreground">Everything you need to excel</h2>
            <p className="text-muted-foreground">Upload, search, and download notes in a beautiful, fast interface.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title} className="group rounded-xl border bg-card p-6 shadow-card transition-all hover:shadow-elevated hover:-translate-y-1">
                <f.icon className="mb-4 h-8 w-8 text-primary" />
                <h3 className="mb-2 font-display text-lg font-bold text-primary">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center font-display text-3xl font-bold text-foreground">Trusted by students</h2>
          <p className="mb-10 text-center text-muted-foreground">Real stories from real students using EduNotes.</p>
          <div className="mx-auto flex max-w-2xl items-center gap-4">
            <button
              onClick={() => setTestimonialIdx((i) => (i === 0 ? testimonials.length - 1 : i - 1))}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-card text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex-1 rounded-xl bg-card p-8 shadow-card text-center">
              <Quote className="mx-auto mb-4 h-8 w-8 text-primary/30" />
              <p className="text-lg italic text-foreground">"{testimonials[testimonialIdx]}"</p>
            </div>
            <button
              onClick={() => setTestimonialIdx((i) => (i === testimonials.length - 1 ? 0 : i + 1))}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-card text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Browse Notes */}
      <section id="browse" className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <h2 className="mb-2 font-display text-3xl font-bold text-foreground">Browse Notes</h2>
            <p className="text-muted-foreground">Filter by branch, year, and semester to find what you need.</p>
          </div>

          <NotesFilter
            search={search}
            branch={branch}
            year={year}
            semester={semester}
            onSearchChange={setSearch}
            onBranchChange={(v) => { setBranch(v); setYear(""); setSemester(""); }}
            onYearChange={(v) => { setYear(v); setSemester(""); }}
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
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-95" />
        <div className="relative z-10 py-16 sm:py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 font-display text-3xl font-bold text-primary-foreground sm:text-4xl">Ready to Share?</h2>
            <p className="mx-auto mb-8 max-w-md text-primary-foreground/80">
              Join StudyVault and help students everywhere by uploading your notes.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" asChild className="bg-primary-foreground px-8 text-base font-semibold text-primary hover:bg-primary-foreground/90">
                <Link to="/upload">Upload Notes</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-primary-foreground/30 px-8 text-base font-semibold text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                <a href="#browse">Browse Notes</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} StudyVault. Built for students, by students.
        </div>
      </footer>
    </div>
  );
};

export default Index;
