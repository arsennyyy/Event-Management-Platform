-- =============================================
-- Скрипт для импорта данных в SQL Server
-- ВАЖНО: Выполняйте импорт в правильном порядке
-- (сначала родительские таблицы, затем дочерние)
-- =============================================

USE [VibeSiteDB]
GO

-- =============================================
-- ВАЖНО: Замените данные ниже на ваши реальные данные
-- или используйте BULK INSERT для импорта из CSV
-- =============================================

-- Пример импорта данных в таблицу Users
-- INSERT INTO [dbo].[Users] ([Name], [Email], [PasswordHash], [EmailVerified], [VerificationToken], [TokenExpiresAt], [CreatedAt], [UpdatedAt])
-- VALUES 
--     ('Иван Иванов', 'ivan@example.com', 'hashed_password', 1, NULL, NULL, GETUTCDATE(), GETUTCDATE()),
--     ('Мария Петрова', 'maria@example.com', 'hashed_password', 1, NULL, NULL, GETUTCDATE(), GETUTCDATE());

-- Пример импорта данных в таблицу Events
-- INSERT INTO [dbo].[Events] ([Title], [Image], [Date], [Time], [Location], [Address], [Price], [Category], [Description], [EventType], [Lineup], [IsFeatured])
-- VALUES 
--     ('Концерт рок-группы', '/images/event1.jpg', '2024-06-15 20:00:00', '20:00', 'Концертный зал', 'ул. Пушкина, 10', '1500-3000', 'Концерт', 'Описание события', 'Concert', '["Группа 1", "Группа 2"]', 1);

-- =============================================
-- Альтернативный способ: Импорт через BULK INSERT
-- =============================================

-- Пример для импорта из CSV файла (требует настройки прав)
/*
BULK INSERT [dbo].[Users]
FROM 'C:\path\to\users_export.csv'
WITH (
    FIELDTERMINATOR = ',',
    ROWTERMINATOR = '\n',
    FIRSTROW = 2  -- Пропустить заголовок
);
*/

-- =============================================
-- Проверка импортированных данных
-- =============================================

-- Проверка количества записей
SELECT 
    'Users' AS TableName, 
    COUNT(*) AS RecordCount 
FROM [dbo].[Users]
UNION ALL
SELECT 'Events', COUNT(*) FROM [dbo].[Events]
UNION ALL
SELECT 'TicketTypes', COUNT(*) FROM [dbo].[TicketTypes]
UNION ALL
SELECT 'Seats', COUNT(*) FROM [dbo].[Seats]
UNION ALL
SELECT 'UserTickets', COUNT(*) FROM [dbo].[UserTickets]
UNION ALL
SELECT 'Orders', COUNT(*) FROM [dbo].[Orders]
UNION ALL
SELECT 'Payments', COUNT(*) FROM [dbo].[Payments]
UNION ALL
SELECT 'Reviews', COUNT(*) FROM [dbo].[Reviews]
UNION ALL
SELECT 'Notifications', COUNT(*) FROM [dbo].[Notifications]
UNION ALL
SELECT 'ContactMessages', COUNT(*) FROM [dbo].[ContactMessages];

GO

PRINT 'Импорт данных завершен!';
PRINT 'Проверьте количество записей выше.';

