namespace ProxyMity.Infra.Database.Repositories;

public class GroupRepository(DbSession session) :  IGroupRepository
{
    public async Task CreateAsync(Group newGroup)
    {
        const string sql = """
            INSERT INTO "group" (id, name, description, created_at, created_by)
            VALUES (@id, @name, @description, @createdAt, @created_by);
        """;

        object parameters = new
        {
            id = newGroup.Id,
            name = newGroup.Name,
            description = newGroup.Description,
            createdAt = newGroup.CreatedAt,
            created_by = newGroup.CreatedBy,
        };

        await session.Connection.ExecuteAsync(sql, parameters, session.Transaction);
    }

    public async Task<Group?> FindByIdAsync(Ulid groupId)
    {
        const string sql = """
            SELECT 
                id AS Id, 
                name AS Name, 
                description AS Description, 
                created_at AS CreatedAt,
                created_by AS CreatedBy
            FROM "group"
            WHERE id = @groupId;
        """;

        object parameters = new { groupId };
        return await session.Connection.QueryFirstOrDefaultAsync<Group>(sql, parameters);
    }
}
