"""
Python скрипт для экспорта данных из SQLite в формат, удобный для импорта в SQL Server
Требует: pip install sqlite3 (встроен в Python) и pandas (опционально)
"""

import sqlite3
import csv
import json
from datetime import datetime

# Путь к файлу SQLite базы данных
DB_PATH = 'app.db'

# Подключение к SQLite
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

def export_table_to_csv(table_name, filename):
    """Экспортирует таблицу в CSV файл"""
    cursor.execute(f"SELECT * FROM {table_name}")
    rows = cursor.fetchall()
    
    # Получаем названия колонок
    column_names = [description[0] for description in cursor.description]
    
    # Записываем в CSV
    with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(column_names)
        writer.writerows(rows)
    
    print(f"Экспортировано {len(rows)} записей из таблицы {table_name} в {filename}")

def export_table_to_sql_insert(table_name, filename):
    """Экспортирует таблицу в SQL INSERT скрипт"""
    cursor.execute(f"SELECT * FROM {table_name}")
    rows = cursor.fetchall()
    
    # Получаем названия колонок
    column_names = [description[0] for description in cursor.description]
    
    # Получаем информацию о типах колонок
    cursor.execute(f"PRAGMA table_info({table_name})")
    columns_info = cursor.fetchall()
    
    with open(filename, 'w', encoding='utf-8') as sqlfile:
        sqlfile.write(f"-- Экспорт данных из таблицы {table_name}\n")
        sqlfile.write(f"-- Дата экспорта: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
        
        for row in rows:
            values = []
            for i, value in enumerate(row):
                col_type = columns_info[i][2].upper()
                
                if value is None:
                    values.append('NULL')
                elif 'INT' in col_type:
                    values.append(str(value))
                elif 'TEXT' in col_type or 'VARCHAR' in col_type:
                    # Экранируем одинарные кавычки
                    escaped_value = str(value).replace("'", "''")
                    values.append(f"N'{escaped_value}'")
                elif 'REAL' in col_type or 'DECIMAL' in col_type or 'NUMERIC' in col_type:
                    values.append(str(value))
                elif 'DATETIME' in col_type or 'DATE' in col_type:
                    if isinstance(value, str):
                        values.append(f"'{value}'")
                    else:
                        values.append(f"'{value}'")
                else:
                    escaped_value = str(value).replace("'", "''")
                    values.append(f"N'{escaped_value}'")
            
            columns_str = ', '.join([f'[{col}]' for col in column_names])
            values_str = ', '.join(values)
            
            sqlfile.write(f"INSERT INTO [dbo].[{table_name}] ({columns_str}) VALUES ({values_str});\n")
    
    print(f"Создан SQL скрипт для таблицы {table_name}: {filename}")

def get_table_count(table_name):
    """Возвращает количество записей в таблице"""
    cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
    return cursor.fetchone()[0]

# Список таблиц для экспорта
tables = ['Users', 'Events', 'TicketTypes', 'Seats', 'UserTickets']

print("=" * 60)
print("Экспорт данных из SQLite")
print("=" * 60)
print()

# Показываем статистику
print("Статистика по таблицам:")
print("-" * 60)
for table in tables:
    count = get_table_count(table)
    print(f"{table:20} : {count:5} записей")
print()

# Экспорт в CSV
print("Экспорт в CSV формат:")
print("-" * 60)
for table in tables:
    export_table_to_csv(table, f"{table.lower()}_export.csv")
print()

# Экспорт в SQL INSERT скрипты
print("Экспорт в SQL INSERT скрипты:")
print("-" * 60)
for table in tables:
    export_table_to_sql_insert(table, f"{table.lower()}_insert.sql")
print()

# Создаем общий SQL скрипт
print("Создание общего SQL скрипта...")
with open('all_data_insert.sql', 'w', encoding='utf-8') as all_sql:
    all_sql.write("-- =============================================\n")
    all_sql.write("-- Общий скрипт импорта данных в SQL Server\n")
    all_sql.write(f"-- Дата создания: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
    all_sql.write("-- =============================================\n\n")
    all_sql.write("USE [VibeSiteDB]\nGO\n\n")
    
    for table in tables:
        all_sql.write(f"-- Импорт данных в таблицу {table}\n")
        with open(f"{table.lower()}_insert.sql", 'r', encoding='utf-8') as table_sql:
            # Пропускаем первые 2 строки (комментарии)
            lines = table_sql.readlines()[2:]
            all_sql.writelines(lines)
        all_sql.write("\nGO\n\n")

print("Создан общий SQL скрипт: all_data_insert.sql")
print()

print("=" * 60)
print("Экспорт завершен!")
print("=" * 60)
print()
print("Созданные файлы:")
print("  - CSV файлы: users_export.csv, events_export.csv, и т.д.")
print("  - SQL скрипты: users_insert.sql, events_insert.sql, и т.д.")
print("  - Общий скрипт: all_data_insert.sql")
print()
print("Следующие шаги:")
print("  1. Откройте SQL Server Management Studio")
print("  2. Выполните скрипт create_sql_server_tables.sql для создания таблиц")
print("  3. Выполните скрипт all_data_insert.sql для импорта данных")
print("  4. Или используйте BULK INSERT для импорта из CSV файлов")

# Закрываем соединение
conn.close()

