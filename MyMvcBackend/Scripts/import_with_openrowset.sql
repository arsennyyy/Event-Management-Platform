-- =============================================
-- Альтернативный способ импорта через OPENROWSET
-- Работает если включен Ad Hoc Distributed Queries
-- =============================================

USE [VibeSiteDB]
GO

-- Включаем Ad Hoc Distributed Queries (если нужно)
EXEC sp_configure 'show advanced options', 1;
RECONFIGURE;
EXEC sp_configure 'Ad Hoc Distributed Queries', 1;
RECONFIGURE;
GO

-- =============================================
-- Импорт Users
-- =============================================
SET IDENTITY_INSERT [dbo].[Users] ON;
GO

INSERT INTO [dbo].[Users] ([Id], [Name], [Email], [PasswordHash], [EmailVerified], [VerificationToken], [TokenExpiresAt], [CreatedAt], [UpdatedAt])
SELECT 
    CAST([Id] AS INT),
    [Name],
    [Email],
    [PasswordHash],
    CAST([EmailVerified] AS BIT),
    [VerificationToken],
    CASE 
        WHEN [TokenExpiresAt] IS NULL OR [TokenExpiresAt] = '' THEN NULL
        ELSE CAST([TokenExpiresAt] AS DATETIME2)
    END,
    CAST([CreatedAt] AS DATETIME2),
    CAST([UpdatedAt] AS DATETIME2)
FROM OPENROWSET(
    'Microsoft.ACE.OLEDB.12.0',
    'Text;Database=D:\+Vibe_site\MyMvcBackend\Scripts\ExportedData\;HDR=YES;FMT=Delimited',
    'SELECT * FROM users_export.csv'
);
GO

SET IDENTITY_INSERT [dbo].[Users] OFF;
GO

-- Аналогично для других таблиц...

PRINT 'Импорт завершен!';
GO

