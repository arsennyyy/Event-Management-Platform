import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import EventCard from "./EventCard"; 
import { eventsData } from "@/data/eventData";

const FeaturedEvents = () => {
  const displayedEvents = eventsData.filter(event => event.isFeatured).slice(0, 4);

  return (
    // Изменен фон на #050505 для соответствия скриншоту
    <section className="py-24 bg-[#09090b]">
      <div className="container px-6 mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <motion.h2
              className="text-4xl md:text-5xl font-display font-black text-white mb-3"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Популярные события
            </motion.h2>
            <motion.p
              className="text-white/50 text-base"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Самые ожидаемые концерты этого сезона
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Link
              to="/concerts"
              className="group inline-flex items-center text-sm font-medium text-white/50 hover:text-white transition-colors"
            >
              Все мероприятия
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <EventCard {...event} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;