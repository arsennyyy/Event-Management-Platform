import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const AboutPage = () => {
  const features = [
    {
      title: "Удобная система покупки билетов",
      description: "Быстрая и безопасная покупка билетов в несколько кликов",
      icon: "🎫"
    },
    {
      title: "Безопасные платежи",
      description: "Защищенные транзакции с использованием современных технологий",
      icon: "🔒"
    },
    {
      title: "Простой процесс организации",
      description: "Интуитивно понятный интерфейс для создания и управления мероприятиями",
      icon: "🎪"
    },
    {
      title: "Поддержка 24/7",
      description: "Наша команда всегда готова помочь вам с любыми вопросами",
      icon: "💬"
    },
    {
      title: "Инновационные решения",
      description: "Современные инструменты для эффективного управления событиями",
      icon: "✨"
    }
  ];

  return (
    <div className="container px-4 md:px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">О нас</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            +Vibe - это инновационная платформа для покупки билетов на концерты и управления событиями
          </p>
        </div>

        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Наша миссия</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-muted-foreground">
              Мы создаем пространство, где организаторы мероприятий и их гости могут легко взаимодействовать, 
              обеспечивая безопасные и удобные транзакции, а также незабываемые впечатления от каждого события.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Badge variant="secondary" className="text-lg px-6 py-2">
            Присоединяйтесь к нам и станьте частью нашего сообщества!
          </Badge>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutPage; 