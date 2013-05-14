Backend services
================

Installation:

    git clone git@github.com:beaconjs/beacon.git
    cd beacon/services
    npm install
    supervisor app.js

You would need to have a MySQL database installed.

To bootstrap the database, run:

    ./bootstrap.sh dev

where dev is the environment (other options are test and prod)

To run db migrations, run 

    db-migrate up -m ./migrations --config ./database.json 


[![Build Status](https://api.travis-ci.org/beaconjs/beacon.png)](https://travis-ci.org/beaconjs/beacon)
