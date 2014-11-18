#!/bin/sh

pkill nodejs
export DATABASE_URL=postgresql://postgres:postgres@localhost/example-app
export NO_CACHE=true
nodemon server/server.js
