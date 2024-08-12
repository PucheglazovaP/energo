#!/usr/bin/env bash
set -e
[[ "$KINIT_PERIOD_SECONDS" == "" ]] && KINIT_PERIOD_SECONDS=3600
while true; do
  echo "*** kinit at $(date)"
  # !!! TODO Требуется указать свои переменные !!!
  kinit "$DATABASE_USER" <<<"$DATABASE_PASS"
  klist -c /var/cache/kinit/ccache
  echo "*** Waiting for $KINIT_PERIOD_SECONDS seconds"
  sleep $KINIT_PERIOD_SECONDS
done
