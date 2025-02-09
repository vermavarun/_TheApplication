using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

public class ApplicationDbContext : IdentityDbContext<IdentityUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) :
        base(options)
    { }

    protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            this.SeedUsers(builder);
            this.SeedRoles(builder);
            this.SeedUserRoles(builder);
        }

        private void SeedUsers(ModelBuilder builder)
        {
            var passwordHasher = new PasswordHasher<IdentityUser>();
             List<IdentityUser> users = new List<IdentityUser>()
            {
                        new IdentityUser {
                            Id = "b74ddd14-6340-4840-95c2-db12554843e5",
                            UserName = "admin@shaksz.com",
                            NormalizedUserName = "ADMIN@SHAKSZ.COM",
                            Email = "admin@hotmail.com",
                            NormalizedEmail = "ADMIN@SHAKSZ.COM",
                        }
            };
            builder.Entity<IdentityUser>().HasData(users);
            users[0].PasswordHash = passwordHasher.HashPassword(users[0], "Pass@123");

        }

        private void SeedRoles(ModelBuilder builder)
        {
            builder.Entity<IdentityRole>().HasData(
                new IdentityRole() { Id = "fab4fac1-c546-41de-aebc-a14da6895711", Name = "admin", ConcurrencyStamp = "1", NormalizedName = "admin" },
                new IdentityRole() { Id = "c7b013f0-5201-4317-abd8-c211f91b7330", Name = "operator", ConcurrencyStamp = "2", NormalizedName = "operator" },
                new IdentityRole() { Id = "c7b013f0-5201-4317-abd8-c211f91b7331", Name = "reader", ConcurrencyStamp = "3", NormalizedName = "reader" }
                );
        }

        private void SeedUserRoles(ModelBuilder builder)
        {
            builder.Entity<IdentityUserRole<string>>().HasData(
                new IdentityUserRole<string>() { RoleId = "fab4fac1-c546-41de-aebc-a14da6895711", UserId = "b74ddd14-6340-4840-95c2-db12554843e5" }
                );
        }
}