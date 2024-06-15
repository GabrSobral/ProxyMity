
namespace ProxyMity.Infra.Email.Handlers;

internal class EmailSender : IEmailSender
{
    public Task SendVerificationEmailAsync(string email, EmailConfirmation emailConfirmation, CancellationToken cancellationToken)
    {
        Console.WriteLine($"Email sended to {email}");

        return Task.CompletedTask;
    }
}
