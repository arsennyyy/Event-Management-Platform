import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Ticket as TicketIcon } from 'lucide-react';

interface Ticket {
  id?: number;
  Id?: number;
  event?: { title: string; date: string; image: string; };
  Event?: { Title: string; Date: string; Image: string; };
  seat?: { row: string; number: number; };
  Seat?: { Row: string; Number: number; };
  ticketType?: string;
  TicketType?: string;
  price?: number;
  Price?: number;
  qrCode?: string;
  QrCode?: string;
  eventDate?: string;
  EventDate?: string;
}

const MyTickets: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5064/api/Seats/my-tickets', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTickets(res.data);
      } catch (err: any) {
        setError('Ошибка при загрузке билетов');
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  // Вспомогательная функция для форматирования даты
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Дата не указана';
    return new Date(dateString).toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    // min-h-[60vh] помогает оттолкнуть футер вниз, даже если контента мало
    <div className="w-full min-h-[60vh] pb-20">
      
      <div className="mb-8">
        <h2 className="text-3xl font-display font-bold text-white mb-2">Мои билеты</h2>
        <p className="text-white/50 text-sm">Предъявите QR-код на входе для сканирования</p>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
           <svg className="animate-spin h-8 w-8 text-white/50" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      {!loading && tickets.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center py-20 bg-[#161616] rounded-2xl border border-white/5 border-dashed">
          <TicketIcon className="h-12 w-12 text-white/20 mb-4" />
          <h3 className="text-lg font-medium text-white mb-1">У вас пока нет билетов</h3>
          <p className="text-white/40 text-sm">Выберите мероприятие и оформите покупку</p>
        </div>
      )}

      <div className="space-y-6">
        {tickets.map((ticket, idx) => {
          const qrValue = ticket.qrCode || ticket.QrCode || Math.random().toString(36).substring(2, 12);
          const title = ticket.Event?.Title || ticket.event?.title || 'Неизвестное событие';
          const date = ticket.Event?.Date || ticket.event?.date || ticket.eventDate || ticket.EventDate;
          const row = ticket.Seat?.Row || ticket.seat?.row || '-';
          const number = ticket.Seat?.Number || ticket.seat?.number || '-';
          const type = ticket.ticketType || ticket.TicketType || 'Стандарт';
          const price = ticket.price || ticket.Price ? `${ticket.price || ticket.Price} BYN` : '0 BYN';

          return (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={(ticket.id ? ticket.id : ticket.Id ? ticket.Id : 'noid') + '-' + idx} 
              className="relative flex flex-col md:flex-row bg-[#161616] rounded-2xl border border-white/10 overflow-hidden shadow-xl"
            >
              {/* Левая часть билета (Информация) */}
              <div className="flex-1 p-6 md:p-8 flex flex-col justify-between relative">
                
                {/* Метка типа билета */}
                <div className="absolute top-0 right-0 bg-white/5 border-b border-l border-white/10 px-4 py-1.5 rounded-bl-xl text-xs font-medium text-white/60 uppercase tracking-wider">
                  {type}
                </div>

                <div className="mb-8 pr-12">
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">{title}</h3>
                  <div className="flex items-center text-sm text-white/60">
                    <Calendar className="h-4 w-4 mr-2 opacity-70" />
                    {formatDate(date)}
                  </div>
                </div>

                <div className="flex items-end justify-between mt-auto pt-6 border-t border-white/10 border-dashed">
                  <div>
                    <div className="text-xs text-white/40 uppercase tracking-wider mb-1">Место</div>
                    <div className="text-xl md:text-2xl font-display font-bold text-white">
                      Ряд {row} <span className="text-white/30 mx-1">•</span> Место {number}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-white/40 uppercase tracking-wider mb-1">Стоимость</div>
                    <div className="text-lg font-medium text-white">{price}</div>
                  </div>
                </div>
              </div>

              {/* Линия отрыва (Разделитель) - Виден только на ПК */}
              <div className="hidden md:flex flex-col items-center relative w-8 shrink-0">
                <div className="absolute -top-3 w-6 h-6 rounded-full bg-[#0a0a0a] border-b border-white/10"></div>
                <div className="h-full w-px border-l-2 border-dashed border-white/10"></div>
                <div className="absolute -bottom-3 w-6 h-6 rounded-full bg-[#0a0a0a] border-t border-white/10"></div>
              </div>

              {/* Разделитель для мобильных */}
              <div className="md:hidden w-full h-8 relative flex items-center justify-between px-4 overflow-hidden">
                <div className="absolute -left-3 w-6 h-6 rounded-full bg-[#0a0a0a] border-r border-white/10 z-10"></div>
                <div className="w-full h-px border-t-2 border-dashed border-white/10"></div>
                <div className="absolute -right-3 w-6 h-6 rounded-full bg-[#0a0a0a] border-l border-white/10 z-10"></div>
              </div>

              {/* Правая часть билета (QR Код) */}
              <div className="bg-white/5 p-6 md:p-8 flex flex-col items-center justify-center shrink-0 min-w-[200px]">
                <div className="bg-white p-3 rounded-xl shadow-lg mb-4">
                  <QRCodeSVG value={qrValue} size={110} level="M" />
                </div>
                <div className="text-xs text-white/50 text-center uppercase tracking-widest font-medium">
                  Scan at Entry
                </div>
              </div>
              
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default MyTickets;