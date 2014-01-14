#!/bin/bash

EXPECTED_ARGS=3
E_BADARGS=65

if [ $# -ne $EXPECTED_ARGS ]
then
  echo "Usage: `basename $0` <keypair> <user> <server>"
  exit $E_BADARGS
fi

KEY_PAIR=$1
USER=$2
SERVER=$3

./combineJs.sh

# Create the directory structure on the server
ssh -t -i $KEY_PAIR $USER@$SERVER '\
sudo mkdir -p /usr/adamity; \
sudo chown $USER /usr/adamity; \
chgrp $USER /usr/adamity; \
mkdir -p /usr/adamity/cdn; \
chmod a+r /usr/adamity/cdn; \
mkdir -p /usr/adamity/event; \
chmod a+r /usr/adamity/event; \
mkdir -p /usr/adamity/web; \
chmod a+r /usr/adamity/web; \
mkdir -p a+r /usr/adamity/test; \
chmod a+r /usr/adamity/test; \
mkdir -p /usr/adamity/test/js;' 

# Event GIF
scp -i $KEY_PAIR ../img/event.gif $USER@$SERVER:/usr/adamity/event
# Impression
scp -i $KEY_PAIR ../impression.php $USER@$SERVER:/usr/adamity/event
scp -i $KEY_PAIR ../helper.php $USER@$SERVER:/usr/adamity/event

# Javascript and flash on cdn
scp -i $KEY_PAIR ../js/adamity.js $USER@$SERVER:/usr/adamity/cdn
scp -i $KEY_PAIR ../as/a.swf $USER@$SERVER:/usr/adamity/cdn

# Apache configuration
scp -i $KEY_PAIR ../conf/adamity.conf $USER@$SERVER:/tmp

# Upload test site
scp -i $KEY_PAIR ../test.html $USER@$SERVER:/usr/adamity/test/
scp -i $KEY_PAIR ../testIframe.html $USER@$SERVER:/usr/adamity/test/
scp -i $KEY_PAIR ../testAlt.html $USER@$SERVER:/usr/adamity/test/
scp -i $KEY_PAIR ../ad.html $USER@$SERVER:/usr/adamity/test/
scp -i $KEY_PAIR ../js/Page.js $USER@$SERVER:/usr/adamity/test/js/
scp -i $KEY_PAIR ../js/PageGenerator.js $USER@$SERVER:/usr/adamity/test/js/
scp -i $KEY_PAIR ../ietest.html $USER@$SERVER:/usr/adamity/test/
scp -i $KEY_PAIR ../js/swfobject.js $USER@$SERVER:/usr/adamity/test/js/

# Adamity homepage
scp -i $KEY_PAIR ../index.html $USER@$SERVER:/usr/adamity/web/

# Enable site and restart apache
ssh -t -i $KEY_PAIR $USER@$SERVER '\
sudo mv /tmp/adamity.conf /etc/apache2/sites-available/; \
sudo a2ensite adamity.conf; \
sudo service apache2 restart' 

echo "Deploy complete"