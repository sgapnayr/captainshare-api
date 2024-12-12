#!/bin/bash

# Base URL for API calls
BASE_URL="http://localhost:3000"

# Create an Owner Trip
echo "=== Creating an Owner Trip ==="
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

# Check if the response contains a trip ID
if echo "$response" | grep -q '"id"'; then
  echo "Owner Trip Created Successfully:"
  echo "$response" | jq

  # Extract and save the trip ID to a temporary file
  tripId=$(echo "$response" | jq -r '.id')
  echo "$tripId" > tripId.tmp
  echo "Trip ID saved to tripId.tmp: $tripId"
else
  echo "Failed to Create Owner Trip:"
  echo "$response"
fi
