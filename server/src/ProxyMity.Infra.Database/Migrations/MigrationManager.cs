namespace ProxyMity.Infra.Database.Migrations;

public class MigrationManager
{
    private readonly DbSession _session;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<MigrationManager> _logger;

    public MigrationManager(DbSession session, ILogger<MigrationManager> logger, IUnitOfWork unitOfWork)
    {
        _session = session;
        _logger = logger;
        _unitOfWork = unitOfWork;
    }

    public async Task CheckIfTablesExist()
    {
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

        var lstTables = await _session.Connection.QueryAsync<(string Name, bool Exist)>(query, null, _session.Transaction);

        _unitOfWork.BeginTransaction();

        foreach (var (name, exist) in lstTables)
            if (!exist) await CreateTable(name);

        _unitOfWork.Commit();
    }

    private async Task CreateTable(string tableName)
    {
        if (!Enum.TryParse(tableName, true, out ETables table))
            throw new MigrationException(tableName);

        try
        {
            _logger.LogInformation($"Creating Table: {tableName} ({table})");

            await _session.Connection.ExecuteAsync(table switch
            {
                ETables.user => UserTableScript.Create(),
                ETables.group => GroupTableScript.Create(),
                ETables.message => MessageTableScript.Create(),
                ETables.participant => ParticipantTableScript.Create(),
                ETables.conversation => ConversationTableScript.Create(),
                ETables.message_status => MessageStatusTableScript.Create(),

                _ => throw new NotImplementedException($"Failed: {tableName} not prepared"),
            }, null, _session.Transaction);

            _logger.LogInformation($"{table} was successfully created\n\n");
        }
        catch (Exception e)
        {
            _logger.LogError($"Migration Failed: {e.Message}");
            throw new InternalMigrationException(e.Message);
        }
    }
}
