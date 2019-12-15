using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace UserAuth.Controllers
{
    [ApiController]
    [Route("")]
    public class AuthController : ControllerBase
    {
        private static ConcurrentDictionary<string, bool> bans = new ConcurrentDictionary<string, bool>();

        private readonly ILogger<AuthController> _logger;

        public AuthController(ILogger<AuthController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IActionResult Get()
        {
            if (Request.Headers.TryGetValue("X-User-Id", out var userId) && !bans.ContainsKey(userId))
            {
                Console.WriteLine("Auth - 200 " + userId);
                return StatusCode(200);
            }
            Console.WriteLine("Auth - 401 " + userId);
            return StatusCode(401);
        }

        [HttpGet("ban/{id}")]
        public string Ban(string id)
        {
            var added = bans.TryAdd(id, true);
            Console.WriteLine($"Ban - {added} - {id}");
            return added ? "Added" : "Error";
        }

        [HttpGet("test")]
        public string Test(string id)
        {
            return "OK";
        }
    }
}
