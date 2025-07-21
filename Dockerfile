
# syntax=docker/dockerfile:1
############################################
# —— 1. Stage base: PHP + extensiones + Composer
############################################
FROM php:8.3-fpm AS base

# Instalamos herramientas comunes
RUN apt-get update \
    && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    zlib1g-dev \
    libpng-dev \
    libonig-dev \
    curl \
    nano \
    cron \
    mariadb-client

# Instalar extensiones PHP necesarias para Laravel
RUN docker-php-ext-install pdo pdo_mysql zip exif mbstring pcntl bcmath opcache

# Instalamos Composer
RUN curl -sS https://getcomposer.org/installer \
    | php -- --install-dir=/usr/local/bin --filename=composer

# Añadimos el crontab para Laravel Scheduler
COPY docker/laravel-cron /etc/cron.d/laravel-cron
RUN chmod 0644 /etc/cron.d/laravel-cron \
    && crontab /etc/cron.d/laravel-cron

# Creamos log de cron y ajustamos permisos
RUN touch /var/log/cron.log \
    && chown www-data:www-data /var/log/cron.log

# Opcional: establece el directorio de trabajo
WORKDIR /var/www

RUN git config --global --add safe.directory /var/www/html

############################################
# —— 2. Stage node-builder: compila assets
############################################
FROM node:22 AS node-builder
WORKDIR /var/www/html
COPY . .
RUN corepack enable pnpm \
    && corepack use pnpm@10.9 \
    && pnpm install \
    && pnpm build

############################################
# —— 3a. Target: producción
############################################
FROM base AS prod

# Copiamos vendor desde base (podrías hacerlo en otro stage "composer",
# pero para brevedad usamos base + composer install)
COPY --from=base /usr/local/bin/composer /usr/local/bin/composer
COPY . .

# Instalamos sólo dependencias de producción
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-scripts

# Copiamos assets compilados
COPY --from=node-builder /var/www/html/public ./public

# Exponemos puerto FPM (si lo necesitas) y arrancamos
EXPOSE 8000
CMD ["php-fpm"]

############################################
# —— 3b. Target: desarrollo
############################################
FROM base AS dev

# Instalar nodejs (solo para desarrollo)
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
RUN apt-get install -y nodejs

# Instalar pnpm
RUN corepack enable pnpm
RUN corepack use pnpm@10.9

# Inicia un bash interactivo
CMD ["bash"]

EXPOSE 8000
