import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { UserCircle, Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Вспомогательный компонент для ссылок с анимацией линии
  const NavLink = ({ to, children }) => (
    <Link 
      to={to} 
      className="relative group text-[15px] font-medium text-white/70 hover:text-[#8B5CF6] transition-colors duration-300"
    >
      {children}
      {/* Линия, которая появляется слева направо */}
      <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#8B5CF6] transition-all duration-300 group-hover:w-full" />
    </Link>
  );

  const renderAuthButtons = () => {
    if (user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-full text-white hover:bg-white/10">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-white/20 text-white">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-[#161616] border-white/10 text-white">
            <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer hover:bg-white/10 focus:bg-white/10 focus:text-white">
              <UserCircle className="mr-2 h-4 w-4" />
              <span>Профиль</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-400 hover:bg-white/10 focus:bg-white/10 focus:text-red-400">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Выйти</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <div className="flex items-center space-x-8 text-sm font-medium">
        <Link to="/signin" className="text-white/80 hover:text-white transition-colors">
          Войти
        </Link>
        <Link to="/signup">
          <Button 
            variant="outline" 
            className="bg-transparent border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6] hover:text-white rounded-2xl px-8 font-semibold border-[1.5px] transition-all duration-300"
          >
            Регистрация
          </Button>
        </Link>
      </div>
    );
  };

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-500",
        isScrolled 
          ? "bg-[#050505]/90 backdrop-blur-xl border-b border-white/5 shadow-2xl" 
          : "bg-gradient-to-b from-[#0a0a0a] to-transparent"
      )}
    >
      <div className="container px-8 mx-auto">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link 
            to="/" 
            className="text-2xl font-black tracking-tighter text-white font-display hover:text-[#8B5CF6] transition-colors duration-300"
          >
            +Vibe
          </Link>

          {/* Center Links (Desktop) */}
          <nav className="hidden md:flex items-center space-x-10 absolute left-1/2 -translate-x-1/2">
            <NavLink to="/concerts">Концерты</NavLink>
            <NavLink to="/about">О нас</NavLink>
            <NavLink to="/faq">FAQ</NavLink>
          </nav>

          {/* Auth Buttons (Desktop) */}
          <div className="hidden md:flex items-center">
            {renderAuthButtons()}
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white hover:bg-white/10"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-x-0 top-20 bg-[#0a0a0a] border-b border-white/10 md:hidden transition-all duration-300",
          isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        )}
      >
        <div className="container px-6 py-8 bg-[#0a0a0a]">
          <nav className="flex flex-col space-y-6">
            <Link to="/concerts" className="text-white/80 text-lg">Концерты</Link>
            <Link to="/about" className="text-white/80 text-lg">О нас</Link>
            <Link to="/faq" className="text-white/80 text-lg">FAQ</Link>
            <div className="h-px bg-white/5" />
            {!user && (
              <div className="flex flex-col space-y-4">
                <Link to="/signin" className="text-white/60 text-center py-2">Войти</Link>
                <Link to="/signup" className="border border-[#8B5CF6] text-[#8B5CF6] text-center py-3 rounded-xl font-bold">
                  Регистрация
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default NavBar;