namespace ProxyMity.Unit.Utils;

public class TestOptions<T> : IOptions<T> where T : class, new() {
    public T Value { get; }

    public TestOptions(T value) {
        Value = value;
    }
}
