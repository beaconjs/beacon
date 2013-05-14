#/bin/bash

environment=$1

if [ -z $environment ]
then
  echo "please specify the environment (dev/ test/ prod)"
  exit 1
fi

if [ $environment == "dev" ]
then
  mysql -uroot -e 'drop database beacon;'
  mysql -uroot -e 'create database beacon;'
  db-migrate up -m ./migrations --config ./database.json 
  mysql -uroot beacon < ./db/seed.sql
fi

if [ $environment == "test" ]
then
  mysql -uroot -e 'drop database beacon_test;'
  mysql -uroot -e 'create database beacon_test;'
  db-migrate up -m ./migrations --config ./database.json -e test
fi

if [ $environment == "prod" ]
then
  mysql -uroot -e 'drop database beacon_live;'
  mysql -uroot -e 'create database beacon_live;'
  db-migrate up -m ./migrations --config ./database.json -e production
  mysql -uroot beacon_live < ./db/seed.sql
fi

