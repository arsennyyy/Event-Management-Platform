-- =============================================
-- Скрипт для пометки миграций как примененных
-- Используйте этот скрипт, если таблицы уже созданы вручную
-- =============================================

USE [VibeSiteDB]
GO

-- Проверяем, существует ли таблица истории миграций
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[__EFMigrationsHistory]') AND type in (N'U'))
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] NVARCHAR(150) NOT NULL,
        [ProductVersion] NVARCHAR(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
    PRINT 'Таблица __EFMigrationsHistory создана';
END
GO

-- Добавляем записи о примененных миграциях
-- Старые миграции для SQLite (помечаем как примененные)
IF NOT EXISTS (SELECT 1 FROM [__EFMigrationsHistory] WHERE [MigrationId] = '20250513143648_InitialCreate')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES ('20250513143648_InitialCreate', '8.0.11');
    PRINT 'Миграция 20250513143648_InitialCreate помечена как примененная';
END
GO

IF NOT EXISTS (SELECT 1 FROM [__EFMigrationsHistory] WHERE [MigrationId] = '20250513190521_UpdateUserTicketModel')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES ('20250513190521_UpdateUserTicketModel', '8.0.11');
    PRINT 'Миграция 20250513190521_UpdateUserTicketModel помечена как примененная';
END
GO

IF NOT EXISTS (SELECT 1 FROM [__EFMigrationsHistory] WHERE [MigrationId] = '20250519190428_AddSeatsAndTickets')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES ('20250519190428_AddSeatsAndTickets', '8.0.11');
    PRINT 'Миграция 20250519190428_AddSeatsAndTickets помечена как примененная';
END
GO

-- Если есть миграция MigrateToSqlServer, тоже помечаем
IF NOT EXISTS (SELECT 1 FROM [__EFMigrationsHistory] WHERE [MigrationId] = '20251221090833_MigrateToSqlServer')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES ('20251221090833_MigrateToSqlServer', '8.0.11');
    PRINT 'Миграция 20251221090833_MigrateToSqlServer помечена как примененная';
END
GO

-- Показываем все примененные миграции
SELECT * FROM [__EFMigrationsHistory] ORDER BY [MigrationId];
GO

PRINT 'Готово! Теперь можно выполнить: dotnet ef database update';

