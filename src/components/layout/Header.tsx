import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, User, LogOut, Shield, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const isAuthenticated = localStorage.getItem("user");
  const user = isAuthenticated ? JSON.parse(isAuthenticated) : null;
  const isAdmin = user?.role === "Admin";

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="glass-card border-b border-glass-border/50 sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="text-2xl font-bold neon-text"
            >
              <Shield className="inline mr-2 text-neon-cyan" size={32} />
              GrievanceHub
            </motion.div>
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-foreground"
          >
            <Menu size={24} />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            <Link to="/track-status">
              <Button variant="ghost" className="hover:neon-glow transition-all">
                <Search className="mr-2" size={18} />
                Track Status
              </Button>
            </Link>
            {isAuthenticated ? (
              <>
                <Link to={isAdmin ? "/admin" : "/portal"}>
                  <Button variant="ghost" className="hover:neon-glow transition-all">
                    <Home className="mr-2" size={18} />
                    {isAdmin ? "Dashboard" : "Portal"}
                  </Button>
                </Link>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {user.name} ({user.role})
                  </span>
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="hover:neon-glow transition-all"
                  >
                    <LogOut size={18} />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="hover:neon-glow transition-all">
                    <User className="mr-2" size={18} />
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-primary hover:neon-glow transition-all">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="md:hidden mt-4 space-y-2"
          >
            <Link to="/track-status" className="block">
              <Button variant="ghost" className="w-full justify-start">
                <Search className="mr-2" size={18} />
                Track Status
              </Button>
            </Link>
            {isAuthenticated ? (
              <>
                <Link to={isAdmin ? "/admin" : "/portal"}>
                  <Button variant="ghost" className="w-full justify-start">
                    <Home className="mr-2" size={18} />
                    {isAdmin ? "Dashboard" : "Portal"}
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="w-full justify-start"
                >
                  <LogOut className="mr-2" size={18} />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="block">
                  <Button variant="ghost" className="w-full justify-start">
                    <User className="mr-2" size={18} />
                    Login
                  </Button>
                </Link>
                <Link to="/signup" className="block">
                  <Button className="w-full bg-primary">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </motion.nav>
        )}
      </div>
    </motion.header>
  );
};
