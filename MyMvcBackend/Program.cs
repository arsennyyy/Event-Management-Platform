using Microsoft.EntityFrameworkCore;
using MyMvcBackend.Data;
using MyMvcBackend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// =============================================
// ПОДКЛЮЧЕНИЕ К POSTGRESQL
// =============================================

// Добавляем сервисы с PostgreSQL
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = null;
    });

// Настройка CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Configure JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"];
if (string.IsNullOrEmpty(jwtKey))
{
    throw new Exception("JWT Key is not configured in appsettings.json");
}

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

// Configure Email Service
builder.Services.AddTransient<IEmailService, EmailService>();

// Настройка URL и порта
builder.WebHost.UseUrls("http://localhost:5064");

var app = builder.Build();

// =============================================
// ПРОВЕРКА ПОДКЛЮЧЕНИЯ К БАЗЕ ДАННЫХ (без миграций)
// =============================================
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    
    try
    {
        // Проверяем, можем ли подключиться к БД
        var canConnect = await dbContext.Database.CanConnectAsync();
        
        if (canConnect)
        {
            logger.LogInformation("✅ Успешное подключение к PostgreSQL!");
            
            // Проверяем количество записей в таблицах
            var usersCount = await dbContext.Users.CountAsync();
            var eventsCount = await dbContext.Events.CountAsync();
            
            logger.LogInformation($"📊 Статистика БД:");
            logger.LogInformation($"   - Users: {usersCount} записей");
            logger.LogInformation($"   - Events: {eventsCount} записей");
        }
        else
        {
            logger.LogError("❌ Не удалось подключиться к PostgreSQL!");
            logger.LogError("   Проверьте строку подключения в appsettings.json");
        }
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "❌ Ошибка при подключении к PostgreSQL");
        logger.LogError($"   Сообщение: {ex.Message}");
    }
}

// Конфигурация middleware
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

// Глобальная обработка ошибок
app.Use(async (context, next) =>
{
    try
    {
        await next();
    }
    catch (Exception ex)
    {
        var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An unhandled exception occurred.");

        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsJsonAsync(new { message = "Internal server error" });
    }
});

app.UseCors("AllowFrontend");
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();