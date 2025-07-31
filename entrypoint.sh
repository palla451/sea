#!/bin/sh
set -e

cd /var/www

# ✅ 1. Se manca .env, lo copio PRIMA di fare qualsiasi cosa
if [ ! -f .env ]; then
    echo "🔧 Copio .env.example in .env"
    cp .env.example .env
fi

# ✅ 2. Se manca vendor/, installo le dipendenze
if [ ! -d vendor ]; then
    echo "📦 Lancio composer install"
    composer install
fi

# ✅ 3. Se manca APP_KEY, la genero
if ! grep -q "^APP_KEY=" .env || grep -q "APP_KEY=$" .env; then
    echo "🔑 Genero APP_KEY"
    php artisan key:generate
fi

# ✅ 4. Imposto i permessi su storage e cache
chmod -R 775 storage bootstrap/cache || true

exec "$@"
