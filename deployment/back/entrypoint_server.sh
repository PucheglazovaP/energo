#!/usr/bin/env bash
set -e
# !!! TODO Требуется указать свои переменные !!!
kinit "$DATABASE_USER" <<<"$DATABASE_PASS"
# !!! TODO Требуется указать имя dll !!!
dotnet RpcSqlServer.dll
