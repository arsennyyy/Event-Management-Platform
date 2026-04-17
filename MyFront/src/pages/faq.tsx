import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQPage = () => {
  const faqs = [
    {
      question: "Как купить билеты на мероприятие?",
      answer: "Выберите интересующее вас мероприятие, выберите нужное количество билетов и следуйте инструкциям по оплате. После успешной оплаты билеты будут доступны в вашем личном кабинете."
    },
    {
      question: "Можно ли вернуть билеты?",
      answer: "Да, возврат билетов возможен в соответствии с правилами мероприятия. Обычно возврат возможен за 24 часа до начала мероприятия. Подробные условия возврата указаны на странице каждого мероприятия."
    },
    {
      question: "Как организовать свое мероприятие?",
      answer: "Для организации мероприятия необходимо зарегистрироваться как организатор, заполнить форму создания мероприятия и предоставить необходимые документы. Наша команда поможет вам на каждом этапе."
    },
    {
      question: "Какие способы оплаты доступны?",
      answer: "Мы принимаем оплату банковскими картами Visa, MasterCard, МИР, а также через электронные кошельки и мобильные приложения банков."
    },
    {
      question: "Как получить поддержку?",
      answer: "Вы можете связаться с нашей службой поддержки через форму обратной связи на сайте, по электронной почте или по телефону. Мы работаем ежедневно с 9:00 до 18:00."
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
          <h1 className="text-4xl font-bold mb-4">Часто задаваемые вопросы</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ответы на самые популярные вопросы о нашей платформе
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center">Не нашли ответ на свой вопрос?</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              Свяжитесь с нашей службой поддержки, и мы с радостью поможем вам
            </p>
            <Badge variant="secondary" className="text-lg px-6 py-2">
              projectmanagementtool52@gmail.com
            </Badge>
          </CardContent>
        </Card>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <AccordionItem value={`item-${index}`} className="border rounded-lg px-4">
                <AccordionTrigger className="text-lg font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </motion.div>
    </div>
  );
};

export default FAQPage; 