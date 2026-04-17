-- =============================================
-- Скрипт для ручной вставки данных в таблицу Events
-- =============================================

USE [VibeSiteDB]
GO

-- Очищаем таблицу Events перед вставкой (если нужно)
-- DELETE FROM [dbo].[Events];
-- GO

SET IDENTITY_INSERT [dbo].[Events] ON;
GO

-- Вставляем данные
INSERT INTO [dbo].[Events] 
    ([Id], [Title], [Image], [Date], [Time], [Location], [Address], [Price], [Category], [Description], [EventType], [Lineup], [IsFeatured])
VALUES
    -- Примечание: для события 1 некоторые поля имеют проблемы с кодировкой в CSV, используем значения по умолчанию
    (1, N'Три дня дождя', N'concert.jpg', '2025-05-17 00:00:00', N'19:00', N'Концертный зал', N'ул. Победителей, 1', N'100', N'Концерт', N'Описание концерта', N'concert', N'[]', 0),
    (2, N'Markul', N'placeholder.svg', '2025-10-10 00:00:00', N'18:00', N'Стадион Динамо', N'ул. Кирова 8, Минск, Минская область', N'От 120 BYN', N'Концерт', N'MDGA альбом', N'Концерт', N'["Markul"]', 1),
    (3, N'Pharaoh', N'placeholder.svg', '2025-09-12 00:00:00', N'19:00', N'Стадион Динамо', N'ул. Кирова 8, Минск, Минская область', N'От 165 BYN', N'Концерт', N'10:13', N'Концерт', N'["Pharaoh","Dead Dynasty"]', 1),
    (4, N'ЛСП', N'placeholder.svg', '2025-06-25 00:00:00', N'19:00', N'Prime Hall', N'пр-т. Победителей 65, Минск, Минская область', N'От 150 BYN', N'Концерт', N'', N'Концерт', N'["ЛСП","Специальный гость"]', 1),
    (5, N'Miyagi & Andy Panda', N'placeholder.svg', '2025-08-15 00:00:00', N'20:00', N'Minsk-Arena', N'пр-т. Победителей 111, Минск', N'От 200 BYN', N'Концерт', N'YAMAKASI TOUR', N'Концерт', N'["Miyagi","Andy Panda"]', 0),
    (6, N'Би-2', N'placeholder.svg', '2025-07-05 00:00:00', N'19:30', N'Дворец Республики', N'Октябрьская площадь 1, Минск', N'От 180 BYN', N'Концерт', N'Юбилейный тур', N'Концерт', N'["Би-2"]', 0),
    (7, N'Kai Angel & 9mice', N'placeholder.svg', '2026-01-22 00:00:00', N'20:00', N'Prime Hall', N'пр-т. Победителей 65, Минск', N'От 190 BYN', N'Концерт', N'Легендарная пара Kai Angel & 9mice со своим дебютным альбомом ''Heavy Metal 2''. Разрывает перепонки в Prime Hall''e. Приходите RR!', N'Концерт', N'["Kai Angel","9mice"]', 0),
    (8, N'Noize MC', N'placeholder.svg', '2025-09-30 00:00:00', N'19:00', N'КЗ ''Минск''', N'ул. Октябрьская 16, Минск', N'От 170 BYN', N'Концерт', N'Акустический концерт', N'Концерт', N'["Noize MC"]', 0);
GO

SET IDENTITY_INSERT [dbo].[Events] OFF;
GO

-- Проверяем результат
SELECT 
    [Id], 
    [Title], 
    [Image], 
    [Date], 
    [Location], 
    [IsFeatured],
    COUNT(*) OVER() AS TotalEvents
FROM [dbo].[Events]
WHERE [Id] BETWEEN 1 AND 8
ORDER BY [Id];
GO

PRINT 'Добавлено событий: ' + CAST(@@ROWCOUNT AS NVARCHAR(10));
PRINT 'Импорт завершен!';
GO

