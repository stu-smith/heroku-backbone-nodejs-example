#!/bin/sh

pkill node
export DATABASE_URL=postgresql://postgres:postgres@localhost/example-app
nodejs schema/schema.js
