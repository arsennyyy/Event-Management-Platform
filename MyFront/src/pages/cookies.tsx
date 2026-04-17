import React from "react";
import { motion } from "framer-motion";

const CookiesPage = () => {
  return (
    <div className="container px-4 md:px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-8">Политика использования файлов cookie</h1>
        <div className="prose prose-lg dark:prose-invert">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Что такое файлы cookie?</h2>
            <p className="mb-4">
              Файлы cookie - это небольшие текстовые файлы, которые сохраняются на вашем устройстве при посещении веб-сайта. 
              Они помогают нам сделать использование сайта более удобным и персонализированным.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Типы используемых файлов cookie</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium mb-2">Необходимые файлы cookie</h3>
                <p className="mb-4">
                  Эти файлы необходимы для работы сайта и не могут быть отключены. 
                  Они обеспечивают базовую функциональность и безопасность.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">Аналитические файлы cookie</h3>
                <p className="mb-4">
                  Помогают нам понять, как посетители взаимодействуют с сайтом, 
                  что позволяет улучшать его работу.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">Функциональные файлы cookie</h3>
                <p className="mb-4">
                  Позволяют сайту запоминать ваши предпочтения и настройки для 
                  более персонализированного опыта.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Управление файлами cookie</h2>
            <p className="mb-4">
              Вы можете управлять настройками файлов cookie через настройки вашего браузера. 
              Однако отключение некоторых файлов cookie может повлиять на функциональность сайта.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Обновления политики</h2>
            <p className="mb-4">
              Мы можем обновлять эту политику время от времени. 
              Рекомендуем периодически проверять эту страницу для ознакомления с изменениями.
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
};

export default CookiesPage; 