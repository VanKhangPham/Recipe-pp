using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using RecipeHub.Application.Features;
using RecipeHub.Application.Identity;
using RecipeHub.Application.Recipes;
using RecipeHub.Domain.Features;
using RecipeHub.Domain.Recipes;
using RecipeHub.Infrastructure.Identity;
using RecipeHub.Infrastructure.Persistence;
using RecipeHub.Infrastructure.Recipes;
using static RecipeHub.Infrastructure.Recipes.RecipeService;

namespace RecipeHub.Infrastructure.Features;

public sealed class AdministrationService(RecipeHubDbContext db, RecipeService recipes, UserManager<ApplicationUser> users,
    RoleManager<IdentityRole<Guid>> roles, IAuthService auth, TimeProvider clock) : IAdministrationService
{
    public async Task<DatasetReviewDto> ReviewDatasetAsync(Guid actorId, Guid recipeId, DatasetReviewWrite request, CancellationToken ct)
    {
        if (request.Status is not ("Pending" or "Approved" or "Rejected")) throw Invalid("Invalid dataset review status.");
        if (request.Status == "Approved" && (string.IsNullOrWhiteSpace(request.SourceName) || string.IsNullOrWhiteSpace(request.LicenseIdentifier)))
            throw Invalid("Approval requires a verified source name and license identifier.");
        if (request.SourceUrl is not null && (!Uri.TryCreate(request.SourceUrl, UriKind.Absolute, out var url) || url.Scheme != "https"))
            throw Invalid("Source URL must be absolute HTTPS or null.");
        await using var transaction = await db.Database.BeginTransactionAsync(ct);
        await db.Database.ExecuteSqlInterpolatedAsync($"SELECT 1 FROM \"Recipes\" WHERE \"Id\" = {recipeId} FOR UPDATE", ct);
        var recipe = await db.Recipes.SingleOrDefaultAsync(value => value.Id == recipeId, ct) ?? throw Missing();
        await db.Entry(recipe).ReloadAsync(ct);
        var entry = await db.Set<RecipeDatasetEntry>().SingleOrDefaultAsync(value => value.RecipeId == recipeId, ct) ?? throw Missing();
        await db.Entry(entry).ReloadAsync(ct);
        entry.ReviewStatus = request.Status;
        entry.SourceName = request.SourceName?.Trim();
        entry.SourceUrl = request.SourceUrl;
        entry.LicenseIdentifier = request.LicenseIdentifier?.Trim();
        if (request.Status != "Approved" && recipe.Status == "Published") recipe.Status = "Draft";
        recipe.UpdatedAt = clock.GetUtcNow();
        Audit(actorId, "DatasetReview" + request.Status, "Recipe", recipeId);
        await recipes.SaveAsync(ct);
        await transaction.CommitAsync(ct);
        return new(recipeId, entry.DatasetKey, entry.ReviewStatus, entry.SourceName, entry.SourceUrl, entry.LicenseIdentifier);
    }

    private IQueryable<AdminUserDto> UserDtos(IQueryable<ApplicationUser> accounts) => accounts.Select(user => new AdminUserDto(user.Id, user.Email!, user.DisplayName,
        (from link in db.UserRoles join role in db.Roles on link.RoleId equals role.Id where link.UserId == user.Id select role.Name!).ToArray(),
        user.LockoutEnabled && user.LockoutEnd > clock.GetUtcNow(), user.CreatedAt));
    public async Task<PageResult<AdminUserDto>> UsersAsync(PageQuery page, CancellationToken ct) => new(
        await UserDtos(db.Users.OrderByDescending(x => x.CreatedAt).ThenBy(x => x.Id).Skip((page.Page - 1) * page.PageSize).Take(page.PageSize)).ToListAsync(ct),
        page.Page, page.PageSize, await db.Users.CountAsync(ct));
    public async Task<AdminUserDto> SetUserStatusAsync(Guid actorId, Guid targetId, bool locked, CancellationToken ct)
    {
        if (locked && actorId == targetId) throw Conflict("Cannot lock your own account.");
        await using var transaction = await db.Database.BeginTransactionAsync(ct);
        await db.Database.ExecuteSqlRawAsync("SELECT pg_advisory_xact_lock(72100402)", ct);
        var user = await db.Users.SingleOrDefaultAsync(x => x.Id == targetId, ct) ?? throw Missing();
        // Use the same row lock as login/refresh before changing lockout and revoking sessions.
        await db.Database.ExecuteSqlInterpolatedAsync($"SELECT 1 FROM \"AspNetUsers\" WHERE \"Id\" = {targetId} FOR UPDATE", ct);
        await db.Entry(user).ReloadAsync(ct);
        if (locked && await users.IsInRoleAsync(user, "Admin"))
        {
            var activeAdmins = await (from account in db.Users join link in db.UserRoles on account.Id equals link.UserId
                join role in db.Roles on link.RoleId equals role.Id
                where role.Name == "Admin" && (!account.LockoutEnabled || account.LockoutEnd == null || account.LockoutEnd <= clock.GetUtcNow()) select account.Id).Distinct().CountAsync(ct);
            if (activeAdmins <= 1) throw Conflict("Cannot lock the last active administrator.");
        }
        user.LockoutEnabled = true; user.LockoutEnd = locked ? clock.GetUtcNow().AddYears(100) : null;
        user.AccessFailedCount = 0; user.UpdatedAt = clock.GetUtcNow();
        if (!(await users.UpdateAsync(user)).Succeeded) throw Conflict("User update conflict.");
        if (locked) await db.RefreshTokens.Where(x => x.UserId == targetId && x.RevokedAt == null)
            .ExecuteUpdateAsync(setters => setters.SetProperty(x => x.RevokedAt, (DateTimeOffset?)clock.GetUtcNow()), ct);
        Audit(actorId, locked ? "UserLocked" : "UserUnlocked", "User", targetId);
        await recipes.SaveAsync(ct); await transaction.CommitAsync(ct);
        return await UserDtos(db.Users.Where(x => x.Id == targetId)).SingleAsync(ct);
    }
    private IQueryable<ReviewDto> ReviewsQuery(IQueryable<Review> reviews) => from review in reviews join user in db.Users on review.UserId equals user.Id
        select new ReviewDto(review.Id, review.RecipeId, new PublicAuthor(user.Id, user.DisplayName), review.Rating, review.Comment,
            review.CreatedAt, review.UpdatedAt, review.ModerationStatus);
    public async Task<PageResult<ReviewDto>> ReviewsAsync(string? status, PageQuery page, CancellationToken ct)
    {
        if (status is not null && status is not ("Pending" or "Visible" or "Hidden")) throw Invalid("Invalid moderation status.");
        var query = db.Set<Review>().AsQueryable(); if (status is not null) query = query.Where(x => x.ModerationStatus == status);
        return new(await ReviewsQuery(query.OrderByDescending(x => x.CreatedAt).ThenBy(x => x.Id).Skip((page.Page - 1) * page.PageSize).Take(page.PageSize)).ToListAsync(ct),
            page.Page, page.PageSize, await query.CountAsync(ct));
    }
    public async Task<ReviewDto> ModerateAsync(Guid actorId, Guid id, string status, CancellationToken ct)
    {
        if (status is not ("Visible" or "Hidden")) throw Invalid("Invalid moderation status.");
        var review = await db.Set<Review>().FindAsync([id], ct) ?? throw Missing();
        review.ModerationStatus = status; review.UpdatedAt = clock.GetUtcNow(); Audit(actorId, "ReviewModerated", "Review", id);
        await recipes.SaveAsync(ct); return await ReviewsQuery(db.Set<Review>().Where(x => x.Id == id)).SingleAsync(ct);
    }
    public async Task<AnalyticsDto> AnalyticsAsync(DateTimeOffset? from, DateTimeOffset? to, CancellationToken ct)
    {
        var end = (to ?? clock.GetUtcNow()).ToUniversalTime(); var start = (from ?? end.AddDays(-30)).ToUniversalTime();
        if (start >= end || end - start > TimeSpan.FromDays(366)) throw Invalid("Analytics range must be positive and at most 366 days.");
        var views = db.Set<RecipeView>().Where(x => x.ViewedAt >= start && x.ViewedAt < end);
        var favorites = db.Set<Favorite>().Where(x => x.CreatedAt >= start && x.CreatedAt < end);
        var mostViewed = await (from view in views join recipe in db.Recipes on view.RecipeId equals recipe.Id
            group view by new { recipe.Id, recipe.Title } into grouped orderby grouped.Count() descending, grouped.Key.Id
            select new RecipeMetric(grouped.Key.Id, grouped.Key.Title, grouped.Count())).Take(10).ToArrayAsync(ct);
        var mostFavorited = await (from favorite in favorites join recipe in db.Recipes on favorite.RecipeId equals recipe.Id
            group favorite by new { recipe.Id, recipe.Title } into grouped orderby grouped.Count() descending, grouped.Key.Id
            select new RecipeMetric(grouped.Key.Id, grouped.Key.Title, grouped.Count())).Take(10).ToArrayAsync(ct);
        var dailyViews = await views.GroupBy(x => DateOnly.FromDateTime(x.ViewedAt.UtcDateTime)).Select(x => new { Date = x.Key, Count = x.Count() }).ToListAsync(ct);
        var dailyUsers = await db.Users.Where(x => x.CreatedAt >= start && x.CreatedAt < end).GroupBy(x => DateOnly.FromDateTime(x.CreatedAt.UtcDateTime))
            .Select(x => new { Date = x.Key, Count = x.Count() }).ToListAsync(ct);
        var activity = dailyViews.Select(x => x.Date).Union(dailyUsers.Select(x => x.Date)).Order()
            .Select(date => new DailyActivity(date, dailyViews.FirstOrDefault(x => x.Date == date)?.Count ?? 0, dailyUsers.FirstOrDefault(x => x.Date == date)?.Count ?? 0)).ToArray();
        return new(await db.Users.CountAsync(ct), await db.Recipes.CountAsync(ct), await views.CountAsync(ct), await favorites.CountAsync(ct), mostViewed, mostFavorited, activity,
            await db.Recipes.GroupBy(x => x.Status).Select(x => new StatusCount(x.Key, x.Count())).ToArrayAsync(ct));
    }
    public async Task BootstrapAdminAsync(string email, string password, string displayName, CancellationToken ct)
    {
        var user = await users.FindByEmailAsync(email.Trim());
        if (user is null)
        {
            var created = await auth.RegisterAsync(new(email, password, displayName), ct);
            user = await db.Users.SingleAsync(x => x.Id == created.Id, ct);
        }
        else if (!await users.CheckPasswordAsync(user, password) || await users.IsLockedOutAsync(user))
            throw new AuthException(AuthError.Unauthorized, "Existing account credentials are invalid or locked.");
        await using var transaction = await db.Database.BeginTransactionAsync(ct);
        await db.Database.ExecuteSqlRawAsync("SELECT pg_advisory_xact_lock(72100402)", ct);
        if (!await roles.RoleExistsAsync("Admin") && !(await roles.CreateAsync(new IdentityRole<Guid>("Admin") { Id = Guid.NewGuid() })).Succeeded)
            throw new InvalidOperationException("Cannot initialize Admin role.");
        if (!await users.IsInRoleAsync(user, "Admin") && !(await users.AddToRoleAsync(user, "Admin")).Succeeded)
            throw new InvalidOperationException("Cannot assign Admin role.");
        Audit(user.Id, "AdminBootstrapped", "User", user.Id); await recipes.SaveAsync(ct); await transaction.CommitAsync(ct);
    }
    private void Audit(Guid actor, string action, string entity, Guid id) => db.Add(new AuditLog
        { ActorUserId = actor, Action = action, EntityType = entity, EntityId = id.ToString(), OccurredAt = clock.GetUtcNow() });
}

