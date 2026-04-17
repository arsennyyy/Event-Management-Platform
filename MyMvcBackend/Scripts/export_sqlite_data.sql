-- =============================================
-- SQL скрипт для экспорта данных из SQLite
-- Используйте этот скрипт в DB Browser for SQLite
-- =============================================

-- Экспорт данных из таблицы Users
.mode csv
.headers on
.output users_export.csv
SELECT * FROM Users;

-- Экспорт данных из таблицы Events
.output events_export.csv
SELECT * FROM Events;

-- Экспорт данных из таблицы TicketTypes
.output tickettypes_export.csv
SELECT * FROM TicketTypes;

-- Экспорт данных из таблицы Seats
.output seats_export.csv
SELECT * FROM Seats;

-- Экспорт данных из таблицы UserTickets
.output usertickets_export.csv
SELECT * FROM UserTickets;

-- Возврат к обычному выводу
.output stdout
.mode column

-- Показать количество записей в каждой таблице
SELECT 'Users' AS TableName, COUNT(*) AS RecordCount FROM Users
UNION ALL
SELECT 'Events', COUNT(*) FROM Events
UNION ALL
SELECT 'TicketTypes', COUNT(*) FROM TicketTypes
UNION ALL
SELECT 'Seats', COUNT(*) FROM Seats
UNION ALL
SELECT 'UserTickets', COUNT(*) FROM UserTickets;

