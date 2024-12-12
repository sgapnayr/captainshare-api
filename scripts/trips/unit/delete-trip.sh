#!/bin/bash

BASE_URL="http://localhost:3000"

# Check if trip ID exists
if [ ! -f tripId.tmp ]; then
  echo "Trip ID not found. Please create a trip first."
  exit 1
fi

# Read the trip ID from the file
tripId=$(cat tripId.tmp)

# Delete the trip
echo "=== Deleting Trip ==="
response=$(curl -s -X DELETE "$BASE_URL/trips/$tripId")

if [ -z "$response" ]; then
  echo "Trip Deleted Successfully."
  rm -f tripId.tmp
else
  echo "Failed to Delete Trip:"
  echo "$response"
fi
