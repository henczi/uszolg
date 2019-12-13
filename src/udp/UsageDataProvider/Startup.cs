using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MassTransit;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace UsageDataProvider
{
    public class Startup
    {
        private static string host = "localhost";
        private static string queue = "usage";
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddRazorPages().AddRazorRuntimeCompilation();
            services.AddMassTransit(x =>
            {
                x.AddBus(provider =>
                    Bus.Factory.CreateUsingRabbitMq(cfg =>
                    {
                        cfg.Host(new Uri("rabbitmq://" + host + "/"),
                            hostConfig =>
                            {
                                hostConfig.Username("guest");
                                hostConfig.Password("guest");
                            });
                        cfg.UseExtensionsLogging(provider.GetRequiredService<ILoggerFactory>());
                    }));

                 EndpointConvention.Map<UsageState>(new Uri("rabbitmq://" + host + "/" +queue));
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapRazorPages();
            });
        }
    }
}
