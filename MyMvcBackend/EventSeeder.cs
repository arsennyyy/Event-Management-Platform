using System;
using System.Collections.Generic;
using System.Linq;
using MyMvcBackend.Data;
using MyMvcBackend.Models;

namespace MyMvcBackend
{
    public static class EventSeeder
    {
        public static void SeedEvents(ApplicationDbContext context)
        {
            var events = new List<Event>
            {
                new Event {
                    Title = "Markul",
                    Image = "",
                    Date = new DateTime(2025, 10, 10),
                    Time = "18:00",
                    Location = "Стадион Динамо",
                    Address = "ул. Кирова 8, Минск, Минская область",
                    Price = "От 120 BYN",
                    Category = "Концерт",
                    Description = "MDGA альбом",
                    EventType = "Концерт",
                    Lineup = "[\"Markul\"]",
                    IsFeatured = true
                },
                new Event {
                    Title = "Pharaoh",
                    Image = "",
                    Date = new DateTime(2025, 9, 12),
                    Time = "19:00",
                    Location = "Стадион Динамо",
                    Address = "ул. Кирова 8, Минск, Минская область",
                    Price = "От 165 BYN",
                    Category = "Концерт",
                    Description = "10:13",
                    EventType = "Концерт",
                    Lineup = "[\"Pharaoh\",\"Dead Dynasty\"]",
                    IsFeatured = true
                },
                new Event {
                    Title = "ЛСП",
                    Image = "",
                    Date = new DateTime(2025, 6, 25),
                    Time = "19:00",
                    Location = "Prime Hall",
                    Address = "пр-т. Победителей 65, Минск, Минская область",
                    Price = "От 150 BYN",
                    Category = "Концерт",
                    Description = "",
                    EventType = "Концерт",
                    Lineup = "[\"ЛСП\",\"Специальный гость\"]",
                    IsFeatured = true
                },
                new Event {
                    Title = "Miyagi & Andy Panda",
                    Image = "",
                    Date = new DateTime(2025, 8, 15),
                    Time = "20:00",
                    Location = "Minsk-Arena",
                    Address = "пр-т. Победителей 111, Минск",
                    Price = "От 200 BYN",
                    Category = "Концерт",
                    Description = "YAMAKASI TOUR",
                    EventType = "Концерт",
                    Lineup = "[\"Miyagi\",\"Andy Panda\"]",
                    IsFeatured = false
                },
                new Event {
                    Title = "Би-2",
                    Image = "",
                    Date = new DateTime(2025, 7, 5),
                    Time = "19:30",
                    Location = "Дворец Республики",
                    Address = "Октябрьская площадь 1, Минск",
                    Price = "От 180 BYN",
                    Category = "Концерт",
                    Description = "Юбилейный тур",
                    EventType = "Концерт",
                    Lineup = "[\"Би-2\"]",
                    IsFeatured = false
                },
                new Event {
                    Title = "Kai Angel & 9mice",
                    Image = "",
                    Date = new DateTime(2026, 1, 22),
                    Time = "20:00",
                    Location = "Prime Hall",
                    Address = "пр-т. Победителей 65, Минск",
                    Price = "От 190 BYN",
                    Category = "Концерт",
                    Description = "Легендарная пара Kai Angel & 9mice со своим дебютным альбомом 'Heavy Metal 2'. Разрывает перепонки в Prime Hall'e. Приходите RR!",
                    EventType = "Концерт",
                    Lineup = "[\"Kai Angel\",\"9mice\"]",
                    IsFeatured = false
                },
                new Event {
                    Title = "Noize MC",
                    Image = "",
                    Date = new DateTime(2025, 9, 30),
                    Time = "19:00",
                    Location = "КЗ 'Минск'",
                    Address = "ул. Октябрьская 16, Минск",
                    Price = "От 170 BYN",
                    Category = "Концерт",
                    Description = "Акустический концерт",
                    EventType = "Концерт",
                    Lineup = "[\"Noize MC\"]",
                    IsFeatured = false
                }
            };

            foreach (var ev in events)
            {
                bool exists = context.Events.Any(e => e.Title == ev.Title && e.Date == ev.Date);
                if (!exists)
                {
                    context.Events.Add(ev);
                }
            }
            context.SaveChanges();

            // Создаем админ-пользователя если его нет
            var adminEmail = "admin@admin.com";
            if (!context.Users.Any(u => u.Email == adminEmail))
            {
                var admin = new User
                {
                    Name = "Администратор",
                    Email = adminEmail,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin4975728"),
                    EmailVerified = true,
                    IsAdmin = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                context.Users.Add(admin);
                context.SaveChanges();
            }
            else
            {
                // Обновляем пароль существующего админа
                var existingAdmin = context.Users.FirstOrDefault(u => u.Email == adminEmail);
                if (existingAdmin != null && existingAdmin.IsAdmin)
                {
                    existingAdmin.PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin4975728");
                    existingAdmin.UpdatedAt = DateTime.UtcNow;
                    context.SaveChanges();
                }
            }
        }
    }
} 