import React, { useState } from "react";
import { motion } from "framer-motion";
import { eventsData } from '@/data/eventData';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const navigate = useNavigate();

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length > 0) {
      const lower = value.toLowerCase();
      setSuggestions(eventsData.filter(ev =>
        ev.title.toLowerCase().includes(lower) ||
        ev.lineup.some(artist => artist.toLowerCase().includes(lower))
      ));
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (title: string) => {
    setQuery(title);
    setSuggestions([]);
  };

  const handleSearch = () => {
    const lower = query.toLowerCase();
    const event = eventsData.find(ev => ev.title.toLowerCase() === lower);
    if (event) {
      navigate(`/event/${event.id}`);
      return;
    }
  };

  return (
    <div className="relative min-h-screen flex items-center bg-[#0a0a0a] pt-24 overflow-hidden font-['Manrope']">
      
      {/* 1. Левый фиолетовый шар */}
      <motion.div
        animate={{ x: [0, 40, -20, 0], y: [0, -40, 30, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[10%] left-[-15%] w-[600px] h-[600px] bg-[#6d28d9]/20 rounded-full blur-[150px] pointer-events-none z-0"
      />
      
      {/* 2. Правый фиолетовый шар (заменил желтый) */}
      <motion.div
        animate={{ x: [0, -30, 20, 0], y: [0, 30, -20, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#5b21b6]/20 rounded-full blur-[150px] pointer-events-none z-0"
      />

      {/* 3. Центральное статичное свечение за текстом и инпутом */}
      <div className="absolute top-[40%] left-[45%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#8b5cf6]/10 rounded-full blur-[140px] pointer-events-none z-0" />

      <div className="container px-6 md:px-12 z-10 relative">
        <div className="max-w-4xl text-left">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-flex items-center rounded-full px-4 py-1.5 text-[10px] font-bold tracking-widest bg-white/5 border border-white/10 text-[#a78bfa] mb-8 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#a78bfa] mr-2"></span>
              Билеты на концерты
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            className="text-5xl md:text-7xl lg:text-[6rem] leading-[1.05] font-black text-white mb-6 tracking-tight font-['Unbounded']"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Найди свой <br /> лучший вечер
          </motion.h1>

          {/* Subheading */}
          <motion.p
            className="text-lg md:text-xl text-white/50 mb-12 max-w-xl leading-relaxed font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            От камерных площадок до грандиозных стадионов. Безопасно. <br className="hidden sm:block" /> Быстро. С гарантией.
          </motion.p>

          {/* Search Bar & Button */}
          <motion.div
            className="flex flex-col sm:flex-row items-center gap-4 mb-16 max-w-[700px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {/* Input Container */}
            <div className="relative w-full flex-1">
              {/* Убрали иконку лупы, сдвинули плейсхолдер левее (pl-6) */}
              <input
                type="text"
                placeholder="Артист, площадка или жанр..."
                className="block w-full bg-[#121212] border border-white/5 rounded-2xl py-4 pl-6 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#a855f7]/50 transition-all text-base shadow-inner"
                value={query}
                onChange={handleInput}
                autoComplete="off"
              />
              
              {/* Автокомплит */}
              {suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-[calc(100%+8px)] bg-[#161616] border border-white/10 rounded-2xl shadow-xl z-20 max-h-48 overflow-auto py-2">
                  {suggestions.map(ev => (
                    <div
                      key={ev.id}
                      className="px-5 py-3 cursor-pointer text-white hover:bg-white/5 transition-colors"
                      onClick={() => handleSuggestionClick(ev.title)}
                    >
                      {ev.title} {ev.lineup.length > 0 && (<span className="text-xs text-white/40 ml-2">({ev.lineup.join(', ')})</span>)}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Button Container с эффектом свечения */}
            <div className="relative group w-full sm:w-[160px] h-[56px] shrink-0">
              {/* Эффект свечения, который появляется при наведении (group-hover:opacity-100) */}
              <div className="absolute inset-0 bg-[#a855f7] rounded-2xl blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500"></div>
              
              <button 
                className="relative bg-[#a855f7] hover:bg-[#9333ea] text-white font-bold rounded-2xl transition-colors w-full h-full flex items-center justify-center text-base" 
                onClick={handleSearch}
              >
                Найти
              </button>
            </div>
          </motion.div>

          {/* Statistics Block */}
          <motion.div 
            className="flex flex-wrap items-center gap-12 md:gap-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <div>
              <div className="text-3xl md:text-[2.5rem] font-black text-white mb-2 font-['Unbounded'] tracking-tight">50 000+</div>
              <div className="text-[11px] text-white/40 font-semibold uppercase tracking-widest">Проданных билетов</div>
            </div>
            <div>
              <div className="text-3xl md:text-[2.5rem] font-black text-white mb-2 font-['Unbounded'] tracking-tight">120+</div>
              <div className="text-[11px] text-white/40 font-semibold uppercase tracking-widest">Мероприятий в год</div>
            </div>
            <div>
              <div className="text-3xl md:text-[2.5rem] font-black text-white mb-2 font-['Unbounded'] tracking-tight">98%</div>
              <div className="text-[11px] text-white/40 font-semibold uppercase tracking-widest">Довольных покупателей</div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Hero;