import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Layout from "../components/Layout";
import { config } from "@/config";
import { toast } from "sonner";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (pass: string) => {
    if (pass.length < 8) return "Пароль должен содержать минимум 8 символов";
    if (!/^[a-zA-Z0-9]+$/.test(pass)) return "Пароль должен содержать только латинские буквы и цифры";
    if (!/[a-zA-Z]/.test(pass)) return "Пароль должен содержать хотя бы одну букву";
    if (!/[0-9]/.test(pass)) return "Пароль должен содержать хотя бы одну цифру";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(config.endpoints.register, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, ConfirmPassword: password }),
      });

      if (!response.ok) {
        const text = await response.text();
        try {
          const data = JSON.parse(text);
          setError(data.errors ? Object.values(data.errors).flat().join(", ") : (data.message || data.title || "Ошибка регистрации"));
        } catch {
          setError(text || "Ошибка регистрации");
        }
        return;
      }

      toast.success("Регистрация успешна!");
      navigate('/signin');
    } catch (err) {
      setError("Ошибка соединения с сервером.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-100px)] px-4 py-16 font-['Manrope'] overflow-hidden bg-[#050505]">
        
        {/* Фиолетовое свечение как на 2 скрине */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#6d28d9]/10 rounded-full blur-[120px] pointer-events-none z-0" />
        
        <div className="text-center mb-8 relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black mb-6 font-['Unbounded'] text-[#8b5cf6] tracking-tighter"
          >
            +Vibe
          </motion.h1>
          <h2 className="text-3xl font-bold mb-2 font-['Unbounded'] text-white tracking-tight">
            Создать аккаунт
          </h2>
          <p className="text-white/40 text-sm font-medium">Присоединитесь и получайте лучшие билеты</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[420px] bg-[#0f0f0f]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative z-10"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="text-red-400 border border-red-500/20 bg-red-500/10 p-3 rounded-lg text-xs text-center font-medium">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name" className="text-[10px] uppercase tracking-[0.15em] text-white/30 font-bold ml-1">
                Ваше имя
              </Label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-white/20 group-focus-within:text-[#8b5cf6] transition-colors" />
                </div>
                <Input
                  id="name" placeholder="Иван Иванов" required
                  value={name} onChange={(e) => setName(e.target.value)} disabled={isLoading}
                  className="pl-11 bg-black/40 border-white/5 focus-visible:ring-1 focus-visible:ring-[#8b5cf6]/50 h-12 text-white placeholder:text-white/20 rounded-xl transition-all"
                />
              </div>
            </div>

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
                  id="password" type={showPassword ? "text" : "password"} placeholder="Минимум 8 символов" required
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

            <p className="text-[11px] text-white/30 leading-relaxed px-1">
              Регистрируясь, вы принимаете{" "}
              <Link to="/terms" className="text-[#8b5cf6] hover:underline font-semibold">условия использования</Link> и{" "}
              <Link to="/privacy" className="text-[#8b5cf6] hover:underline font-semibold">политику конфиденциальности</Link>
            </p>

            <Button 
              type="submit" disabled={isLoading}
              className="w-full bg-[#8b5cf6] hover:bg-[#7c3aed] text-white h-12 font-bold text-sm rounded-xl mt-4 transition-all shadow-lg shadow-[#8b5cf6]/20 active:scale-[0.98]" 
            >
              {isLoading ? "Регистрация..." : "Создать аккаунт"}
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
              Уже есть аккаунт?{" "}
              <Link to="/signin" className="text-[#8b5cf6] hover:text-[#a78bfa] font-bold ml-1 transition-colors underline-offset-4 hover:underline">
                Войти
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default SignUp;