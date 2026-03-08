import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { BookOpen, LogIn, LogOut, Upload, LayoutDashboard } from "lucide-react";

const Navbar = () => {
  const { user, isCR, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
            <BookOpen className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">StudyVault</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <Link to="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Home
          </Link>
          <Link to="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Browse Notes
          </Link>
          {isCR && (
            <>
              <Link to="/upload" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Upload Notes
              </Link>
              <Link to="/dashboard" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Dashboard
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isCR && (
            <div className="flex items-center gap-1 md:hidden">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/upload"><Upload className="h-4 w-4" /></Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link to="/dashboard"><LayoutDashboard className="h-4 w-4" /></Link>
              </Button>
            </div>
          )}
          {user ? (
            <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Log out</span>
            </Button>
          ) : (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link to="/login">Log in</Link>
              </Button>
              <Button size="sm" asChild className="gradient-primary border-0">
                <Link to="/login">Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
