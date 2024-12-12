#!/bin/bash

BASE_URL="http://localhost:3000"

# Check if trip ID exists
if [ ! -f tripId.tmp ]; then
  echo "Trip ID not found. Please create a trip first."
  exit 1
fi

# Read the trip ID from the file
tripId=$(cat tripId.tmp)

# Update the trip status
echo "=== Updating Trip Status to ONGOING ==="
response=$(curl -s -X PATCH "$BASE_URL/trips/$tripId" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "ONGOING"
  }')

if echo "$response" | grep -q '"id"'; then
  echo "Trip Updated Successfully:"
  echo "$response" | jq
else
  echo "Failed to Update Trip:"
  echo "$response"
fi
