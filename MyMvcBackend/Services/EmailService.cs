using System.Net;
using System.Net.Mail;

namespace MyMvcBackend.Services
{
    public interface IEmailService
    {
        Task SendWelcomeEmailAsync(string toEmail, string userName);
        Task SendContactFormEmailAsync(string name, string email, string message);
    }

    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public async Task SendWelcomeEmailAsync(string toEmail, string userName)
        {
            try
            {
                var smtpSettings = _configuration.GetSection("SmtpSettings");
                var client = new SmtpClient(smtpSettings["Host"])
                {
                    Port = int.Parse(smtpSettings["Port"]),
                    Credentials = new NetworkCredential(smtpSettings["Username"], smtpSettings["Password"]),
                    EnableSsl = true,
                };

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(smtpSettings["Username"]),
                    Subject = "Добро пожаловать!",
                    Body = $"Здравствуйте, {userName}!\n\nДобро пожаловать на наш сайт. Мы рады, что вы с нами!",
                    IsBodyHtml = false,
                };
                mailMessage.To.Add(toEmail);

                _logger.LogInformation($"Attempting to send email to {toEmail}");
                await client.SendMailAsync(mailMessage);
                _logger.LogInformation($"Email sent successfully to {toEmail}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to send email to {toEmail}. Error: {ex.Message}");
                // Не выбрасываем исключение, чтобы не прерывать процесс регистрации
            }
        }

        public async Task SendContactFormEmailAsync(string name, string email, string message)
        {
            try
            {
                var smtpSettings = _configuration.GetSection("SmtpSettings");
                var client = new SmtpClient(smtpSettings["Host"])
                {
                    Port = int.Parse(smtpSettings["Port"]),
                    Credentials = new NetworkCredential(smtpSettings["Username"], smtpSettings["Password"]),
                    EnableSsl = true,
                };

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(smtpSettings["Username"]),
                    Subject = "Новое сообщение с сайта",
                    Body = $"Имя: {name}\nEmail: {email}\n\nСообщение:\n{message}",
                    IsBodyHtml = false,
                };

                // Отправляем на адрес администратора
                var adminEmail = smtpSettings["Username"];
                mailMessage.To.Add(adminEmail);

                _logger.LogInformation($"Attempting to send contact form email from {email} to {adminEmail}");
                await client.SendMailAsync(mailMessage);
                _logger.LogInformation($"Contact form email sent successfully from {email} to {adminEmail}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to send contact form email from {email}. Error: {ex.Message}");
                throw; // В этом случае выбрасываем исключение, так как это критично для функционала
            }
        }
    }
} 