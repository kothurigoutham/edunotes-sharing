import Navbar from "@/components/Navbar";
import { Users, BookOpen, Target, GraduationCap } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="/hero-bg.jpg" alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 gradient-hero" />
        </div>
        <div className="relative z-10 py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-3 font-display text-4xl font-extrabold text-primary-foreground sm:text-5xl">About Us</h1>
            <p className="mx-auto max-w-lg text-lg text-primary-foreground/80">
              Learn more about EduNotes and our mission to help students succeed.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 font-display text-3xl font-bold text-foreground">Our Mission</h2>
              <p className="text-lg text-muted-foreground">
                EduNotes was built with one goal — to make quality study material accessible to every student, everywhere. We believe that sharing knowledge should be simple, fast, and free.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2">
              <div className="rounded-xl border bg-card p-6 shadow-card">
                <Target className="mb-3 h-8 w-8 text-primary" />
                <h3 className="mb-2 font-display text-lg font-bold text-foreground">Our Goal</h3>
                <p className="text-sm text-muted-foreground">
                  To create a centralized platform where students can share, discover, and download notes organized by branch, year, and semester.
                </p>
              </div>
              <div className="rounded-xl border bg-card p-6 shadow-card">
                <Users className="mb-3 h-8 w-8 text-primary" />
                <h3 className="mb-2 font-display text-lg font-bold text-foreground">Community Driven</h3>
                <p className="text-sm text-muted-foreground">
                  Class Representatives (CRs) upload notes for their classmates, ensuring high-quality and relevant material for everyone.
                </p>
              </div>
              <div className="rounded-xl border bg-card p-6 shadow-card">
                <BookOpen className="mb-3 h-8 w-8 text-primary" />
                <h3 className="mb-2 font-display text-lg font-bold text-foreground">Easy Access</h3>
                <p className="text-sm text-muted-foreground">
                  Browse and download notes with powerful filters — no login required to view. Just find what you need and download instantly.
                </p>
              </div>
              <div className="rounded-xl border bg-card p-6 shadow-card">
                <GraduationCap className="mb-3 h-8 w-8 text-primary" />
                <h3 className="mb-2 font-display text-lg font-bold text-foreground">Built for Students</h3>
                <p className="text-sm text-muted-foreground">
                  Designed by students, for students. We understand the struggle of finding the right notes before exams.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} EduNotes. Built for students, by students.
        </div>
      </footer>
    </div>
  );
};

export default About;
