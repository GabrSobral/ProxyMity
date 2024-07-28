namespace ProxyMity.Unit.Interfaces;

public class InMemoryRepository<T> {
    public List<T> Items { get; set; } = [];
}
