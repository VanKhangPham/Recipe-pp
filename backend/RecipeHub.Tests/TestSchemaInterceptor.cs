using System.Data.Common;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace RecipeHub.Tests;

internal sealed class TestSchemaInterceptor(string schema) : DbConnectionInterceptor
{
    private DbCommand SelectSchema(DbConnection connection)
    {
        var command = connection.CreateCommand();
        command.CommandText = "SELECT set_config('search_path', @schema, false); SELECT current_schema()";
        var parameter = command.CreateParameter();
        parameter.ParameterName = "schema";
        parameter.Value = schema;
        command.Parameters.Add(parameter);
        return command;
    }

    public override async Task ConnectionOpenedAsync(DbConnection connection, ConnectionEndEventData eventData, CancellationToken cancellationToken = default)
    {
        await using var command = SelectSchema(connection);
        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        if (!await reader.NextResultAsync(cancellationToken) || !await reader.ReadAsync(cancellationToken) || reader.GetString(0) != schema)
            throw new InvalidOperationException("Test schema unavailable.");
    }

    public override void ConnectionOpened(DbConnection connection, ConnectionEndEventData eventData)
    {
        using var command = SelectSchema(connection);
        using var reader = command.ExecuteReader();
        if (!reader.NextResult() || !reader.Read() || reader.GetString(0) != schema)
            throw new InvalidOperationException("Test schema unavailable.");
    }
}
