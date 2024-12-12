#!/bin/bash

BASE_URL="http://localhost:3000"

# Check if trip ID exists
if [ ! -f tripId.tmp ]; then
  echo "Trip ID not found. Please create a trip first."
  exit 1
fi

# Read the trip ID from the file
tripId=$(cat tripId.tmp)

# Fetch the trip
echo "=== Fetching Trip Details ==="
response=$(curl -s "$BASE_URL/trips/$tripId")

if echo "$response" | grep -q '"id"'; then
  echo "Trip Details:"
  echo "$response" | jq
else
  echo "Failed to Fetch Trip Details:"
  echo "$response"
fi
