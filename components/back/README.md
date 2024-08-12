# Back ��� ������� 9505 - ������������������ ������� ����������������� �����
� ������ ����������� ��������� RpcSqlServer - ��, �������� ������� �� RabbitMQ, ����������� �� � MS SQL � ������������ ��������� � RabbitMQ �� ������� RPC, ���������� �� ����� C#(.NET 6).

#��������� �������
� ����� ������� ��������� 2 �������:
1. RpcSqlServer - ��, ����������� ��� ������ backend'� � ������� 9505
2. RpcSqlClient - �� ������������ RpcSqlServer, ��� ������ backend'� � ������� 9505 �� �����


#���������������� ����������

1. ������������ � ����� appsettings.json 
  "ConnectionStrings": {
    "SQLConnection": "Data Source=KOY-1\\SQLEXPRESS;Initial Catalog=DemoSSIS_Target;Integrated Security=True;TrustServerCertificate=True",
    "RabbitConnection": "amqp://guest:guest@localhost:5672/%2f"
  },
  "RabbitSettings": {
    "QueueName":  "rpc_sql_queue"
  }

2. ������������ � ���������� ��������� (appsettings.json ����� �� �����)

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