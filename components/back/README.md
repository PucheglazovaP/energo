# Back для проекта 9505 - Автоматизированная система энергоменеджмента ЕНТМК
В данном репозитории находится RpcSqlServer - ПО, читающее запросы из RabbitMQ, выполняющее их в MS SQL и возвращающее результат в RabbitMQ по шаблону RPC, написанное на языке C#(.NET 6).

#Структура проекта
В одном решении находятся 2 проекта:
1. RpcSqlServer - ПО, необходимое для работы backend'а в проекте 9505
2. RpcSqlClient - ПО тестирования RpcSqlServer, для работы backend'а в проекте 9505 не нужно


#Конфигурационные переменные

1. Конфигурация в файле appsettings.json 
  "ConnectionStrings": {
    "SQLConnection": "Data Source=KOY-1\\SQLEXPRESS;Initial Catalog=DemoSSIS_Target;Integrated Security=True;TrustServerCertificate=True",
    "RabbitConnection": "amqp://guest:guest@localhost:5672/%2f"
  },
  "RabbitSettings": {
    "QueueName":  "rpc_sql_queue"
  }

2. Конфигурация в переменных окружения (appsettings.json тогда не нужен)

ENV DATABASE_HOST="KOY-1"
ENV DATABASE_INSTANCE="SQLEXPRESS"
ENV DATABASE_NAME="DemoSSIS_Target"
ENV DATABASE_INTEGRATEDSECURITY="False"
ENV DATABASE_USER=""
ENV DATABASE_PASS=""

ENV RABBITMQ_HOST="localhost"
ENV RABBITMQ_PORT="5672"
ENV RABBITMQ_VHOST="%2f"
ENV RABBITMQ_USER="guest"
ENV RABBITMQ_PASSWORD="guest"
ENV RABBITMQ_QUEUE="rpc_sql_queue"