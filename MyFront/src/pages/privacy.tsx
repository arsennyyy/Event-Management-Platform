import React from "react";
import { motion } from "framer-motion";

const PrivacyPage = () => {
  return (
    <div className="container px-4 md:px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-8">Политика конфиденциальности</h1>
        <div className="prose prose-lg dark:prose-invert">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Сбор информации</h2>
            <p className="mb-4">
              Мы собираем информацию, которую вы предоставляете при регистрации, покупке билетов и использовании наших услуг. 
              Это включает ваше имя, контактные данные и информацию о платежах.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Использование информации</h2>
            <p className="mb-4">
              Собранная информация используется для:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Обработки ваших заказов и платежей</li>
              <li>Предоставления поддержки клиентам</li>
              <li>Улучшения наших услуг</li>
              <li>Отправки важных уведомлений</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Защита информации</h2>
            <p className="mb-4">
              Мы принимаем все необходимые меры для защиты вашей личной информации от несанкционированного доступа, 
              изменения или уничтожения.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Передача данных</h2>
            <p className="mb-4">
              Мы не передаем вашу личную информацию третьим лицам, за исключением случаев, 
              когда это необходимо для предоставления услуг или требуется по закону.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Ваши права</h2>
            <p className="mb-4">
              Вы имеете право на доступ к вашей личной информации, её исправление и удаление. 
              Для этого свяжитесь с нашей службой поддержки.
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
};

export default PrivacyPage; 