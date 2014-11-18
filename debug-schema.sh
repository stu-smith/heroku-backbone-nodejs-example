#!/bin/sh

pkill nodejs
export DATABASE_URL=postgresql://postgres:postgres@localhost/example-app
nodejs schema/schema.js
