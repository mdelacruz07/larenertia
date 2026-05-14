#!/usr/bin/env sh
set -e

if [ ! -f .env ] && [ -f .env.example ]; then
    cp .env.example .env
fi

if [ ! -f vendor/autoload.php ]; then
    composer install --no-interaction --prefer-dist
fi

if [ "${DB_CONNECTION:-}" = "mysql" ]; then
    echo "Waiting for MySQL at ${DB_HOST:-mysql}:${DB_PORT:-3306}..."

    until MYSQL_PWD="${DB_PASSWORD:-}" mysqladmin ping \
        -h"${DB_HOST:-mysql}" \
        -P"${DB_PORT:-3306}" \
        -u"${DB_USERNAME:-root}" \
        --silent; do
        sleep 2
    done
fi

if [ "${APP_KEY:-}" = "" ] && ! grep -q '^APP_KEY=base64:' .env 2>/dev/null; then
    php artisan key:generate --force --ansi
fi

php artisan config:clear --ansi

if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
    php artisan migrate --force --ansi
fi

exec "$@"
