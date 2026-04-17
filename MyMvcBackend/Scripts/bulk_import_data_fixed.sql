-- =============================================
-- ИСПРАВЛЕННЫЙ скрипт импорта данных из CSV
-- Использует промежуточные таблицы для правильной обработки типов
-- =============================================

USE [VibeSiteDB]
GO

-- Отключаем проверку внешних ключей
ALTER TABLE [dbo].[TicketTypes] NOCHECK CONSTRAINT ALL;
ALTER TABLE [dbo].[Seats] NOCHECK CONSTRAINT ALL;
ALTER TABLE [dbo].[UserTickets] NOCHECK CONSTRAINT ALL;
GO

-- Очищаем таблицы перед импортом
-- ВАЖНО: Отключаем проверку внешних ключей перед удалением
DELETE FROM [dbo].[UserTickets];
DELETE FROM [dbo].[Seats];
DELETE FROM [dbo].[TicketTypes];
DELETE FROM [dbo].[Events];
DELETE FROM [dbo].[Users];
GO

PRINT 'Таблицы очищены перед импортом';
GO

-- =============================================
-- 1. Импорт Users через промежуточную таблицу
-- =============================================

-- Создаем промежуточную таблицу
IF OBJECT_ID('tempdb..#UsersTemp') IS NOT NULL DROP TABLE #UsersTemp;
CREATE TABLE #UsersTemp (
    Id INT,
    Name NVARCHAR(100),
    Email NVARCHAR(100),
    PasswordHash NVARCHAR(100),
    EmailVerified NVARCHAR(10),  -- Строка для 0/1
    VerificationToken NVARCHAR(500),
    TokenExpiresAt NVARCHAR(50),
    CreatedAt NVARCHAR(50),
    UpdatedAt NVARCHAR(50)
);
GO

BULK INSERT #UsersTemp
FROM 'D:\+Vibe_site\MyMvcBackend\Scripts\ExportedData\Users.csv'
WITH (
    FORMAT = 'CSV',
    FIRSTROW = 2,
    FIELDTERMINATOR = ',',
    ROWTERMINATOR = '\n',
    FIELDQUOTE = '"',
    CODEPAGE = '65001',
    MAXERRORS = 100
);
GO

-- Вставляем в основную таблицу с преобразованием типов
SET IDENTITY_INSERT [dbo].[Users] ON;
GO

INSERT INTO [dbo].[Users] ([Id], [Name], [Email], [PasswordHash], [EmailVerified], [VerificationToken], [TokenExpiresAt], [CreatedAt], [UpdatedAt])
SELECT 
    Id,
    Name,
    Email,
    PasswordHash,
    CASE WHEN EmailVerified = '1' OR EmailVerified = 'true' THEN 1 ELSE 0 END,
    NULLIF(VerificationToken, ''),
    CASE WHEN TokenExpiresAt IS NULL OR TokenExpiresAt = '' THEN NULL ELSE CAST(TokenExpiresAt AS DATETIME2) END,
    CAST(CreatedAt AS DATETIME2),
    CAST(UpdatedAt AS DATETIME2)
FROM #UsersTemp;
GO

SET IDENTITY_INSERT [dbo].[Users] OFF;
GO

DROP TABLE #UsersTemp;
PRINT 'Импортированы данные в таблицу Users: ' + CAST(@@ROWCOUNT AS NVARCHAR(10)) + ' строк';
GO

-- =============================================
-- 2. Импорт Events через промежуточную таблицу
-- =============================================

IF OBJECT_ID('tempdb..#EventsTemp') IS NOT NULL DROP TABLE #EventsTemp;
CREATE TABLE #EventsTemp (
    Id INT,
    Title NVARCHAR(500),
    Image NVARCHAR(1000),  -- Может быть NULL
    Date NVARCHAR(50),
    Time NVARCHAR(50),
    Location NVARCHAR(500),
    Address NVARCHAR(1000),
    Price NVARCHAR(100),
    Category NVARCHAR(100),
    Description NVARCHAR(MAX),
    EventType NVARCHAR(100),
    Lineup NVARCHAR(MAX),
    IsFeatured NVARCHAR(10)  -- Строка для 0/1
);
GO

BULK INSERT #EventsTemp
FROM 'D:\+Vibe_site\MyMvcBackend\Scripts\ExportedData\Events.csv'
WITH (
    FORMAT = 'CSV',
    FIRSTROW = 2,
    FIELDTERMINATOR = ',',
    ROWTERMINATOR = '\n',
    FIELDQUOTE = '"',
    CODEPAGE = '65001',
    MAXERRORS = 100
);
GO

SET IDENTITY_INSERT [dbo].[Events] ON;
GO

INSERT INTO [dbo].[Events] ([Id], [Title], [Image], [Date], [Time], [Location], [Address], [Price], [Category], [Description], [EventType], [Lineup], [IsFeatured])
SELECT 
    Id,
    Title,
    CASE WHEN Image IS NULL OR Image = '' THEN 'placeholder.svg' ELSE Image END,  -- Если Image пустое, используем placeholder
    CAST(Date AS DATETIME2),
    Time,
    Location,
    Address,
    Price,
    NULLIF(Category, ''),
    Description,
    EventType,
    Lineup,
    CASE WHEN IsFeatured = '1' OR IsFeatured = 'true' THEN 1 ELSE 0 END
FROM #EventsTemp;
GO

SET IDENTITY_INSERT [dbo].[Events] OFF;
GO

DROP TABLE #EventsTemp;
PRINT 'Импортированы данные в таблицу Events: ' + CAST(@@ROWCOUNT AS NVARCHAR(10)) + ' строк';
GO

-- =============================================
-- 3. Импорт TicketTypes
-- =============================================

IF OBJECT_ID('tempdb..#TicketTypesTemp') IS NOT NULL DROP TABLE #TicketTypesTemp;
CREATE TABLE #TicketTypesTemp (
    Id INT,
    Name NVARCHAR(200),
    Price NVARCHAR(50),
    Available NVARCHAR(10),
    EventId INT
);
GO

BULK INSERT #TicketTypesTemp
FROM 'D:\+Vibe_site\MyMvcBackend\Scripts\ExportedData\TicketTypes.csv'
WITH (
    FORMAT = 'CSV',
    FIRSTROW = 2,
    FIELDTERMINATOR = ',',
    ROWTERMINATOR = '\n',
    FIELDQUOTE = '"',
    CODEPAGE = '65001'
);
GO

SET IDENTITY_INSERT [dbo].[TicketTypes] ON;
GO

INSERT INTO [dbo].[TicketTypes] ([Id], [Name], [Price], [Available], [EventId])
SELECT 
    Id,
    Name,
    CAST(Price AS DECIMAL(18,2)),
    CASE WHEN Available = '1' OR Available = 'true' THEN 1 ELSE 0 END,
    EventId
FROM #TicketTypesTemp;
GO

SET IDENTITY_INSERT [dbo].[TicketTypes] OFF;
GO

DROP TABLE #TicketTypesTemp;
PRINT 'Импортированы данные в таблицу TicketTypes: ' + CAST(@@ROWCOUNT AS NVARCHAR(10)) + ' строк';
GO

-- =============================================
-- 4. Импорт Seats
-- =============================================

IF OBJECT_ID('tempdb..#SeatsTemp') IS NOT NULL DROP TABLE #SeatsTemp;
CREATE TABLE #SeatsTemp (
    Id INT,
    EventId INT,
    Row NVARCHAR(50),
    Number INT,
    Status NVARCHAR(50),
    Type NVARCHAR(50),
    Price NVARCHAR(50),
    ReservedByUserId NVARCHAR(50),
    ReservationExpiresAt NVARCHAR(50)
);
GO

BULK INSERT #SeatsTemp
FROM 'D:\+Vibe_site\MyMvcBackend\Scripts\ExportedData\Seats.csv'
WITH (
    FORMAT = 'CSV',
    FIRSTROW = 2,
    FIELDTERMINATOR = ',',
    ROWTERMINATOR = '\n',
    FIELDQUOTE = '"',
    CODEPAGE = '65001',
    MAXERRORS = 100
);
GO

SET IDENTITY_INSERT [dbo].[Seats] ON;
GO

INSERT INTO [dbo].[Seats] ([Id], [EventId], [Row], [Number], [Status], [Type], [Price], [ReservedByUserId], [ReservationExpiresAt])
SELECT 
    Id,
    EventId,
    Row,
    Number,
    Status,
    Type,
    CAST(Price AS DECIMAL(18,2)),
    CASE WHEN ReservedByUserId IS NULL OR ReservedByUserId = '' THEN NULL ELSE CAST(ReservedByUserId AS INT) END,
    CASE WHEN ReservationExpiresAt IS NULL OR ReservationExpiresAt = '' THEN NULL ELSE CAST(ReservationExpiresAt AS DATETIME2) END
FROM #SeatsTemp;
GO

SET IDENTITY_INSERT [dbo].[Seats] OFF;
GO

DROP TABLE #SeatsTemp;
PRINT 'Импортированы данные в таблицу Seats: ' + CAST(@@ROWCOUNT AS NVARCHAR(10)) + ' строк';
GO

-- =============================================
-- 5. Импорт UserTickets (ВАЖНО: порядок колонок в CSV отличается!)
-- =============================================

IF OBJECT_ID('tempdb..#UserTicketsTemp') IS NOT NULL DROP TABLE #UserTicketsTemp;
CREATE TABLE #UserTicketsTemp (
    Id INT,
    EventDate NVARCHAR(50),
    EventId INT,
    IsUsed NVARCHAR(10),
    Price NVARCHAR(50),
    PurchaseDate NVARCHAR(50),
    QrCode NVARCHAR(1000),
    SeatId INT,
    TicketType NVARCHAR(200),
    UserId INT
);
GO

BULK INSERT #UserTicketsTemp
FROM 'D:\+Vibe_site\MyMvcBackend\Scripts\ExportedData\UserTickets.csv'
WITH (
    FORMAT = 'CSV',
    FIRSTROW = 2,
    FIELDTERMINATOR = ',',
    ROWTERMINATOR = '\n',
    FIELDQUOTE = '"',
    CODEPAGE = '65001',
    MAXERRORS = 100
);
GO

SET IDENTITY_INSERT [dbo].[UserTickets] ON;
GO

-- ВАЖНО: Порядок колонок в таблице: UserId, EventId, SeatId, TicketType, Price, PurchaseDate, EventDate, QrCode, IsUsed
-- Порядок в CSV: Id, EventDate, EventId, IsUsed, Price, PurchaseDate, QrCode, SeatId, TicketType, UserId
INSERT INTO [dbo].[UserTickets] ([Id], [UserId], [EventId], [SeatId], [TicketType], [Price], [PurchaseDate], [EventDate], [QrCode], [IsUsed])
SELECT 
    Id,
    UserId,
    EventId,
    SeatId,
    TicketType,
    CAST(Price AS DECIMAL(18,2)),
    CAST(PurchaseDate AS DATETIME2),
    CAST(EventDate AS DATETIME2),
    QrCode,
    CASE WHEN IsUsed = '1' OR IsUsed = 'true' THEN 1 ELSE 0 END
FROM #UserTicketsTemp;
GO

SET IDENTITY_INSERT [dbo].[UserTickets] OFF;
GO

DROP TABLE #UserTicketsTemp;
PRINT 'Импортированы данные в таблицу UserTickets: ' + CAST(@@ROWCOUNT AS NVARCHAR(10)) + ' строк';
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

PRINT '========================================';
PRINT 'Импорт завершен успешно!';
PRINT '========================================';
GO

