# Usamos una imagen oficial de PHP con FPM
FROM php:8.3-fpm

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    zlib1g-dev \
    libpng-dev \
    libonig-dev \
    curl \
    nano

# Instalar extensiones PHP necesarias para Laravel
RUN docker-php-ext-install pdo pdo_mysql zip exif mbstring pcntl bcmath opcache

# Instalar Composer
RUN curl -sS https://getcomposer.org/installer  | php -- --install-dir=/usr/local/bin --filename=composer

# Opcional: establece el directorio de trabajo
WORKDIR /var/www

# Expone el puerto 8000 si quieres usar el servidor embebido
EXPOSE 8000

# Inicia un bash interactivo
CMD ["bash"]

RUN git config --global --add safe.directory /var/www/html
