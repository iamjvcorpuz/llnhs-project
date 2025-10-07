FROM php:8.2-apache

RUN apt-get -y update --fix-missing && \
    apt-get install -y libzip-dev && \
    apt-get install -y libonig-dev && \
    apt-get install -y libpng-dev && \
    docker-php-ext-install zip && \
    apt-get install -y nano vim git && \
    apt-get install cron -y


RUN docker-php-ext-install mysqli pdo pdo_mysql bcmath mbstring exif pcntl gd && docker-php-ext-enable mysqli pdo pdo_mysql

#rootdir
WORKDIR /var/www/html

#copy all files to root dir
COPY . /var/www/html
# install composer in current directory
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
    && php composer-setup.php \
    && php -r "unlink('composer-setup.php');"

# RUN php composer.phar update

#allow root/user to run plugins
ENV COMPOSER_ALLOW_SUPERUSER=1

# run composer, optimizing Composer's class autoloader map, exclude dev dependencies in prod
RUN php composer.phar install --optimize-autoloader --ignore-platform-reqs  --no-dev

RUN php composer.phar dump-autoload

# COPY .env-local .env
COPY .env-staging .env

# RUN php composer.phar require vinkla/hashids

# RUN php composer.phar require doctrine/dbal

# RUN php artisan key:generate

#optimize config loading
RUN php artisan config:cache
# RUN php artisan migrate
# RUN php artisan db:seed --class DefaultDataSeeder
# RUN php artisan db:seed --class DatabaseSeeder

#optimize route loading
# RUN php artisan route:cache

# RUN chown -R $USER:www-data /var/www/html
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/public

#setup for vhost
COPY ./docker/default.conf /etc/apache2/sites-enabled/000-default.conf

ENV APACHE_PORT=${PORT:-8080}
RUN sed -i "s/Listen 80/Listen ${APACHE_PORT}/g" /etc/apache2/ports.conf

EXPOSE 8080

# enable apache modules
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

RUN a2enmod rewrite headers

RUN echo "memory_limit = 1056M" > /usr/local/etc/php/conf.d/memory-limit.ini
RUN echo "* * * * * cd /var/www/html && php artisan schedule:run >> /var/www/html/storage/logs/cron.log 2>&1" | crontab -
# COPY ./www/lnhs-attendance-system/start.sh /usr/local/bin/start

#grant permission to exec start.sh
# RUN chmod u+x /usr/local/bin/start 

#execute
# CMD ["/usr/local/bin/start"]
CMD ["apache2-foreground"]
# CMD ["php","/var/www/html/public/index.php"]