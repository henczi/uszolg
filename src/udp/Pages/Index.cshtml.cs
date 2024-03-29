﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MassTransit;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;

namespace UsageDataProvider.Pages
{
    public class IndexModel : PageModel
    {
        public static List<UsageState> Usages = new List<UsageState>()
        {
            new UsageState { Name = "A", Key = "1" },
            new UsageState { Name = "B", Key = "2" },
            new UsageState { Name = "C", Key = "3" },
        };

        private readonly ILogger<IndexModel> _logger;
        private readonly IBusControl _bus;

        public List<UsageState> Usagess => Usages;

        public IndexModel(ILogger<IndexModel> logger, IBusControl bus)
        {
            _logger = logger;
            _bus = bus;
        }

        public async Task<IActionResult> OnPostAsync(string key)
        {
            var usage = Usages.FirstOrDefault(x => x.Key == key);

            if (usage == null) return Page();

            usage.Active = !usage.Active;
            usage.TimeStamp = DateTimeOffset.UtcNow;

            try { await _bus.Send(usage); } // Publish - Endpoint not working
            catch(Exception e) { Console.WriteLine(e.Message); }

            return Page();
        }

    }
}
