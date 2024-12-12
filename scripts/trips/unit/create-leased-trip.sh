#!/bin/bash

BASE_URL="http://localhost:3000"
TRIP_ID_FILE="tripId.tmp"

echo "=== Creating a Leased Trip ==="

response=$(curl -s -X POST "$BASE_URL/trips" \
  -H "Content-Type: application/json" \
  -d '{
    "boatId": "boat456",
    "captainId": "captain456",
    "ownerId": "owner456",
    "startTime": "2024-12-16T09:00:00.000Z",
    "endTime": "2024-12-16T12:00:00.000Z",
    "tripType": "LEASED_TRIP",
    "captainShare": 0.3
  }')

if echo "$response" | jq -e '.id' >/dev/null 2>&1; then
  tripId=$(echo "$response" | jq -r '.id')
  echo "Leased Trip Created Successfully:"
  echo "$response" | jq

  # Save the tripId to a file for subsequent use
  echo "$tripId" > "$TRIP_ID_FILE"
  echo "Trip ID saved to $TRIP_ID_FILE: $tripId"
else
  echo "Failed to Create Leased Trip:"
  echo "$response"
  exit 1
fi
