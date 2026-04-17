using System;
using System.ComponentModel.DataAnnotations;

namespace MyMvcBackend.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public required string Name { get; set; }
        
        [Required]
        [StringLength(100)]
        [EmailAddress]
        public required string Email { get; set; }
        
        [Required]
        [StringLength(100)]
        public required string PasswordHash { get; set; }
        
        public bool EmailVerified { get; set; } = false;
        
        public bool IsAdmin { get; set; } = false;
        
        public string? VerificationToken { get; set; }
        
        public DateTime? TokenExpiresAt { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}