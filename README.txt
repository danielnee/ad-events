1. Add the hosts in hosts.conf to your host file


Server setup

sudo apt-get install apache2

sudo apt-get install php5

sudo apt-get install libapache2-mod-php5

sudo a2enmod rewrite

sudo apt-get install libcurl3 php5-dev libcurl4-gnutls-dev libmagic-dev
sudo apt-get install php-http make

sudo pecl install pecl_http

sudo service apache2 restart
