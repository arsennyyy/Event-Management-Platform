using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using MyMvcBackend.Models;
using MyMvcBackend.Data;
using MyMvcBackend.Services;
using Microsoft.AspNetCore.Authorization;

namespace MyMvcBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(
            ApplicationDbContext context,
            IConfiguration configuration,
            IEmailService emailService,
            ILogger<AuthController> logger)
        {
            _context = context;
            _configuration = configuration;
            _emailService = emailService;
            _logger = logger;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegistrationModel model)
        {
            try
            {
                _logger.LogInformation($"Attempting to register user with email: {model.Email}");

                if (!ModelState.IsValid)
                {
                    _logger.LogWarning("Invalid model state during registration");
                    return BadRequest(new { errors = ModelState });
                }

                if (await _context.Users.AnyAsync(u => u.Email == model.Email))
                {
                    _logger.LogWarning($"Email already exists: {model.Email}");
                    return BadRequest(new { message = "Пользователь с таким email уже существует" });
                }

                if (model.Password.Length < 6)
                {
                    return BadRequest(new { message = "Пароль должен содержать минимум 6 символов" });
                }

                if (model.Password != model.ConfirmPassword)
                {
                    return BadRequest(new { message = "Пароли не совпадают" });
                }

                var user = new User
                {
                    Name = model.Name,
                    Email = model.Email,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.Password),
                    VerificationToken = GenerateToken(),
                    TokenExpiresAt = DateTime.UtcNow.AddDays(1)
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                try
                {
                    await _emailService.SendWelcomeEmailAsync(user.Email, user.Name);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to send welcome email");
                }

                _logger.LogInformation($"User registered successfully: {user.Email}");
                return Ok(new { message = "Регистрация успешна" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during registration");
                return StatusCode(500, new { message = "Внутренняя ошибка сервера при регистрации" });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            try
            {
                _logger.LogInformation($"Attempting login for user: {model.Email}");

                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email);

                if (user == null || !BCrypt.Net.BCrypt.Verify(model.Password, user.PasswordHash))
                {
                    _logger.LogWarning($"Invalid login attempt for email: {model.Email}");
                    return BadRequest(new { message = "Неверный email или пароль" });
                }

                var token = GenerateJwtToken(user);

                _logger.LogInformation($"User logged in successfully: {user.Email}");
                return Ok(new { 
                    token,
                    id = user.Id.ToString(),
                    name = user.Name,
                    email = user.Email,
                    joinedDate = user.CreatedAt,
                    isAdmin = user.IsAdmin
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during login");
                return StatusCode(500, new { message = "Внутренняя ошибка сервера при входе в систему" });
            }
        }

        [Authorize]
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordModel model)
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized();
            var userId = int.Parse(userIdClaim.Value);
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return Unauthorized();
            if (!BCrypt.Net.BCrypt.Verify(model.OldPassword, user.PasswordHash))
                return BadRequest(new { message = "Старый пароль неверный" });
            if (model.NewPassword.Length < 6)
                return BadRequest(new { message = "Новый пароль слишком короткий" });
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.NewPassword);
            user.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return Ok(new { message = "Пароль успешно изменён" });
        }

        private string GenerateJwtToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.Name)
            };

            if (user.IsAdmin)
            {
                claims.Add(new Claim(ClaimTypes.Role, "Admin"));
            }

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(Convert.ToDouble(_configuration["Jwt:ExpiryInMinutes"])),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private string GenerateToken()
        {
            return Guid.NewGuid().ToString();
        }

        public class LoginModel
        {
            public required string Email { get; set; }
            public required string Password { get; set; }
        }

        public class ChangePasswordModel
        {
            public string OldPassword { get; set; } = string.Empty;
            public string NewPassword { get; set; } = string.Empty;
        }
    }
}