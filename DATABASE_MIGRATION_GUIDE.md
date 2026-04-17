# Инструкция по переносу базы данных SQL Server

## 📋 Подготовка

Перед началом убедитесь, что на обоих компьютерах установлен:
- **SQL Server Management Studio (SSMS)** или **SQL Server Express/LocalDB**
- Доступ к базе данных на исходном компьютере

---

## 🔄 Способ 1: Backup и Restore (Рекомендуемый)

Этот способ создает полную резервную копию базы данных и восстанавливает её на новом компьютере.

### На исходном компьютере (старый ноутбук):

#### Шаг 1: Создание Backup файла

1. Откройте **SQL Server Management Studio (SSMS)**
2. Подключитесь к вашему SQL Server:
   - **Server name:** `(localdb)\MSSQLLocalDB` (для LocalDB)
   - Или имя вашего SQL Server экземпляра
3. Разверните **Databases** → найдите базу данных **VibeSiteDB**
4. **Правой кнопкой** на базе данных → **Tasks** → **Back Up...**
5. В окне **Back Up Database**:
   - **Backup type:** Full
   - **Backup component:** Database
   - **Destination:** Нажмите **Remove** (если есть старые пути)
   - Нажмите **Add...** → выберите путь для сохранения (например: `C:\Backup\VibeSiteDB.bak`)
   - Нажмите **OK**
6. Нажмите **OK** для создания backup

**Альтернативно через SQL команду:**

```sql
BACKUP DATABASE VibeSiteDB
TO DISK = 'C:\Backup\VibeSiteDB.bak'
WITH FORMAT, COMPRESSION;
```

### На новом компьютере:

#### Шаг 2: Восстановление базы данных

1. Скопируйте файл `VibeSiteDB.bak` на новый компьютер (например, в `C:\Backup\`)
2. Откройте **SSMS** на новом компьютере
3. Подключитесь к SQL Server
4. **Правой кнопкой** на **Databases** → **Restore Database...**
5. В окне **Restore Database**:
   - **Source:** выберите **Device** → нажмите **...** (три точки)
   - Нажмите **Add...** → выберите файл `VibeSiteDB.bak`
   - Нажмите **OK**
   - **Destination:** Database name: `VibeSiteDB`
   - Перейдите на вкладку **Options**
   - Убедитесь, что пути к файлам корректны (если нужно, измените)
   - Нажмите **OK** для восстановления

**Альтернативно через SQL команду:**

```sql
RESTORE DATABASE VibeSiteDB
FROM DISK = 'C:\Backup\VibeSiteDB.bak'
WITH REPLACE, RECOVERY;
```

---

## 🔄 Способ 2: Генерация скриптов (Script Database)

Этот способ создает SQL скрипты для воссоздания структуры и данных.

### На исходном компьютере:

1. Откройте **SSMS**
2. Подключитесь к базе данных **VibeSiteDB**
3. **Правой кнопкой** на базе данных → **Tasks** → **Generate Scripts...**
4. В мастере **Generate and Publish Scripts**:
   - **Choose Objects:** выберите **Script entire database and all database objects**
   - Нажмите **Next**
   - **Set Scripting Options:**
     - **Save to file:** выберите путь (например: `C:\Backup\VibeSiteDB_Script.sql`)
     - **Advanced Scripting Options:**
       - **Types of data to script:** выберите **Schema and data** (важно!)
       - **Script Indexes:** True
       - **Script Foreign Keys:** True
   - Нажмите **Next** → **Next** → **Finish**

### На новом компьютере:

1. Скопируйте файл `VibeSiteDB_Script.sql` на новый компьютер
2. Откройте **SSMS** на новом компьютере
3. Подключитесь к SQL Server
4. Создайте новую базу данных (если её нет):
   ```sql
   CREATE DATABASE VibeSiteDB;
   ```
5. Откройте файл `VibeSiteDB_Script.sql` в SSMS
6. Убедитесь, что выбрана база данных **VibeSiteDB**
7. Нажмите **Execute** (F5) для выполнения скрипта

**Время выполнения:** зависит от размера данных (может занять несколько минут)

---

## 🔄 Способ 3: Экспорт/Импорт через SSMS (Export Data)

### На исходном компьютере:

1. Откройте **SSMS**
2. Подключитесь к базе данных **VibeSiteDB**
3. **Правой кнопкой** на базе данных → **Tasks** → **Export Data...**
4. В мастере **SQL Server Import and Export Wizard**:
   - **Data source:** SQL Server Native Client
   - **Server name:** ваш сервер
   - **Database:** VibeSiteDB
   - Нажмите **Next**
   - **Destination:** Flat File Destination
   - **File name:** `C:\Backup\VibeSiteDB_Export.txt`
   - Нажмите **Next**
   - Выберите таблицы для экспорта (или все)
   - Нажмите **Next** → **Next** → **Finish**

### На новом компьютере:

1. Создайте базу данных **VibeSiteDB** (если её нет)
2. Примените миграции:
   ```bash
   cd MyMvcBackend
   dotnet ef database update
   ```
3. Используйте **Import Data** для импорта данных обратно

---

## 🔄 Способ 4: Использование Entity Framework Migrations (Автоматический)

Если структура БД управляется через миграции EF Core:

### На новом компьютере:

1. Убедитесь, что проект скопирован и зависимости установлены
2. Откройте терминал в папке `MyMvcBackend`
3. Примените все миграции:
   ```bash
   dotnet ef database update
   ```
4. Это создаст структуру базы данных автоматически
5. Затем импортируйте данные одним из способов выше

**Примечание:** Этот способ создаст только структуру, данные нужно импортировать отдельно.

---

## 📝 Проверка после переноса

После переноса базы данных проверьте:

1. **Подключение к базе данных:**
   ```sql
   USE VibeSiteDB;
   SELECT COUNT(*) FROM Users;
   SELECT COUNT(*) FROM Events;
   SELECT COUNT(*) FROM Orders;
   ```

2. **Проверка данных:**
   ```sql
   -- Проверка пользователей
   SELECT * FROM Users;
   
   -- Проверка событий
   SELECT * FROM Events;
   
   -- Проверка заказов
   SELECT * FROM Orders;
   ```

3. **Обновите строку подключения** в `MyMvcBackend/appsettings.json`:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=(localdb)\\MSSQLLocalDB;Database=VibeSiteDB;Trusted_Connection=True;TrustServerCertificate=True;"
   }
   ```

4. **Запустите проект** и проверьте, что данные отображаются корректно

---

## ⚠️ Важные замечания

1. **Размер файла:** Backup файлы могут быть большими. Убедитесь, что есть место на диске.

2. **Версии SQL Server:** Старайтесь использовать одинаковые версии SQL Server на обоих компьютерах, или более новую версию на целевом компьютере.

3. **Права доступа:** Убедитесь, что у пользователя SQL Server есть права на создание и восстановление баз данных.

4. **Локальные пути:** Если используете LocalDB, пути могут отличаться. Проверьте строку подключения.

5. **Резервное копирование:** Всегда делайте backup перед переносом!

---

## 🚀 Быстрая команда для создания Backup

Создайте файл `backup-database.sql`:

```sql
-- Создание папки для backup (если её нет)
-- В SSMS выполните эту команду

BACKUP DATABASE VibeSiteDB
TO DISK = 'C:\Backup\VibeSiteDB_' + CONVERT(VARCHAR(20), GETDATE(), 112) + '.bak'
WITH FORMAT, COMPRESSION, INIT;

PRINT 'Backup created successfully!';
```

Выполните этот скрипт в SSMS для автоматического создания backup с датой в имени файла.

---

## 📞 Дополнительная помощь

Если возникли проблемы:

1. Проверьте логи SQL Server
2. Убедитесь, что SQL Server запущен
3. Проверьте права доступа к файлам
4. Убедитесь, что версии SQL Server совместимы
