using System;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Configuration.Json;
using System.Collections.Concurrent;
using System.Text;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using Newtonsoft.Json;
using System.Net.Sockets;
using Newtonsoft.Json.Linq;

public class RpcClient
{
    public readonly IConfiguration _configuration = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
            .AddEnvironmentVariables()
            .Build();

    private readonly IConnection connection;
    private readonly IModel channel;
    private readonly string replyQueueName;
    private readonly EventingBasicConsumer consumer;
    private readonly BlockingCollection<string> respQueue = new BlockingCollection<string>();
    private readonly IBasicProperties props;

    public RpcClient()
    {
        //var factory = new ConnectionFactory() { HostName = "localhost" };
        var factory = new ConnectionFactory() { Uri = new UriBuilder(_configuration.GetConnectionString("RabbitConnection")).Uri };

        connection = factory.CreateConnection();
        channel = connection.CreateModel();
        replyQueueName = channel.QueueDeclare().QueueName;
        consumer = new EventingBasicConsumer(channel);

        props = channel.CreateBasicProperties();
        var correlationId = Guid.NewGuid().ToString();
        props.CorrelationId = correlationId;
        props.ReplyTo = replyQueueName;

        consumer.Received += (model, ea) =>
        {
            var body = ea.Body.ToArray();
            var response = Encoding.UTF8.GetString(body);
            if (ea.BasicProperties.CorrelationId == correlationId)
            {
                respQueue.Add(response);
            }
        };

        channel.BasicConsume(
            consumer: consumer,
            queue: replyQueueName,
            autoAck: true);
    }

    public string Call(string message)
    {
        var messageBytes = Encoding.UTF8.GetBytes(message);
        channel.BasicPublish(
            exchange: "",
            routingKey: _configuration["RabbitSettings:QueueName"],
            basicProperties: props,
            body: messageBytes);

        return respQueue.Take();
    }

    public void Close()
    {
        connection.Close();
    }
}

public class Rpc
{
    private static IConfiguration configuration = new RpcClient()._configuration;
    public static void Main()
    {
        var response = "";
        var rpcClient = new RpcClient();

        JToken jAppSettings = JToken.Parse(
          File.ReadAllText(Path.Combine(Environment.CurrentDirectory, "appsettings.json"))
        );
        string json = JsonConvert.SerializeObject(jAppSettings["Query"]);

        int imax = Int32.Parse(configuration["QueryRepeat"]);
        for (int i = 0; i <= imax; i++)
        {
            response = rpcClient.Call(json);
        }

        Console.WriteLine("{0}", response);
        rpcClient.Close();
    }
}
