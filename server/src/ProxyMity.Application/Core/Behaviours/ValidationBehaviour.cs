namespace ProxyMity.Application.Core.Behaviours;

/// <summary>
/// Represents the validation behaviour middleware.
/// </summary>
/// <typeparam name="TRequest">The request type.</typeparam>
/// <typeparam name="TResponse">The response type.</typeparam>
public sealed class ValidationBehaviour<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse> {
    private readonly IEnumerable<IValidator<TRequest>> _validators;

    /// <summary>
    /// Initializes a new instance of the <see cref="ValidationBehaviour{TRequest,TResponse}"/> class.
    /// </summary>
    /// <param name="validators">The validator for the current request type.</param>
    public ValidationBehaviour(IEnumerable<IValidator<TRequest>> validators) {
        _validators = validators;
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken
    ) {
        var context = new ValidationContext<TRequest>(request);

        var validationFailures = await Task.WhenAll(
            _validators.Select(validator => validator.ValidateAsync(context))
        );

        var errors = validationFailures
            .Where(validationResult => !validationResult.IsValid)
            .SelectMany(validationResult => validationResult.Errors)
            .Select(validationFailure => new ValidationError(
                validationFailure.ErrorMessage,
                validationFailure.ErrorCode
            ))
            .ToList();

        if (errors.Any())
            throw new Exceptions.ValidationException(errors);

        return await next();
    }
}
