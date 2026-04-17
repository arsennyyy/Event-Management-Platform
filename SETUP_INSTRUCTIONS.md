# Инструкция по установке проекта на новый компьютер

## 📋 Требования

Перед началом установки убедитесь, что на новом компьютере установлены:

1. **Node.js** (версия 18.0 или выше)
   - Скачать: https://nodejs.org/
   - Проверить установку: `node --version`

2. **.NET SDK** (версия 8.0 или выше)
   - Скачать: https://dotnet.microsoft.com/download/dotnet/8.0
   - Проверить установку: `dotnet --version`

3. **SQL Server** (SQL Server 2019 Express или выше, или LocalDB)
   - Скачать: https://www.microsoft.com/sql-server/sql-server-downloads
   - Или SQL Server Management Studio (SSMS): https://aka.ms/ssmsfullsetup

4. **Git** (опционально, если используете Git)
   - Скачать: https://git-scm.com/downloads

---

## 🚀 Установка зависимостей проекта

### Шаг 1: Копирование проекта

Скопируйте всю папку проекта `+Vibe_site` на новый компьютер.

### Шаг 2: Установка зависимостей Frontend (React)

Откройте терминал/командную строку и выполните:

```bash
# Перейдите в папку фронтенда
cd MyFront

# Установите все зависимости
npm install

# Или если используете yarn
yarn install

# Или если используете pnpm
pnpm install
```

**Ожидаемое время:** 2-5 минут (зависит от скорости интернета)

### Шаг 3: Установка зависимостей Backend (.NET)

Откройте терминал/командную строку и выполните:

```bash
# Перейдите в папку бэкенда
cd MyMvcBackend

# Восстановите все NuGet пакеты
dotnet restore

# Соберите проект (опционально, для проверки)
dotnet build
```

**Ожидаемое время:** 1-3 минуты

### Шаг 4: Настройка базы данных

См. раздел **"Перенос базы данных"** ниже.

### Шаг 5: Запуск проекта

**Запуск Backend:**

```bash
# В папке MyMvcBackend
cd MyMvcBackend

# Запустите сервер
dotnet run

# Сервер запустится на http://localhost:5064
```

**Запуск Frontend:**

```bash
# В папке MyFront (в новом терминале)
cd MyFront

# Запустите dev-сервер
npm run dev

# Или
yarn dev

# Или
pnpm dev

# Сервер запустится на http://localhost:5173
```

---

## 📦 Альтернативный способ: Установка через package-lock.json

Если у вас есть `package-lock.json` или `yarn.lock`, зависимости установятся автоматически с теми же версиями:

```bash
# В папке MyFront
npm ci

# Или
yarn install --frozen-lockfile
```

---

## 🔍 Проверка установки

После установки проверьте:

1. **Frontend зависимости:**
   ```bash
   cd MyFront
   npm list --depth=0
   ```

2. **Backend зависимости:**
   ```bash
   cd MyMvcBackend
   dotnet list package
   ```

3. **Запуск проекта:**
   - Backend должен запуститься без ошибок
   - Frontend должен открыться в браузере на `http://localhost:5173`

---

## ⚠️ Возможные проблемы

### Проблема: npm install не работает
**Решение:**
```bash
# Очистите кэш npm
npm cache clean --force

# Удалите папку node_modules и package-lock.json
rm -rf node_modules package-lock.json

# Установите заново
npm install
```

### Проблема: dotnet restore не работает
**Решение:**
```bash
# Очистите кэш NuGet
dotnet nuget locals all --clear

# Восстановите заново
dotnet restore
```

### Проблема: Ошибки при сборке
**Решение:**
- Убедитесь, что установлена правильная версия .NET SDK (8.0+)
- Проверьте, что все пути к файлам корректны
- Убедитесь, что SQL Server запущен

---

## 📝 Быстрая команда для установки всего

Создайте файл `install-all.bat` (Windows) или `install-all.sh` (Linux/Mac):

**Windows (install-all.bat):**
```batch
@echo off
echo Installing Frontend dependencies...
cd MyFront
call npm install
cd ..

echo Installing Backend dependencies...
cd MyMvcBackend
call dotnet restore
cd ..

echo Installation complete!
pause
```

**Linux/Mac (install-all.sh):**
```bash
#!/bin/bash
echo "Installing Frontend dependencies..."
cd MyFront
npm install
cd ..

echo "Installing Backend dependencies..."
cd MyMvcBackend
dotnet restore
cd ..

echo "Installation complete!"
```

Запустите файл для автоматической установки всех зависимостей.
