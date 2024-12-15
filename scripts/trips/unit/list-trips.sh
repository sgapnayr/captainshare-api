#!/bin/bash

# Send the request to list all trips
TRIPS_LIST=$(curl -s -X GET "http://localhost:3000/trips" \
  -H "Content-Type: application/json")

# Format the response using jq
echo "$TRIPS_LIST" | jq .
