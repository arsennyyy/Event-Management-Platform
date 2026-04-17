import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const TermsPage = () => {
  const sections = [
    {
      title: "1. Общие положения",
      content: "Используя платформу +Vibe, вы соглашаетесь с настоящими условиями использования. Если вы не согласны с этими условиями, пожалуйста, не используйте наш сервис."
    },
    {
      title: "2. Использование сервиса",
      content: "Платформа +Vibe предоставляет услуги по покупке билетов на мероприятия и организации событий. Вы обязуетесь использовать сервис только в законных целях и в соответствии с настоящими условиями."
    },
    {
      title: "3. Регистрация и безопасность",
      content: "При регистрации вы должны предоставить точную и полную информацию. Вы несете ответственность за сохранение конфиденциальности вашей учетной записи."
    },
    {
      title: "4. Платежи и возвраты",
      content: "Все платежи обрабатываются через защищенные платежные системы. Условия возврата билетов определяются правилами конкретного мероприятия."
    },
    {
      title: "5. Интеллектуальная собственность",
      content: "Весь контент на платформе +Vibe является собственностью компании и защищен законами об авторском праве."
    }
  ];

  return (
    <div className="container px-4 md:px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Условия использования</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Пожалуйста, внимательно ознакомьтесь с условиями использования нашей платформы
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center">Последнее обновление: {new Date().toLocaleDateString()}</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <Badge variant="secondary" className="text-lg px-6 py-2">
              Версия 1.0
            </Badge>
          </CardContent>
        </Card>

        <ScrollArea className="h-[600px] rounded-md border p-4">
          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>{section.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{section.content}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </motion.div>
    </div>
  );
};

export default TermsPage; 