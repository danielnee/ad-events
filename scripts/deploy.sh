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
chmod a-r /usr/adamity/cdn; \
mkdir -p /usr/adamity/event; \
chmod a-r /usr/adamity/event'

# Event GIF
scp -i $KEY_PAIR ../img/event.gif $USER@$SERVER:/usr/adamity/event

# Javascript and flash on cdn
scp -i $KEY_PAIR ../js/adamity.js $USER@$SERVER:/usr/adamity/cdn
scp -i $KEY_PAIR ../as/FrameRateDetector.swf $USER@$SERVER:/usr/adamity/cdn

# Apache configuration
scp -i $KEY_PAIR ../conf/adamity.conf $USER@$SERVER:/tmp

# Enable site and restart apache
ssh -t -i $KEY_PAIR $USER@$SERVER '\
sudo mv /tmp/adamity.conf /etc/apache2/sites-available/; \
sudo a2ensite adamity.conf; \
sudo service apache2 restart' 

echo "Deploy complete"