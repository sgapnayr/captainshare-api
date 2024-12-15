#!/bin/bash

# Accepting user input for trip ID
read -p "Enter Trip ID: " TRIP_ID

# Send the request to get the trip details
TRIP_DETAILS=$(curl -s -X GET "http://localhost:3000/trips/$TRIP_ID" \
  -H "Content-Type: application/json")

# Format the response using jq
echo "$TRIP_DETAILS" | jq .
