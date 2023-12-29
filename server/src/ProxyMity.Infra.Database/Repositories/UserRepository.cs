namespace ProxyMity.Infra.Database.Repositories;

public class UserRepository(DbSession session):IUserRepository
{
    public async Task CreateAsync(User newUser)
    {
        const string sql = """
            INSERT INTO "user" (
                "id", 
                "name", 
                "email", 
                "password", 
                "created_at"
            ) VALUES (
                @id, 
                @name, 
                @email, 
                @password, 
                @createdAt
            );
        """;

        object parameters = new
        {
            id = newUser.Id,
            name = newUser.Name,
            email = newUser.Email,
            password = newUser.Password,
            createdAt = newUser.CreatedAt,
        };

        await session.Connection.ExecuteAsync(sql, parameters, session.Transaction);
    }

    public async Task<User?> FindByEmailAsync(string email)
    {
        const string sql = """
            SELECT 
                id AS "Id", 
                name AS "Name", 
                email AS "Email", 
                password AS "Password", 
                created_at AS "CreatedAt", 
                last_online AS "LastOnline", 
                photo_url AS "PhotoUrl"
            FROM "user"
            WHERE email = @email;
        """;

        object parameters = new { email };
        return await session.Connection.QueryFirstOrDefaultAsync<User>(sql, parameters);
    }

    public async Task<User?> FindByIdAsync(Ulid userId)
    {
        const string sql = """
            SELECT 
                id AS "Id", 
                name AS "Name", 
                email AS "Email", 
                password AS "Password", 
                created_at AS "CreatedAt", 
                last_online AS "LastOnline", 
                photo_url AS "PhotoUrl"
            FROM "user"
            WHERE id = @userId;
        """;

        object parameters = new { userId };
        return await session.Connection.QueryFirstOrDefaultAsync<User>(sql, parameters);
    }
}
