-- =============================================
-- Скрипт создания всех таблиц для SQL Server
-- База данных: VibeSiteDB
-- =============================================

USE [VibeSiteDB]
GO

-- =============================================
-- 1. Таблица Users (Пользователи)
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Users] (
        [Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [Name] NVARCHAR(100) NOT NULL,
        [Email] NVARCHAR(100) NOT NULL,
        [PasswordHash] NVARCHAR(100) NOT NULL,
        [EmailVerified] BIT NOT NULL DEFAULT 0,
        [VerificationToken] NVARCHAR(500) NULL,
        [TokenExpiresAt] DATETIME2 NULL,
        [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        [UpdatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT [UQ_Users_Email] UNIQUE ([Email])
    );
    
    CREATE INDEX [IX_Users_Email] ON [dbo].[Users]([Email]);
    PRINT 'Таблица Users создана успешно';
END
GO

-- =============================================
-- 2. Таблица Events (События)
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Events]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Events] (
        [Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [Title] NVARCHAR(500) NOT NULL,
        [Image] NVARCHAR(1000) NOT NULL,
        [Date] DATETIME2 NOT NULL,
        [Time] NVARCHAR(50) NOT NULL,
        [Location] NVARCHAR(500) NOT NULL,
        [Address] NVARCHAR(1000) NOT NULL,
        [Price] NVARCHAR(100) NOT NULL,
        [Category] NVARCHAR(100) NULL,
        [Description] NVARCHAR(MAX) NOT NULL,
        [EventType] NVARCHAR(100) NOT NULL,
        [Lineup] NVARCHAR(MAX) NOT NULL,
        [IsFeatured] BIT NOT NULL DEFAULT 0
    );
    
    CREATE INDEX [IX_Events_Date] ON [dbo].[Events]([Date]);
    CREATE INDEX [IX_Events_IsFeatured] ON [dbo].[Events]([IsFeatured]);
    PRINT 'Таблица Events создана успешно';
END
GO

-- =============================================
-- 3. Таблица TicketTypes (Типы билетов)
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[TicketTypes]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[TicketTypes] (
        [Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [Name] NVARCHAR(200) NOT NULL,
        [Price] DECIMAL(18,2) NOT NULL,
        [Available] BIT NOT NULL DEFAULT 1,
        [EventId] INT NOT NULL,
        CONSTRAINT [FK_TicketTypes_Events] FOREIGN KEY ([EventId]) 
            REFERENCES [dbo].[Events]([Id]) ON DELETE CASCADE
    );
    
    CREATE INDEX [IX_TicketTypes_EventId] ON [dbo].[TicketTypes]([EventId]);
    PRINT 'Таблица TicketTypes создана успешно';
END
GO

-- =============================================
-- 4. Таблица Seats (Места)
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Seats]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Seats] (
        [Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [EventId] INT NOT NULL,
        [Row] NVARCHAR(50) NOT NULL,
        [Number] INT NOT NULL,
        [Status] NVARCHAR(50) NOT NULL DEFAULT 'available',
        [Type] NVARCHAR(50) NOT NULL DEFAULT 'standard',
        [Price] DECIMAL(18,2) NOT NULL,
        [ReservedByUserId] INT NULL,
        [ReservationExpiresAt] DATETIME2 NULL,
        CONSTRAINT [FK_Seats_Events] FOREIGN KEY ([EventId]) 
            REFERENCES [dbo].[Events]([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_Seats_Users] FOREIGN KEY ([ReservedByUserId]) 
            REFERENCES [dbo].[Users]([Id]) ON DELETE SET NULL
    );
    
    CREATE INDEX [IX_Seats_EventId] ON [dbo].[Seats]([EventId]);
    CREATE INDEX [IX_Seats_ReservedByUserId] ON [dbo].[Seats]([ReservedByUserId]);
    CREATE INDEX [IX_Seats_Status] ON [dbo].[Seats]([Status]);
    PRINT 'Таблица Seats создана успешно';
END
GO

-- =============================================
-- 5. Таблица UserTickets (Билеты пользователей)
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[UserTickets]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[UserTickets] (
        [Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [UserId] INT NOT NULL,
        [EventId] INT NOT NULL,
        [SeatId] INT NOT NULL,
        [TicketType] NVARCHAR(200) NOT NULL,
        [Price] DECIMAL(18,2) NOT NULL,
        [PurchaseDate] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        [EventDate] DATETIME2 NOT NULL,
        [QrCode] NVARCHAR(1000) NOT NULL,
        [IsUsed] BIT NOT NULL DEFAULT 0,
        CONSTRAINT [FK_UserTickets_Users] FOREIGN KEY ([UserId]) 
            REFERENCES [dbo].[Users]([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_UserTickets_Events] FOREIGN KEY ([EventId]) 
            REFERENCES [dbo].[Events]([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_UserTickets_Seats] FOREIGN KEY ([SeatId]) 
            REFERENCES [dbo].[Seats]([Id]) ON DELETE CASCADE
    );
    
    CREATE INDEX [IX_UserTickets_UserId] ON [dbo].[UserTickets]([UserId]);
    CREATE INDEX [IX_UserTickets_EventId] ON [dbo].[UserTickets]([EventId]);
    CREATE INDEX [IX_UserTickets_SeatId] ON [dbo].[UserTickets]([SeatId]);
    PRINT 'Таблица UserTickets создана успешно';
END
GO

-- =============================================
-- 6. Таблица Orders (Заказы)
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Orders]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Orders] (
        [Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [UserId] INT NOT NULL,
        [OrderNumber] NVARCHAR(100) NOT NULL,
        [TotalAmount] DECIMAL(18,2) NOT NULL,
        [Status] NVARCHAR(50) NOT NULL DEFAULT 'pending',
        [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        [CompletedAt] DATETIME2 NULL,
        CONSTRAINT [FK_Orders_Users] FOREIGN KEY ([UserId]) 
            REFERENCES [dbo].[Users]([Id]) ON DELETE CASCADE,
        CONSTRAINT [UQ_Orders_OrderNumber] UNIQUE ([OrderNumber])
    );
    
    CREATE INDEX [IX_Orders_UserId] ON [dbo].[Orders]([UserId]);
    CREATE INDEX [IX_Orders_OrderNumber] ON [dbo].[Orders]([OrderNumber]);
    CREATE INDEX [IX_Orders_Status] ON [dbo].[Orders]([Status]);
    PRINT 'Таблица Orders создана успешно';
END
GO

-- =============================================
-- 7. Таблица Payments (Платежи)
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Payments]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Payments] (
        [Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [OrderId] INT NOT NULL,
        [UserId] INT NOT NULL,
        [Amount] DECIMAL(18,2) NOT NULL,
        [PaymentMethod] NVARCHAR(100) NOT NULL,
        [Status] NVARCHAR(50) NOT NULL DEFAULT 'pending',
        [TransactionId] NVARCHAR(500) NULL,
        [PaymentDetails] NVARCHAR(MAX) NULL,
        [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        [CompletedAt] DATETIME2 NULL,
        CONSTRAINT [FK_Payments_Orders] FOREIGN KEY ([OrderId]) 
            REFERENCES [dbo].[Orders]([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_Payments_Users] FOREIGN KEY ([UserId]) 
            REFERENCES [dbo].[Users]([Id]) ON DELETE CASCADE
    );
    
    CREATE INDEX [IX_Payments_OrderId] ON [dbo].[Payments]([OrderId]);
    CREATE INDEX [IX_Payments_UserId] ON [dbo].[Payments]([UserId]);
    CREATE INDEX [IX_Payments_Status] ON [dbo].[Payments]([Status]);
    CREATE INDEX [IX_Payments_TransactionId] ON [dbo].[Payments]([TransactionId]);
    PRINT 'Таблица Payments создана успешно';
END
GO

-- =============================================
-- 8. Таблица Reviews (Отзывы)
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Reviews]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Reviews] (
        [Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [UserId] INT NOT NULL,
        [EventId] INT NOT NULL,
        [Rating] INT NOT NULL CHECK ([Rating] >= 1 AND [Rating] <= 5),
        [Comment] NVARCHAR(MAX) NULL,
        [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        [UpdatedAt] DATETIME2 NULL,
        [IsApproved] BIT NOT NULL DEFAULT 0,
        CONSTRAINT [FK_Reviews_Users] FOREIGN KEY ([UserId]) 
            REFERENCES [dbo].[Users]([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_Reviews_Events] FOREIGN KEY ([EventId]) 
            REFERENCES [dbo].[Events]([Id]) ON DELETE CASCADE,
        CONSTRAINT [UQ_Reviews_User_Event] UNIQUE ([UserId], [EventId])
    );
    
    CREATE INDEX [IX_Reviews_UserId] ON [dbo].[Reviews]([UserId]);
    CREATE INDEX [IX_Reviews_EventId] ON [dbo].[Reviews]([EventId]);
    CREATE INDEX [IX_Reviews_IsApproved] ON [dbo].[Reviews]([IsApproved]);
    PRINT 'Таблица Reviews создана успешно';
END
GO

-- =============================================
-- 9. Таблица Notifications (Уведомления)
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Notifications]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Notifications] (
        [Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [UserId] INT NOT NULL,
        [Title] NVARCHAR(500) NOT NULL,
        [Message] NVARCHAR(MAX) NOT NULL,
        [Type] NVARCHAR(50) NOT NULL DEFAULT 'info',
        [IsRead] BIT NOT NULL DEFAULT 0,
        [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        [ReadAt] DATETIME2 NULL,
        [RelatedEventId] INT NULL,
        [RelatedTicketId] INT NULL,
        CONSTRAINT [FK_Notifications_Users] FOREIGN KEY ([UserId]) 
            REFERENCES [dbo].[Users]([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_Notifications_Events] FOREIGN KEY ([RelatedEventId]) 
            REFERENCES [dbo].[Events]([Id]) ON DELETE SET NULL,
        CONSTRAINT [FK_Notifications_UserTickets] FOREIGN KEY ([RelatedTicketId]) 
            REFERENCES [dbo].[UserTickets]([Id]) ON DELETE SET NULL
    );
    
    CREATE INDEX [IX_Notifications_UserId] ON [dbo].[Notifications]([UserId]);
    CREATE INDEX [IX_Notifications_IsRead] ON [dbo].[Notifications]([IsRead]);
    CREATE INDEX [IX_Notifications_CreatedAt] ON [dbo].[Notifications]([CreatedAt]);
    PRINT 'Таблица Notifications создана успешно';
END
GO

-- =============================================
-- 10. Таблица ContactMessages (Сообщения контактов)
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[ContactMessages]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[ContactMessages] (
        [Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [Name] NVARCHAR(100) NOT NULL,
        [Email] NVARCHAR(100) NOT NULL,
        [Message] NVARCHAR(MAX) NOT NULL,
        [Status] NVARCHAR(50) NOT NULL DEFAULT 'new',
        [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        [ResolvedAt] DATETIME2 NULL,
        [Response] NVARCHAR(MAX) NULL,
        [RespondedByUserId] INT NULL
    );
    
    CREATE INDEX [IX_ContactMessages_Status] ON [dbo].[ContactMessages]([Status]);
    CREATE INDEX [IX_ContactMessages_CreatedAt] ON [dbo].[ContactMessages]([CreatedAt]);
    CREATE INDEX [IX_ContactMessages_Email] ON [dbo].[ContactMessages]([Email]);
    PRINT 'Таблица ContactMessages создана успешно';
END
GO

PRINT 'Все таблицы созданы успешно!';
PRINT 'Всего таблиц: 10';
GO

