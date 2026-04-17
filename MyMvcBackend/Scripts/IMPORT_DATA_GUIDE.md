# Инструкция по экспорту и импорту данных

## 📤 ШАГ 1: Экспорт из SQLite

### В DB Browser for SQLite:

1. **Откройте базу данных** `app.db`

2. **Экспортируйте каждую таблицу по отдельности:**

   **Таблица Users:**
   - File → Export → Table(s) as CSV file
   - Выберите таблицу `Users`
   - Сохраните как `users_export.csv`
   - ✅ Включите "Column names in the first row"
   - Разделитель: `,` (запятая)

   **Таблица Events:**
   - File → Export → Table(s) as CSV file
   - Выберите таблицу `Events`
   - Сохраните как `events_export.csv`
   - ✅ Включите "Column names in the first row"

   **Таблица TicketTypes:**
   - File → Export → Table(s) as CSV file
   - Выберите таблицу `TicketTypes`
   - Сохраните как `tickettypes_export.csv`
   - ✅ Включите "Column names in the first row"

   **Таблица Seats:**
   - File → Export → Table(s) as CSV file
   - Выберите таблицу `Seats`
   - Сохраните как `seats_export.csv`
   - ✅ Включите "Column names in the first row"

   **Таблица UserTickets:**
   - File → Export → Table(s) as CSV file
   - Выберите таблицу `UserTickets`
   - Сохраните как `usertickets_export.csv`
   - ✅ Включите "Column names in the first row"

3. **Сохраните все CSV файлы** в папку `MyMvcBackend/Scripts/ExportedData/`

---

## 📥 ШАГ 2: Импорт в SQL Server

### Вариант 1: Через SQL Server Management Studio (SSMS)

1. **Откройте SSMS** и подключитесь к `(localdb)\MSSQLLocalDB`

2. **Выберите базу данных** `VibeSiteDB`

3. **Импортируйте данные в правильном порядке:**

   **⚠️ ВАЖНО: Импортируйте в таком порядке:**
   1. Users (сначала родительские таблицы)
   2. Events
   3. TicketTypes (зависит от Events)
   4. Seats (зависит от Events и Users)
   5. UserTickets (зависит от Users, Events и Seats)

4. **Для каждой таблицы:**
   - Правой кнопкой на таблицу → Tasks → Import Data...
   - Data source: Flat File Source
   - Выберите соответствующий CSV файл
   - Destination: SQL Server Native Client
   - Database: VibeSiteDB
   - Table: [dbo].[TableName]
   - Нажмите Next и следуйте инструкциям

### Вариант 2: Через SQL скрипт (BULK INSERT)

Используйте скрипт `bulk_import_data.sql` (будет создан ниже)

---

## ⚠️ ВАЖНЫЕ ЗАМЕЧАНИЯ

1. **Порядок импорта критичен** - сначала родительские таблицы (Users, Events), затем дочерние
2. **Проверьте типы данных** - даты могут быть в формате TEXT в SQLite, их нужно преобразовать
3. **Внешние ключи** - убедитесь, что все ID существуют в родительских таблицах
4. **Id колонки** - в SQL Server они IDENTITY, поэтому нужно либо:
   - Отключить IDENTITY_INSERT перед импортом
   - Или не импортировать колонку Id и позволить SQL Server создать новые ID

---

## 🔍 Проверка после импорта

Выполните в SSMS:

```sql
USE [VibeSiteDB]
GO

SELECT 'Users' AS TableName, COUNT(*) AS RecordCount FROM Users
UNION ALL
SELECT 'Events', COUNT(*) FROM Events
UNION ALL
SELECT 'TicketTypes', COUNT(*) FROM TicketTypes
UNION ALL
SELECT 'Seats', COUNT(*) FROM Seats
UNION ALL
SELECT 'UserTickets', COUNT(*) FROM UserTickets;
```

