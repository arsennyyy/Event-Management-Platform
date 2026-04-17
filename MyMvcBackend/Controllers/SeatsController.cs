using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using MyMvcBackend.Data;
using MyMvcBackend.Models;
using System.Security.Claims;
using Microsoft.Extensions.Logging;

namespace MyMvcBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SeatsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<SeatsController> _logger;

        public SeatsController(ApplicationDbContext context, ILogger<SeatsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/Seats/event/5
        [HttpGet("event/{eventId}")]
        public async Task<ActionResult<IEnumerable<Seat>>> GetEventSeats(int eventId)
        {
            var seats = await _context.Seats
                .Where(s => s.EventId == eventId)
                .ToListAsync();

            // Если мест нет, создаем схему зала
            if (!seats.Any())
            {
                seats = await InitializeHallLayout(eventId);
            }

            return seats;
        }

        // POST: api/Seats/reserve
        [Authorize]
        [HttpPost("reserve")]
        public async Task<ActionResult<Seat>> ReserveSeat(SeatReservationRequest request)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                _logger.LogWarning("UserId claim not found in token!");
                return Unauthorized();
            }
            var userId = int.Parse(userIdClaim.Value);

            var seat = await _context.Seats
                .FirstOrDefaultAsync(s => s.Id == request.SeatId && s.EventId == request.EventId);

            if (seat == null) return NotFound("Место не найдено");
            if (seat.Status != "available") return BadRequest("Место уже занято");

            // Проверяем, не истекло ли время бронирования других мест пользователя
            var userReservations = await _context.Seats
                .Where(s => s.ReservedByUserId == userId && s.EventId == request.EventId)
                .ToListAsync();

            foreach (var reservation in userReservations)
            {
                if (reservation.ReservationExpiresAt < DateTime.UtcNow)
                {
                    reservation.Status = "available";
                    reservation.ReservedByUserId = null;
                    reservation.ReservationExpiresAt = null;
                }
            }

            seat.Status = "reserved";
            seat.ReservedByUserId = userId;
            seat.ReservationExpiresAt = DateTime.UtcNow.AddMinutes(10);

            try
            {
                await _context.SaveChangesAsync();
                return seat;
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SeatExists(seat.Id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
        }

        // POST: api/Seats/purchase
        [Authorize]
        [HttpPost("purchase")]
        public async Task<ActionResult<object>> PurchaseSeat(SeatPurchaseRequest request)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                _logger.LogWarning("UserId claim not found in token!");
                return Unauthorized();
            }
            var userId = int.Parse(userIdClaim.Value);

            var seat = await _context.Seats
                .Include(s => s.Event)
                .FirstOrDefaultAsync(s => s.Id == request.SeatId && s.EventId == request.EventId);

            if (seat == null) return NotFound("Место не найдено");
            if (seat.Status != "reserved" || seat.ReservedByUserId != userId) 
                return BadRequest("Место не забронировано вами");

            // Генерируем QR-код
            var qrCode = GenerateQrCode(userId, seat.EventId, seat.Id);

            // Создаем билет
            var ticket = new UserTicket
            {
                UserId = userId,
                EventId = seat.EventId,
                SeatId = seat.Id,
                TicketType = request.TicketType,
                Price = seat.Price,
                PurchaseDate = DateTime.UtcNow,
                EventDate = seat.Event?.Date ?? DateTime.UtcNow,
                QrCode = qrCode,
                IsUsed = false
            };

            // Обновляем статус места
            seat.Status = "sold";
            seat.ReservedByUserId = null;
            seat.ReservationExpiresAt = null;

            _context.UserTickets.Add(ticket);

            try
            {
                await _context.SaveChangesAsync();
                // Возвращаем только нужные поля (DTO)
                return new {
                    ticket.Id,
                    ticket.TicketType,
                    ticket.Price,
                    ticket.PurchaseDate,
                    ticket.EventDate,
                    ticket.QrCode,
                    ticket.IsUsed,
                    Event = new {
                        seat.Event?.Title,
                        seat.Event?.Date,
                        seat.Event?.Image
                    },
                    Seat = new {
                        seat.Row,
                        seat.Number
                    }
                };
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SeatExists(seat.Id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
        }

        // GET: api/Seats/my-tickets
        [Authorize]
        [HttpGet("my-tickets")]
        public async Task<ActionResult<IEnumerable<object>>> GetMyTickets()
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                _logger.LogWarning("UserId claim not found in token!");
                return Unauthorized();
            }
            var userId = int.Parse(userIdClaim.Value);
            _logger.LogInformation($"UserId from token: {userId}");
            _logger.LogInformation($"All claims: {string.Join(", ", User.Claims.Select(c => c.Type + ":" + c.Value))}");

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                _logger.LogWarning($"User with id {userId} not found in DB!");
                return Unauthorized();
            }

            var tickets = await _context.UserTickets
                .Include(t => t.Event)
                .Include(t => t.Seat)
                .Where(t => t.UserId == userId)
                .OrderByDescending(t => t.EventDate)
                .ToListAsync();

            // Явно подгружаем Event и Seat, если вдруг не подгрузились
            foreach (var ticket in tickets)
            {
                if (ticket.Event == null)
                    ticket.Event = await _context.Events.FindAsync(ticket.EventId);
                if (ticket.Seat == null)
                    ticket.Seat = await _context.Seats.FindAsync(ticket.SeatId);
            }

            // Возвращаем только нужные поля (DTO)
            return tickets.Select(ticket => new {
                ticket.Id,
                ticket.TicketType,
                ticket.Price,
                ticket.PurchaseDate,
                ticket.EventDate,
                ticket.QrCode,
                ticket.IsUsed,
                Event = ticket.Event == null ? null : new {
                    ticket.Event.Id,
                    ticket.Event.Title,
                    ticket.Event.Image,
                    ticket.Event.Date,
                    ticket.Event.Time,
                    ticket.Event.Location,
                    ticket.Event.Address,
                    ticket.Event.Price,
                    ticket.Event.Category,
                    ticket.Event.Description,
                    ticket.Event.EventType,
                    ticket.Event.Lineup,
                    ticket.Event.IsFeatured
                },
                Seat = ticket.Seat == null ? null : new {
                    ticket.Seat.Row,
                    ticket.Seat.Number
                }
            }).ToList();
        }

        private async Task<List<Seat>> InitializeHallLayout(int eventId)
        {
            var seats = new List<Seat>();
            var rows = new[] { "А", "Б", "В", "Г", "Д", "Е", "Ж", "З" };
            var event_ = await _context.Events.Include(e => e.TicketTypes).FirstOrDefaultAsync(e => e.Id == eventId);
            
            if (event_ == null) return seats;

            // Получаем цены из TicketTypes (более гибко)
            var vipTypes = event_.TicketTypes.Where(t => t.Name.ToLower().Contains("vip"));
            var standardTypes = event_.TicketTypes.Where(t => !t.Name.ToLower().Contains("vip") && !t.Name.ToLower().Contains("инвалид") && !t.Name.ToLower().Contains("disabled"));
            var disabledTypes = event_.TicketTypes.Where(t => t.Name.ToLower().Contains("инвалид") || t.Name.ToLower().Contains("disabled"));
            decimal vipPrice = vipTypes.Any() ? vipTypes.Max(t => t.Price) : 0;
            decimal standardPrice = standardTypes.Any() ? standardTypes.Min(t => t.Price) : (event_.TicketTypes.Any() ? event_.TicketTypes.Min(t => t.Price) : 0);
            decimal disabledPrice = disabledTypes.Any() ? disabledTypes.Min(t => t.Price) : 0;

            foreach (var row in rows)
            {
                var rowIndex = Array.IndexOf(rows, row);
                var seatsPerRow = 12 + rowIndex * 2;
                
                for (int i = 1; i <= seatsPerRow; i++)
                {
                    string type = "standard";
                    decimal price = standardPrice;
                    if (row == "А" || row == "Б")
                    {
                        type = "vip";
                        price = vipPrice;
                    }
                    else if ((i == 1 || i == seatsPerRow) && (row == "Г" || row == "Д"))
                    {
                        type = "disabled";
                        price = disabledPrice;
                    }

                    var seat = new Seat
                    {
                        EventId = eventId,
                        Row = row,
                        Number = i,
                        Status = "available",
                        Type = type,
                        Price = price
                    };

                    seats.Add(seat);
                }
            }

            _context.Seats.AddRange(seats);
            await _context.SaveChangesAsync();
            return seats;
        }

        private bool SeatExists(int id)
        {
            return _context.Seats.Any(e => e.Id == id);
        }

        private string GenerateQrCode(int userId, int eventId, int seatId)
        {
            return $"{userId}-{eventId}-{seatId}-{Guid.NewGuid()}";
        }
    }

    public class SeatReservationRequest
    {
        public int EventId { get; set; }
        public int SeatId { get; set; }
    }

    public class SeatPurchaseRequest
    {
        public int EventId { get; set; }
        public int SeatId { get; set; }
        public string TicketType { get; set; } = string.Empty;
    }
} 