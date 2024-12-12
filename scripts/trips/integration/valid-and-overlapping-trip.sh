#!/bin/bash

BASE_URL="http://localhost:3000"
TRIP_ID_FILE="tripId.tmp"

echo "=== Creating a Valid Trip ==="
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

# Extract Trip ID
tripId=$(echo "$response" | jq -r '.id')
if [ -z "$tripId" ] || [ "$tripId" == "null" ]; then
  echo "Failed to Create Valid Trip:"
  echo "$response"
  exit 1
fi

echo "Valid Trip Created: $tripId"
echo "$response" | jq

# Save the trip ID
echo "$tripId" > "$TRIP_ID_FILE"

echo "=== Attempting Overlapping Trip ==="
overlapResponse=$(curl -s -X POST "$BASE_URL/trips" \
  -H "Content-Type: application/json" \
  -d '{
    "boatId": "boat456",
    "captainId": "captain456",
    "ownerId": "owner456",
    "startTime": "2024-12-16T10:00:00.000Z",
    "endTime": "2024-12-16T13:00:00.000Z",
    "tripType": "LEASED_TRIP",
    "captainShare": 0.3
  }')

# Check Overlapping Response
if echo "$overlapResponse" | jq -e '.statusCode' >/dev/null 2>&1; then
  echo "Overlapping Trip Response:"
  echo "$overlapResponse" | jq
else
  echo "Overlapping Trip Accepted (unexpected):"
  echo "$overlapResponse"
  exit 1
fi
