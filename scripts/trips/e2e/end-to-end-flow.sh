#!/bin/bash

BASE_URL="http://localhost:3000"

echo "=== Starting End-to-End Flow ==="

# Create an owner trip
echo "=== Creating an Owner Trip ==="
ownerTripResponse=$(curl -s -X POST "$BASE_URL/trips" \
  -H "Content-Type: application/json" \
  -d '{
    "boatId": "boat123",
    "captainId": "captain123",
    "ownerId": "owner123",
    "startTime": "2024-12-15T09:00:00.000Z",
    "endTime": "2024-12-15T12:00:00.000Z",
    "tripType": "OWNER_TRIP"
  }')
echo "$ownerTripResponse" | jq

# Extract owner trip ID
ownerTripId=$(echo "$ownerTripResponse" | jq -r '.id')
if [ -z "$ownerTripId" ]; then
  echo "Failed to create Owner Trip"
  exit 1
fi

# Update trip status
echo "=== Updating Owner Trip Status ==="
updateResponse=$(curl -s -X PATCH "$BASE_URL/trips/$ownerTripId" \
  -H "Content-Type: application/json" \
  -d '{"status": "ONGOING"}')
echo "$updateResponse" | jq

# Fetch revenue
echo "=== Fetching Revenue Details for Owner Trip ==="
revenueResponse=$(curl -s "$BASE_URL/trips/$ownerTripId")
echo "$revenueResponse" | jq

# Delete the trip
echo "=== Deleting Owner Trip ==="
deleteResponse=$(curl -s -X DELETE "$BASE_URL/trips/$ownerTripId")
echo "$deleteResponse"

echo "=== End-to-End Flow Completed Successfully ==="
