#!/bin/bash

BASE_URL="http://localhost:3000"

# Step 1: Create a Trip
echo "=== Creating a Trip for Deletion Test ==="
createResponse=$(curl -s -X POST "$BASE_URL/trips" \
  -H "Content-Type: application/json" \
  -d '{
    "boatId": "boat123",
    "captainId": "captain123",
    "ownerId": "owner123",
    "startTime": "2024-12-15T09:00:00.000Z",
    "endTime": "2024-12-15T12:00:00.000Z",
    "tripType": "OWNER_TRIP"
  }')

tripId=$(echo "$createResponse" | jq -r '.id')

if [ -n "$tripId" ]; then
  echo "Trip Created for Deletion Test: $tripId"
else
  echo "Failed to Create Trip:"
  echo "$createResponse"
  exit 1
fi

# Step 2: Delete the Trip
echo "=== Deleting Trip ==="
deleteResponse=$(curl -s -X DELETE "$BASE_URL/trips/$tripId")

if [ -z "$deleteResponse" ]; then
  echo "Trip Deleted Successfully."
else
  echo "Failed to Delete Trip:"
  echo "$deleteResponse"
  exit 1
fi

# Step 3: Confirm Deletion
echo "=== Confirming Deletion ==="
confirmResponse=$(curl -s "$BASE_URL/trips/$tripId")
echo "Deletion Confirmation Response:"
echo "$confirmResponse"
