namespace ProxyMity.Domain.Interfaces;

public interface IEmailSender
{
    public Task SendVerificationEmailAsync(string email, EmailConfirmation emailConfirmation, CancellationToken cancellationToken);
}
