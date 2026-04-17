using Microsoft.EntityFrameworkCore;
using MyMvcBackend.Models;

namespace MyMvcBackend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
        
        public DbSet<User> Users { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<TicketType> TicketTypes { get; set; }
        public DbSet<Seat> Seats { get; set; }
        public DbSet<UserTicket> UserTickets { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<ContactMessage> ContactMessages { get; set; }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // =============================================
            // ЯВНО УКАЗЫВАЕМ ИМЕНА ТАБЛИЦ И КОЛОНОК (нижний регистр)
            // =============================================
            
            // USERS
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("users");
                
                entity.HasKey(u => u.Id);
                entity.Property(u => u.Id)
                    .HasColumnName("id")
                    .UseIdentityColumn();
                
                entity.Property(u => u.Name)
                    .HasColumnName("name")
                    .IsRequired()
                    .HasMaxLength(100);
                    
                entity.Property(u => u.Email)
                    .HasColumnName("email")
                    .IsRequired()
                    .HasMaxLength(100);
                entity.HasIndex(u => u.Email).IsUnique().HasDatabaseName("ix_users_email");
                    
                entity.Property(u => u.PasswordHash)
                    .HasColumnName("passwordhash")
                    .IsRequired()
                    .HasMaxLength(100);
                    
                entity.Property(u => u.VerificationToken)
                    .HasColumnName("verificationtoken")
                    .HasMaxLength(500);
                    
                entity.Property(u => u.TokenExpiresAt)
                    .HasColumnName("tokenexpiresat");
                    
                entity.Property(u => u.EmailVerified)
                    .HasColumnName("emailverified")
                    .HasDefaultValue(false);
                    
                entity.Property(u => u.IsAdmin)
                    .HasColumnName("isadmin")
                    .HasDefaultValue(false);
                    
                entity.Property(u => u.CreatedAt)
                    .HasColumnName("createdat")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");
                    
                entity.Property(u => u.UpdatedAt)
                    .HasColumnName("updatedat")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");
            });

            // EVENTS
            modelBuilder.Entity<Event>(entity =>
            {
                entity.ToTable("events");
                
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .UseIdentityColumn();
                
                entity.Property(e => e.Title)
                    .HasColumnName("title")
                    .IsRequired()
                    .HasMaxLength(500);
                    
                entity.Property(e => e.Image)
                    .HasColumnName("image")
                    .IsRequired()
                    .HasMaxLength(1000);
                    
                entity.Property(e => e.Date)
                    .HasColumnName("date")
                    .IsRequired();
                    
                entity.Property(e => e.Time)
                    .HasColumnName("time")
                    .IsRequired()
                    .HasMaxLength(50);
                    
                entity.Property(e => e.Location)
                    .HasColumnName("location")
                    .IsRequired()
                    .HasMaxLength(500);
                    
                entity.Property(e => e.Address)
                    .HasColumnName("address")
                    .IsRequired()
                    .HasMaxLength(1000);
                    
                entity.Property(e => e.Price)
                    .HasColumnName("price")
                    .IsRequired()
                    .HasMaxLength(100);
                    
                entity.Property(e => e.Category)
                    .HasColumnName("category")
                    .HasMaxLength(100);
                    
                entity.Property(e => e.Description)
                    .HasColumnName("description");
                    
                entity.Property(e => e.EventType)
                    .HasColumnName("eventtype")
                    .IsRequired()
                    .HasMaxLength(100);
                    
                entity.Property(e => e.Lineup)
                    .HasColumnName("lineup");
                    
                entity.Property(e => e.IsFeatured)
                    .HasColumnName("isfeatured")
                    .HasDefaultValue(false);
                    
                // Индексы
                entity.HasIndex(e => e.Date).HasDatabaseName("ix_events_date");
                entity.HasIndex(e => e.IsFeatured).HasDatabaseName("ix_events_isfeatured");
            });

            // TICKET TYPES
            modelBuilder.Entity<TicketType>(entity =>
            {
                entity.ToTable("tickettypes");
                
                entity.HasKey(t => t.Id);
                entity.Property(t => t.Id)
                    .HasColumnName("id")
                    .UseIdentityColumn();
                
                entity.Property(t => t.Name)
                    .HasColumnName("name")
                    .IsRequired()
                    .HasMaxLength(200);
                    
                entity.Property(t => t.Price)
                    .HasColumnName("price")
                    .IsRequired()
                    .HasPrecision(18, 2);
                    
                entity.Property(t => t.Available)
                    .HasColumnName("available")
                    .HasDefaultValue(true);
                    
                entity.Property(t => t.EventId)
                    .HasColumnName("eventid");
                    
                entity.HasOne(t => t.Event)
                    .WithMany(e => e.TicketTypes)
                    .HasForeignKey(t => t.EventId)
                    .OnDelete(DeleteBehavior.Cascade);
                    
                entity.HasIndex(t => t.EventId).HasDatabaseName("ix_tickettypes_eventid");
            });

            // SEATS
            modelBuilder.Entity<Seat>(entity =>
            {
                entity.ToTable("seats");
                
                entity.HasKey(s => s.Id);
                entity.Property(s => s.Id)
                    .HasColumnName("id")
                    .UseIdentityColumn();
                
                entity.Property(s => s.EventId)
                    .HasColumnName("eventid");
                    
                entity.Property(s => s.Row)
                    .HasColumnName("row")
                    .IsRequired()
                    .HasMaxLength(50);
                    
                entity.Property(s => s.Number)
                    .HasColumnName("number");
                    
                entity.Property(s => s.Status)
                    .HasColumnName("status")
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasDefaultValue("available");
                    
                entity.Property(s => s.Type)
                    .HasColumnName("type")
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasDefaultValue("standard");
                    
                entity.Property(s => s.Price)
                    .HasColumnName("price")
                    .IsRequired()
                    .HasPrecision(18, 2);
                    
                entity.Property(s => s.ReservedByUserId)
                    .HasColumnName("reservedbyuserid");
                    
                entity.Property(s => s.ReservationExpiresAt)
                    .HasColumnName("reservationexpiresat");
                    
                entity.HasOne(s => s.Event)
                    .WithMany(e => e.Seats)
                    .HasForeignKey(s => s.EventId)
                    .OnDelete(DeleteBehavior.Cascade);
                    
                entity.HasOne(s => s.ReservedByUser)
                    .WithMany()
                    .HasForeignKey(s => s.ReservedByUserId)
                    .OnDelete(DeleteBehavior.SetNull);
                    
                entity.HasIndex(s => s.EventId).HasDatabaseName("ix_seats_eventid");
                entity.HasIndex(s => s.ReservedByUserId).HasDatabaseName("ix_seats_reservedbyuserid");
                entity.HasIndex(s => s.Status).HasDatabaseName("ix_seats_status");
            });

            // USER TICKETS
            modelBuilder.Entity<UserTicket>(entity =>
            {
                entity.ToTable("usertickets");
                
                entity.HasKey(t => t.Id);
                entity.Property(t => t.Id)
                    .HasColumnName("id")
                    .UseIdentityColumn();
                
                entity.Property(t => t.UserId)
                    .HasColumnName("userid");
                    
                entity.Property(t => t.EventId)
                    .HasColumnName("eventid");
                    
                entity.Property(t => t.SeatId)
                    .HasColumnName("seatid");
                    
                entity.Property(t => t.TicketType)
                    .HasColumnName("tickettype")
                    .IsRequired()
                    .HasMaxLength(200);
                    
                entity.Property(t => t.Price)
                    .HasColumnName("price")
                    .IsRequired()
                    .HasPrecision(18, 2);
                    
                entity.Property(t => t.PurchaseDate)
                    .HasColumnName("purchasedate")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");
                    
                entity.Property(t => t.EventDate)
                    .HasColumnName("eventdate");
                    
                entity.Property(t => t.QrCode)
                    .HasColumnName("qrcode")
                    .IsRequired()
                    .HasMaxLength(1000);
                    
                entity.Property(t => t.IsUsed)
                    .HasColumnName("isused")
                    .HasDefaultValue(false);
                    
                entity.HasOne(t => t.User)
                    .WithMany()
                    .HasForeignKey(t => t.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
                    
                entity.HasOne(t => t.Event)
                    .WithMany()
                    .HasForeignKey(t => t.EventId)
                    .OnDelete(DeleteBehavior.Cascade);
                    
                entity.HasOne(t => t.Seat)
                    .WithMany()
                    .HasForeignKey(t => t.SeatId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // ORDERS
            modelBuilder.Entity<Order>(entity =>
            {
                entity.ToTable("orders");
                
                entity.HasKey(o => o.Id);
                entity.Property(o => o.Id)
                    .HasColumnName("id")
                    .UseIdentityColumn();
                
                entity.Property(o => o.UserId)
                    .HasColumnName("userid");
                    
                entity.Property(o => o.OrderNumber)
                    .HasColumnName("ordernumber")
                    .IsRequired()
                    .HasMaxLength(100);
                    
                entity.Property(o => o.TotalAmount)
                    .HasColumnName("totalamount")
                    .IsRequired()
                    .HasPrecision(18, 2);
                    
                entity.Property(o => o.Status)
                    .HasColumnName("status")
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasDefaultValue("pending");
                    
                entity.Property(o => o.CreatedAt)
                    .HasColumnName("createdat")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");
                    
                entity.Property(o => o.CompletedAt)
                    .HasColumnName("completedat");
                    
                entity.HasOne(o => o.User)
                    .WithMany()
                    .HasForeignKey(o => o.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
                    
                entity.HasIndex(o => o.OrderNumber)
                    .IsUnique()
                    .HasDatabaseName("ix_orders_ordernumber");
                    
                entity.HasIndex(o => o.Status).HasDatabaseName("ix_orders_status");
                entity.HasIndex(o => o.UserId).HasDatabaseName("ix_orders_userid");
            });

            // PAYMENTS
            modelBuilder.Entity<Payment>(entity =>
            {
                entity.ToTable("payments");
                
                entity.HasKey(p => p.Id);
                entity.Property(p => p.Id)
                    .HasColumnName("id")
                    .UseIdentityColumn();
                
                entity.Property(p => p.OrderId)
                    .HasColumnName("orderid");
                    
                entity.Property(p => p.UserId)
                    .HasColumnName("userid");
                    
                entity.Property(p => p.Amount)
                    .HasColumnName("amount")
                    .IsRequired()
                    .HasPrecision(18, 2);
                    
                entity.Property(p => p.PaymentMethod)
                    .HasColumnName("paymentmethod")
                    .IsRequired()
                    .HasMaxLength(100);
                    
                entity.Property(p => p.Status)
                    .HasColumnName("status")
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasDefaultValue("pending");
                    
                entity.Property(p => p.TransactionId)
                    .HasColumnName("transactionid")
                    .HasMaxLength(500);
                    
                entity.Property(p => p.PaymentDetails)
                    .HasColumnName("paymentdetails");
                    
                entity.Property(p => p.CreatedAt)
                    .HasColumnName("createdat")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");
                    
                entity.Property(p => p.CompletedAt)
                    .HasColumnName("completedat");
                    
                entity.HasOne(p => p.Order)
                    .WithMany()
                    .HasForeignKey(p => p.OrderId)
                    .OnDelete(DeleteBehavior.Cascade);
                    
                entity.HasOne(p => p.User)
                    .WithMany()
                    .HasForeignKey(p => p.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // REVIEWS
            modelBuilder.Entity<Review>(entity =>
            {
                entity.ToTable("reviews");
                
                entity.HasKey(r => r.Id);
                entity.Property(r => r.Id)
                    .HasColumnName("id")
                    .UseIdentityColumn();
                
                entity.Property(r => r.UserId)
                    .HasColumnName("userid");
                    
                entity.Property(r => r.EventId)
                    .HasColumnName("eventid");
                    
                entity.Property(r => r.Rating)
                    .HasColumnName("rating");
                    
                entity.Property(r => r.Comment)
                    .HasColumnName("comment");
                    
                entity.Property(r => r.CreatedAt)
                    .HasColumnName("createdat")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");
                    
                entity.Property(r => r.UpdatedAt)
                    .HasColumnName("updatedat");
                    
                entity.Property(r => r.IsApproved)
                    .HasColumnName("isapproved")
                    .HasDefaultValue(false);
                    
                entity.HasOne(r => r.User)
                    .WithMany()
                    .HasForeignKey(r => r.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
                    
                entity.HasOne(r => r.Event)
                    .WithMany()
                    .HasForeignKey(r => r.EventId)
                    .OnDelete(DeleteBehavior.Cascade);
                    
                // Уникальность: один пользователь - один отзыв на событие
                entity.HasIndex(r => new { r.UserId, r.EventId })
                    .IsUnique()
                    .HasDatabaseName("ix_reviews_userid_eventid");
                    
                entity.HasIndex(r => r.EventId).HasDatabaseName("ix_reviews_eventid");
                entity.HasIndex(r => r.UserId).HasDatabaseName("ix_reviews_userid");
                entity.HasIndex(r => r.IsApproved).HasDatabaseName("ix_reviews_isapproved");
            });

            // NOTIFICATIONS
            modelBuilder.Entity<Notification>(entity =>
            {
                entity.ToTable("notifications");
                
                entity.HasKey(n => n.Id);
                entity.Property(n => n.Id)
                    .HasColumnName("id")
                    .UseIdentityColumn();
                
                entity.Property(n => n.UserId)
                    .HasColumnName("userid");
                    
                entity.Property(n => n.Title)
                    .HasColumnName("title")
                    .IsRequired()
                    .HasMaxLength(500);
                    
                entity.Property(n => n.Message)
                    .HasColumnName("message");
                    
                entity.Property(n => n.Type)
                    .HasColumnName("type")
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasDefaultValue("info");
                    
                entity.Property(n => n.IsRead)
                    .HasColumnName("isread")
                    .HasDefaultValue(false);
                    
                entity.Property(n => n.CreatedAt)
                    .HasColumnName("createdat")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");
                    
                entity.Property(n => n.ReadAt)
                    .HasColumnName("readat");
                    
                entity.Property(n => n.RelatedEventId)
                    .HasColumnName("relatedeventid");
                    
                entity.Property(n => n.RelatedTicketId)
                    .HasColumnName("relatedticketid");
                    
                entity.HasOne(n => n.User)
                    .WithMany()
                    .HasForeignKey(n => n.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
                    
                entity.HasOne(n => n.RelatedEvent)
                    .WithMany()
                    .HasForeignKey(n => n.RelatedEventId)
                    .OnDelete(DeleteBehavior.SetNull);
                    
                entity.HasOne(n => n.RelatedTicket)
                    .WithMany()
                    .HasForeignKey(n => n.RelatedTicketId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // CONTACT MESSAGES
            modelBuilder.Entity<ContactMessage>(entity =>
            {
                entity.ToTable("contactmessages");
                
                entity.HasKey(c => c.Id);
                entity.Property(c => c.Id)
                    .HasColumnName("id")
                    .UseIdentityColumn();
                
                entity.Property(c => c.Name)
                    .HasColumnName("name")
                    .IsRequired()
                    .HasMaxLength(100);
                    
                entity.Property(c => c.Email)
                    .HasColumnName("email")
                    .IsRequired()
                    .HasMaxLength(100);
                    
                entity.Property(c => c.Message)
                    .HasColumnName("message");
                    
                entity.Property(c => c.Status)
                    .HasColumnName("status")
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasDefaultValue("new");
                    
                entity.Property(c => c.CreatedAt)
                    .HasColumnName("createdat")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");
                    
                entity.Property(c => c.ResolvedAt)
                    .HasColumnName("resolvedat");
                    
                entity.Property(c => c.Response)
                    .HasColumnName("response");
                    
                entity.Property(c => c.RespondedByUserId)
                    .HasColumnName("respondedbyuserid");
                    
                entity.HasIndex(c => c.CreatedAt).HasDatabaseName("ix_contactmessages_createdat");
                entity.HasIndex(c => c.Email).HasDatabaseName("ix_contactmessages_email");
                entity.HasIndex(c => c.Status).HasDatabaseName("ix_contactmessages_status");
            });
        }
    }
}