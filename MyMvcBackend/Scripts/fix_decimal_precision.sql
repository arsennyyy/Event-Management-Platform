-- =============================================
-- Скрипт для обновления precision для decimal полей
-- =============================================

USE [VibeSiteDB]
GO

-- Обновляем precision для таблицы Orders
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
           WHERE TABLE_NAME = 'Orders' AND COLUMN_NAME = 'TotalAmount')
BEGIN
    ALTER TABLE [dbo].[Orders]
    ALTER COLUMN [TotalAmount] DECIMAL(18,2) NOT NULL;
    PRINT 'Обновлена точность для Orders.TotalAmount';
END
GO

-- Обновляем precision для таблицы Payments
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
           WHERE TABLE_NAME = 'Payments' AND COLUMN_NAME = 'Amount')
BEGIN
    ALTER TABLE [dbo].[Payments]
    ALTER COLUMN [Amount] DECIMAL(18,2) NOT NULL;
    PRINT 'Обновлена точность для Payments.Amount';
END
GO

-- Обновляем precision для таблицы Seats
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
           WHERE TABLE_NAME = 'Seats' AND COLUMN_NAME = 'Price')
BEGIN
    ALTER TABLE [dbo].[Seats]
    ALTER COLUMN [Price] DECIMAL(18,2) NOT NULL;
    PRINT 'Обновлена точность для Seats.Price';
END
GO

-- Обновляем precision для таблицы TicketTypes
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
           WHERE TABLE_NAME = 'TicketTypes' AND COLUMN_NAME = 'Price')
BEGIN
    ALTER TABLE [dbo].[TicketTypes]
    ALTER COLUMN [Price] DECIMAL(18,2) NOT NULL;
    PRINT 'Обновлена точность для TicketTypes.Price';
END
GO

-- Обновляем precision для таблицы UserTickets
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
           WHERE TABLE_NAME = 'UserTickets' AND COLUMN_NAME = 'Price')
BEGIN
    ALTER TABLE [dbo].[UserTickets]
    ALTER COLUMN [Price] DECIMAL(18,2) NOT NULL;
    PRINT 'Обновлена точность для UserTickets.Price';
END
GO

PRINT 'Все decimal поля обновлены!';
GO

