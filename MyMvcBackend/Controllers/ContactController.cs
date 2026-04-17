using Microsoft.AspNetCore.Mvc;
using MyMvcBackend.Models;
using MyMvcBackend.Services;
using System.Threading.Tasks;

namespace MyMvcBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactController : ControllerBase
    {
        private readonly IEmailService _emailService;
        private readonly ILogger<ContactController> _logger;

        public ContactController(IEmailService emailService, ILogger<ContactController> logger)
        {
            _emailService = emailService;
            _logger = logger;
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendMessage([FromBody] ContactFormModel model)
        {
            try
            {
                _logger.LogInformation($"Received contact form submission from {model.Email}");

                if (!ModelState.IsValid)
                {
                    _logger.LogWarning("Invalid model state in contact form submission");
                    return BadRequest(new { errors = ModelState });
                }

                await _emailService.SendContactFormEmailAsync(model.Name, model.Email, model.Message);
                
                _logger.LogInformation($"Successfully sent contact form email from {model.Email}");
                return Ok(new { message = "Сообщение успешно отправлено" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error sending contact form message from {model.Email}");
                return StatusCode(500, new { message = "Ошибка при отправке сообщения" });
            }
        }
    }
} 