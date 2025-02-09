using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using Admin.Controllers;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using Moq;
using Xunit;

namespace Admin.Tests.Controllers
{
    public class AdminControllerTests
    {
        [Fact]
        public async Task GetUsers_ReturnsListOfUsers()
        {
            // Arrange
            var mockUserManager = MockUserManager<IdentityUser>();
            var mockRoleManager = MockRoleManager<IdentityRole>();

            // Create a list of users to return from the mock UserManager
            var users = new List<IdentityUser>
            {
                new IdentityUser { UserName = "user1" },
                new IdentityUser { UserName = "user2" }
            }.AsQueryable();

            // Mock the Users property to return the list of users
            var mockDbSet = new Mock<DbSet<IdentityUser>>();
            mockDbSet.As<IAsyncEnumerable<IdentityUser>>()
                .Setup(m => m.GetAsyncEnumerator(It.IsAny<CancellationToken>()))
                .Returns(new TestAsyncEnumerator<IdentityUser>(users.GetEnumerator()));

            mockDbSet.As<IQueryable<IdentityUser>>()
                .Setup(m => m.Provider)
                .Returns(new TestAsyncQueryProvider<IdentityUser>(users.Provider));

            mockDbSet.As<IQueryable<IdentityUser>>()
                .Setup(m => m.Expression)
                .Returns(users.Expression);

            mockDbSet.As<IQueryable<IdentityUser>>()
                .Setup(m => m.ElementType)
                .Returns(users.ElementType);

            mockDbSet.As<IQueryable<IdentityUser>>()
                .Setup(m => m.GetEnumerator())
                .Returns(users.GetEnumerator());

            mockUserManager.Setup(um => um.Users).Returns(mockDbSet.Object);

            var controller = new AdminController(mockUserManager.Object, mockRoleManager.Object);

            // Act
            var result = await controller.GetUsers();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnedUsers = Assert.IsType<List<IdentityUser>>(okResult.Value);
            Assert.Equal(2, returnedUsers.Count);
        }

        private static Mock<UserManager<TUser>> MockUserManager<TUser>() where TUser : class
        {
            var store = new Mock<IUserStore<TUser>>();
            return new Mock<UserManager<TUser>>(store.Object, null, null, null, null, null, null, null, null);
        }

        private static Mock<RoleManager<TRole>> MockRoleManager<TRole>() where TRole : class
        {
            var store = new Mock<IRoleStore<TRole>>();
            return new Mock<RoleManager<TRole>>(store.Object, null, null, null, null);
        }
    }

    // Helper classes to mock IAsyncEnumerable and IAsyncQueryProvider
    public class TestAsyncEnumerator<T> : IAsyncEnumerator<T>
    {
        private readonly IEnumerator<T> _inner;

        public TestAsyncEnumerator(IEnumerator<T> inner)
        {
            _inner = inner;
        }

        public T Current => _inner.Current;

        public ValueTask DisposeAsync()
        {
            _inner.Dispose();
            return ValueTask.CompletedTask;
        }

        public ValueTask<bool> MoveNextAsync()
        {
            return ValueTask.FromResult(_inner.MoveNext());
        }
    }

    public class TestAsyncQueryProvider<T> : IAsyncQueryProvider
    {
        private readonly IQueryProvider _inner;

        public TestAsyncQueryProvider(IQueryProvider inner)
        {
            _inner = inner;
        }

        public IQueryable CreateQuery(Expression expression)
        {
            return new TestAsyncEnumerable<T>(expression);
        }

        public IQueryable<TElement> CreateQuery<TElement>(Expression expression)
        {
            return new TestAsyncEnumerable<TElement>(expression);
        }

        public object Execute(Expression expression)
        {
            return _inner.Execute(expression);
        }

        public TResult Execute<TResult>(Expression expression)
        {
            return _inner.Execute<TResult>(expression);
        }

        public TResult ExecuteAsync<TResult>(Expression expression, CancellationToken cancellationToken = default)
        {
            var expectedResultType = typeof(TResult).GetGenericArguments()[0];
            var executionResult = _inner.Execute(expression);

            return (TResult)typeof(Task).GetMethod(nameof(Task.FromResult))
                ?.MakeGenericMethod(expectedResultType)
                .Invoke(null, new[] { executionResult });
        }
    }

    public class TestAsyncEnumerable<T> : EnumerableQuery<T>, IAsyncEnumerable<T>, IQueryable<T>
    {
        public TestAsyncEnumerable(IEnumerable<T> enumerable)
            : base(enumerable)
        {
        }

        public TestAsyncEnumerable(Expression expression)
            : base(expression)
        {
        }

        public IAsyncEnumerator<T> GetAsyncEnumerator(CancellationToken cancellationToken = default)
        {
            return new TestAsyncEnumerator<T>(this.AsEnumerable().GetEnumerator());
        }

        IQueryProvider IQueryable.Provider => new TestAsyncQueryProvider<T>(this);
    }
}