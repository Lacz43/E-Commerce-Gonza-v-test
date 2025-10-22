# Configuración de Nginx para GonzaGo

Este directorio contiene los archivos de configuración de Nginx para la aplicación Laravel GonzaGo.

## Archivos

- `nginx.conf` - Configuración principal de Nginx con ajustes optimizados para Laravel
- `default.conf` - Configuración del bloque de servidor para la aplicación Laravel
- `Dockerfile` - Configuración de construcción Docker para el contenedor Nginx
- `.dockerignore` - Archivos a excluir del contexto de construcción Docker

## Características de Configuración

### Seguridad
- Cabeceras de seguridad (X-Frame-Options, X-Content-Type-Options, X-XSS-Protection, CSP)
- Deniega acceso a archivos sensibles (.env, archivos composer, .htaccess)
- Limitación de tasa para API y solicitudes generales

### Rendimiento
- Compresión Gzip para contenido basado en texto
- Caché de archivos estáticos con expiración prolongada
- Parámetros FastCGI optimizados para PHP-FPM

### Específico de Laravel
- Manejo adecuado de rutas Laravel con try_files
- Configuración FastCGI para procesamiento PHP
- Paso de variables de entorno a PHP-FPM
- Endpoint de verificación de salud en `/health`

## Uso

Esta configuración asume:
- La aplicación se ejecuta en un contenedor llamado `gonzaplus_prod` en el puerto 9000
- Los activos estáticos se sirven desde `/var/www/html/public`
- Las variables de entorno se pasan desde el archivo Docker Compose

## Verificación de Salud

La configuración incluye un endpoint de verificación de salud en `/health` que retorna una respuesta simple "healthy".
