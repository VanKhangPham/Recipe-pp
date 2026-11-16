using System.Collections.Concurrent;
using Microsoft.Extensions.Logging;
using Npgsql;

namespace RecipeHub.Tests;

// Capture exception types and SQLSTATE only. Provider messages may contain connection details.
internal sealed class TestErrorLogger : ILoggerProvider
{
    private readonly ConcurrentQueue<string> errors = new();
    public string Diagnostics => string.Join(Environment.NewLine, errors);
    public ILogger CreateLogger(string categoryName) => new ErrorLogger(this, categoryName);
    public void Dispose() { }

    private sealed class ErrorLogger(TestErrorLogger owner, string category) : ILogger
    {
        public IDisposable? BeginScope<TState>(TState state) where TState : notnull => null;
        public bool IsEnabled(LogLevel logLevel) => logLevel >= LogLevel.Error;
        public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception? exception,
            Func<TState, Exception?, string> formatter)
        {
            if (!IsEnabled(logLevel)) return;
            for (var current = exception; current is not null; current = current.InnerException)
                owner.errors.Enqueue(category + " " + current.GetType().FullName +
                    (current is PostgresException postgres ? " SQLSTATE=" + postgres.SqlState : "") +
                    Environment.NewLine + current.StackTrace);
        }
    }
}
