# Подробная инструкция по миграции из SQLite в SQL Server Management Studio 2021

## 📋 Содержание
1. [Обзор таблиц](#обзор-таблиц)
2. [Подготовка к миграции](#подготовка-к-миграции)
3. [Экспорт данных из SQLite](#экспорт-данных-из-sqlite)
4. [Создание базы данных в SQL Server](#создание-базы-данных-в-sql-server)
5. [Импорт данных в SQL Server](#импорт-данных-в-sql-server)
6. [Обновление приложения](#обновление-приложения)
7. [Проверка миграции](#проверка-миграции)

---

## 📊 Обзор таблиц

### Существующие таблицы (5):
1. **Users** - Пользователи системы
2. **Events** - События/мероприятия
3. **TicketTypes** - Типы билетов для событий
4. **Seats** - Места в зале
5. **UserTickets** - Билеты пользователей

### Новые таблицы (5):
6. **Orders** - Заказы (группирует билеты в один заказ)
7. **Payments** - Платежи (отслеживание всех платежей)
8. **Reviews** - Отзывы о событиях
9. **Notifications** - Уведомления для пользователей
10. **ContactMessages** - Сообщения из формы обратной связи

**Итого: 10 таблиц**

---

## 🔧 Подготовка к миграции

### Шаг 1: Установка необходимых инструментов

1. **SQL Server Management Studio (SSMS) 2021** - уже установлен
2. **SQLite Browser** или **DB Browser for SQLite** - для просмотра и экспорта данных
   - Скачать: https://sqlitebrowser.org/
3. **SQL Server** - должен быть установлен и запущен

### Шаг 2: Резервное копирование

**ВАЖНО!** Создайте резервную копию файла `app.db`:
- Скопируйте файл `MyMvcBackend/app.db` в безопасное место
- Также скопируйте файлы `app.db-shm` и `app.db-wal` если они существуют

---

## 📤 Экспорт данных из SQLite

### Вариант 1: Использование DB Browser for SQLite (Рекомендуется)

1. Откройте **DB Browser for SQLite**
2. Нажмите **File → Open Database**
3. Выберите файл `MyMvcBackend/app.db`
4. Перейдите на вкладку **Execute SQL**
5. Выполните SQL-скрипт из файла `export_sqlite_data.sql` (будет создан ниже)
6. Сохраните результаты экспорта

### Вариант 2: Использование командной строки

Откройте PowerShell в папке `MyMvcBackend` и выполните:

```powershell
# Установите SQLite CLI если его нет
# Скачайте с https://www.sqlite.org/download.html

# Экспорт структуры и данных
sqlite3 app.db .schema > schema_export.sql
sqlite3 app.db .dump > data_export.sql
```

### Вариант 3: Использование Python скрипта

Создайте файл `export_sqlite.py` в корне проекта (см. файл ниже)

---

## 🗄️ Создание базы данных в SQL Server

### Шаг 1: Подключение к SQL Server

1. Запустите **SQL Server Management Studio**
2. Подключитесь к вашему SQL Server instance:
   - **Server name**: `localhost` или `localhost\SQLEXPRESS` (для Express версии)
   - **Authentication**: Windows Authentication или SQL Server Authentication
3. Нажмите **Connect**

### Шаг 2: Создание новой базы данных

1. В **Object Explorer** правой кнопкой на **Databases** → **New Database...**
2. Введите имя базы данных: `VibeSiteDB` (или другое на ваше усмотрение)
3. Нажмите **OK**

### Шаг 3: Создание таблиц

1. В **Object Explorer** разверните вашу базу данных
2. Правой кнопкой на **Tables** → **New Table...**
3. Или выполните SQL-скрипт из файла `create_sql_server_tables.sql` (будет создан ниже)

---

## 📥 Импорт данных в SQL Server

### Шаг 1: Преобразование данных

SQLite и SQL Server имеют различия в типах данных:
- `INTEGER` → `INT` или `BIGINT`
- `TEXT` → `NVARCHAR(MAX)` или `NVARCHAR(n)`
- `REAL` → `DECIMAL` или `FLOAT`
- `BLOB` → `VARBINARY(MAX)`

### Шаг 2: Импорт через SSMS

1. Откройте **SQL Server Management Studio**
2. Подключитесь к вашей базе данных
3. Откройте **File → Open → File...**
4. Выберите файл `import_data_to_sqlserver.sql` (будет создан ниже)
5. Нажмите **Execute** (F5)

### Шаг 3: Проверка данных

Выполните запросы для проверки:

```sql
-- Проверка количества записей в каждой таблице
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

---

## 🔄 Обновление приложения

### Шаг 1: Обновление строки подключения

Откройте файл `MyMvcBackend/appsettings.json` и измените:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=VibeSiteDB;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

Или для SQL Server Authentication:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=VibeSiteDB;User Id=your_username;Password=your_password;TrustServerCertificate=True;"
  }
}
```

### Шаг 2: Установка пакета SQL Server

Откройте терминал в папке `MyMvcBackend` и выполните:

```powershell
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
```

### Шаг 3: Обновление Program.cs

Откройте `MyMvcBackend/Program.cs` и измените:

**Было:**
```csharp
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));
```

**Стало:**
```csharp
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
```

### Шаг 4: Создание новой миграции

```powershell
cd MyMvcBackend
dotnet ef migrations add MigrateToSqlServer
dotnet ef database update
```

**Примечание:** Если у вас уже есть данные в SQL Server, можно пропустить `database update` или использовать `--no-build` флаг.

---

## ✅ Проверка миграции

### Шаг 1: Проверка подключения

Запустите приложение:

```powershell
cd MyMvcBackend
dotnet run
```

Проверьте, что нет ошибок подключения к базе данных.

### Шаг 2: Проверка данных

1. Откройте **SQL Server Management Studio**
2. Выполните запросы для проверки данных
3. Убедитесь, что все таблицы созданы и содержат данные

### Шаг 3: Тестирование функционала

1. Запустите фронтенд: `cd MyFront && npm run dev`
2. Проверьте основные функции:
   - Регистрация/Вход
   - Просмотр событий
   - Покупка билетов
   - Просмотр профиля

---

## 🆘 Решение проблем

### Проблема 1: Ошибка подключения

**Ошибка:** "Cannot open database"

**Решение:**
- Проверьте, что SQL Server запущен
- Проверьте имя базы данных в строке подключения
- Проверьте права доступа пользователя

### Проблема 2: Ошибка типов данных

**Ошибка:** "Conversion failed"

**Решение:**
- Проверьте соответствие типов данных в скриптах миграции
- Убедитесь, что даты в правильном формате

### Проблема 3: Проблемы с внешними ключами

**Ошибка:** "Foreign key constraint"

**Решение:**
- Импортируйте данные в правильном порядке (сначала родительские таблицы)
- Проверьте, что все внешние ключи существуют

---

## 📝 Дополнительные замечания

1. **Индексы**: После импорта данных создайте индексы для улучшения производительности
2. **Резервное копирование**: Регулярно создавайте резервные копии SQL Server базы данных
3. **Производительность**: SQL Server обычно работает быстрее SQLite для больших объемов данных
4. **Безопасность**: Настройте правильные права доступа для пользователей базы данных

---

## 📞 Поддержка

Если возникнут проблемы, проверьте:
- Логи приложения
- SQL Server Error Log
- Event Viewer Windows

