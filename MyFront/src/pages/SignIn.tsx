import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Layout from "@/components/Layout";
import { useUser } from "@/contexts/UserContext";
import { config } from "@/config";
import { toast } from "sonner";
import { Mail, Lock, Eye, EyeOff } from "lucide-react"; 

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(config.endpoints.login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setUser({
          id: data.id, name: data.name, email: data.email,
          joinedDate: data.joinedDate, isAdmin: data.isAdmin || false,
        });
        toast.success("Успешный вход в систему!");
        navigate(data.email === 'admin@admin.com' ? "/admin" : "/profile");
      } else {
        toast.error(data.message || "Ошибка входа. Проверьте email и пароль.");
      }
    } catch (error) {
      toast.error("Произошла ошибка при входе в систему");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-100px)] px-4 py-16 font-['Manrope'] overflow-hidden bg-[#050505]">
        
        {/* Центральное фиолетовое свечение (как на 1 скрине) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#6d28d9]/10 rounded-full blur-[120px] pointer-events-none z-0" />
        
        {/* Дополнительный анимированный блик */}
        <motion.div
          animate={{ 
            opacity: [0.4, 0.7, 0.4],
            scale: [1, 1.1, 1] 
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] w-[300px] h-[300px] bg-[#8b5cf6]/5 rounded-full blur-[80px] pointer-events-none z-0"
        />

        <div className="text-center mb-8 relative z-10">
          {/* Фиолетовый логотип (изменение цвета на #8b5cf6) */}
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black mb-6 font-['Unbounded'] text-[#8b5cf6] tracking-tighter"
          >
            +Vibe
          </motion.h1>
          <h2 className="text-3xl font-bold mb-2 font-['Unbounded'] text-white tracking-tight">
            Добро пожаловать
          </h2>
          <p className="text-white/40 text-sm font-medium">Войдите в свой аккаунт</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-[420px] bg-[#0f0f0f]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative z-10"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[10px] uppercase tracking-[0.15em] text-white/30 font-bold ml-1">
                Электронная почта
              </Label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-white/20 group-focus-within:text-[#8b5cf6] transition-colors" />
                </div>
                <Input
                  id="email" type="email" placeholder="you@example.com" required
                  value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading}
                  className="pl-11 bg-black/40 border-white/5 focus-visible:ring-1 focus-visible:ring-[#8b5cf6]/50 h-12 text-white placeholder:text-white/20 rounded-xl transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[10px] uppercase tracking-[0.15em] text-white/30 font-bold ml-1">
                Пароль
              </Label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-white/20 group-focus-within:text-[#8b5cf6] transition-colors" />
                </div>
                <Input
                  id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" required
                  value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading}
                  className="pl-11 pr-11 bg-black/40 border-white/5 focus-visible:ring-1 focus-visible:ring-[#8b5cf6]/50 h-12 text-white placeholder:text-white/20 rounded-xl transition-all"
                />
                <button
                  type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/20 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" disabled={isLoading}
              className="w-full bg-[#8b5cf6] hover:bg-[#7c3aed] text-white h-12 font-bold text-sm rounded-xl mt-4 transition-all shadow-lg shadow-[#8b5cf6]/20 active:scale-[0.98]" 
            >
              {isLoading ? "Вход..." : "Войти"}
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5"></span></div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em]">
              <span className="bg-[#0f0f0f] px-4 text-white/20 font-bold">или</span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-white/40 font-medium">
              Нет аккаунта?{" "}
              <Link to="/signup" className="text-[#8b5cf6] hover:text-[#a78bfa] font-bold ml-1 transition-colors underline-offset-4 hover:underline">
                Зарегистрироваться
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default SignIn;