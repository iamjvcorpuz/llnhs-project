# Use an official PHP runtime with FPM
# FROM php:8.2-fpm
FROM gabrieltva/php-fpm-node

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    nginx

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath

# Install Node.js and npm for Vite
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs

# Set working directory
WORKDIR /var/www

# Copy application files
COPY . .

# Install Composer dependencies
# RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
    && php composer-setup.php \
    && php -r "unlink('composer-setup.php');"
RUN php composer.phar update
RUN composer install --ignore-platform-reqs --optimize-autoloader --no-dev
# RUN composer install --ignore-platform-reqs

# Install npm dependencies and build frontend
RUN npm install
RUN npm run build

# Configure Laravel environment
COPY .env-staging .env
# RUN php artisan key:generate --ansi
RUN php artisan config:cache
# RUN php artisan route:cache
RUN php artisan view:cache

# Set permissions
RUN chown -R www-data:www-data /var/www
RUN chmod -R 755 /var/www/storage

# Copy Nginx configuration
COPY ./docker/nginx.conf /etc/nginx/sites-available/default

# Expose port 8080 (Cloud Run requirement)
EXPOSE 8080

# Start Nginx and PHP-FPM
CMD ["sh", "-c", "php-fpm -D && nginx -g 'daemon off;'"]
# CMD ["sh", "-c", "apt-get update && apt-get install -y mysql-client && mysql --host=/cloudsql/llnhs-staging:us-central1:llnhs-db-staging --user=4dmIn --password=4dmIn -e 'SHOW DATABASES;'"]