#!/bin/bash
# Production deployment script for Travel Agency (Laravel API + Vite React Frontend)
# Usage: bash deploy.sh

# 1. Set these variables for your VPS paths/domains
LARAVEL_DIR="/var/www/travel-agency/laravel-app"
FRONTEND_DIR="/var/www/travel-agency/client"
FRONTEND_DOMAIN="app.example.com"   # Change to your frontend domain
API_DOMAIN="api.example.com"         # Change to your API domain

# 2. Backend: Laravel API
cd "$LARAVEL_DIR"
echo "[Laravel] Installing dependencies..."
composer install --optimize-autoloader --no-dev
cp .env.example .env 2>/dev/null || true
php artisan key:generate
php artisan migrate --force
php artisan db:seed --force
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 3. Frontend: Vite React
cd "$FRONTEND_DIR"
echo "[Frontend] Installing dependencies and building..."
sed -i "s|^VITE_API_URL=.*|VITE_API_URL=https://$API_DOMAIN/api|g" .env
npm install --production=false
npm run build

# 4. Nginx config suggestions (manual step)
echo "\n[Manual Step] Configure Nginx for both apps. Example configs:"
echo "\n--- Laravel API ---\nserver {\n    server_name $API_DOMAIN;\n    root $LARAVEL_DIR/public;\n    index index.php;\n    location / {\n        try_files $uri $uri/ /index.php?$query_string;\n    }\n    location ~ \\.php$ {\n        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;\n        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;\n        include fastcgi_params;\n    }\n}\n"
echo "\n--- Frontend (Vite build) ---\nserver {\n    server_name $FRONTEND_DOMAIN;\n    root $FRONTEND_DIR/dist;\n    index index.html;\n    location / {\n        try_files $uri $uri/ /index.html;\n    }\n}\n"

echo "\n[Done] Backend and frontend are built. Set up Nginx and HTTPS, then restart services."
