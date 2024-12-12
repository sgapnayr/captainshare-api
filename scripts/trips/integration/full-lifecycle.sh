#!/bin/bash

BASE_URL="http://localhost:3000"

echo "=== Creating a Trip ==="
tripResponse=$(curl -s -X POST "$BASE_URL/trips" \
  -H "Content-Type: application/json" \
  -d '{
    "boatId": "boat123",
    "captainId": "captain123",
    "ownerId": "owner123",
    "startTime": "2024-12-15T09:00:00.000Z",
    "endTime": "2024-12-15T12:00:00.000Z",
    "tripType": "OWNER_TRIP"
  }')

tripId=$(echo "$tripResponse" | jq -r '.id')
echo "Trip Created: $tripId"

# Update trip status
echo "=== Updating Trip Status ==="
curl -s -X PATCH "$BASE_URL/trips/$tripId" \
  -H "Content-Type: application/json" \
  -d '{"status": "COMPLETED"}' | jq

# Delete trip
echo "=== Deleting Trip ==="
curl -s -X DELETE "$BASE_URL/trips/$tripId" | jq

# Confirm deletion
echo "=== Confirming Deletion ==="
confirmResponse=$(curl -s "$BASE_URL/trips/$tripId")
echo "$confirmResponse" | jq
