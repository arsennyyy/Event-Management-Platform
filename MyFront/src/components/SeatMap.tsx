import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { InfoIcon, Plus, Minus, X } from "lucide-react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/components/ui/use-toast';

interface Seat {
  id: number;
  row: string;
  number: number;
  status: "available" | "reserved" | "selected" | "sold";
  type: "standard" | "vip" | "disabled";
  price: number;
  reservedByUserId?: number | null;
  reservationExpiresAt?: string | null;
}

interface EventInfo {
  id: number;
  title: string;
  date: string;
}

interface SeatMapProps {
  ticketTypes: {
    name: string;
    price: number;
    available: boolean;
  }[];
  eventInfo: EventInfo;
}

const SeatMap = ({ ticketTypes, eventInfo }: SeatMapProps) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useUser();
  const { toast } = useToast();

  const getPriceForType = (type: string) => {
    if (type === "vip") {
      return ticketTypes.find(t => t.name.toLowerCase().includes("vip"))?.price ?? 0;
    }
    if (type === "standard") {
      return ticketTypes.find(t => t.name.toLowerCase().includes("стандарт"))?.price ?? 0;
    }
    if (type === "disabled") {
      return 0;
    }
    return 0;
  };

  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  
  // Получаем места с сервера
  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const response = await axios.get(`http://localhost:5064/api/Seats/event/${eventInfo.id}`);
        const normalized = response.data
          .map((seat: any) => ({
            id: seat.id ?? seat.Id,
            row: seat.row ?? seat.Row,
            number: seat.number ?? seat.Number,
            status: seat.status ?? seat.Status,
            type: seat.type ?? seat.Type,
            price: seat.price ?? seat.Price,
            reservedByUserId: seat.reservedByUserId ?? seat.ReservedByUserId ?? null,
            reservationExpiresAt: seat.reservationExpiresAt ?? seat.ReservationExpiresAt ?? null,
          }))
          .filter((seat: any) => seat.id !== undefined && seat.row !== undefined && seat.number !== undefined);
        setSeats(normalized);
      } catch (error) {
        setPurchaseError('Ошибка при загрузке схемы зала');
      }
    };

    if (eventInfo?.id) {
      fetchSeats();
    }
  }, [eventInfo?.id]);

  // Проверяем истекшие брони каждые 30 секунд
  useEffect(() => {
    const checkReservations = async () => {
      try {
        const response = await axios.get(`http://localhost:5064/api/Seats/event/${eventInfo.id}`);
        const normalized = response.data
          .map((seat: any) => ({
            id: seat.id ?? seat.Id,
            row: seat.row ?? seat.Row,
            number: seat.number ?? seat.Number,
            status: seat.status ?? seat.Status,
            type: seat.type ?? seat.Type,
            price: seat.price ?? seat.Price,
            reservedByUserId: seat.reservedByUserId ?? seat.ReservedByUserId ?? null,
            reservationExpiresAt: seat.reservationExpiresAt ?? seat.ReservationExpiresAt ?? null,
          }))
          .filter((seat: any) => seat.id !== undefined && seat.row !== undefined && seat.number !== undefined);
        
        const updatedSeats = normalized.map((seat: Seat) => {
          const selectedSeat = selectedSeats.find(s => s.id === seat.id);
          if (selectedSeat) {
            return { ...seat, status: "selected" };
          }
          return seat;
        });
        
        setSeats(updatedSeats);
      } catch (error) {
        console.error('Ошибка при обновлении статуса мест:', error);
      }
    };

    const interval = setInterval(checkReservations, 30000);
    return () => clearInterval(interval);
  }, [eventInfo?.id, selectedSeats]);

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === "sold" || seat.status === "reserved") return;
    setSelectedSeats(prev => {
      const alreadySelected = prev.find(s => s.id === seat.id);
      if (alreadySelected) {
        return prev.filter(s => s.id !== seat.id);
      } else {
        return [...prev, seat];
      }
    });
  };
  
  const zoomIn = () => setZoomLevel(prev => Math.min(prev + 0.2, 2));
  const zoomOut = () => setZoomLevel(prev => Math.max(prev - 0.2, 0.6));
  
  const getTotalPrice = () => {
    return selectedSeats.reduce((total, seat) => total + seat.price, 0);
  };
  
  const seatsByRow = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) acc[seat.row] = [];
    acc[seat.row].push(seat);
    return acc;
  }, {} as Record<string, Seat[]>);
  
  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast({
        title: 'Войдите в аккаунт',
        description: 'Чтобы купить билет, необходимо авторизоваться.',
        variant: 'destructive',
      });
      setTimeout(() => navigate('/signin'), 1000);
      return;
    }
    setShowCheckout(true);
  };

  const handlePay = async () => {
    setIsPaying(true);
    setPurchaseError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Необходимо авторизоваться');

      for (const seat of selectedSeats) {
        await axios.post('http://localhost:5064/api/Seats/reserve', {
          eventId: eventInfo?.id,
          seatId: seat.id,
        }, { headers: { Authorization: `Bearer ${token}` } });

        await axios.post('http://localhost:5064/api/Seats/purchase', {
          eventId: eventInfo?.id,
          seatId: seat.id,
          ticketType: seat.type,
        }, { headers: { Authorization: `Bearer ${token}` } });
      }

      const updatedSeats = await axios.get(`http://localhost:5064/api/Seats/event/${eventInfo.id}`);
      setSeats(updatedSeats.data);
      setSelectedSeats([]);
      setShowCheckout(false);
      navigate('/profile?tab=tickets');
    } catch (err: any) {
      if (err?.response?.data) {
        const errorData = err.response.data;
        if (typeof errorData === 'string') {
          setPurchaseError(errorData);
        } else if (errorData.Title) {
          setPurchaseError(errorData.Title);
        } else if (errorData.Errors) {
          setPurchaseError(Object.values(errorData.Errors).join(', '));
        } else {
          setPurchaseError('Произошла ошибка при покупке билета');
        }
      } else {
        setPurchaseError(err.message || 'Произошла ошибка при покупке билета');
      }
      try {
        const updatedSeats = await axios.get(`http://localhost:5064/api/Seats/event/${eventInfo.id}`);
        const normalized = updatedSeats.data
          .map((seat: any) => ({
            id: seat.id ?? seat.Id,
            row: seat.row ?? seat.Row,
            number: seat.number ?? seat.Number,
            status: seat.status ?? seat.Status,
            type: seat.type ?? seat.Type,
            price: seat.price ?? seat.Price,
            reservedByUserId: seat.reservedByUserId ?? seat.ReservedByUserId ?? null,
            reservationExpiresAt: seat.reservationExpiresAt ?? seat.ReservationExpiresAt ?? null,
          }))
          .filter((seat: any) => seat.id !== undefined && seat.row !== undefined && seat.number !== undefined);
        setSeats(normalized);
      } catch {}
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="w-full overflow-hidden bg-[#161616] rounded-2xl border border-white/10 shadow-2xl flex flex-col">
      {/* Шапка зала */}
      <div className="p-5 border-b border-white/5 bg-[#0a0a0a]">
        <div className="flex justify-between items-center">
          <h3 className="font-display font-bold text-white text-lg">Выберите места</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={zoomOut}
              disabled={zoomLevel <= 0.6}
              className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Minus className="h-4 w-4" />
            </button>
            <button
              onClick={zoomIn}
              disabled={zoomLevel >= 2}
              className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Легенда (Цвета мест) */}
      <div className="bg-[#0a0a0a]/50 px-4 py-3 flex flex-wrap gap-5 justify-center border-b border-white/5">
        <div className="flex items-center">
          <div className="w-3.5 h-3.5 rounded bg-transparent border border-white/20 mr-2"></div>
          <span className="text-xs text-white/60 font-medium">Доступно</span>
        </div>
        <div className="flex items-center">
          <div className="w-3.5 h-3.5 rounded bg-white border border-white mr-2 shadow-[0_0_8px_rgba(255,255,255,0.5)]"></div>
          <span className="text-xs text-white/60 font-medium">Выбрано</span>
        </div>
        <div className="flex items-center">
          <div className="relative overflow-hidden w-3.5 h-3.5 rounded bg-white/5 border border-white/10 mr-2 flex items-center justify-center">
            {/* Диагональная линия для легенды "Продано" */}
            <span className="absolute top-1/2 left-1/2 w-[140%] h-[1px] bg-white/30 -translate-x-1/2 -translate-y-1/2 -rotate-45"></span>
          </div>
          <span className="text-xs text-white/60 font-medium">Продано</span>
        </div>
        <div className="flex items-center">
          <div className="w-3.5 h-3.5 rounded bg-[#ffd700]/10 border border-[#ffd700]/50 mr-2"></div>
          <span className="text-xs text-white/60 font-medium">VIP</span>
        </div>
        <div className="flex items-center">
          <div className="w-3.5 h-3.5 rounded bg-blue-500/10 border border-blue-500/50 mr-2"></div>
          <span className="text-xs text-white/60 font-medium">Спец. места</span>
        </div>
      </div>
      
      {/* Контейнер со схемой зала */}
      <div className="relative p-6 overflow-auto min-h-[400px] max-h-[500px] scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent flex-1">
        
        {/* Сцена */}
        <div className="mb-12 w-2/3 max-w-md mx-auto">
          <div className="h-10 rounded-t-[3rem] border-t border-x border-white/10 bg-gradient-to-b from-white/5 to-transparent flex items-center justify-center text-xs text-white/30 font-display font-bold uppercase tracking-[0.3em]">
            Сцена
          </div>
        </div>
        
        {/* Сами места (с зумом) */}
        <div 
          className="flex flex-col items-center transition-transform duration-300 origin-top pb-10"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {seats.length === 0 ? (
            <div className="text-center text-sm text-white/40 py-10">
              {purchaseError || "Схема зала недоступна"}
            </div>
          ) : (
            Object.entries(seatsByRow).map(([row, rowSeats]) => (
              <div key={row} className="flex justify-center my-1.5 w-full items-center">
                {/* Номер ряда (слева) */}
                <div className="flex-shrink-0 w-8 flex items-center justify-center font-medium text-[10px] text-white/30">
                  {row}
                </div>
                
                {/* Блок мест */}
                <div className="flex flex-wrap justify-center gap-1.5">
                  {rowSeats.map((seat, idx) => {
                    const isSelected = selectedSeats.some(s => s.id === seat.id);
                    const isUnavailable = seat.status === "sold" || seat.status === "reserved";

                    return (
                      <motion.button
                        key={(seat.id ? seat.id : idx) + '-' + (seat.row || idx) + '-' + (seat.number || idx)}
                        whileHover={!isUnavailable ? { scale: 1.15 } : {}}
                        whileTap={!isUnavailable ? { scale: 0.9 } : {}}
                        onClick={() => handleSeatClick(seat)}
                        disabled={isUnavailable}
                        className={cn(
                          "relative overflow-hidden w-7 h-7 rounded-md text-[11px] font-medium flex items-center justify-center transition-all duration-200 border",
                          
                          // Стандартные (Доступно)
                          !isUnavailable && seat.type === "standard" && !isSelected && 
                          "bg-transparent border-white/20 text-white/50 hover:border-white/60 hover:text-white",
                          
                          // VIP (Доступно)
                          !isUnavailable && seat.type === "vip" && !isSelected && 
                          "bg-[#ffd700]/5 border-[#ffd700]/40 text-[#ffd700]/80 hover:bg-[#ffd700]/20 hover:border-[#ffd700] hover:text-[#ffd700]",
                          
                          // Инвалиды (Доступно)
                          !isUnavailable && seat.type === "disabled" && !isSelected && 
                          "bg-blue-500/5 border-blue-500/40 text-blue-500/80 hover:bg-blue-500/20 hover:border-blue-500 hover:text-blue-500",
                          
                          // Выбранные (Любой тип)
                          isSelected && 
                          "bg-white border-white text-black shadow-[0_0_12px_rgba(255,255,255,0.6)] z-10",
                          
                          // Продано / Забронировано
                          isUnavailable && 
                          "bg-white/5 border-white/10 text-white/20 cursor-not-allowed" 
                        )}
                        title={`Ряд ${seat.row}, Место ${seat.number} - ${seat.price} BYN`}
                      >
                        {/* Номер места (теперь всегда показывается) */}
                        <span className="relative z-10">{seat.number}</span>

                        {/* Диагональное перечеркивание для занятых мест */}
                        {isUnavailable && (
                          <span className="absolute top-1/2 left-1/2 w-[140%] h-[1px] bg-white/20 -translate-x-1/2 -translate-y-1/2 -rotate-45 z-20 pointer-events-none"></span>
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Номер ряда (справа) */}
                <div className="flex-shrink-0 w-8 flex items-center justify-center font-medium text-[10px] text-white/30">
                  {row}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Подвал с выбранными местами */}
      <div className="p-5 border-t border-white/5 bg-[#0a0a0a] mt-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
          <div className="flex-1">
            <h4 className="font-medium text-white/80 mb-2 text-sm">Выбранные места:</h4>
            {selectedSeats.length === 0 ? (
              <p className="text-sm text-white/30">Ничего не выбрано</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {selectedSeats.map((seat, idx) => (
                  <div key={(seat.id ? seat.id : idx) + '-' + (seat.row || idx) + '-' + (seat.number || idx)} 
                       className="px-2.5 py-1 rounded-md bg-white/10 border border-white/20 text-white text-xs font-medium">
                    Ряд {seat.row}, Место {seat.number}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="text-left sm:text-right w-full sm:w-auto">
            <div className="text-xs text-white/50 uppercase tracking-wider mb-1">Итого к оплате</div>
            <div className="text-3xl font-display font-black text-white whitespace-nowrap">
              {getTotalPrice().toFixed(0)} BYN
            </div>
          </div>
        </div>
        
        <button 
          className="w-full py-3.5 rounded-xl bg-white text-black font-bold text-sm hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          disabled={selectedSeats.length === 0}
          onClick={handleCheckout}
        >
          Перейти к оформлению
        </button>
        
        <div className="flex items-center justify-center mt-4 text-xs text-white/40">
          <InfoIcon className="h-3.5 w-3.5 mr-1.5 opacity-70" />
          Места бронируются на 10 минут после выбора
        </div>
      </div>

      {/* Модальное окно оформления (Темная тема) */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#161616] border border-white/10 rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-md relative"
          >
            {/* Кнопка закрытия */}
            <button 
              onClick={() => setShowCheckout(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-2xl font-display font-bold text-white mb-6">Оформление</h3>
            
            <div className="bg-[#0a0a0a] rounded-xl p-5 mb-6 border border-white/5 space-y-3">
              <div>
                <div className="text-xs text-white/40 mb-1">Событие</div>
                <div className="text-white font-medium">{eventInfo?.title || '—'}</div>
              </div>
              <div>
                <div className="text-xs text-white/40 mb-1">Дата и время</div>
                <div className="text-white font-medium">{eventInfo?.date || '—'}</div>
              </div>
              <div>
                <div className="text-xs text-white/40 mb-1">Выбранные билеты ({selectedSeats.length} шт.)</div>
                <div className="text-white font-medium leading-relaxed">
                  {selectedSeats.map(s => `${s.row} ряд, ${s.number} место`).join(' • ')}
                </div>
              </div>
            </div>

            <div className="flex items-end justify-between mb-8">
              <span className="text-white/60">К оплате:</span>
              <span className="text-3xl font-display font-black text-white">{getTotalPrice().toFixed(0)} BYN</span>
            </div>

            {purchaseError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-lg mb-6 text-center">
                {purchaseError}
              </div>
            )}
            
            <div className="space-y-3">
              <button 
                className="w-full py-4 rounded-xl bg-white text-black font-bold hover:bg-white/90 disabled:opacity-70 transition-all flex justify-center items-center"
                onClick={handlePay} 
                disabled={isPaying}
              >
                {isPaying ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Обработка...
                  </span>
                ) : 'Оплатить'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SeatMap;