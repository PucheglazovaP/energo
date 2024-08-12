using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Configuration.Json;
using RabbitMQ.Client.Events;
using RabbitMQ.Client;
using System.Reflection;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using Newtonsoft.Json;
using System.Data;
using System.Net.WebSockets;
using System.Drawing;
using Microsoft.IdentityModel.Protocols;
using System.Web;
using System.Reflection.Emit;

class RpcSqlServer
{
    internal static IConfiguration? _configuration;

    internal static Dictionary<string, CommandType> CommandTypes { get; } = new Dictionary<string, CommandType>
    {
        {"StoredProcedure", CommandType.StoredProcedure },
        {"TableDirect", CommandType.TableDirect },
        {"Text", CommandType.Text }
    };
    internal static Dictionary<string, ParameterDirection> ParamDirections { get; } = new Dictionary<string, ParameterDirection>
    {
        { "Input", ParameterDirection.Input },
        { "Output", ParameterDirection.Output },
        { "InputOutput", ParameterDirection.InputOutput },
        { "ReturnValue", ParameterDirection.ReturnValue }
    };
    internal static Dictionary<string, DbType> DbTypes { get; } = new Dictionary<string, DbType>
    {
        { "AnsiString", DbType.AnsiString },
        { "AnsiStringFixedLength", DbType.AnsiStringFixedLength },
        { "Binary", DbType.Binary },
        { "Boolean", DbType.Boolean },
        { "Byte", DbType.Byte },
        { "Currency", DbType.Currency },
        { "Date", DbType.Date },
        { "DateTime", DbType.DateTime },
        { "DateTime2", DbType.DateTime2 },
        { "Decimal", DbType.Decimal },
        { "Double", DbType.Double },
        { "Guid", DbType.Guid },
        { "Int16", DbType.Int16 },
        { "Int32", DbType.Int32 },
        { "Int64", DbType.Int64 },
        { "Object", DbType.Object },
        { "SByte", DbType.SByte },
        { "Single", DbType.Single },
        { "String", DbType.String },
        { "StringFixedLength", DbType.StringFixedLength },
        { "Time", DbType.Time },
        { "UInt16", DbType.UInt16 },
        { "UInt32", DbType.UInt32 },
        { "UInt64", DbType.UInt64 },
        { "VarNumeric", DbType.VarNumeric },
        { "Xml", DbType.Xml }
    };

    private static string SQLConnection = "";
    private static string RabbitConnection = "";
    private static string QueueName = "";
    private static bool keepRunning = true;

    public static void Main()
    {
        _configuration = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
            .AddUserSecrets(typeof(RpcSqlServer).GetTypeInfo().Assembly, optional: true)
            .AddEnvironmentVariables()
            .Build();

        RabbitConnection = _configuration.GetConnectionString("RabbitConnection");
        if (_configuration["RABBITMQ_HOST"] != null && _configuration["RABBITMQ_PORT"] != null && _configuration["RABBITMQ_VHOST"] != null &&
           _configuration["RABBITMQ_USER"] != null && _configuration["RABBITMQ_PASSWORD"] != null)
        {
            RabbitConnection = String.Format("amqp://{0}:{1}@{2}:{3}/{4}", _configuration["RABBITMQ_USER"], _configuration["RABBITMQ_PASSWORD"],
                _configuration["RABBITMQ_HOST"], _configuration["RABBITMQ_PORT"], _configuration["RABBITMQ_VHOST"]);
        }

        SQLConnection = _configuration.GetConnectionString("SQLConnection");
        if(_configuration["DATABASE_HOST"] != null && _configuration["DATABASE_INSTANCE"] != null && _configuration["DATABASE_NAME"] != null &&
           _configuration["DATABASE_INTEGRATEDSECURITY"] != null) {
            SQLConnection = string.Format("Data Source={0}{1};Initial Catalog={2};Integrated security={3};User Id={4};Password={5};TrustServerCertificate=True",
                _configuration["DATABASE_HOST"],
                _configuration["DATABASE_INSTANCE"] != string.Empty ? string.Concat("\\", _configuration["DATABASE_INSTANCE"]) : string.Empty,
                _configuration["DATABASE_NAME"],
                _configuration["DATABASE_INTEGRATEDSECURITY"],
                _configuration["DATABASE_USER"],
                _configuration["DATABASE_PASS"]);
        }

        QueueName = _configuration["RabbitSettings:QueueName"];
        if (_configuration["RABBITMQ_QUEUE"] != null) { QueueName = _configuration["RABBITMQ_QUEUE"]; }

        var factory = new ConnectionFactory() { Uri = new UriBuilder(RabbitConnection).Uri };
        using var connection = factory.CreateConnection();
        using var channel = connection.CreateModel();
        channel.QueueDeclare(queue: QueueName, durable: false,
          exclusive: false, autoDelete: false, arguments: null);
        channel.BasicQos(0, 1, false);
        var consumer = new EventingBasicConsumer(channel);
        channel.BasicConsume(queue: QueueName,
          autoAck: false, consumer: consumer);
        Console.WriteLine(" [x] Awaiting RPC requests");

        consumer.Received += (model, ea) =>
        {
            string response = "";

            var body = ea.Body.ToArray();
            var props = ea.BasicProperties;
            var replyProps = channel.CreateBasicProperties();
            replyProps.CorrelationId = props.CorrelationId;

            try
            {
                var message = Encoding.UTF8.GetString(body);
                response = dbquery(message);
            }
            catch (Exception e)
            {
                Console.WriteLine(" [.] " + e.Message);
                response = "";
            }
            finally
            {
                var responseBytes = Encoding.UTF8.GetBytes(response);
                channel.BasicPublish(exchange: "", routingKey: props.ReplyTo,
                  basicProperties: replyProps, body: responseBytes);
                channel.BasicAck(deliveryTag: ea.DeliveryTag,
                  multiple: false);
            }
        };

        Console.WriteLine(" Press [Ctrl-C] to exit.");
        Console.CancelKeyPress += delegate (object? sender, ConsoleCancelEventArgs e) {
            e.Cancel = true;
            keepRunning = false;
        };

        while (keepRunning) { Thread.Sleep(1); }
    }

    private static string dbquery(string message)
    {
        string prnOutput = "";
        List<SqlParameter> OutputParams = new();
        var answer = new Answer();
        var columns = new List<string>();
        var rows = new List<Dictionary<string, object>>();
        Table table = new();
        DataTable schemaTable = new();
        DataTable schema = new();

        try
        {
            string connetionString = SQLConnection;
            var oRequest = JsonConvert.DeserializeObject<DbCommand>(message);
            if (oRequest is not null)
            {
                answer.Request = oRequest;

                using (SqlConnection con = new SqlConnection(connetionString))
                {
                con.Open();
                //Console.WriteLine(con.ClientConnectionId);

                // Печать внутри процедур
                con.InfoMessage += (object obj, SqlInfoMessageEventArgs e) =>
                {
                    prnOutput += e.Message + "\\n";
                };

                using (SqlCommand command = new SqlCommand(oRequest.Sql, con))
                {
                    // Только процедуры и функции
                    command.CommandType = CommandType.StoredProcedure;

                    // Параметры input/output
                    foreach (var item in oRequest.Parameters)
                    {
                        SqlParameter param = new(item.Name, (item.Value != null ? item.Value : DBNull.Value))
                        {
                            DbType = DbTypes.FirstOrDefault(t => t.Key == item.DbType).Value,
                            Direction = ParamDirections.FirstOrDefault(t => t.Key == item.Direction).Value
                        };

                        if (item.DbType == "Guid" && item.Value != null)
                        {
                            param.Value = new Guid((string)param.Value);
                        }

                        if (item.Size is not null)
                        {
                            param.Size = int.Parse(item.Size);
                        }

                        if (param.Direction == ParameterDirection.Output || param.Direction == ParameterDirection.InputOutput)
                        {
                            OutputParams.Add(param);
                        }

                        command.Parameters.Add(param);
                    }

                    // Код возврата
                    SqlParameter retval = new("@ReturnValue", System.Data.SqlDbType.Int)
                    {
                        Direction = System.Data.ParameterDirection.ReturnValue
                    };
                    command.Parameters.Add(retval);
                    OutputParams.Add(retval);

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        do
                        {
                            schema = new();
                            schema.Clear();
                            schema.Columns.Add("ColumnName");
                            schema.Columns.Add("ColumnOrdinal");
                            schema.Columns.Add("ColumnSize");
                            schema.Columns.Add("DataType");

                            schemaTable = reader.GetSchemaTable();
                            foreach (DataRow row in schemaTable.Rows)
                            {
                                DataRow _r = schema.NewRow();
                                _r["ColumnName"] = row["ColumnName"];
                                _r["ColumnOrdinal"] = row["ColumnOrdinal"];
                                _r["ColumnSize"] = row["ColumnSize"];
                                _r["DataType"] = row["DataType"];
                                schema.Rows.Add(_r);
                            }

                            columns = new List<string>();
                            for (var i = 0; i < reader.FieldCount; i++)
                            {
                                columns.Add(reader.GetName(i));
                            }

                            rows = new List<Dictionary<string, object>>();
                            while (reader.Read())
                            {
                                rows.Add(columns.ToDictionary(column => column, column => reader[column]));
                            }

                            table = new Table();
                            table.Structure = schema;
                            table.Rows = rows;
                            answer.Response.Tables.Add(table);

                        } while (reader.NextResult()); // Если возвращается несколько таблиц
                    }

                    DataTable outTable = new();
                    foreach (var item in OutputParams)
                    {
                        DataColumn column = new(item.ParameterName);
                        outTable.Columns.Add(column);
                    }
                    DataRow newRow = outTable.NewRow();
                    foreach (var item in OutputParams)
                    {
                        newRow[item.ParameterName] = item.Value.ToString();
                    }
                    outTable.Rows.Add(newRow);
                    answer.Response.OutParameters = outTable;
                    answer.Response.PrintOutput = prnOutput;
                }
                con.Close();
                }

            }
        }
        catch (SqlException e)
        {
            Console.WriteLine(e.ToString());
            answer.Response.Error = e.Message.Replace("\"", "'").Replace("\\", "\\\\").Replace("\r\n", "\\n");
        }

        return JsonConvert.SerializeObject(answer, Formatting.Indented);
    }
}

public class Parameter
{
    public string Name { get; set; } = "";
    public string DbType { get; set; } = "";
    public string? Value { get; set; }
    public string Direction { get; set; } = "";
    public string? Size { get; set; }
}

public class DbCommand
{
    public string Sql { get; set; } = "";
    public string? CommandType { get; set; }
    public List<Parameter> Parameters { get; set; } = new();
}

public class Response
{
    public List<Table> Tables { get; set; } = new();
    public DataTable OutParameters { get; set; } = new();
    public string? PrintOutput { get; set; }
    public string? Error { get; set; }
}

public class Answer
{
    public DbCommand Request { get; set; } = new();
    public Response Response { get; set; } = new();
}

public class Table
{
    public DataTable Structure { get; set; } = new();
    public List<Dictionary<string, object>> Rows { get; set; } = new();
}

