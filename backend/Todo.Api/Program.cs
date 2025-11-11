using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Todo.Api.Data;
using Todo.Api.Models;

var builder = WebApplication.CreateBuilder(args);

// ----- DB (with resiliency) -----
builder.Services.AddDbContext<AppDbContext>(opt =>
{
    var cs = builder.Configuration.GetConnectionString("DefaultConnection");
    opt.UseSqlServer(cs, sql => sql.EnableRetryOnFailure(5, TimeSpan.FromSeconds(2), null));
});

// ----- Identity -----
builder.Services.AddIdentityCore<AppUser>(opt => { opt.User.RequireUniqueEmail = true; })
    .AddEntityFrameworkStores<AppDbContext>()
    .AddSignInManager<SignInManager<AppUser>>();

// ----- JWT -----
var key      = builder.Configuration["Jwt:Key"]      ?? "dev-key-change-this";
var issuer   = builder.Configuration["Jwt:Issuer"]   ?? "todo-api";
var audience = builder.Configuration["Jwt:Audience"] ?? "todo-web";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(o =>
    {
        o.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true, ValidateAudience = true, ValidateIssuerSigningKey = true, ValidateLifetime = true,
            ValidIssuer = issuer, ValidAudience = audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key))
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ----- CORS -----
const string CorsPolicy = "web";
builder.Services.AddCors(opt => opt.AddPolicy(CorsPolicy, p => p
    .WithOrigins(
        "https://d1p7pk2h9bas4v.cloudfront.net",          // your CloudFront site
        "https://ajjnp3prb7.us-east-2.awsapprunner.com", // your App Runner origin if you ever call API from itself
        "http://localhost:5173"                           // Vite dev
    )
    .AllowAnyHeader()
    .AllowAnyMethod()
));

var app = builder.Build();

// Behind App Runner/ALB terminate TLS:
app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
});

// Swagger: enable by env in prod if you want
if (app.Environment.IsDevelopment() || 
    string.Equals(builder.Configuration["SHOW_SWAGGER"], "true", StringComparison.OrdinalIgnoreCase))
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(CorsPolicy);
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// ---- Safe DB init ----
var disableInit = string.Equals(
    builder.Configuration["DISABLE_DB_INIT"], "true", StringComparison.OrdinalIgnoreCase);

if (!disableInit)
{
    try
    {
        using var scope = app.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        // Use Migrate in production; EnsureCreated is for dev only
        db.Database.Migrate();
    }
    catch (Exception ex)
    {
        // Don’t crash the container—log and keep serving /health
        app.Logger.LogError(ex, "Database migration failed at startup");
    }
}

// ---- Health + DB ping ----
app.MapGet("/health", () => Results.Ok(new { ok = true, utc = DateTime.UtcNow }));
app.MapGet("/dbping", async (AppDbContext db) =>
{
    try
    {
        await db.Database.OpenConnectionAsync();
        await db.Database.CloseConnectionAsync();
        return Results.Ok(new { db = "ok" });
    }
    catch (Exception ex)
    {
        return Results.Problem(ex.Message);
    }
});

app.Run();
