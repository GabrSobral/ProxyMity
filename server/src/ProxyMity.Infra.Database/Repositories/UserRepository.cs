namespace ProxyMity.Infra.Database.Repositories;

public class UserRepository : TRepository<UserRepository>, IUserRepository {
    public UserRepository(DbSession session) : base(session) { }

    public async Task CreateAsync(User newUser) {
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

        object parameters = new {
            id = newUser.Id,
            name = newUser.Name,
            email = newUser.Email,
            password = newUser.Password,
            createdAt = newUser.CreatedAt,
        };

        await _session.Connection.ExecuteAsync(sql, parameters, _session.Transaction);
    }

    public async Task<User?> FindByEmailAsync(string email) {
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
        return await _session.Connection.QueryFirstOrDefaultAsync<User>(sql, parameters);
    }

    public async Task<User?> FindByIdAsync(Guid userId) {
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
        return await _session.Connection.QueryFirstOrDefaultAsync<User>(sql, parameters);
    }
}
