# Étape 1 : Build avec Composer
FROM php:8.3-fpm AS build

# Installer les dépendances système
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    zip \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    libpq-dev \
    libjpeg-dev \
    libfreetype6-dev \
    && docker-php-ext-configure zip \
    && docker-php-ext-install pdo pdo_mysql zip mbstring exif pcntl bcmath

# Installer Composer manuellement (plus fiable)
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Définir le répertoire de travail
WORKDIR /var/www

# Copier les fichiers du projet
COPY . .

# Préinstaller les dépendances PHP sans interaction
RUN COMPOSER_ALLOW_SUPERUSER=1 COMPOSER_PROCESS_TIMEOUT=600 \
    composer install --no-interaction --prefer-dist --optimize-autoloader

# Étape 2 : Exécution (runtime)
FROM php:8.3-fpm

# Installer extensions nécessaires
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    libpq-dev \
    libjpeg-dev \
    libfreetype6-dev \
    zip unzip \
    && docker-php-ext-configure zip \
    && docker-php-ext-install pdo pdo_mysql zip mbstring exif pcntl bcmath

# Copier Composer et les fichiers construits depuis l'étape build
COPY --from=build /usr/bin/composer /usr/bin/composer
COPY --from=build /var/www /var/www

WORKDIR /var/www

# Droits d’exécution pour Laravel
RUN chown -R www-data:www-data /var/www \
    && chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Commande de démarrage (exemple avec supervisord ou php-fpm selon ton stack)
CMD ["php-fpm"]
