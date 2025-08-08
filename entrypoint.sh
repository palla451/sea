#!/bin/sh
set -e

cd /var/www

# 1. Copia .env se mancante
if [ ! -f .env ]; then
    echo "🔧 Copio .env.example in .env"
    cp .env.example .env
fi

# 2. Installa dipendenze se vendor mancante
if [ ! -d vendor ]; then
    echo "📦 Lancio composer install"
    composer install
fi

# 3. Genera APP_KEY se mancante
if ! grep -q "^APP_KEY=" .env || grep -q "APP_KEY=$" .env; then
    echo "🔑 Genero APP_KEY"
    php artisan key:generate
fi

echo "🔄 Attendo che PostgreSQL sia pronto..."

export PGPASSWORD=secret

until pg_isready -h postgres -p 5432 -U user; do
  echo "⏳ In attesa del DB..."
  sleep 2
  done
echo "✅ PostgreSQL è pronto. Avvio Laravel..."

# 4. Imposta i permessi
chmod -R 775 storage bootstrap/cache || true

# ✅ 5. Esegui le migration e i seed
echo "🗄️ Eseguo php artisan migrate"
php artisan migrate --force

echo "🌱 Eseguo php artisan db:seed"
php artisan db:seed --force

# 6. Avvia PHP-FPM
exec "$@"
