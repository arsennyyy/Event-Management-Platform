import React from "react";
import { motion } from "framer-motion";
import NavBar from "./NavBar";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const Layout = ({ children, className }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0a]">
      {/* Шапка */}
      <NavBar />
      
      {/* Основной контент */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ 
          duration: 0.4, 
          ease: [0.22, 1, 0.36, 1]
        }}
        className={cn("flex-1", className)}
      >
        {children}
      </motion.main>

      {/* Новый темный Footer */}
      <footer className="bg-[#0a0a0a] border-t border-white/5 pt-16 pb-8 mt-auto z-10 relative">
        <div className="container px-6 mx-auto">
          
          {/* Верхняя часть футера (Колонки) */}
          <div className="flex flex-col lg:flex-row justify-between gap-12 mb-16">
            
            {/* 1 Колонка: Лого и описание */}
            <div className="max-w-md">
              <Link to="/" className="text-3xl font-display font-black text-white inline-block mb-6">
                +Vibe
              </Link>
              <p className="text-white/50 text-sm leading-relaxed mb-6">
                Ваш премиальный сервис для покупки билетов <br className="hidden md:block" />
                на лучшие концерты и мероприятия. <br className="hidden md:block" />
                Безопасно, быстро, с гарантией.
              </p>
              
              {/* Индикатор "Продажи открыты" */}
              <div className="flex items-center text-sm text-white/50">
                <span className="w-2 h-2 rounded-full bg-[#00e59b] mr-3 shadow-[0_0_10px_rgba(0,229,155,0.5)]"></span>
                Продажи открыты
              </div>
            </div>

            {/* Блок со ссылками */}
            <div className="flex flex-col sm:flex-row gap-12 sm:gap-24 lg:gap-32">
              {/* 2 Колонка: Компания */}
              <div>
                <h4 className="font-display font-bold text-white text-sm tracking-wider uppercase mb-6">
                  Компания
                </h4>
                <ul className="space-y-4 text-sm text-white/50">
                  <li><Link to="/about" className="hover:text-white transition-colors">О нас</Link></li>
                  <li><Link to="/contact" className="hover:text-white transition-colors">Контакты</Link></li>
                  <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                </ul>
              </div>

              {/* 3 Колонка: Правовая информация */}
              <div>
                <h4 className="font-display font-bold text-white text-sm tracking-wider uppercase mb-6">
                  Правовая информация
                </h4>
                <ul className="space-y-4 text-sm text-white/50">
                  <li><Link to="/terms" className="hover:text-white transition-colors">Условия использования</Link></li>
                  <li><Link to="/privacy" className="hover:text-white transition-colors">Конфиденциальность</Link></li>
                  <li><Link to="/cookies" className="hover:text-white transition-colors">Политика Cookie</Link></li>
                </ul>
              </div>
            </div>

          </div>

          {/* Нижняя часть футера (Копирайт и девиз) */}
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-sm text-white/40">
              {/* Я оставил динамический год, чтобы он автоматически менялся */}
              © {new Date().getFullYear()} +Vibe. Все права защищены.
            </div>
            
            <div className="flex items-center text-sm font-display font-bold italic text-white/90">
              <div className="w-12 h-px bg-white/20 mr-4"></div>
              Premium Live Experience
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
};

export default Layout;