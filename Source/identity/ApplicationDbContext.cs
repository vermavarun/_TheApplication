using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

public class ApplicationDbContext : IdentityDbContext<UserModel>
{
    public DbSet<UserDetail> UserDetails { get; set; }
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) :
        base(options)
    { }

    protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // UserDetail has a one-to-one relationship with UserModel
            builder.Entity<UserDetail>()
                .HasOne<UserModel>()
                .WithOne()
                .HasForeignKey<UserDetail>(ud => ud.Id);

            this.SeedRoles(builder);
            this.SeedUsers(builder);
            this.SeedUserRoles(builder);
        }

        private void SeedUsers(ModelBuilder builder)
{
    var passwordHasher = new PasswordHasher<UserModel>();
    var user = new UserModel
    {
        Id = "b74ddd14-6340-4840-95c2-db12554843e5",
        UserName = "admin@shaksz.com",
        NormalizedUserName = "ADMIN@SHAKSZ.COM",
        Email = "admin@hotmail.com",
        NormalizedEmail = "ADMIN@SHAKSZ.COM",
        EmailConfirmed = true,
        SecurityStamp = Guid.NewGuid().ToString("D"),
        ConcurrencyStamp = Guid.NewGuid().ToString("D")
    };
    user.PasswordHash = passwordHasher.HashPassword(user, "Pass@123");

    builder.Entity<UserModel>().HasData(user);
}


        private void SeedRoles(ModelBuilder builder)
        {
            builder.Entity<IdentityRole>().HasData(
                new IdentityRole() { Id = "fab4fac1-c546-41de-aebc-a14da6895711", Name = "admin", ConcurrencyStamp = "1", NormalizedName = "ADMIN" },
                new IdentityRole() { Id = "c7b013f0-5201-4317-abd8-c211f91b7330", Name = "operator", ConcurrencyStamp = "2", NormalizedName = "OPERATOR" },
                new IdentityRole() { Id = "c7b013f0-5201-4317-abd8-c211f91b7331", Name = "reader", ConcurrencyStamp = "3", NormalizedName = "READER" }
                );
        }

        private void SeedUserRoles(ModelBuilder builder)
        {
            builder.Entity<IdentityUserRole<string>>().HasData(
                new IdentityUserRole<string>() { RoleId = "fab4fac1-c546-41de-aebc-a14da6895711", UserId = "b74ddd14-6340-4840-95c2-db12554843e5" }
                );
        }
}