using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyMvcBackend.Data;
using MyMvcBackend.Models;

namespace MyMvcBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AdminController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AdminController(ApplicationDbContext context)
        {
            _context = context;
        }

        private bool IsAdmin()
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return false;
            var userId = int.Parse(userIdClaim.Value);
            var user = _context.Users.Find(userId);
            return user?.IsAdmin == true;
        }

        // ========== USERS ==========
        [HttpGet("users")]
        public async Task<ActionResult<IEnumerable<object>>> GetUsers([FromQuery] string? search = null)
        {
            if (!IsAdmin()) return Forbid();

            var query = _context.Users.AsQueryable();
            
            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(u => 
                    u.Name.Contains(search) || 
                    u.Email.Contains(search));
            }

            var users = await query
                .OrderByDescending(u => u.CreatedAt)
                .Select(u => new
                {
                    u.Id,
                    u.Name,
                    u.Email,
                    u.EmailVerified,
                    u.IsAdmin,
                    u.CreatedAt,
                    u.UpdatedAt
                })
                .ToListAsync();

            return Ok(users);
        }

        [HttpGet("users/{id}")]
        public async Task<ActionResult<object>> GetUser(int id)
        {
            if (!IsAdmin()) return Forbid();

            var user = await _context.Users
                .Where(u => u.Id == id)
                .Select(u => new
                {
                    u.Id,
                    u.Name,
                    u.Email,
                    u.EmailVerified,
                    u.IsAdmin,
                    u.CreatedAt,
                    u.UpdatedAt
                })
                .FirstOrDefaultAsync();

            if (user == null) return NotFound();

            return Ok(user);
        }

        [HttpPut("users/{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserModel model)
        {
            if (!IsAdmin()) return Forbid();

            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            user.Name = model.Name ?? user.Name;
            user.Email = model.Email ?? user.Email;
            user.IsAdmin = model.IsAdmin ?? user.IsAdmin;
            user.EmailVerified = model.EmailVerified ?? user.EmailVerified;
            user.UpdatedAt = DateTime.UtcNow;

            if (!string.IsNullOrEmpty(model.Password))
            {
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.Password);
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Пользователь обновлен" });
        }

        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            if (!IsAdmin()) return Forbid();

            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Пользователь удален" });
        }

        [HttpPost("users")]
        public async Task<ActionResult<object>> CreateUser([FromBody] CreateUserModel model)
        {
            if (!IsAdmin()) return Forbid();

            if (await _context.Users.AnyAsync(u => u.Email == model.Email))
            {
                return BadRequest(new { message = "Пользователь с таким email уже существует" });
            }

            var user = new User
            {
                Name = model.Name,
                Email = model.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.Password),
                IsAdmin = model.IsAdmin ?? false,
                EmailVerified = model.EmailVerified ?? false,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                user.Id,
                user.Name,
                user.Email,
                user.IsAdmin,
                user.EmailVerified
            });
        }

        // ========== EVENTS ==========
        [HttpGet("events")]
        public async Task<ActionResult<IEnumerable<object>>> GetEvents([FromQuery] string? search = null)
        {
            if (!IsAdmin()) return Forbid();

            var query = _context.Events.AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(e => 
                    e.Title.Contains(search) || 
                    e.Location.Contains(search) ||
                    (e.Category != null && e.Category.Contains(search)));
            }

            var events = await query
                .OrderByDescending(e => e.Date)
                .Select(e => new
                {
                    e.Id,
                    e.Title,
                    e.Image,
                    e.Date,
                    e.Time,
                    e.Location,
                    e.Address,
                    e.Price,
                    e.Category,
                    e.Description,
                    e.EventType,
                    e.Lineup,
                    e.IsFeatured
                })
                .ToListAsync();

            return Ok(events);
        }

        [HttpGet("events/{id}")]
        public async Task<ActionResult<object>> GetEvent(int id)
        {
            if (!IsAdmin()) return Forbid();

            var @event = await _context.Events.FindAsync(id);
            if (@event == null) return NotFound();

            return Ok(@event);
        }

        [HttpPost("events")]
        public async Task<ActionResult<object>> CreateEvent([FromBody] Event @event)
        {
            if (!IsAdmin()) return Forbid();

            _context.Events.Add(@event);
            await _context.SaveChangesAsync();

            return Ok(@event);
        }

        [HttpPut("events/{id}")]
        public async Task<IActionResult> UpdateEvent(int id, [FromBody] Event @event)
        {
            if (!IsAdmin()) return Forbid();

            if (id != @event.Id) return BadRequest();

            _context.Entry(@event).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Событие обновлено" });
        }

        [HttpDelete("events/{id}")]
        public async Task<IActionResult> DeleteEvent(int id)
        {
            if (!IsAdmin()) return Forbid();

            var @event = await _context.Events.FindAsync(id);
            if (@event == null) return NotFound();

            _context.Events.Remove(@event);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Событие удалено" });
        }

        // ========== ORDERS ==========
        [HttpGet("orders")]
        public async Task<ActionResult<IEnumerable<object>>> GetOrders([FromQuery] string? search = null)
        {
            if (!IsAdmin()) return Forbid();

            var query = _context.Orders
                .Include(o => o.User)
                .AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(o => 
                    o.OrderNumber.Contains(search) ||
                    o.User.Name.Contains(search) ||
                    o.User.Email.Contains(search));
            }

            var orders = await query
                .OrderByDescending(o => o.CreatedAt)
                .Select(o => new
                {
                    o.Id,
                    o.OrderNumber,
                    o.TotalAmount,
                    o.Status,
                    o.CreatedAt,
                    o.CompletedAt,
                    User = new
                    {
                        o.User.Id,
                        o.User.Name,
                        o.User.Email
                    }
                })
                .ToListAsync();

            return Ok(orders);
        }

        [HttpPut("orders/{id}")]
        public async Task<IActionResult> UpdateOrder(int id, [FromBody] UpdateOrderModel model)
        {
            if (!IsAdmin()) return Forbid();

            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound();

            if (!string.IsNullOrEmpty(model.Status))
            {
                order.Status = model.Status;
                if (model.Status == "paid" || model.Status == "completed")
                {
                    order.CompletedAt = DateTime.UtcNow;
                }
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Заказ обновлен" });
        }

        [HttpDelete("orders/{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            if (!IsAdmin()) return Forbid();

            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound();

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Заказ удален" });
        }

        // ========== PAYMENTS ==========
        [HttpGet("payments")]
        public async Task<ActionResult<IEnumerable<object>>> GetPayments([FromQuery] string? search = null)
        {
            if (!IsAdmin()) return Forbid();

            var query = _context.Payments
                .Include(p => p.User)
                .Include(p => p.Order)
                .AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(p => 
                    (p.TransactionId != null && p.TransactionId.Contains(search)) ||
                    p.Order.OrderNumber.Contains(search) ||
                    p.User.Email.Contains(search));
            }

            var payments = await query
                .OrderByDescending(p => p.CreatedAt)
                .Select(p => new
                {
                    p.Id,
                    p.Amount,
                    p.PaymentMethod,
                    p.Status,
                    p.TransactionId,
                    p.CreatedAt,
                    p.CompletedAt,
                    User = new
                    {
                        p.User.Id,
                        p.User.Name,
                        p.User.Email
                    },
                    Order = new
                    {
                        p.Order.Id,
                        p.Order.OrderNumber
                    }
                })
                .ToListAsync();

            return Ok(payments);
        }

        // ========== REVIEWS ==========
        [HttpGet("reviews")]
        public async Task<ActionResult<IEnumerable<object>>> GetReviews([FromQuery] string? search = null)
        {
            if (!IsAdmin()) return Forbid();

            var query = _context.Reviews
                .Include(r => r.User)
                .Include(r => r.Event)
                .AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(r => 
                    r.User.Name.Contains(search) ||
                    r.Event.Title.Contains(search) ||
                    (r.Comment != null && r.Comment.Contains(search)));
            }

            var reviews = await query
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new
                {
                    r.Id,
                    r.Rating,
                    r.Comment,
                    r.IsApproved,
                    r.CreatedAt,
                    r.UpdatedAt,
                    User = new
                    {
                        r.User.Id,
                        r.User.Name,
                        r.User.Email
                    },
                    Event = new
                    {
                        r.Event.Id,
                        r.Event.Title
                    }
                })
                .ToListAsync();

            return Ok(reviews);
        }

        [HttpPut("reviews/{id}")]
        public async Task<IActionResult> UpdateReview(int id, [FromBody] UpdateReviewModel model)
        {
            if (!IsAdmin()) return Forbid();

            var review = await _context.Reviews.FindAsync(id);
            if (review == null) return NotFound();

            if (model.IsApproved.HasValue)
            {
                review.IsApproved = model.IsApproved.Value;
            }

            if (!string.IsNullOrEmpty(model.Comment))
            {
                review.Comment = model.Comment;
            }

            review.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Отзыв обновлен" });
        }

        [HttpDelete("reviews/{id}")]
        public async Task<IActionResult> DeleteReview(int id)
        {
            if (!IsAdmin()) return Forbid();

            var review = await _context.Reviews.FindAsync(id);
            if (review == null) return NotFound();

            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Отзыв удален" });
        }

        // ========== CONTACT MESSAGES ==========
        [HttpGet("contact-messages")]
        public async Task<ActionResult<IEnumerable<object>>> GetContactMessages([FromQuery] string? search = null)
        {
            if (!IsAdmin()) return Forbid();

            var query = _context.ContactMessages.AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(m => 
                    m.Name.Contains(search) ||
                    m.Email.Contains(search) ||
                    m.Message.Contains(search));
            }

            var messages = await query
                .OrderByDescending(m => m.CreatedAt)
                .Select(m => new
                {
                    m.Id,
                    m.Name,
                    m.Email,
                    m.Message,
                    m.Status,
                    m.CreatedAt,
                    m.ResolvedAt,
                    m.Response
                })
                .ToListAsync();

            return Ok(messages);
        }

        [HttpPut("contact-messages/{id}")]
        public async Task<IActionResult> UpdateContactMessage(int id, [FromBody] UpdateContactMessageModel model)
        {
            if (!IsAdmin()) return Forbid();

            var message = await _context.ContactMessages.FindAsync(id);
            if (message == null) return NotFound();

            if (!string.IsNullOrEmpty(model.Status))
            {
                message.Status = model.Status;
                if (model.Status == "resolved")
                {
                    message.ResolvedAt = DateTime.UtcNow;
                }
            }

            if (!string.IsNullOrEmpty(model.Response))
            {
                message.Response = model.Response;
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Сообщение обновлено" });
        }

        [HttpDelete("contact-messages/{id}")]
        public async Task<IActionResult> DeleteContactMessage(int id)
        {
            if (!IsAdmin()) return Forbid();

            var message = await _context.ContactMessages.FindAsync(id);
            if (message == null) return NotFound();

            _context.ContactMessages.Remove(message);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Сообщение удалено" });
        }

        // ========== STATISTICS ==========
        [HttpGet("statistics")]
        public async Task<ActionResult<object>> GetStatistics()
        {
            if (!IsAdmin()) return Forbid();

            var stats = new
            {
                TotalUsers = await _context.Users.CountAsync(),
                TotalEvents = await _context.Events.CountAsync(),
                TotalOrders = await _context.Orders.CountAsync(),
                TotalPayments = await _context.Payments.CountAsync(),
                TotalRevenue = await _context.Payments
                    .Where(p => p.Status == "completed")
                    .SumAsync(p => (decimal?)p.Amount) ?? 0,
                PendingOrders = await _context.Orders.CountAsync(o => o.Status == "pending"),
                ApprovedReviews = await _context.Reviews.CountAsync(r => r.IsApproved),
                PendingMessages = await _context.ContactMessages.CountAsync(m => m.Status == "new")
            };

            return Ok(stats);
        }
    }

    // Models
    public class UpdateUserModel
    {
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public bool? IsAdmin { get; set; }
        public bool? EmailVerified { get; set; }
    }

    public class CreateUserModel
    {
        public required string Name { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
        public bool? IsAdmin { get; set; }
        public bool? EmailVerified { get; set; }
    }

    public class UpdateOrderModel
    {
        public string? Status { get; set; }
    }

    public class UpdateReviewModel
    {
        public bool? IsApproved { get; set; }
        public string? Comment { get; set; }
    }

    public class UpdateContactMessageModel
    {
        public string? Status { get; set; }
        public string? Response { get; set; }
    }
}

