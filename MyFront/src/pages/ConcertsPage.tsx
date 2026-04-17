import React, { useState } from "react";
import { motion } from "framer-motion";
import { Layout, Search, SlidersHorizontal } from "lucide-react";
import EventCard from "@/components/EventCard";
import NavBar from "@/components/NavBar"; // Добавили импорт хедера
import Footer from "@/components/Layout"; // Раскомментируйте, если у вас есть компонент футера

import { eventsData } from "@/data/eventData";

const genres = ["Все жанры", "Рок", "Инди", "Хип-хоп", "Рэп", "Трэп", "R&B", "Альтернатива", "Арт-рэп"];

const ConcertsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("Все");
  const [selectedGenre, setSelectedGenre] = useState("Все жанры");

  // Фильтрация мероприятий
  const filteredEvents = eventsData.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (event.lineup && event.lineup.some(artist => artist.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesSearch; 
  });

  return (
    <>
      {/* Хедер добавлен на страницу */}
      <NavBar />

      <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-24">
        <div className="container px-6 mx-auto">
          
          {/* Заголовок страницы */}
          <div className="mb-8 border-b border-white/10 pb-8">
             <div className="w-12 h-px bg-white/20 mb-6"></div>
             <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black text-white mb-4 tracking-tight">
               Все мероприятия
             </h1>
             <p className="text-white/50 text-lg">
               {filteredEvents.length} мероприятий — выберите своё
             </p>
          </div>

          {/* Панель фильтров (без серого фона, как на скрине) */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 mb-12">
            
            {/* Поиск */}
            <div className="relative w-full lg:w-80 shrink-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <input 
                type="text" 
                placeholder="Поиск артиста или площадки..." 
                className="w-full bg-transparent border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Контейнер для кнопок (Скрываем скроллбар с помощью Tailwind) */}
            <div className="flex items-center gap-3 overflow-x-auto w-full pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              
              <SlidersHorizontal className="h-5 w-5 text-white/40 shrink-0 ml-1" />
              
              {/* Тип (Все / Концерт) */}
              <div className="flex items-center gap-2 shrink-0">
                {["Все", "Концерт"].map(type => (
                  <button 
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                      selectedType === type 
                        ? 'bg-white text-black' 
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Вертикальный разделитель */}
              <div className="w-px h-6 bg-white/10 mx-2 shrink-0"></div>

              {/* Жанры */}
              <div className="flex items-center gap-2 shrink-0 pr-4">
                {genres.map(genre => (
                  <button 
                    key={genre}
                    onClick={() => setSelectedGenre(genre)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border whitespace-nowrap ${
                      selectedGenre === genre 
                        ? 'border-white text-white' 
                        : 'border-white/10 text-white/50 hover:text-white hover:border-white/30'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Сетка карточек */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <EventCard {...event} />
              </motion.div>
            ))}
          </div>
          
          {/* Сообщение, если ничего не найдено */}
          {filteredEvents.length === 0 && (
            <div className="text-center py-20">
              <h3 className="text-2xl font-display font-bold text-white mb-2">Ничего не найдено</h3>
              <p className="text-white/50">Попробуйте изменить параметры поиска или фильтры.</p>
            </div>
          )}
        </div>
      </div>
    <Layout />
      {/* Футер добавлен на страницу */}
      {/* <Footer /> */}
    </>
  );
};

export default ConcertsPage;