# 🎟️ Event Management Platform (+Vibe)

<div align="center">

![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![C#](https://img.shields.io/badge/C%23-12.0-239120?style=for-the-badge&logo=csharp&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Authentication-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)

**Полноценная платформа для организации мероприятий и бронирования билетов**

</div>

---

## 📋 О проекте

**Event Management Platform** — это веб-приложение для онлайн-бронирования билетов на мероприятия (аналог Ticketpro/Kvitki.by, но для среднего и малого бизнеса). Платформа закрывает полный цикл: от создания события и выбора мест в зале до генерации QR-билетов, обработки платежей и постинговой активности.

---

## 🎯 Ключевые возможности

| Функция | Описание |
|---------|----------|
| 👥 **Ролевая модель** | Администратор, Организатор, Посетитель — разные уровни доступа |
| 🎪 **Управление мероприятиями** | CRUD для событий, настройка схем залов, типы билетов (VIP/Стандарт) |
| 💺 **Интерактивное бронирование** | Схема зала с блокировкой мест в реальном времени |
| 🔐 **Безопасность** | JWT-аутентификация, BCrypt, защита от SQL-инъекций |
| 🎫 **Билетная система** | Генерация QR-кодов на каждый билет |
| 📧 **Email-рассылка** | Приветственные письма, верификация, уведомления |
| ⭐ **Отзывы и рейтинги** | Оценка мероприятий, модерация отзывов |
| 🔔 **Уведомления** | Система оповещений пользователей |
| 🗺️ **Карты Google** | Отображение места проведения |

---

## 🛠️ Технологический стек

### Backend

| Технология | Назначение |
|------------|------------|
| **C# / .NET 8** | Основной язык программирования |
| **ASP.NET Core MVC** | Веб-фреймворк, REST API |
| **Entity Framework Core** | ORM для работы с БД |
| **JWT** | Аутентификация и авторизация |
| **BCrypt** | Хеширование паролей |
| **SMTP** | Email-рассылка |

### Frontend

| Технология | Назначение |
|------------|------------|
| **React 18** | Библиотека для UI |
| **TypeScript** | Типизация |
| **Tailwind CSS** | Стилизация |
| **Framer Motion** | Анимации |
| **React Router DOM** | Маршрутизация |
| **Lucide React** | Иконки |

### База данных

| Технология | Назначение |
|------------|------------|
| **PostgreSQL 16** | Основная СУБД |
| **Npgsql** | Провайдер для EF Core |

---
### Основные таблицы

| Таблица | Описание |
|---------|----------|
| `Users` | Пользователи (имя, email, хеш пароля, верификация) |
| `Events` | Мероприятия (название, дата, время, место, цена, категория) |
| `Seats` | Места (ряд, номер, статус, тип, цена) |
| `UserTickets` | Билеты пользователей (QR-код, статус использования) |
| `Orders` | Заказы (номер, сумма, статус) |
| `Payments` | Платежи (сумма, способ, статус, транзакция) |
| `Feedbacks` | Отзывы (рейтинг, комментарий, модерация) |
| `Notifications` | Уведомления пользователей |
| `ContactMessages` | Сообщения обратной связи |

---

## 🖼️ Скриншоты

| № | Страница | Скриншот |
|---|----------|----------|
| 1 | Главная (Hero-секция) | ![Hero](./screenshots/1-main-hero.png) |
| 2 | Список мероприятий | ![Список](./screenshots/2-main-events.png) |
| 3 | Регистрация | ![Регистрация](./screenshots/3-register.png) |
| 4 | Авторизация | ![Авторизация](./screenshots/4-login.png) |
| 5 | Детали мероприятия | ![Детали](./screenshots/5-event-details.png) |
| 6 | Схема зала | ![Схема зала](./screenshots/6-seat-map.png) |
| 7 | Оформление билетов | ![Оформление](./screenshots/7-checkout.png) |
| 8 | Профиль пользователя | ![Профиль](./screenshots/8-profile.png) |
| 9 | Мои билеты (QR-коды) | ![Билеты](./screenshots/9-my-tickets.png) |
| 10 | Настройки | ![Настройки](./screenshots/10-settings.png) |
| 11 | Обратная связь | ![Контакты](./screenshots/11-contact.png) |
| 12 | Email-рассылка | ![Email](./screenshots/12-welcome-email.png) |
