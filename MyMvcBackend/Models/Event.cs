using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MyMvcBackend.Models
{
    public class Event
    {
        [Key]
        public int Id { get; set; }
        public required string Title { get; set; }
        public required string Image { get; set; }
        public DateTime Date { get; set; }
        public required string Time { get; set; }
        public required string Location { get; set; }
        public required string Address { get; set; }
        public required string Price { get; set; }
        public string? Category { get; set; }
        public required string Description { get; set; }
        public required string EventType { get; set; }
        public required string Lineup { get; set; } // Stored as JSON string
        public bool IsFeatured { get; set; }
        public virtual ICollection<TicketType> TicketTypes { get; set; } = new List<TicketType>();
        public virtual ICollection<Seat> Seats { get; set; } = new List<Seat>();
    }
}