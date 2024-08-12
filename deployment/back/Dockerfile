# Стадия сборки
FROM dotnet/sdk:6.0 AS build
# Директория сборки
WORKDIR /app
# Копирование кода
COPY components/back/ .
# Сборка бинарного пакета
RUN dotnet restore RpcSqlServer/RpcSqlServer.csproj
RUN dotnet build RpcSqlServer/RpcSqlServer.csproj -c Release -o /app/build
#=====================================================================
# Стадия публикации
FROM build AS publish

RUN dotnet publish RpcSqlServer/RpcSqlServer.csproj -c Release -o /app/publish
#=====================================================================
# Стадия запуска приложения
FROM dotnet/aspnet:6.0 AS base
# Определение рабочей директории
WORKDIR /app
# Настрока регистри (можно закомментировать при локальной сборке)
COPY ./deployment/apt/apt.conf /etc/apt/apt.conf
COPY ./deployment/apt/sources.list /etc/apt/sources.list
# Настройка openssl для работы с SQL Server <= 2008 R2
RUN sed -i 's/TLSv1.2/TLSv1.0/g' /etc/ssl/openssl.cnf \
    && sed -i 's/SECLEVEL=2/SECLEVEL=1/g' /etc/ssl/openssl.cnf
# Установка kerberos
RUN DEBIAN_FRONTEND=noninteractive apt update \
    && apt install -y --no-install-recommends krb5-config krb5-user krb5-kdc iputils-ping net-tools
# Копирование kerberos конфигов
COPY ./deployment/back/krb5.conf /etc/krb5.conf
# Создание директории для kinit билета
RUN mkdir -p /var/cache/kinit && chmod 777 /var/cache/kinit
# Установка переменных для приложения
ENV ASPNETCORE_URLS=http://+:5000

# Копирование скомпилированных бинарных файлов
COPY --from=publish /app/publish .
# Копирование скриптов запуска
COPY ./deployment/back/entrypoint_*.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint_*.sh
