-- =============================================
-- Скрипт для импорта данных из CSV в SQL Server
-- ВАЖНО: Замените пути к файлам на реальные!
-- =============================================

USE [VibeSiteDB]
GO

-- Отключаем проверку внешних ключей для ускорения импорта
ALTER TABLE [dbo].[TicketTypes] NOCHECK CONSTRAINT ALL;
ALTER TABLE [dbo].[Seats] NOCHECK CONSTRAINT ALL;
ALTER TABLE [dbo].[UserTickets] NOCHECK CONSTRAINT ALL;
GO

-- =============================================
-- 1. Импорт Users
-- =============================================
-- ВАЖНО: Замените путь на реальный путь к вашему CSV файлу
-- Пример: 'C:\Users\YourName\Desktop\users_export.csv'

-- Если нужно сохранить оригинальные ID:
SET IDENTITY_INSERT [dbo].[Users] ON;
GO

BULK INSERT [dbo].[Users]
FROM 'D:\+Vibe_site\MyMvcBackend\Scripts\ExportedData\users_export.csv'
WITH (
    FIELDTERMINATOR = ',',
    ROWTERMINATOR = '\n',
    FIRSTROW = 2,  -- Пропустить заголовок
    CODEPAGE = '65001'  -- UTF-8
);
GO

SET IDENTITY_INSERT [dbo].[Users] OFF;
GO

PRINT 'Импортированы данные в таблицу Users';
GO

-- =============================================
-- 2. Импорт Events
-- =============================================
SET IDENTITY_INSERT [dbo].[Events] ON;
GO

BULK INSERT [dbo].[Events]
FROM 'D:\+Vibe_site\MyMvcBackend\Scripts\ExportedData\events_export.csv'
WITH (
    FIELDTERMINATOR = ',',
    ROWTERMINATOR = '\n',
    FIRSTROW = 2,
    CODEPAGE = '65001'
);
GO

SET IDENTITY_INSERT [dbo].[Events] OFF;
GO

PRINT 'Импортированы данные в таблицу Events';
GO

-- =============================================
-- 3. Импорт TicketTypes
-- =============================================
SET IDENTITY_INSERT [dbo].[TicketTypes] ON;
GO

BULK INSERT [dbo].[TicketTypes]
FROM 'D:\+Vibe_site\MyMvcBackend\Scripts\ExportedData\tickettypes_export.csv'
WITH (
    FIELDTERMINATOR = ',',
    ROWTERMINATOR = '\n',
    FIRSTROW = 2,
    CODEPAGE = '65001'
);
GO

SET IDENTITY_INSERT [dbo].[TicketTypes] OFF;
GO

PRINT 'Импортированы данные в таблицу TicketTypes';
GO

-- =============================================
-- 4. Импорт Seats
-- =============================================
SET IDENTITY_INSERT [dbo].[Seats] ON;
GO

BULK INSERT [dbo].[Seats]
FROM 'D:\+Vibe_site\MyMvcBackend\Scripts\ExportedData\seats_export.csv'
WITH (
    FIELDTERMINATOR = ',',
    ROWTERMINATOR = '\n',
    FIRSTROW = 2,
    CODEPAGE = '65001'
);
GO

SET IDENTITY_INSERT [dbo].[Seats] OFF;
GO

PRINT 'Импортированы данные в таблицу Seats';
GO

-- =============================================
-- 5. Импорт UserTickets
-- =============================================
SET IDENTITY_INSERT [dbo].[UserTickets] ON;
GO

BULK INSERT [dbo].[UserTickets]
FROM 'D:\+Vibe_site\MyMvcBackend\Scripts\ExportedData\usertickets_export.csv'
WITH (
    FIELDTERMINATOR = ',',
    ROWTERMINATOR = '\n',
    FIRSTROW = 2,
    CODEPAGE = '65001'
);
GO

SET IDENTITY_INSERT [dbo].[UserTickets] OFF;
GO

PRINT 'Импортированы данные в таблицу UserTickets';
GO

-- Включаем обратно проверку внешних ключей
ALTER TABLE [dbo].[TicketTypes] CHECK CONSTRAINT ALL;
ALTER TABLE [dbo].[Seats] CHECK CONSTRAINT ALL;
ALTER TABLE [dbo].[UserTickets] CHECK CONSTRAINT ALL;
GO

-- =============================================
-- Проверка импортированных данных
-- =============================================
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
SELECT 'UserTickets', COUNT(*) FROM [dbo].[UserTickets];
GO

PRINT 'Импорт завершен!';
GO

