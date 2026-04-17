import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface EventCardProps {
  id: string;
  title: string;
  image: string; // Сюда будет подставляться ссылка на вашу фотографию
  date: string;
  time: string;
  location: string;
  price: string;
  category?: string;
  isFeatured?: boolean;
  className?: string;
  subtitle?: string; 
  genre?: string;
}

const EventCard = ({
  id,
  title,
  image,
  date,
  time,
  location,
  price,
  category = "Концерт",
  isFeatured = false,
  className,
  subtitle,
  genre,
}: EventCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-[#161616] border border-white/5 hover:border-white/20 transition-all duration-300 flex flex-col h-full",
        className
      )}
    >
      <Link to={`/event/${id}`} className="absolute inset-0 z-30" aria-label={`Перейти к ${title}`} />

      {/* --- БЛОК С ФОТОГРАФИЕЙ --- */}
      <div className="relative h-52 w-full overflow-hidden shrink-0">
        {/* Сама картинка */}
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Градиент снизу вверх, чтобы текст под фото читался лучше и переход был плавным */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-[#161616]/20 to-transparent" />

        {/* Бейджи (Жанр, Категория) поверх фото */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
          <div className="px-3 py-1 rounded-full bg-black/40 border border-white/10 text-white text-xs font-medium backdrop-blur-md">
            {category}
          </div>
          <div className="px-3 py-1 rounded-full bg-black/40 border border-white/10 text-white/80 text-xs font-medium backdrop-blur-md">
            {genre || (isFeatured ? "Топ" : "Билеты")}
          </div>
        </div>
      </div>

      {/* --- БЛОК С КОНТЕНТОМ (Темный фон) --- */}
      <div className="relative z-20 p-5 flex flex-col flex-grow">
        
        {/* Заголовок и подзаголовок */}
        <div className="mb-auto">
          <h3 className="text-xl md:text-2xl font-display font-bold text-white mb-2 leading-tight group-hover:text-white/90 transition-colors line-clamp-2">
            {title}
          </h3>
          <p className="text-sm text-white/40 line-clamp-2 leading-relaxed mb-6">
            {subtitle || "Билеты на мероприятие. Безопасная покупка и гарантия отличного вечера."}
          </p>
        </div>
        
        {/* Иконки с датой и местом */}
        <div className="space-y-2.5 mb-5 mt-4">
          <div className="flex items-center gap-4 text-xs font-medium text-white/50">
            <div className="flex items-center">
              <Calendar className="h-3.5 w-3.5 mr-2 opacity-60" />
              <span>{date}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-3.5 w-3.5 mr-2 opacity-60" />
              <span>{time}</span>
            </div>
          </div>
          
          <div className="flex items-center text-xs font-medium text-white/50">
            <MapPin className="h-3.5 w-3.5 mr-2 opacity-60 shrink-0" />
            <span className="truncate">{location}</span>
          </div>
        </div>
        
        {/* Разделительная линия */}
        <div className="h-px w-full bg-white/5 mb-4 group-hover:bg-white/10 transition-colors" />

        {/* Подвал карточки: Цена и кнопка */}
        <div className="flex items-center justify-between">
          {/* Я убрал слово "от", так как оно у вас уже зашито в переменную price */}
          <div className="text-lg font-display font-bold text-white">
            {price}
          </div>
          
          <div className="text-white/50 group-hover:text-white text-sm font-medium transition-colors flex items-center">
            Купить 
            <span className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
              →
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;