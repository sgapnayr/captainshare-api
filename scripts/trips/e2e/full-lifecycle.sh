#!/bin/bash

BASE_URL="http://localhost:3000"

echo "=== Starting Full Lifecycle Test ==="

# Create a leased trip
echo "=== Creating a Leased Trip ==="
leasedTripResponse=$(curl -s -X POST "$BASE_URL/trips" \
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
echo "$leasedTripResponse" | jq

# Extract leased trip ID
leasedTripId=$(echo "$leasedTripResponse" | jq -r '.id')
if [ -z "$leasedTripId" ]; then
  echo "Failed to create Leased Trip"
  exit 1
fi

# Update trip status
echo "=== Updating Leased Trip Status ==="
updateResponse=$(curl -s -X PATCH "$BASE_URL/trips/$leasedTripId" \
  -H "Content-Type: application/json" \
  -d '{"status": "COMPLETED"}')
echo "$updateResponse" | jq

# Fetch revenue
echo "=== Fetching Revenue Details for Leased Trip ==="
revenueResponse=$(curl -s "$BASE_URL/trips/$leasedTripId")
echo "$revenueResponse" | jq

# Delete the trip
echo "=== Deleting Leased Trip ==="
deleteResponse=$(curl -s -X DELETE "$BASE_URL/trips/$leasedTripId")
echo "$deleteResponse"

echo "=== Full Lifecycle Test Completed Successfully ==="
