using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace UsageDataProvider
{
    public class UsageState
    {
        public string Key { get; set; }
        public string Name { get; set; }
        public bool Active { get; set; } = false;
    }
}
