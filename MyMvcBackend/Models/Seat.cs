using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyMvcBackend.Models
{
    public class Seat
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int EventId { get; set; }

        [Required]
        public string Row { get; set; } = string.Empty;

        [Required]
        public int Number { get; set; }

        [Required]
        public string Status { get; set; } = "available"; // available, reserved, sold

        [Required]
        public string Type { get; set; } = "standard"; // standard, vip, disabled

        [Required]
        public decimal Price { get; set; }

        public int? ReservedByUserId { get; set; }

        public DateTime? ReservationExpiresAt { get; set; }

        [ForeignKey("EventId")]
        public virtual Event? Event { get; set; }

        [ForeignKey("ReservedByUserId")]
        public virtual User? ReservedByUser { get; set; }
    }
} 