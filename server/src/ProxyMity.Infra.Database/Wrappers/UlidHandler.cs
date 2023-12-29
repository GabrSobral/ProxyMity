using static Dapper.SqlMapper;

namespace ProxyMity.Infra.Database.Wrappers;

internal class BinaryUlidHandler : TypeHandler<Ulid>
{
    public override Ulid Parse(object value) => new Ulid((byte[]) value);

    public override void SetValue(IDbDataParameter parameter, Ulid value)
    {
        parameter.DbType = DbType.Binary;
        parameter.Size = 16;
        parameter.Value = value.ToByteArray();
    }
}

internal class StringUlidHandler : TypeHandler<Ulid>
{
    public override Ulid Parse(object value) => Ulid.Parse((string)value);

    public override void SetValue(IDbDataParameter parameter, Ulid value)
    {
        parameter.DbType = DbType.StringFixedLength;
        parameter.Size = 26;
        parameter.Value = value.ToString();
    }
}

