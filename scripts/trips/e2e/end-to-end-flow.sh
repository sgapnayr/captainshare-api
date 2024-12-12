#!/bin/bash

BASE_URL="http://localhost:3000"

echo "=== Starting End-to-End Flow ==="

# Step 1: Create a Trip
createResponse=$(curl -s -X POST "$BASE_URL/trips" \
  -H "Content-Type: application/json" \
  -d '{
    "boatId": "boat789",
    "captainId": "captain789",
    "ownerId": "owner789",
    "startTime": "2024-12-17T09:00:00.000Z",
    "endTime": "2024-12-17T12:00:00.000Z",
    "tripType": "LEASED_TRIP",
    "captainShare": 0.4
  }')

tripId=$(echo "$createResponse" | jq -r '.id')

if [ -n "$tripId" ]; then
  echo "Trip Created: $tripId"
else
  echo "Failed to Create Trip:"
  echo "$createResponse"
  exit 1
fi

# Step 2: Fetch Trip Details
echo "=== Fetching Trip Details ==="
fetchResponse=$(curl -s "$BASE_URL/trips/$tripId")
echo "Fetched Trip Details:"
echo "$fetchResponse" | jq

# Step 3: Update Trip Status
echo "=== Updating Trip Status ==="
updateResponse=$(curl -s -X PATCH "$BASE_URL/trips/$tripId" \
  -H "Content-Type: application/json" \
  -d '{"status": "COMPLETED"}')
echo "Updated Trip:"
echo "$updateResponse" | jq

# Step 4: Validate Revenue
echo "=== Validating Revenue ==="
revenueResponse=$(curl -s "$BASE_URL/trips/$tripId")
echo "Revenue Details:"
echo "$revenueResponse" | jq

# Step 5: Delete Trip
echo "=== Deleting Trip ==="
deleteResponse=$(curl -s -X DELETE "$BASE_URL/trips/$tripId")

if [ -z "$deleteResponse" ]; then
  echo "Trip Deleted Successfully."
else
  echo "Failed to Delete Trip:"
  echo "$deleteResponse"
fi

# Step 6: Confirm Deletion
echo "=== Confirming Deletion ==="
confirmResponse=$(curl -s "$BASE_URL/trips/$tripId")
echo "Deletion Confirmation Response:"
echo "$confirmResponse"

echo "=== End-to-End Flow Completed ==="
