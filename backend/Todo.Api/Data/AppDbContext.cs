using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Todo.Api.Models;

namespace Todo.Api.Data;

public class AppDbContext : IdentityDbContext<AppUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<TaskItem> Tasks => Set<TaskItem>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        base.OnModelCreating(b);

        b.Entity<TaskItem>(e =>
        {
            e.Property(x => x.Title).HasMaxLength(120).IsRequired();
            e.Property(x => x.Urgency).HasDefaultValue(3);
            e.Property(x => x.UserId).IsRequired();
            e.HasIndex(x => new { x.UserId, x.DueDate });
        });
    }
}
