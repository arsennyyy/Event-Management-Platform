import React from "react";
import Layout from "../components/Layout";
import Hero from "@/components/Hero";
import FeaturedEvents from "@/components/FeaturedEvents";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <Layout>
      <Hero />
      
      <FeaturedEvents />
      
      {/* Trust and Safety Section */}
      <section className="section-padding">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <span className="text-sm font-medium text-primary">Почему мы?</span>
              <h2 className="heading-lg mt-2 mb-4">Безопасные и комфортные впечатления от мероприятий</h2>
              <p className="text-foreground/70 mb-6">
                Наша платформа обеспечивает безопасный и надежный способ покупки билетов, с функциями,
                разработанными для улучшения вашего опыта от начала до конца.
              </p>

              <div className="space-y-4">
                {[
                  "Безопасная покупка билетов с защитой от мошенничества",
                  "Интерактивный выбор мест с отображением доступности в реальном времени",
                  "QR-коды для удобного входа на мероприятие",
                  "Гарантированный возврат средств при отмене мероприятия",
                ].map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="rounded-xl overflow-hidden"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <img
                src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80"
                alt="Concert crowd"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;