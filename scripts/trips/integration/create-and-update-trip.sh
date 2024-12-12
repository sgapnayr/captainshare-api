#!/bin/bash

BASE_URL="http://localhost:3000"

echo "=== Creating a Trip ==="
response=$(curl -s -X POST "$BASE_URL/trips" \
  -H "Content-Type: application/json" \
  -d '{
    "boatId": "boat123",
    "captainId": "captain123",
    "ownerId": "owner123",
    "startTime": "2024-12-15T09:00:00.000Z",
    "endTime": "2024-12-15T12:00:00.000Z",
    "tripType": "OWNER_TRIP"
  }')

tripId=$(echo "$response" | jq -r '.id')
if [ -z "$tripId" ]; then
  echo "Failed to Create Trip:"
  echo "$response"
  exit 1
fi

echo "Trip Created Successfully: $tripId"
echo "$response" | jq

# Update trip status
echo "=== Updating Trip Status ==="
updateResponse=$(curl -s -X PATCH "$BASE_URL/trips/$tripId" \
  -H "Content-Type: application/json" \
  -d '{"status": "ONGOING"}')

echo "Trip Updated:"
echo "$updateResponse" | jq
