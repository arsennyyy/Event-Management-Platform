# 🚀 Быстрые команды для установки и переноса проекта

## 📦 Установка зависимостей

### Frontend (React)
```bash
cd MyFront
npm install
```

### Backend (.NET)
```bash
cd MyMvcBackend
dotnet restore
```

### Все сразу (Windows)
```bash
cd MyFront && npm install && cd ../MyMvcBackend && dotnet restore
```

---

## 🗄️ База данных - Backup (на старом компьютере)

### Через SSMS GUI:
1. SSMS → Databases → VibeSiteDB → Tasks → Back Up...
2. Выберите путь: `C:\Backup\VibeSiteDB.bak`
3. OK

### Через SQL команду:
```sql
BACKUP DATABASE VibeSiteDB
TO DISK = 'C:\Backup\VibeSiteDB.bak'
WITH FORMAT, COMPRESSION;
```

---

## 🔄 База данных - Restore (на новом компьютере)

### Через SSMS GUI:
1. SSMS → Databases → Restore Database...
2. Device → Add → выберите `VibeSiteDB.bak`
3. Database name: `VibeSiteDB`
4. OK

### Через SQL команду:
```sql
RESTORE DATABASE VibeSiteDB
FROM DISK = 'C:\Backup\VibeSiteDB.bak'
WITH REPLACE, RECOVERY;
```

---

## 🏃 Запуск проекта

### Backend:
```bash
cd MyMvcBackend
dotnet run
```
→ Запустится на http://localhost:5064

### Frontend:
```bash
cd MyFront
npm run dev
```
→ Запустится на http://localhost:5173

---

## ✅ Проверка установки

### Проверить Node.js:
```bash
node --version
npm --version
```

### Проверить .NET:
```bash
dotnet --version
```

### Проверить зависимости Frontend:
```bash
cd MyFront
npm list --depth=0
```

### Проверить зависимости Backend:
```bash
cd MyMvcBackend
dotnet list package
```

### Проверить базу данных:
```sql
USE VibeSiteDB;
SELECT COUNT(*) FROM Users;
SELECT COUNT(*) FROM Events;
```

---

## 🔧 Применение миграций (если нужно)

```bash
cd MyMvcBackend
dotnet ef database update
```

---

## 📝 Полная последовательность действий на новом компьютере

```bash
# 1. Установка Frontend зависимостей
cd MyFront
npm install

# 2. Установка Backend зависимостей
cd ../MyMvcBackend
dotnet restore

# 3. Восстановление базы данных (через SSMS или SQL команду выше)

# 4. Применение миграций (если нужно)
dotnet ef database update

# 5. Запуск Backend (в одном терминале)
dotnet run

# 6. Запуск Frontend (в другом терминале)
cd ../MyFront
npm run dev
```

---

## ⚠️ Если что-то не работает

### Очистка кэша npm:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Очистка кэша NuGet:
```bash
dotnet nuget locals all --clear
dotnet restore
```

### Пересборка проекта:
```bash
cd MyMvcBackend
dotnet clean
dotnet build
```
