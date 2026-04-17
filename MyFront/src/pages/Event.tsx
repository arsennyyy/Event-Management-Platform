import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Check, Info } from "lucide-react";
import SeatMap from "@/components/SeatMap";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getEventById } from "@/data/eventData";
import { useToast } from "@/components/ui/use-toast";

declare global {
  interface Window {
    ymaps: any;
  }
}

// --- УМНЫЙ КОМПОНЕНТ ЯНДЕКС КАРТЫ ---
// Добавили venueName (название площадки), чтобы ставить точную красную метку!
const YandexMap = ({ venueName, address, apiKey }: { venueName: string; address: string; apiKey: string }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapStatus, setMapStatus] = useState<'loading' | 'success' | 'error'>('loading');

  // Умный запрос: Название площадки + Адрес (Исключает выдачу "10 найдено")
  const searchQuery = `${venueName}, ${address}`;

  useEffect(() => {
    let mapInstance: any = null;

    const initMap = () => {
      if (!window.ymaps || !mapContainerRef.current) {
        setMapStatus('error');
        return;
      }
      
      window.ymaps.ready(() => {
        // Ищем по точному запросу
        window.ymaps.geocode(searchQuery, { results: 1 })
          .then((res: any) => {
            const firstGeoObject = res.geoObjects.get(0);
            
            if (!firstGeoObject || !mapContainerRef.current) {
              setMapStatus('error'); 
              return;
            }

            const coords = firstGeoObject.geometry.getCoordinates();
            mapContainerRef.current.innerHTML = ''; 

            mapInstance = new window.ymaps.Map(mapContainerRef.current, {
              center: coords,
              zoom: 16,
              controls: ['zoomControl', 'fullscreenControl']
            });

            // Ставим красную метку
            const placemark = new window.ymaps.Placemark(coords, {
              balloonContent: venueName,
              hintContent: address
            }, {
              preset: 'islands#redDotIcon'
            });

            mapInstance.geoObjects.add(placemark);
            mapInstance.behaviors.disable('scrollZoom'); 
            
            setMapStatus('success'); 
          })
          .catch((err: any) => {
            console.error("Яндекс отклонил запрос (ошибка ключа):", err);
            setMapStatus('error'); 
          });
      });
    };

    const scriptId = "yandex-maps-api-script";
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU`;
      script.async = true;
      
      script.onload = initMap;
      script.onerror = () => setMapStatus('error'); 
      
      document.head.appendChild(script);
    } else if (window.ymaps) {
      initMap();
    } else {
      script.addEventListener("load", initMap);
      script.addEventListener("error", () => setMapStatus('error'));
    }

    return () => {
      if (mapInstance) {
        mapInstance.destroy();
      }
    };
  }, [searchQuery, apiKey]);

  if (mapStatus === 'loading') {
    return (
      <div className="relative w-full aspect-video md:h-[400px] rounded-2xl overflow-hidden mb-10 border border-white/10 bg-[#161616] flex items-center justify-center">
        <div className="flex items-center text-white/50 text-sm">
          <svg className="animate-spin h-5 w-5 mr-3 text-white/30" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          Связь со спутниками Яндекса...
        </div>
      </div>
    );
  }

  // ЗАПАСНОЙ ВАРИАНТ (Если ключ выдает Invalid API Key)
  if (mapStatus === 'error') {
    return (
      <div className="relative w-full aspect-video md:h-[400px] rounded-2xl overflow-hidden mb-10 border border-white/10 bg-[#0a0a0a]">
        <iframe 
          src={`https://yandex.ru/map-widget/v1/?text=${encodeURIComponent(searchQuery)}&z=16`} 
          width="100%" 
          height="100%" 
          frameBorder="0" 
          allowFullScreen={true} 
          style={{ filter: 'invert(100%) hue-rotate(180deg) brightness(85%) contrast(90%)' }}
        ></iframe>
      </div>
    );
  }

  // УСПЕШНЫЙ ВАРИАНТ (Когда ключ работает)
  return (
    <div className="relative w-full aspect-video md:h-[400px] rounded-2xl overflow-hidden mb-10 border border-white/10 bg-[#0a0a0a]">
      <div 
        ref={mapContainerRef} 
        className="w-full h-full"
        style={{ filter: 'invert(100%) hue-rotate(180deg) brightness(85%) contrast(90%)' }}
      />
    </div>
  );
};


// --- ОСНОВНАЯ СТРАНИЦА СОБЫТИЯ ---
const Event = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const event = getEventById(id || "");
  const [activeTab, setActiveTab] = useState("details");

  const YANDEX_API_KEY = "22662b03-7e60-4230-b268-7418b275248e";

  useEffect(() => {
    if (!event) {
      toast({
        title: "Событие не найдено",
        description: "Запрашиваемое вами событие не существует",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [event, navigate, toast]);

  if (!event) {
    return null;
  }

  const yandexMapsLink = `https://yandex.ru/maps/?text=${encodeURIComponent(`${event.location}, ${event.address}`)}`;

  return (
    <Layout>
      <div className="min-h-screen pt-20 pb-24 bg-[#0a0a0a]">
        
        {/* --- Hero Section (Обложка) --- */}
        <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden mb-12">
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent z-10" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-20">
            <div className="container mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex px-3 py-1 mb-4 rounded-full bg-white/10 border border-white/20 text-white text-xs font-medium backdrop-blur-md uppercase tracking-wider">
                  {event.category}
                </div>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-black text-white mb-6 leading-tight tracking-tight">
                  {event.title}
                </h1>
                
                <div className="flex flex-wrap gap-6 text-white/70 text-sm font-medium">
                  <div className="flex items-center bg-white/5 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10">
                    <Calendar className="h-5 w-5 mr-2 text-white/50" />
                    {event.date}
                  </div>
                  <div className="flex items-center bg-white/5 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10">
                    <Clock className="h-5 w-5 mr-2 text-white/50" />
                    {event.time}
                  </div>
                  <div className="flex items-center bg-white/5 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10">
                    <MapPin className="h-5 w-5 mr-2 text-white/50" />
                    {event.location}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* --- Основной контент --- */}
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 items-start">
            
            <div className="xl:col-span-2">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                
                <TabsList className="bg-[#161616] border border-white/5 p-1.5 rounded-2xl mb-10 w-full sm:w-auto inline-flex flex-wrap h-auto">
                  <TabsTrigger value="details" className="rounded-xl data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/50 px-6 py-3 font-medium text-sm">Детали</TabsTrigger>
                  <TabsTrigger value="venue" className="rounded-xl data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/50 px-6 py-3 font-medium text-sm">Место проведения</TabsTrigger>
                  <TabsTrigger value="tickets" className="rounded-xl data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/50 px-6 py-3 font-medium text-sm">Билеты</TabsTrigger>
                </TabsList>
                
                {/* Детали */}
                <TabsContent value="details" className="space-y-10 outline-none mt-0">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-[#161616] rounded-3xl border border-white/5 p-8"
                  >
                    <h2 className="text-2xl font-display font-bold text-white mb-6">О мероприятии</h2>
                    <div className="text-white/60 leading-relaxed space-y-4">
                      {event.description.split("\n\n").map((paragraph, idx) => (
                        <p key={idx}>{paragraph}</p>
                      ))}
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="bg-[#161616] rounded-3xl border border-white/5 p-8"
                  >
                    <h3 className="text-2xl font-display font-bold text-white mb-6">Состав</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {event.lineup.map((artist, idx) => (
                        <div 
                          key={idx}
                          className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 flex flex-col items-center gap-4 hover:border-white/20 transition-colors"
                        >
                          <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                            <span className="font-display font-bold text-2xl text-white/30">{artist.charAt(0)}</span>
                          </div>
                          <h4 className="font-medium text-white text-center">{artist}</h4>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </TabsContent>
                
                {/* Место проведения с Вашей Яндекс.Картой */}
                <TabsContent value="venue" className="outline-none mt-0">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-[#161616] rounded-3xl border border-white/5 p-8"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-8 gap-4">
                      <div>
                        <h2 className="text-2xl font-display font-bold text-white mb-2">{event.location}</h2>
                        <p className="text-white/50">{event.address}</p>
                      </div>
                      
                      <a 
                        href={yandexMapsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium text-white transition-colors whitespace-nowrap"
                      >
                        <MapPin className="w-4 h-4 mr-2" />
                        Маршрут в Яндекс
                      </a>
                    </div>
                    
                    {/* НАША НОВАЯ КАРТА (Теперь передаем и Название и Адрес) */}
                    <YandexMap venueName={event.location} address={event.address} apiKey={YANDEX_API_KEY} />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div>
                        <h3 className="text-lg font-display font-bold text-white mb-4">Как добраться</h3>
                        <p className="text-white/50 text-sm leading-relaxed">
                          Парковка доступна на территории за дополнительную плату. Рекомендуем использовать сервисы каршеринга, такси или общественный транспорт во избежание пробок.
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-display font-bold text-white mb-4">Удобства площадки</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-white/70">
                          <div className="flex items-center"><Check className="w-4 h-4 mr-3 text-[#00e59b]" /> Еда и напитки</div>
                          <div className="flex items-center"><Check className="w-4 h-4 mr-3 text-[#00e59b]" /> Гардероб</div>
                          <div className="flex items-center"><Check className="w-4 h-4 mr-3 text-[#00e59b]" /> Туалеты</div>
                          <div className="flex items-center"><Check className="w-4 h-4 mr-3 text-[#00e59b]" /> Места для курения</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </TabsContent>
                
                {/* Билеты */}
                <TabsContent value="tickets" className="outline-none mt-0">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl font-display font-bold text-white mb-6">Категории билетов</h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { name: "Стандарт", desc: "Входной билет на танцпол", price: "50", available: true },
                        { name: "VIP", desc: "Ранний вход + Отдельный бар", price: "100", available: true },
                        { name: "Meet & Greet", desc: "Фото с артистом + VIP билет", price: "250", available: false }
                      ].map((ticket, idx) => (
                        <div 
                          key={idx} 
                          className={`bg-[#161616] border rounded-2xl p-6 transition-colors ${
                            ticket.available ? 'border-white/10 hover:border-white/30' : 'border-white/5 opacity-50'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-6">
                            <div>
                              <h3 className="text-lg font-bold text-white mb-1">{ticket.name}</h3>
                              <p className="text-xs text-white/40">{ticket.desc}</p>
                            </div>
                            <div className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                              ticket.available ? 'bg-[#00e59b]/10 text-[#00e59b]' : 'bg-white/5 text-white/40'
                            }`}>
                              {ticket.available ? 'В наличии' : 'Sold out'}
                            </div>
                          </div>
                          <div className="flex items-end justify-between">
                            <div className="text-2xl font-display font-black text-white">{ticket.price} BYN</div>
                            <button 
                              onClick={() => {
                                if(ticket.available) {
                                  document.getElementById('seatmap-section')?.scrollIntoView({ behavior: 'smooth' });
                                }
                              }}
                              disabled={!ticket.available}
                              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                                ticket.available ? 'bg-white text-black hover:bg-white/90' : 'bg-white/5 text-white/30 cursor-not-allowed'
                              }`}
                            >
                              Выбрать
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-[#161616] border border-white/5 rounded-2xl p-6 mt-8 flex gap-4 items-start">
                      <div className="bg-white/5 p-3 rounded-full shrink-0">
                        <Info className="w-5 h-5 text-white/50" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium mb-2">Правила возврата и посещения</h4>
                        <ul className="text-sm text-white/50 space-y-2 list-disc list-inside">
                          <li>Билеты не подлежат возврату, за исключением случаев отмены мероприятия.</li>
                          <li>Двери открываются за 1 час до начала.</li>
                          <li>Действует возрастное ограничение (проверяется на входе).</li>
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Схема зала */}
            <div className="xl:col-span-1 sticky top-32" id="seatmap-section">
              <SeatMap 
                ticketTypes={event.ticketTypes}
                eventInfo={{
                  id: Number(event.id),
                  title: event.title,
                  date: event.date
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Event;