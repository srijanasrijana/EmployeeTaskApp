using EmployeeTaskApp.Repositories;
using EmployeeTaskApp.Utilities;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
namespace EmployeeTaskApp
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllersWithViews()
                    .AddJsonOptions(options => options.JsonSerializerOptions.PropertyNamingPolicy = null);// Disable Properynaming policy
            services.AddMvc(options => options.EnableEndpointRouting = false);
            //Register Daper Context
            services.AddSingleton<DapperContext>();
            //Register Repositories
            services.AddSingleton<IEmployeeTask,EmployeeTaskRepository>();
            //Swagger Integration
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Employee Task API", Version = "v1" });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            // Swagger Integration
            app.UseSwagger();
            app.UseSwaggerUI();

            app.UseStaticFiles();
            app.UseRouting();
            // Default Route to HomeController
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");
                //endpoints.MapControllers();
            });
        }
    }
}
