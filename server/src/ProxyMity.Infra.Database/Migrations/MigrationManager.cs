namespace ProxyMity.Infra.Database.Migrations;

public class MigrationManager(DbSession session, ILogger<MigrationManager> logger, IUnitOfWork unitOfWork)
{
    public async Task CheckIfTablesExist()
    {
        CancellationToken cancellationToken = new();

        var query = """
            SELECT 'user', EXISTS(SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user') AS "User"
            UNION ALL

            SELECT 'group', EXISTS(SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'group') AS "Group"
            UNION ALL

            SELECT 'conversation', EXISTS(SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'conversation') AS "Conversation"
            UNION ALL

            SELECT 'message', EXISTS(SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'message') AS "Message"
            UNION ALL

            SELECT 'participant', EXISTS(SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'participant') AS "Participant"
            UNION ALL

            SELECT 'message_status', EXISTS(SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'message_status') AS "MessageStatus"
         """;

        var lstTables = await session.Connection.QueryAsync<(string Name, bool Exist)>(query, null, session.Transaction);

        unitOfWork.BeginTransaction();

        foreach (var (name, exist) in lstTables)
            if (!exist) await CreateTable(name);

        await unitOfWork.CommitAsync(cancellationToken);
    }

    private async Task CreateTable(string tableName)
    {
        if (!Enum.TryParse(tableName, true, out ETables table))
            throw new MigrationException(tableName);

        try
        {
            logger.LogInformation($"Creating Table: {tableName} ({table})");

            await session.Connection.ExecuteAsync(table switch
            {
                ETables.user => UserTableScript.Create(),
                ETables.group => GroupTableScript.Create(),
                ETables.message => MessageTableScript.Create(),
                ETables.participant => ParticipantTableScript.Create(),
                ETables.conversation => ConversationTableScript.Create(),
                ETables.message_status => MessageStatusTableScript.Create(),

                _ => throw new NotImplementedException($"Failed: {tableName} not prepared"),
            }, null, session.Transaction);

            logger.LogInformation($"{table} was successfully created\n\n");
        }
        catch (Exception e)
        {
            logger.LogError($"Migration Failed: {e.Message}");
            throw new InternalMigrationException(e.Message);
        }
    }
}
